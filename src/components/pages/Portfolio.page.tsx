"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { CategoryItemsList } from "../custom/CategoryItemsList";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
}

export const PortfolioPage = ({ category }: { category?: string }) => {
  const [categoryData, setCategoryData] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("portfolio");

  useEffect(() => {
    const fetchCategory = async () => {
      if (!category) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/get-category?slug=${category}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Category not found");
          }
          throw new Error("Error loading category");
        }

        const data = await response.json();
        setCategoryData(data.category);
      } catch (err: any) {
        console.error("Error fetching category:", err);
        setError(err.message || "Error loading category");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [category]);

  if (loading) {
    return (
      <div className="p-8 pt-4 min-h-[400px] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !categoryData) {
    return null;
  }

  return (
    <div className="p-8 pt-4">
      <h2 className="text-2xl font-semibold py-4">{categoryData.name}</h2>

      {category && <CategoryItemsList categoryId={categoryData.id} />}

      <div
        dangerouslySetInnerHTML={{ __html: categoryData.description ?? "" }}
        className="py-4"
      ></div>
    </div>
  );
};
