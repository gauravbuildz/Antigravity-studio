import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const tokenSecret = process.env.JWT_SECRET || 'antigravity-studio-super-secret-key-12345';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (!code) {
      return new Response('Auth code is missing', { status: 400 });
    }

    let email = '';
    let name = '';

    if (code.startsWith('mock-google-code-')) {
      // Mock Google auth flow
      email = 'google-demo@antigravity.studio';
      name = 'Google Demo User';
    } else {
      // Real Google OAuth flow
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/api/auth/google/callback';

      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          client_id: clientId || '',
          client_secret: clientSecret || '',
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }),
      });

      if (!tokenRes.ok) {
        const errText = await tokenRes.text();
        console.error('Google token exchange error output:', errText);
        throw new Error('Failed to exchange code for Google token');
      }

      const tokenData = await tokenRes.json();
      const accessToken = tokenData.access_token;

      if (!accessToken) {
        throw new Error('Google returned no access token');
      }

      // Fetch user profile info
      const userProfileRes = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!userProfileRes.ok) {
        throw new Error('Failed to fetch Google user profile');
      }

      const profileData = await userProfileRes.json();
      email = profileData.email;
      name = profileData.name || 'Google User';

      if (!email) {
        throw new Error('Google did not return an email address');
      }
    }

    // Find or create user in SQLite database
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create user with dummy hash since password is not used for OAuth
      user = await prisma.user.create({
        data: {
          email,
          passwordHash: `oauth-google-${Math.random()}`,
        },
      });
    }

    // Sign JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      tokenSecret,
      { expiresIn: '24h' }
    );

    // Return HTML page that saves token and redirects client to workspace
    const htmlResponse = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authenticating with Google...</title>
          <style>
            body {
              background-color: #020617;
              color: #f8fafc;
              font-family: sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
            }
            .loader {
              border: 3px solid #1e293b;
              border-top: 3px solid #6366f1;
              border-radius: 50%;
              width: 24px;
              height: 24px;
              animation: spin 1s linear infinite;
              margin-right: 12px;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        </head>
        <body>
          <div class="loader"></div>
          <span>Redirecting to workspace...</span>
          <script>
            localStorage.setItem('antigravity_token', '${token}');
            localStorage.setItem('antigravity_user_email', '${user.email}');
            window.location.href = '/workspace';
          </script>
        </body>
      </html>
    `;

    return new Response(htmlResponse, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (err: any) {
    console.error('Google OAuth error:', err);
    return new Response(`Google OAuth Authentication Failed: ${err.message}`, { status: 500 });
  }
}
