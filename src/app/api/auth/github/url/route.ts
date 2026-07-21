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
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = process.env.GITHUB_REDIRECT_URI || 'http://localhost:3001/api/auth/github/callback';

  if (!clientId) {
    // If no client credentials, return mock redirect to bypass config locally
    const mockRedirectUrl = `/api/auth/github/callback?code=mock-github-code-12345`;
    return NextResponse.json({ url: mockRedirectUrl }, { headers: corsHeaders });
  }

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email`;
  return NextResponse.json({ url: githubAuthUrl }, { headers: corsHeaders });
}
