import {
  createCategoryItem,
  getCategoryById,
  getImageById,
} from "@/db/queries";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, image_id, category, slug } = body;

    if (!name || !image_id || !category) {
      return NextResponse.json(
        { error: "Name, image ID, and category are required" },
        { status: 400 },
      );
    }

    // Check if category exists
    const categoryObj = await getCategoryById(parseInt(category));
    if (!categoryObj) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    // Check if image exists
    const image = await getImageById(parseInt(image_id));
    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Create the category item
    const newCategoryItem = await createCategoryItem({
      name,
      slug,
      imageId: parseInt(image_id),
      imageUrl: image.publicUrl,
      categoryId: parseInt(category),
    });

    return NextResponse.json(
      { message: "Category item created successfully", item: newCategoryItem },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating category item:", error);
    return NextResponse.json(
      { error: "Failed to create category item" },
      { status: 500 },
    );
  }
}
