import { NextRequest, NextResponse } from "next/server";
import { getAllCategories, getCategoryBySlug } from "@/db/queries";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const category = await getCategoryBySlug(slug);

      if (!category) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 },
        );
      }

      return NextResponse.json({ category });
    }

    // Otherwise return all categories
    const categories = await getAllCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Failed to get categories:", error);
    return NextResponse.json(
      { error: "Failed to get categories" },
      { status: 500 },
    );
  }
}