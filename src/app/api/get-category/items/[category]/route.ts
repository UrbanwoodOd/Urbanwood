import { connectToDatabase } from "@/lib/mongodb";
import { CategoryItem } from "@/models/Category";
import { Image } from "@/models/Image";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { category: string } },
) {
  try {
    const { category } = params;

    await connectToDatabase();

    const items = await CategoryItem.find({ category }).sort({ createdAt: -1 });

    const populatedItems = await Promise.all(
      items.map(async (item) => {
        const itemObj = item.toObject();

        if (item.image_url && !item.image_id) {
          return {
            ...itemObj,
            image_url: item.image_url,
          };
        }

        if (item.image_id) {
          const image = await Image.findById(item.image_id);
          return {
            ...itemObj,
            image: image ? image.toObject() : null,
            image_url: image ? image.publicUrl : item.image_url || null,
          };
        }

        return itemObj;
      }),
    );

    return NextResponse.json({ items: populatedItems });
  } catch (error) {
    console.error("Error fetching category items:", error);
    return NextResponse.json(
      { error: "Failed to fetch category items" },
      { status: 500 },
    );
  }
}
