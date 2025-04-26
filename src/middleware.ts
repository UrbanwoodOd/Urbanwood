import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { locales } from "./i18n/config";

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
            value: "",
            ...options,
          });
        },
      },
    },
  );

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Check for both direct and localized admin routes
  const isDirectAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLocalizedAdminRoute = locales.some((locale) =>
    request.nextUrl.pathname.startsWith(`/${locale}/admin`),
  );
  const isProtectedRoute = isDirectAdminRoute || isLocalizedAdminRoute;

  const isAPIRoute =
    request.nextUrl.pathname.startsWith("/api/upload-image") ||
    request.nextUrl.pathname.startsWith("/api/post-category") ||
    request.nextUrl.pathname.startsWith("/api/update-category");

  if ((isProtectedRoute || isAPIRoute) && !session) {
    // Get current locale from path or default to 'en'
    const currentPathname = request.nextUrl.pathname;
    const localeMatch = currentPathname.match(
      new RegExp(`^/(${locales.join("|")})/`),
    );
    const currentLocale = localeMatch ? localeMatch[1] : "en";

    // Redirect to login page with locale
    const redirectUrl = new URL(`/${currentLocale}/auth/signin`, request.url);
    redirectUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Additional check for admin-only routes - verify admin email
  if (
    isProtectedRoute &&
    session &&
    session.user.email !== "vadimkbondarchuk@gmail.com"
  ) {
    // Get current locale from path or default to 'en'
    const currentPathname = request.nextUrl.pathname;
    const localeMatch = currentPathname.match(
      new RegExp(`^/(${locales.join("|")})/`),
    );
    const currentLocale = localeMatch ? localeMatch[1] : "en";

    // User is signed in but not the admin, redirect to homepage with appropriate locale
    return NextResponse.redirect(new URL(`/${currentLocale}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/:locale/admin/:path*",
    "/api/upload-image",
    "/api/delete-image/:path*",
    "/api/post-category",
    "/api/post-category-item",
    "/api/update-category/:path*",
    "/api/update-category-item/:path*",
  ],
};
