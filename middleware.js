// middleware.js

import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions } from './lib/session';

export async function middleware(request) {
  const session = await getIronSession(request.cookies, sessionOptions);

  // If the user is not logged in and is trying to access an admin page
  if (!session.isLoggedIn && request.nextUrl.pathname.startsWith('/admin')) {
    // Redirect them to the login page
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If the user is logged in and tries to access the login page
  if (session.isLoggedIn && request.nextUrl.pathname.startsWith('/login')) {
    // Redirect them to the admin dashboard
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // Continue with the request if none of the above conditions are met
  return NextResponse.next();
}

// This configures the middleware to run only on admin and login pages
export const config = {
  matcher: ['/admin/:path*', '/login'],
};
