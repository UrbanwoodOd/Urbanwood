import mongoose, { Schema } from "mongoose";

export interface ICategory {
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
  },
  { timestamps: true },
);

const Category =
  mongoose.models.Category ||
  mongoose.model<ICategory>("Category", CategorySchema);

export interface ICategoryItem {
  name: string;
  slug: string;
  image_id: Schema.Types.ObjectId;
  image_url: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategoryItemSchema = new Schema<ICategoryItem>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image_id: { type: Schema.Types.ObjectId, ref: "Image", required: true },
    image_url: {
      type: String,
      required: true,
    },
    category: { type: String, required: true },
  },
  { timestamps: true },
);

const CategoryItem =
  mongoose.models.CategoryItem ||
  mongoose.model<ICategoryItem>("CategoryItem", CategoryItemSchema);

export { Category, CategoryItem };
