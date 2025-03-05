import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const refreshToken = req.cookies.get('refresh')?.value;

  if (!refreshToken && req.nextUrl.pathname.startsWith('/store'))
    return NextResponse.redirect(new URL('/login', req.url));

  if (refreshToken && req.nextUrl.pathname === '/login')
    return NextResponse.redirect(new URL('/store/movies', req.url));
}

export const config = {
  matcher: ['/store/:path*', '/admin/:path*', '/login'], // Protect routes
};
