import { and, asc, count, eq, ilike, or } from "drizzle-orm";
import { db } from "../db/index.js";
import { categories, products, users, type User } from "../db/schema.js";
import { ApiError } from "../utils/api-error.js";

const productSelection = {
  id: products.id,
  name: products.name,
  description: products.description,
  price: products.price,
  quantityInStock: products.quantityInStock,
  categoryId: products.categoryId,
  categoryName: categories.name,
  userId: products.userId,
  ownerName: users.name,
  createdAt: products.createdAt,
  updatedAt: products.updatedAt,
};

const ensureOwnerAccess = (actor: User, ownerId: string) => {
  if (actor.role !== "admin" && actor.id !== ownerId) {
    throw new ApiError(403, "You may only modify your own products");
  }
};

export type ProductQueryOptions = {
  page?: number;
  size?: number;
  search?: string;
  categoryId?: string;
};

export const createProduct = async (
  input: {
    name: string;
    description: string;
    price: number;
    quantityInStock: number;
    categoryId: string;
    userId?: string;
  },
  actor: User,
) => {
  const ownerId = actor.role === "admin" && input.userId ? input.userId : actor.id;
  const [product] = await db
    .insert(products)
    .values({ ...input, userId: ownerId })
    .returning();
  if (!product) throw new ApiError(500, "Unable to create product");
  return product;
};

export const getProducts = async (options: ProductQueryOptions = {}) => {
  const page = options.page ? Number(options.page) : 1;
  const size = options.size ? Number(options.size) : 10;
  const offset = (page - 1) * size;

  const conditions = [];
  if (options.search) {
    const searchPattern = `%${options.search}%`;
    conditions.push(or(ilike(products.name, searchPattern), ilike(products.description, searchPattern)));
  }
  if (options.categoryId) {
    conditions.push(eq(products.categoryId, options.categoryId));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [totalResult] = await db
    .select({ total: count() })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .innerJoin(users, eq(products.userId, users.id))
    .where(whereClause);

  const total = Number(totalResult?.total ?? 0);
  const totalPages = Math.ceil(total / size) || 1;

  const items = await db
    .select(productSelection)
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .innerJoin(users, eq(products.userId, users.id))
    .where(whereClause)
    .orderBy(asc(products.name))
    .limit(size)
    .offset(offset);

  return { items, meta: { page, size, total, totalPages } };
};

export const getProductById = async (id: string) => {
  const [product] = await db
    .select(productSelection)
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .innerJoin(users, eq(products.userId, users.id))
    .where(eq(products.id, id))
    .limit(1);
  if (!product) throw new ApiError(404, "Product not found");
  return product;
};

export const getProductsByUser = async (
  userId: string,
  actor: User,
  options: { page?: number; size?: number } = {},
) => {
  ensureOwnerAccess(actor, userId);
  const page = options.page ? Number(options.page) : 1;
  const size = options.size ? Number(options.size) : 10;
  const offset = (page - 1) * size;

  const whereClause = eq(products.userId, userId);

  const [totalResult] = await db
    .select({ total: count() })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .innerJoin(users, eq(products.userId, users.id))
    .where(whereClause);

  const total = Number(totalResult?.total ?? 0);
  const totalPages = Math.ceil(total / size) || 1;

  const items = await db
    .select(productSelection)
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .innerJoin(users, eq(products.userId, users.id))
    .where(whereClause)
    .orderBy(asc(products.name))
    .limit(size)
    .offset(offset);

  return { items, meta: { page, size, total, totalPages } };
};

export const updateProduct = async (
  id: string,
  input: Partial<{
    name: string;
    description: string;
    price: number;
    quantityInStock: number;
    categoryId: string;
    userId: string;
  }>,
  actor: User,
) => {
  const [existing] = await db.select().from(products).where(eq(products.id, id)).limit(1);
  if (!existing) throw new ApiError(404, "Product not found");
  ensureOwnerAccess(actor, existing.userId);

  const userId = actor.role === "admin" ? input.userId : undefined;
  const [product] = await db
    .update(products)
    .set({ ...input, ...(userId ? { userId } : { userId: existing.userId }), updatedAt: new Date() })
    .where(and(eq(products.id, id), actor.role === "admin" ? undefined : eq(products.userId, actor.id)))
    .returning();
  if (!product) throw new ApiError(404, "Product not found");
  return product;
};

export const deleteProduct = async (id: string, actor: User): Promise<void> => {
  const [existing] = await db.select().from(products).where(eq(products.id, id)).limit(1);
  if (!existing) throw new ApiError(404, "Product not found");
  ensureOwnerAccess(actor, existing.userId);

  const [deleted] = await db
    .delete(products)
    .where(and(eq(products.id, id), actor.role === "admin" ? undefined : eq(products.userId, actor.id)))
    .returning({ id: products.id });
  if (!deleted) throw new ApiError(404, "Product not found");
};
