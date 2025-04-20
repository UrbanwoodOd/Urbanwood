import mongoose, { Schema } from "mongoose";

export interface IImage {
  filename: string;  // The filename in MinIO
  originalName: string;
  mimeType: string;
  size: number;
  publicUrl: string;
  category: string;  // Either category ID or 'general'
  createdAt: Date;
  updatedAt: Date;
}

const ImageSchema = new Schema<IImage>(
  {
    filename: { type: String, required: true }, 
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    publicUrl: { type: String, required: true },
    category: { type: String, required: true, default: 'general' },
  },
  { timestamps: true },
);

const Image =
  mongoose.models.Image ||
  mongoose.model<IImage>("Image", ImageSchema);

export { Image };