"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";

interface CategoryItemsListProps {
  categoryId: string;
  onEdit: (item: any) => void;
}

export function CategoryItemsList({
  categoryId,
  onEdit,
}: CategoryItemsListProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/get-category/items/${categoryId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch category items");
        }

        const data = await response.json();
        setItems(data.items || []);
      } catch (error: any) {
        setError(error.message);
        console.error("Error fetching category items:", error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchItems();
    }
  }, [categoryId]);

  if (loading) {
    return (
      <div className="flex justify-center my-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
        Error: {error}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        В этой категории пока нет элементов
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <div
          key={item._id}
          className="border rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="relative w-full h-48">
            <Image
              src={item.image_url}
              alt={item.name}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="p-4">
            <h3 className="font-medium text-lg mb-2">{item.name}</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(item)}
              className="w-full mt-2"
            >
              Редактировать
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
