import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

interface ProjectModel {
  id: string;
  title: string;
  prompt: string;
  pages: string;
  chatHistory: string;
  timestamp: Date;
  userId: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:3001',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders });
}

async function verifyAuth(req: Request): Promise<string | null> {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.split(' ')[1];
    const tokenSecret = process.env.JWT_SECRET || 'antigravity-studio-super-secret-key-12345';
    const decoded = jwt.verify(token, tokenSecret) as { userId: string; email: string };
    
    // Check if the user exists in the SQLite database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });
    if (!user) return null;
    
    return decoded.userId;
  } catch {
    return null;
  }
}

// GET: Fetch all projects of the authenticated user
export async function GET(req: Request) {
  try {
    const userId = await verifyAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
    }

    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
    });

    // Map projects to format expected by UI
    const mappedProjects = projects.map((p: ProjectModel) => {
      const parsedPages = JSON.parse(p.pages || '[]');
      return {
        id: p.id,
        title: p.title,
        prompt: p.prompt,
        pages: parsedPages,
        html: parsedPages[0]?.html || '', // Fallback for backward compatibility
        chatHistory: JSON.parse(p.chatHistory || '[]'),
        timestamp: p.timestamp.getTime(),
      };
    });

    return NextResponse.json(mappedProjects, { status: 200, headers: corsHeaders });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMsg }, { status: 500, headers: corsHeaders });
  }
}

// POST: Create or Update a project
export async function POST(req: Request) {
  try {
    const userId = await verifyAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
    }

    const body = await req.json();
    const { id, title, prompt, html, pages, chatHistory } = body;

    // Resolve pages: if pages array is passed, use it; otherwise wrap the HTML in a single Home page.
    let finalPages = pages;
    if (!finalPages && html) {
      finalPages = [{ name: 'Home', path: 'index.html', html }];
    }

    if (!prompt || !finalPages) {
      return NextResponse.json({ error: 'Prompt and HTML/Pages are required' }, { status: 400, headers: corsHeaders });
    }

    const pagesStr = JSON.stringify(finalPages);
    const chatHistoryStr = JSON.stringify(chatHistory || []);

    let project;

    if (id) {
      // Update existing project
      const existingProject = await prisma.project.findUnique({
        where: { id },
      });

      if (!existingProject || existingProject.userId !== userId) {
        return NextResponse.json({ error: 'Project not found or unauthorized' }, { status: 404, headers: corsHeaders });
      }

      project = await prisma.project.update({
        where: { id },
        data: {
          pages: pagesStr,
          chatHistory: chatHistoryStr,
          timestamp: new Date(),
        },
      });
    } else {
      // Create new project
      let finalTitle = title || prompt.trim().split(' ').slice(0, 5).join(' ');
      if (finalTitle.length > 30) finalTitle = finalTitle.substring(0, 30) + '...';

      project = await prisma.project.create({
        data: {
          title: finalTitle || 'Untitled Project',
          prompt,
          pages: pagesStr,
          chatHistory: chatHistoryStr,
          userId,
        },
      });
    }

    const parsedPages = JSON.parse(project.pages || '[]');

    return NextResponse.json({
      message: 'Project saved successfully',
      project: {
        id: project.id,
        title: project.title,
        prompt: project.prompt,
        pages: parsedPages,
        html: parsedPages[0]?.html || '', // Fallback for backward compatibility
        chatHistory: JSON.parse(project.chatHistory || '[]'),
        timestamp: project.timestamp.getTime(),
      }
    }, { status: 200, headers: corsHeaders });

  } catch (err: unknown) {
    console.error('Prisma POST /api/projects error:', err);
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMsg }, { status: 500, headers: corsHeaders });
  }
}

// DELETE: Delete a project
export async function DELETE(req: Request) {
  try {
    const userId = await verifyAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400, headers: corsHeaders });
    }

    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject || existingProject.userId !== userId) {
      return NextResponse.json({ error: 'Project not found or unauthorized' }, { status: 404, headers: corsHeaders });
    }

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Project deleted successfully' }, { status: 200, headers: corsHeaders });

  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMsg }, { status: 500, headers: corsHeaders });
  }
}
