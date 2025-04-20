"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";

interface CategoryItemFormProps {
  categoryItem?: any;
  mode: "add" | "edit";
  onComplete: () => void;
  categoryId: string;
}

export function CategoryItemForm({
  categoryItem,
  mode,
  onComplete,
  categoryId,
}: CategoryItemFormProps) {
  const [name, setName] = useState(categoryItem?.name || "");
  const [imageId, setImageId] = useState(categoryItem?.image_id || "");
  const [imageUrl, setImageUrl] = useState(categoryItem?.image_url || "");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(categoryItem?.image_url || "");
  const [slug, setSlug] = useState(categoryItem?.slug || "");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Create a preview URL
      const fileUrl = URL.createObjectURL(selectedFile);
      setPreview(fileUrl);
    }
  };

  const uploadImage = async (): Promise<{ id: string; url: string }> => {
    if (!file) {
      // If no new file was selected and we're in edit mode, use existing ID and URL
      if (mode === "edit" && imageId && imageUrl) {
        return { id: imageId, url: imageUrl };
      }
      throw new Error("No image file selected");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", categoryId);

    const response = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to upload image");
    }

    const data = await response.json();
    return {
      id: data.image.id,
      url: data.image.publicUrl,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!name) {
        throw new Error("Name is required");
      }

      // Upload image if there's a file or use existing image
      let itemImageId = imageId;
      let itemImageUrl = imageUrl; // Used for both preview and fallback

      if (file) {
        const uploadResult = await uploadImage();
        itemImageId = uploadResult.id;
        itemImageUrl = uploadResult.url;
      } else if (!imageId && !imageUrl && mode === "add") {
        throw new Error("Image is required");
      }

      // Send data to API endpoint
      const apiUrl =
        mode === "add"
          ? "/api/post-category-item"
          : `/api/update-category-item/${categoryItem._id}`;

      const method = mode === "add" ? "POST" : "PUT";

      // Always include both image_id and image_url
      const requestBody = {
        name,
        category: categoryId,
        image_id: itemImageId,
        image_url: itemImageUrl,
        slug,
      };

      const response = await fetch(apiUrl, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save category item");
      }

      // Success - go back to the list
      onComplete();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!categoryItem?._id) return;

    if (!confirm("Are you sure you want to delete this item?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/update-category-item/${categoryItem._id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete category item");
      }

      // Success - go back to the list
      onComplete();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        {mode === "add" ? "Добавить элемент" : "Редактировать элемент"}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Название *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            disabled={loading}
            required
          />
        </div>

        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Слаг *
          </label>
          <input
            type="text"
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            disabled={loading}
            required
          />
        </div>

        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Изображение *
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            disabled={loading}
          />
          {preview && (
            <div className="mt-2">
              <p className="text-sm text-gray-500 mb-1">Предпросмотр:</p>
              <div className="relative w-full h-48">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-4">
          <div>
            <Button type="submit" disabled={loading}>
              {loading
                ? "Сохранение..."
                : mode === "add"
                ? "Добавить"
                : "Сохранить"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="ml-2"
              onClick={onComplete}
              disabled={loading}
            >
              Отмена
            </Button>
          </div>
          {mode === "edit" && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              Удалить
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
