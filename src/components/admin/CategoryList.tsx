"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imagePath?: string;
  createdAt: string;
  updatedAt: string;
}

interface CategoryListProps {
  onEdit: (category: Category) => void;
  onManageItems: (category: Category) => void;
}

export function CategoryList({ onEdit, onManageItems }: CategoryListProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/get-category");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить эту категорию?")) {
      return;
    }

    try {
      const response = await fetch(`/api/update-category/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      // Refresh the category list
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
      alert("Failed to delete category. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        <p>{error}</p>
        <Button variant="outline" className="mt-2" onClick={fetchCategories}>
          Попробовать снова
        </Button>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-gray-500 mb-4">Категории не найдены.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <Card key={category.id} className="p-4">
            <div className="flex justify-between">
              <div>
                <h3 className="font-medium text-lg">{category.name}</h3>
                <p className="text-sm text-gray-500">/{category.slug}</p>
                {category.description && (
                  <p className="text-sm mt-2">{category.description}</p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Создано: {new Date(category.createdAt).toLocaleDateString()}
                </p>
              </div>
              {category.imagePath && (
                <div className="h-20 w-20 rounded-md overflow-hidden">
                  <img
                    src={category.imagePath}
                    alt={category.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(category)}
              >
                Изменить
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => onManageItems(category)}
              >
                Элементы
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(category.id)}
              >
                Удалить
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
