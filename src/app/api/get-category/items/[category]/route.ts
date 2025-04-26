import { getCategoryItems } from "@/db/queries";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { category: string } },
) {
  try {
    const { category } = params;

    const items = await getCategoryItems(parseInt(category));

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error fetching category items:", error);
    return NextResponse.json(
      { error: "Failed to fetch category items" },
      { status: 500 },
    );
  }
}
