import { asc, desc, eq } from "drizzle-orm";
import db from "./db";
import { categories, categoryItems, images } from "./schema";
import { NewCategory, NewCategoryItem, NewImage } from "./types";

// Categories
export async function getAllCategories() {
  return db.query.categories.findMany({
    orderBy: [asc(categories.name)],
  });
}

export async function getCategoryBySlug(slug: string) {
  return db.query.categories.findFirst({
    where: eq(categories.slug, slug),
  });
}

export async function getCategoryById(id: number) {
  return db.query.categories.findFirst({
    where: eq(categories.id, id),
  });
}

export async function createCategory(category: NewCategory) {
  const result = await db.insert(categories).values(category).returning();
  return result[0];
}

export async function updateCategory(
  id: number,
  category: Partial<NewCategory>,
) {
  const result = await db
    .update(categories)
    .set({
      ...category,
      updatedAt: new Date(),
    })
    .where(eq(categories.id, id))
    .returning();
  return result[0];
}

// Category Items
export async function getCategoryItems(categoryId: number) {
  return db.query.categoryItems.findMany({
    where: eq(categoryItems.categoryId, categoryId),
    orderBy: [desc(categoryItems.createdAt)],
    with: {
      image: true,
    },
  });
}

export async function getCategoryItemById(id: number) {
  return db.query.categoryItems.findFirst({
    where: eq(categoryItems.id, id),
    with: {
      image: true,
    },
  });
}

export async function createCategoryItem(item: NewCategoryItem) {
  const result = await db.insert(categoryItems).values(item).returning();
  return result[0];
}

export async function updateCategoryItem(
  id: number,
  item: Partial<NewCategoryItem>,
) {
  const result = await db
    .update(categoryItems)
    .set({
      ...item,
      updatedAt: new Date(),
    })
    .where(eq(categoryItems.id, id))
    .returning();
  return result[0];
}

// Images
export async function getImageById(id: number) {
  return db.query.images.findFirst({
    where: eq(images.id, id),
  });
}

export async function createImage(image: NewImage) {
  const result = await db.insert(images).values(image).returning();
  return result[0];
}

export async function updateImage(id: number, image: Partial<NewImage>) {
  const result = await db
    .update(images)
    .set({
      ...image,
      updatedAt: new Date(),
    })
    .where(eq(images.id, id))
    .returning();
  return result[0];
}
