import { NextResponse } from "next/server";
import { updateCategoryItem, getCategoryItemById, getImageById } from "@/db/queries";
import { db } from "@/lib/db";
import { categoryItems } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const numId = parseInt(id);
    
    if (isNaN(numId)) {
      return NextResponse.json(
        { error: "Invalid ID format" },
        { status: 400 },
      );
    }
    
    const body = await request.json();
    const { name, image_id, category } = body;

    if (!name || !image_id || !category) {
      return NextResponse.json(
        { error: "Name, image ID, and category are required" },
        { status: 400 },
      );
    }

    // Find the image to get its publicUrl
    const image = await getImageById(parseInt(image_id));
    if (!image) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 },
      );
    }

    // Create slug from name if not provided
    const slug = body.slug || name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .trim();

    // Update category item
    const updatedItem = await updateCategoryItem(numId, {
      name,
      slug,
      categorySlug: category,
      imageId: parseInt(image_id),
      imageUrl: image.publicUrl,
    });

    if (!updatedItem) {
      return NextResponse.json(
        { error: "Category item not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Category item updated successfully",
      item: updatedItem,
    });
  } catch (error) {
    console.error("Error updating category item:", error);
    return NextResponse.json(
      { error: "Failed to update category item" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const numId = parseInt(id);
    
    if (isNaN(numId)) {
      return NextResponse.json(
        { error: "Invalid ID format" },
        { status: 400 },
      );
    }

    // Check if item exists
    const item = await getCategoryItemById(numId);
    if (!item) {
      return NextResponse.json(
        { error: "Category item not found" },
        { status: 404 },
      );
    }

    // Delete the category item
    await db.delete(categoryItems).where(eq(categoryItems.id, numId));

    // Note: We're not deleting associated images as they might be used elsewhere
    // Just like in the original code

    return NextResponse.json({
      message: "Category item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category item:", error);
    return NextResponse.json(
      { error: "Failed to delete category item" },
      { status: 500 },
    );
  }
}