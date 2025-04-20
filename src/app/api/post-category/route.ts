import { connectToDatabase } from "@/lib/mongodb";
import { Category } from "@/models/Category";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 },
      );
    }

    // Check if category with same slug already exists
    const existingCategory = await Category.findOne({ slug: data.slug });
    if (existingCategory) {
      return NextResponse.json(
        { error: "Category with this slug already exists" },
        { status: 409 },
      );
    }

    // Create new category
    const newCategory = await Category.create({
      name: data.name,
      slug: data.slug,
      description: data.description || "",
      image_url: data.image_url || "",
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
