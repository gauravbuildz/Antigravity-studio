import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { users } from '@/lib/db';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:3001',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const existingUser = users.find((u) => u.email === email.toLowerCase().trim());
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400, headers: corsHeaders }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      id: Math.random().toString(36).substring(2, 9),
      email: email.toLowerCase().trim(),
      passwordHash,
    };

    users.push(newUser);

    return NextResponse.json(
      { message: 'User created successfully', userId: newUser.id },
      { status: 201, headers: corsHeaders }
    );
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500, headers: corsHeaders }
    );
  }
}
