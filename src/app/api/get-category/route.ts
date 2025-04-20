import { connectToDatabase } from "@/lib/mongodb";
import { Category } from "@/models/Category";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    await connectToDatabase();

    if (slug) {
      const category = await Category.findOne({ slug });

      if (!category) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 },
        );
      }

      return NextResponse.json({ category });
    }

    // Otherwise return all categories
    const categories = await Category.find({}).sort({ name: 1 });
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Failed to get categories:", error);
    return NextResponse.json(
      { error: "Failed to get categories" },
      { status: 500 },
    );
  }
}
