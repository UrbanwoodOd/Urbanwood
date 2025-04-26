"use client";

import { CategoryForm } from "@/components/admin/CategoryForm";
import { CategoryItemForm } from "@/components/admin/CategoryItemForm";
import { CategoryItemsList } from "@/components/admin/CategoryItemsList";
import { CategoryList } from "@/components/admin/CategoryList";
import { MainNavigation } from "@/components/custom/MainNavigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/supabase/supabase";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPortfolioPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [activeView, setActiveView] = useState<
    "list" | "add" | "edit" | "items" | "addItem" | "editItem"
  >("list");
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
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
          // Not logged in or not the admin
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

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setActiveView("add");
  };

  const handleEditCategory = (category: any) => {
    setSelectedCategory(category);
    setActiveView("edit");
  };

  const handleBackToList = () => {
    setActiveView("list");
    setSelectedCategory(null);
    setSelectedItem(null);
  };

  const handleManageCategoryItems = (category: any) => {
    setSelectedCategory(category);
    setActiveView("items");
  };

  const handleAddItem = () => {
    setSelectedItem(null);
    setActiveView("addItem");
  };

  const handleEditItem = (item: any) => {
    setSelectedItem(item);
    setActiveView("editItem");
  };

  const handleBackToItems = () => {
    setActiveView("items");
    setSelectedItem(null);
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

  const renderContent = () => {
    switch (activeView) {
      case "list":
        return (
          <CategoryList
            onEdit={handleEditCategory}
            onManageItems={handleManageCategoryItems}
          />
        );
      case "add":
      case "edit":
        return (
          <CategoryForm
            category={selectedCategory}
            mode={activeView}
            onComplete={handleBackToList}
          />
        );
      case "items":
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {t("portfolio.categoryItems")}: {selectedCategory?.name}
              </h2>
              <Button onClick={handleAddItem}>{t("portfolio.addItem")}</Button>
            </div>
            <CategoryItemsList
              categoryId={selectedCategory?._id}
              onEdit={handleEditItem}
            />
          </div>
        );
      case "addItem":
      case "editItem":
        return (
          <CategoryItemForm
            categoryItem={selectedItem}
            mode={activeView === "addItem" ? "add" : "edit"}
            onComplete={handleBackToItems}
            categoryId={selectedCategory?._id}
          />
        );
      default:
        return null;
    }
  };

  return (
    <main className="container mx-auto">
      <MainNavigation />
      <div className="py-12 px-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{t("portfolio.title")}</h1>
            <div className="flex gap-4">
              {activeView !== "list" && (
                <Button
                  variant="outline"
                  onClick={
                    activeView === "items" ||
                    activeView === "addItem" ||
                    activeView === "editItem"
                      ? activeView === "items"
                        ? handleBackToList
                        : handleBackToItems
                      : handleBackToList
                  }
                >
                  {activeView === "items"
                    ? t("portfolio.backToCategories")
                    : activeView === "addItem" || activeView === "editItem"
                    ? t("portfolio.backToItems")
                    : t("portfolio.backToList")}
                </Button>
              )}
              {activeView === "list" && (
                <Button onClick={handleAddCategory}>
                  {t("portfolio.addCategory")}
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => router.push(`/${locale}/admin`)}
              >
                {t("portfolio.backToAdmin")}
              </Button>
            </div>
          </div>

          {renderContent()}
        </div>
      </div>
    </main>
  );
}
