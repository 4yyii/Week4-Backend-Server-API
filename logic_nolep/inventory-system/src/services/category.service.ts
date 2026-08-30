import { asc, count, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { categories } from "../db/schema.js";
import { ApiError } from "../utils/api-error.js";

export const createCategory = async (name: string) => {
  const [category] = await db.insert(categories).values({ name }).returning();
  if (!category) throw new ApiError(500, "Unable to create category");
  return category;
};

export const getCategories = async (options: { page?: number; size?: number } = {}) => {
  const page = options.page ? Number(options.page) : 1;
  const size = options.size ? Number(options.size) : 10;
  const offset = (page - 1) * size;

  const [totalResult] = await db.select({ total: count() }).from(categories);
  const total = Number(totalResult?.total ?? 0);
  const totalPages = Math.ceil(total / size) || 1;

  const items = await db
    .select()
    .from(categories)
    .orderBy(asc(categories.name))
    .limit(size)
    .offset(offset);

  return { items, meta: { page, size, total, totalPages } };
};

export const getCategoryById = async (id: string) => {
  const [category] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  if (!category) throw new ApiError(404, "Category not found");
  return category;
};

export const updateCategory = async (id: string, name: string) => {
  const [category] = await db
    .update(categories)
    .set({ name, updatedAt: new Date() })
    .where(eq(categories.id, id))
    .returning();
  if (!category) throw new ApiError(404, "Category not found");
  return category;
};

export const deleteCategory = async (id: string): Promise<void> => {
  const [deleted] = await db.delete(categories).where(eq(categories.id, id)).returning({ id: categories.id });
  if (!deleted) throw new ApiError(404, "Category not found");
};
