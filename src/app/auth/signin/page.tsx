"use client";

import { Footer } from "@/components/custom/Footer";
import { MainNavigation } from "@/components/custom/MainNavigation";
import { Button } from "@/components/ui/button";
import { locales } from "@/i18n/config";
import { createClient } from "@/supabase/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("vadimkbondarchuk@gmail.com");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [locale, setLocale] = useState("en");

  // Determine locale from next parameter or browser
  useEffect(() => {
    const nextParam = searchParams.get("next");
    if (nextParam) {
      // Check if the next URL contains a locale
      const localeMatch = nextParam.match(
        new RegExp(`^/(${locales.join("|")})/`),
      );
      if (localeMatch && localeMatch[1]) {
        setLocale(localeMatch[1]);
        return;
      }
    }

    // Fallback to browser language
    const browserLang = navigator.language.split("-")[0];
    const supportedLocale = locales.find((l) => l === browserLang);
    if (supportedLocale) {
      setLocale(supportedLocale);
    }
  }, [searchParams]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Allow only specific admin email
    if (email !== "vadimkbondarchuk@gmail.com") {
      setMessage("Access denied: Admin login only.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Get the next URL from query params or use localized admin path
      const nextUrl = searchParams.get("next") || `/${locale}/admin`;
      router.push(nextUrl);
      router.refresh();
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto">
      <MainNavigation />
      <div className="flex flex-col items-center justify-center min-h-[70vh] py-12">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold mb-6 text-center">
            Admin Login
          </h1>
          {message && (
            <div className="mb-4 p-3 bg-blue-50 text-blue-800 rounded">
              {message}
            </div>
          )}
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
                readOnly
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </main>
  );
}
