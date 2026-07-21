import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders });
}

function verifyAuth(req: Request): string | null {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.split(' ')[1];
    const tokenSecret = process.env.JWT_SECRET || 'antigravity-studio-super-secret-key-12345';
    const decoded = jwt.verify(token, tokenSecret) as { userId: string; email: string };
    return decoded.userId;
  } catch {
    return null;
  }
}

// Clean visual template HTML to export perfect static output
import { cleanExportHtml } from '../../../lib/cleaner';

export async function POST(req: Request) {
  try {
    const userId = verifyAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
    }

    const { pages, netlifyToken } = await req.json();

    if (!pages || !Array.isArray(pages) || pages.length === 0) {
      return NextResponse.json({ error: 'Pages array is required' }, { status: 400, headers: corsHeaders });
    }

    // Generate a unique site ID
    const siteId = Math.random().toString(36).substring(2, 10);
    const deployDirName = `site-${siteId}`;
    const deployDirPath = path.join(process.cwd(), 'public', 'deploys', deployDirName);

    // Create directories
    fs.mkdirSync(deployDirPath, { recursive: true });

    // Write all clean pages to disk
    pages.forEach((page) => {
      const cleanHtml = cleanExportHtml(page.html);
      const filePath = path.join(deployDirPath, page.path);
      fs.writeFileSync(filePath, cleanHtml, 'utf-8');
    });

    const localUrl = `/deploys/${deployDirName}/index.html`;

    // Handle Netlify Deploy if Personal Access Token is supplied
    if (netlifyToken && netlifyToken.trim()) {
      try {
        // Step 1: Create a site on Netlify
        const createSiteRes = await fetch('https://api.netlify.com/api/v1/sites', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${netlifyToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: `antigravity-${siteId}`,
          }),
        });

        if (!createSiteRes.ok) {
          const errText = await createSiteRes.text();
          console.error('Failed to create Netlify site:', errText);
          throw new Error('Could not create site on Netlify. Check your API token.');
        }

        const siteData = await createSiteRes.json();
        const netlifySiteId = siteData.id;

        // Pack ZIP file on Windows using Powershell
        const zipPath = path.join(process.cwd(), 'public', 'deploys', `${deployDirName}.zip`);
        const { execSync } = require('child_process');
        
        execSync(`powershell -Command "Compress-Archive -Path '${deployDirPath}\\*' -DestinationPath '${zipPath}' -Force"`);

        // Read Zip file
        const zipBuffer = fs.readFileSync(zipPath);

        // Upload ZIP to Netlify Deploy endpoint
        const deployRes = await fetch(`https://api.netlify.com/api/v1/sites/${netlifySiteId}/deploys`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${netlifyToken}`,
            'Content-Type': 'application/zip',
          },
          body: zipBuffer,
        });

        // Cleanup ZIP file
        fs.unlinkSync(zipPath);

        if (!deployRes.ok) {
          const errText = await deployRes.text();
          console.error('Netlify deploy failed:', errText);
          throw new Error('Netlify server rejected the zip upload.');
        }

        const deployData = await deployRes.json();
        const liveUrl = deployData.ssl_url || deployData.url;

        return NextResponse.json({
          message: 'Site deployed successfully to Netlify!',
          localUrl,
          liveUrl,
        }, { status: 200, headers: corsHeaders });

      } catch (err: any) {
        console.error('Netlify Upload failed, falling back to local deploy:', err);
        return NextResponse.json({
          message: 'Local deployment succeeded, but Netlify upload failed.',
          error: err.message,
          localUrl,
          liveUrl: null,
        }, { status: 200, headers: corsHeaders });
      }
    }

    return NextResponse.json({
      message: 'Site deployed successfully to local sandbox!',
      localUrl,
      liveUrl: null,
    }, { status: 200, headers: corsHeaders });

  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMsg }, { status: 500, headers: corsHeaders });
  }
}
