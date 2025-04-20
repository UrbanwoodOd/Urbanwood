import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  // Create a Supabase client configured to use cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // This is used for setting cookies during redirects
          request.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          // This is used for removing cookies during redirects
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components
  const { data: { session } } = await supabase.auth.getSession();

  // If user is not signed in and the route is protected, redirect to signin
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/admin');
  const isAPIRoute = request.nextUrl.pathname.startsWith('/api/upload-image') || 
                    request.nextUrl.pathname.startsWith('/api/post-category') ||
                    request.nextUrl.pathname.startsWith('/api/update-category');

  if ((isProtectedRoute || isAPIRoute) && !session) {
    // Redirect to login page
    const redirectUrl = new URL('/auth/signin', request.url);
    redirectUrl.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Additional check for admin-only routes - verify admin email
  if (isProtectedRoute && session && session.user.email !== 'vadimkbondarchuk@gmail.com') {
    // User is signed in but not the admin
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/upload-image',
    '/api/delete-image/:path*',
    '/api/post-category',
    '/api/post-category-item',
    '/api/update-category/:path*',
    '/api/update-category-item/:path*',
  ],
};