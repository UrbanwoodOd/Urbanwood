import createMiddleware from "next-intl/middleware";
import { locales } from "./config";

export default createMiddleware({
  // A list of all locales that are supported
  locales: locales,

  // Used when no locale matches
  defaultLocale: "en",

  // Use path-based routing instead of cookies
  localePrefix: "always",
});

export const config = {
  // Match all pathnames except non-localized routes
  matcher: ["/((?!api|_next|auth|.*\\..*).*)"],
};
