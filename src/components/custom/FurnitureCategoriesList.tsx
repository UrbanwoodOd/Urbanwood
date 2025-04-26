"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle } from "../ui/card";

export const FurnitureCard = ({
  title,
  imageUrl,
  altText,
  slug,
}: {
  title: string;
  imageUrl: string;
  altText: string;
  slug: string;
}) => {
  return (
    <Link href={`/portfolio/${slug}`} className="group cursor-pointer">
      <Card className="overflow-hidden transition-all duration-300 group-hover:scale-105 shadow-none border-none rounded-none bg-transparent">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={imageUrl}
            alt={altText}
            className="w-full h-full object-cover filter grayscale transition-all duration-300 group-hover:grayscale-0"
          />
        </div>
        <CardHeader className="py-2 bg-transparent">
          <CardTitle className="text-center text-lg font-light">
            {title}
          </CardTitle>
        </CardHeader>
      </Card>
    </Link>
  );
};

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  imagePath?: string;
}

interface FormattedCategory {
  title: string;
  imageUrl: string;
  altText: string;
  slug: string;
}

export const FurnitureCategoriesList = () => {
  const [categories, setCategories] = useState<FormattedCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/api/get-category");

        if (data.categories && data.categories.length > 0) {
          // Map the MongoDB categories to the format needed for display
          const formattedCategories = data.categories.map(
            (category: Category): FormattedCategory => ({
              title: category.name,
              imageUrl: category.imagePath || "/categories/sofa.jpg", // Default image if none provided
              altText: category.description || category.name,
              slug: category.slug,
            }),
          );

          setCategories(formattedCategories);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 px-4 min-h-[200px] items-center">
        <div className="col-span-full flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 px-4">
      {categories.map((category) => (
        <FurnitureCard key={category.slug} {...category} />
      ))}
    </div>
  );
};
