import { NextRequest, NextResponse } from 'next/server';

// This route proxies the code to the main Discord OAuth handler and redirects to /dashboard
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const mode = req.nextUrl.searchParams.get('mode');
  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }

  // Forward the code and mode to the main handler
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.boundless-saga.com'}/api/auth/discord`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, mode }),
  });

  if (!res.ok) {
    let error;
    try {
      error = await res.json();
    } catch (e) {
      error = { error: 'Unknown error', details: 'Failed to parse error response from Discord handler.' };
    }
    return NextResponse.json(error, { status: res.status });
  }

  // On success, redirect to dashboard with 303 status so browser uses GET
  return NextResponse.redirect(
    new URL('/dashboard', process.env.NEXT_PUBLIC_BASE_URL || 'https://www.boundless-saga.com'),
    { status: 303 }
  );
}
