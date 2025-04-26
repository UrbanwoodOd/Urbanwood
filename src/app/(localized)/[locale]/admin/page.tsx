"use client";

import { MainNavigation } from "@/components/custom/MainNavigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/supabase/supabase";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations("admin");

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getSession();

        if (
          !data.session ||
          data.session.user.email !== "vadimkbondarchuk@gmail.com"
        ) {
          // Not logged in or not the admin - redirect to localized sign-in
          router.push(`/${locale}/auth/signin`);
          return;
        }

        setUser(data.session.user);
      } catch (error) {
        console.error("Error checking admin status:", error);
        router.push(`/${locale}/auth/signin`);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router, locale]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${locale}`);
  };

  if (loading) {
    return (
      <main className="container mx-auto">
        <MainNavigation />
        <div className="flex justify-center items-center min-h-[70vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto">
      <MainNavigation />
      <div className="py-12 px-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold">{t("title")}</h1>

          <Button className="my-6" onClick={handleSignOut}>
            {t("signOut")}
          </Button>

          <div className="mb-6 p-4 bg-gray-50 rounded-md">
            <h2 className="text-lg font-semibold mb-2">{t("adminInfo")}</h2>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>{t("lastSignIn")}:</strong>{" "}
              {new Date(user?.last_sign_in_at).toLocaleString()}
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-3">
                {t("websiteManagement")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AdminCard
                  title={t("portfolioItems.title")}
                  description={t("portfolioItems.description")}
                  path={`/${locale}/admin/portfolio`}
                />
                <AdminCard
                  title={t("contentManagement.title")}
                  description={t("contentManagement.description")}
                  path={`/${locale}/admin/content`}
                />
                <AdminCard
                  title={t("contactManagement.title")}
                  description={t("contactManagement.description")}
                  path={`/${locale}/admin/contacts`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function AdminCard({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  const t = useTranslations("admin");

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <h3 className="font-medium text-lg mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <a
        href={path}
        className="text-primary hover:text-primary/80 font-medium text-sm inline-flex items-center"
      >
        {t("portfolio.manage")}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 ml-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </a>
    </div>
  );
}
