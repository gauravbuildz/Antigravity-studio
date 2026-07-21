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

    if (code.startsWith('mock-github-code-')) {
      // Mock GitHub auth flow
      email = 'github-demo@antigravity.studio';
      name = 'GitHub Demo User';
    } else {
      // Real GitHub OAuth flow
      const clientId = process.env.GITHUB_CLIENT_ID;
      const clientSecret = process.env.GITHUB_CLIENT_SECRET;
      
      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
        }),
      });

      if (!tokenRes.ok) {
        throw new Error('Failed to exchange code for GitHub token');
      }

      const tokenData = await tokenRes.json();
      const accessToken = tokenData.access_token;

      if (!accessToken) {
        throw new Error('GitHub returned no access token');
      }

      // Fetch user profile info
      const userProfileRes = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': 'AntiGravity-Studio',
        },
      });

      if (!userProfileRes.ok) {
        throw new Error('Failed to fetch GitHub profile');
      }

      const profileData = await userProfileRes.json();
      name = profileData.name || profileData.login || 'GitHub User';

      // Fetch user emails
      const emailsRes = await fetch('https://api.github.com/user/emails', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': 'AntiGravity-Studio',
        },
      });

      if (emailsRes.ok) {
        const emailsList = await emailsRes.json();
        const primaryEmail = emailsList.find((e: any) => e.primary && e.verified) || emailsList[0];
        email = primaryEmail ? primaryEmail.email : '';
      }

      if (!email && profileData.email) {
        email = profileData.email;
      }

      if (!email) {
        email = `${profileData.login}@github.com`;
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
          passwordHash: `oauth-github-${Math.random()}`,
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
          <title>Authenticating with GitHub...</title>
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
    console.error('GitHub OAuth error:', err);
    return new Response(`GitHub OAuth Authentication Failed: ${err.message}`, { status: 500 });
  }
}
