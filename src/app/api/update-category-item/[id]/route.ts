import { connectToDatabase } from "@/lib/mongodb";
import { CategoryItem } from "@/models/Category";
import { Image } from "@/models/Image";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, image_id, image_url, category } = body;

    if (!name || !image_id || !category) {
      return NextResponse.json(
        { error: "Name, image ID, and category are required" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    // Find the image to get its publicUrl
    const image = await Image.findById(image_id);
    if (!image) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 400 },
      );
    }

    // Create slug from name
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .trim();

    // Check if another item (not this one) already has this slug
    const existingItem = await CategoryItem.findOne({
      slug,
      _id: { $ne: id },
    });

    if (existingItem) {
      return NextResponse.json(
        { error: "Another item with this name already exists" },
        { status: 400 },
      );
    }

    // Prepare the update data with both image_id and image_url
    const updateData = {
      name,
      slug,
      category,
      image_id: new mongoose.Types.ObjectId(image_id),
      image_url: image.publicUrl,
    };

    // Update category item
    const updatedItem = await CategoryItem.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );

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

    await connectToDatabase();

    // Find the item first to get the image_id reference
    const item = await CategoryItem.findById(id);
    
    if (!item) {
      return NextResponse.json(
        { error: "Category item not found" },
        { status: 404 },
      );
    }

    // Delete the category item
    await CategoryItem.findByIdAndDelete(id);

    // Optionally, if you want to delete the associated image:
    // This is commented out because you might want to keep images for reference
    // or other items might be using the same image
    
    // const imageId = item.image_id;
    // if (imageId) {
    //   // Check if any other items are using this image
    //   const otherItemsUsingImage = await CategoryItem.countDocuments({ image_id: imageId });
    //   
    //   // Only delete the image if no other items are using it
    //   if (otherItemsUsingImage === 0) {
    //     const image = await Image.findById(imageId);
    //     if (image) {
    //       // Delete from MinIO first
    //       try {
    //         await deleteFile(getFileNameFromUrl(image.publicUrl));
    //       } catch (err) {
    //         console.error('Error deleting file from MinIO:', err);
    //       }
    //       // Then delete from MongoDB
    //       await Image.findByIdAndDelete(imageId);
    //     }
    //   }
    // }

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
