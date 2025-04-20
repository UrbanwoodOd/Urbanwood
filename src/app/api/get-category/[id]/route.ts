import { connectToDatabase } from "@/lib/mongodb";
import { Category } from "@/models/Category";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = params.id;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ category });
  } catch (error) {
    console.error("Failed to get category:", error);
    return NextResponse.json(
      { error: "Failed to get category" },
      { status: 500 },
    );
  }
}
