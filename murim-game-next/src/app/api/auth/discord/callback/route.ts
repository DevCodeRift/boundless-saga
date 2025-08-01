import { NextRequest, NextResponse } from 'next/server';

// This route proxies the code to the main Discord OAuth handler and redirects to /dashboard
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }

  // Forward the code to the main handler
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.boundless-saga.com'}/api/auth/discord`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });

  if (!res.ok) {
    const error = await res.json();
    return NextResponse.json(error, { status: res.status });
  }

  // On success, redirect to dashboard
  return NextResponse.redirect(new URL('/dashboard', process.env.NEXT_PUBLIC_BASE_URL || 'https://www.boundless-saga.com'));
}
