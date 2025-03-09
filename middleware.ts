import { getAccessToken, getAdminStatus, getRefreshToken } from '@actions/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const refresh = await getRefreshToken();
  const access = (await getAccessToken()) || null;

  const admin: boolean = await getAdminStatus(access);

  if (req.nextUrl.pathname === '/')
    return refresh
      ? NextResponse.redirect(new URL('/store/movies', req.url))
      : NextResponse.redirect(new URL('/login', req.url));

  if (!refresh && req.nextUrl.pathname !== '/login')
    return NextResponse.redirect(new URL('/login', req.url));

  if (!admin && req.nextUrl.pathname.startsWith('/admin'))
    return NextResponse.redirect(new URL('/store/movies', req.url));

  if (admin && req.nextUrl.pathname === '/store/account')
    return NextResponse.redirect(new URL('/store/movies', req.url));

  if (refresh && req.nextUrl.pathname === '/login')
    return NextResponse.redirect(new URL('/store/movies', req.url));
}

export const config = {
  matcher: ['/store/:path*', '/admin/:path*', '/login', '/'], // Protect routes
};
