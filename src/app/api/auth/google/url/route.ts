import { NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders });
}

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/api/auth/google/callback';

  if (!clientId) {
    // If no client credentials, return mock redirect to bypass config locally
    const mockRedirectUrl = `/api/auth/google/callback?code=mock-google-code-12345`;
    return NextResponse.json({ url: mockRedirectUrl }, { headers: corsHeaders });
  }

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20email%20profile`;
  return NextResponse.json({ url: googleAuthUrl }, { headers: corsHeaders });
}
