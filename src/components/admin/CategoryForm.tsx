"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Category {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  imagePath?: string;
}

interface CategoryFormProps {
  category?: Category | null;
  mode: "add" | "edit";
  onComplete: () => void;
}

export function CategoryForm({
  category,
  mode,
  onComplete,
}: CategoryFormProps) {
  const [formData, setFormData] = useState<Category>({
    name: "",
    slug: "",
    description: "",
    imagePath: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (category && mode === "edit") {
      setFormData({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        imagePath: category.imagePath || "",
      });

      if (category.imagePath) {
        setImagePreview(category.imagePath);
      }
    }
  }, [category, mode]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^\wа-яё]+/gi, "-")
      .replace(/^-|-$/g, "");
    setFormData((prev) => ({ ...prev, slug }));
  };

  const handleImageSelect = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("directory", "categories");

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload image");
      }

      const data = await response.json();

      // Update the form data with the new image path
      setFormData((prev) => ({ ...prev, imagePath: data.filePath }));
      setImagePreview(data.filePath);
    } catch (err: any) {
      console.error("Error uploading image:", err);
      setError(err.message || "Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let response;

      if (mode === "add") {
        response = await fetch("/api/post-category", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        response = await fetch(`/api/update-category/${formData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save category");
      }

      // Success - go back to list
      onComplete();
    } catch (err: any) {
      console.error("Error saving category:", err);
      setError(err.message || "Failed to save category. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">
        {mode === "add"
          ? "Добавить новую категорию"
          : "Редактировать категорию"}
      </h2>

      {error && (
        <div className="p-4 mb-4 bg-red-50 text-red-700 rounded-md">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Название категории *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Например: Кухонная мебель"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium">URL-путь *</label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={generateSlug}
              className="text-xs"
            >
              Сгенерировать из названия
            </Button>
          </div>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Например: kuhonnaya-mebel"
          />
          <p className="text-xs text-gray-500 mt-1">
            Только латинские буквы, цифры и дефисы. Без пробелов.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Описание</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows={3}
            placeholder="Краткое описание категории..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Изображение категории
          </label>
          <div className="mt-2">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleImageUpload}
            />

            <div className="flex items-start gap-4">
              {imagePreview && (
                <div className="relative w-40 h-40 border rounded-md overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleImageSelect}
                  disabled={uploadingImage}
                  className="w-40"
                >
                  {uploadingImage ? (
                    <>
                      <span className="mr-2 animate-spin">↻</span>
                      Загрузка...
                    </>
                  ) : imagePreview ? (
                    "Заменить изображение"
                  ) : (
                    "Загрузить изображение"
                  )}
                </Button>

                {imagePreview && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData((prev) => ({ ...prev, imagePath: "" }));
                    }}
                    className="w-40"
                  >
                    Удалить изображение
                  </Button>
                )}
              </div>
            </div>

            <input
              type="hidden"
              name="imagePath"
              value={formData.imagePath || ""}
            />

            <p className="text-xs text-gray-500 mt-2">
              Поддерживаемые форматы: JPG, PNG, WebP. Максимальный размер: 5МБ
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onComplete}
            disabled={isSubmitting}
          >
            Отмена
          </Button>
          <Button type="submit" disabled={isSubmitting || uploadingImage}>
            {isSubmitting ? (
              <>
                <span className="mr-2 animate-spin">↻</span>
                {mode === "add" ? "Сохранение..." : "Обновление..."}
              </>
            ) : mode === "add" ? (
              "Сохранить"
            ) : (
              "Обновить"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
