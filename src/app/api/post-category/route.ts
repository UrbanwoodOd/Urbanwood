import { NextRequest, NextResponse } from "next/server";
import { createCategory, getCategoryBySlug } from "@/db/queries";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 },
      );
    }

    // Check if category with same slug already exists
    const existingCategory = await getCategoryBySlug(data.slug);
    if (existingCategory) {
      return NextResponse.json(
        { error: "Category with this slug already exists" },
        { status: 409 },
      );
    }

    // Create new category
    const newCategory = await createCategory({
      name: data.name,
      slug: data.slug,
      description: data.description || "",
    });

    return NextResponse.json(
      { message: "Category created successfully", category: newCategory },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 },
    );
  }
}