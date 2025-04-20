import { connectToDatabase } from "@/lib/mongodb";
import { CategoryItem } from "@/models/Category";
import { Image } from "@/models/Image";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, image_id, category, slug } = body;

    if (!name || !image_id || !category) {
      return NextResponse.json(
        { error: "Name, image (ID or URL), and category are required" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const image = await Image.findById(image_id);

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 400 });
    }

    const existingItem = await CategoryItem.findOne({ slug });
    if (existingItem) {
      return NextResponse.json(
        { error: "Item with this name already exists" },
        { status: 400 },
      );
    }

    const newCategoryItem = new CategoryItem({
      name,
      slug,
      image_id,
      image_url: image.publicUrl,
      category,
    });
    await newCategoryItem.save();

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
