import { uploadFile } from "@/lib/minio";
import { NextRequest, NextResponse } from "next/server";
import { createImage } from "@/db/queries";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  try {
    // const supabase = createClient();
    // const { data } = await supabase.auth.getSession();

    // if (
    //   !data.session ||
    //   data.session.user.email !== "vadimkbondarchuk@gmail.com"
    // ) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const category = (formData.get("category") as string) || "general";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds the 5MB limit" },
        { status: 400 },
      );
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Invalid file type. Only jpg, jpeg, png, and webp are allowed",
        },
        { status: 400 },
      );
    }

    // Create a unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const originalName = file.name.split(".")[0].replace(/[^a-zA-Z0-9]/g, "-");
    const fileName = `${category}/${originalName}-${timestamp}.${fileExtension}`;

    // Convert the file to bytes
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload file to MinIO
    const publicUrl = await uploadFile(buffer, fileName, file.type);

    // Save the image metadata in PostgreSQL using DrizzleORM
    const imageDoc = await createImage({
      filename: fileName,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      publicUrl,
      category,
    });

    return NextResponse.json(
      {
        success: true,
        url: publicUrl,
        image: {
          id: imageDoc.id,
          filename: fileName,
          publicUrl,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to upload image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 },
    );
  }
}