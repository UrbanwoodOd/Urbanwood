import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// Categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Images
export const images = pgTable("images", {
  id: serial("id").primaryKey(),
  filename: varchar("filename", { length: 255 }).notNull(),
  originalName: varchar("original_name", { length: 255 }).notNull(),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  size: integer("size").notNull(),
  publicUrl: varchar("public_url", { length: 255 }).notNull(),
  category: varchar("category", { length: 255 }).notNull().default("general"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Category Items
export const categoryItems = pgTable("category_items", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  imageId: integer("image_id")
    .notNull()
    .references(() => images.id),
  imageUrl: varchar("image_url", { length: 255 }).notNull(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Define relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  categoryItems: many(categoryItems),
}));

export const categoryItemsRelations = relations(categoryItems, ({ one }) => ({
  category: one(categories, {
    fields: [categoryItems.categoryId],
    references: [categories.id],
  }),
  image: one(images, {
    fields: [categoryItems.imageId],
    references: [images.id],
  }),
}));

export const imagesRelations = relations(images, ({ many }) => ({
  categoryItems: many(categoryItems),
}));
