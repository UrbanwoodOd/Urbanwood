"use client";

import { Card, CardHeader, CardTitle } from "../ui/card";
import { useEffect, useState } from "react";
import Link from "next/link";

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

// Fallback categories if API fails
const fallbackCategories: FormattedCategory[] = [
  {
    title: "Кухни на заказ",
    imageUrl: "/categories/sofa.jpg",
    altText: "Кухни на заказ",
    slug: "kitchens",
  },
  {
    title: "Мебель для кафе, баров, ресторанов",
    imageUrl: "/categories/sofa.jpg",
    altText: "Мебель для кафе",
    slug: "cafe-furniture",
  },
  {
    title: "Мебель лофт",
    imageUrl: "/categories/sofa.jpg",
    altText: "Мебель лофт",
    slug: "loft-furniture",
  },
];

export const FurnitureCategoriesList = () => {
  const [categories, setCategories] = useState<FormattedCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/get-category');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const data = await response.json();
        if (data.categories && data.categories.length > 0) {
          // Map the MongoDB categories to the format needed for display
          const formattedCategories = data.categories.map((category: Category): FormattedCategory => ({
            title: category.name,
            imageUrl: category.imagePath || '/categories/sofa.jpg', // Default image if none provided
            altText: category.description || category.name,
            slug: category.slug,
          }));
          
          setCategories(formattedCategories);
        } else {
          // Use fallback if no categories found
          setCategories(fallbackCategories);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(true);
        // Use fallback on error
        setCategories(fallbackCategories);
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
