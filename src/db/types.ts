import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { categories, categoryItems, images } from './schema';

// Select types (for retrieval)
export type Category = InferSelectModel<typeof categories>;
export type CategoryItem = InferSelectModel<typeof categoryItems>;
export type Image = InferSelectModel<typeof images>;

// Insert types (for creation)
export type NewCategory = InferInsertModel<typeof categories>;
export type NewCategoryItem = InferInsertModel<typeof categoryItems>;
export type NewImage = InferInsertModel<typeof images>;