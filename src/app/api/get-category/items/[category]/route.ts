import { NextResponse } from "next/server";
import { getCategoryItems } from "@/db/queries";

export async function GET(
  request: Request,
  { params }: { params: { category: string } },
) {
  try {
    const { category } = params;

    const items = await getCategoryItems(category);

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error fetching category items:", error);
    return NextResponse.json(
      { error: "Failed to fetch category items" },
      { status: 500 },
    );
  }
}