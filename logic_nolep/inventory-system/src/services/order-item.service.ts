import { and, asc, count, eq, gte, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { orderItems, orders, products } from "../db/schema.js";
import { ApiError } from "../utils/api-error.js";

const recalculateTotal = sql<number>`coalesce((select sum(oi.quantity * oi.unit_price) from order_items oi where oi.order_id = ${orders.id}), 0)`;

export const createOrderItem = async (input: { orderId: string; productId: string; quantity: number }) =>
  db.transaction(async (transaction) => {
    const [order] = await transaction.select({ id: orders.id }).from(orders).where(eq(orders.id, input.orderId)).limit(1);
    if (!order) throw new ApiError(404, "Order not found");
    const [product] = await transaction.select().from(products).where(eq(products.id, input.productId)).limit(1);
    if (!product) throw new ApiError(404, "Product not found");

    const [stockUpdated] = await transaction
      .update(products)
      .set({ quantityInStock: sql`${products.quantityInStock} - ${input.quantity}`, updatedAt: new Date() })
      .where(and(eq(products.id, product.id), gte(products.quantityInStock, input.quantity)))
      .returning({ id: products.id });
    if (!stockUpdated) throw new ApiError(409, `Insufficient stock for product ${product.name}`);

    const [item] = await transaction
      .insert(orderItems)
      .values({ ...input, unitPrice: product.price })
      .returning();
    await transaction
      .update(orders)
      .set({ totalPrice: recalculateTotal, updatedAt: new Date() })
      .where(eq(orders.id, input.orderId));
    return item;
  });

export const getOrderItems = async (options: { page?: number; size?: number } = {}) => {
  const page = options.page ? Number(options.page) : 1;
  const size = options.size ? Number(options.size) : 10;
  const offset = (page - 1) * size;

  const [totalResult] = await db
    .select({ total: count() })
    .from(orderItems)
    .innerJoin(products, eq(orderItems.productId, products.id));

  const total = Number(totalResult?.total ?? 0);
  const totalPages = Math.ceil(total / size) || 1;

  const items = await db
    .select({
      id: orderItems.id,
      orderId: orderItems.orderId,
      productId: orderItems.productId,
      productName: products.name,
      quantity: orderItems.quantity,
      unitPrice: orderItems.unitPrice,
      createdAt: orderItems.createdAt,
      updatedAt: orderItems.updatedAt,
    })
    .from(orderItems)
    .innerJoin(products, eq(orderItems.productId, products.id))
    .orderBy(asc(orderItems.createdAt))
    .limit(size)
    .offset(offset);

  return { items, meta: { page, size, total, totalPages } };
};

export const getOrderItemById = async (id: string) => {
  const [item] = await db.select().from(orderItems).where(eq(orderItems.id, id)).limit(1);
  if (!item) throw new ApiError(404, "Order item not found");
  return item;
};

export const getOrderItemsByOrder = async (orderId: string, options: { page?: number; size?: number } = {}) => {
  const [order] = await db.select({ id: orders.id }).from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order) throw new ApiError(404, "Order not found");

  const page = options.page ? Number(options.page) : 1;
  const size = options.size ? Number(options.size) : 10;
  const offset = (page - 1) * size;

  const whereClause = eq(orderItems.orderId, orderId);
  const [totalResult] = await db.select({ total: count() }).from(orderItems).where(whereClause);
  const total = Number(totalResult?.total ?? 0);
  const totalPages = Math.ceil(total / size) || 1;

  const items = await db
    .select()
    .from(orderItems)
    .where(whereClause)
    .orderBy(asc(orderItems.createdAt))
    .limit(size)
    .offset(offset);

  return { items, meta: { page, size, total, totalPages } };
};

export const updateOrderItem = async (
  id: string,
  input: Partial<{ productId: string; quantity: number }>,
) =>
  db.transaction(async (transaction) => {
    const [existing] = await transaction.select().from(orderItems).where(eq(orderItems.id, id)).limit(1);
    if (!existing) throw new ApiError(404, "Order item not found");

    const productId = input.productId ?? existing.productId;
    const quantity = input.quantity ?? existing.quantity;
    const [product] = await transaction.select().from(products).where(eq(products.id, productId)).limit(1);
    if (!product) throw new ApiError(404, "Product not found");

    await transaction
      .update(products)
      .set({ quantityInStock: sql`${products.quantityInStock} + ${existing.quantity}`, updatedAt: new Date() })
      .where(eq(products.id, existing.productId));
    const [stockUpdated] = await transaction
      .update(products)
      .set({ quantityInStock: sql`${products.quantityInStock} - ${quantity}`, updatedAt: new Date() })
      .where(and(eq(products.id, productId), gte(products.quantityInStock, quantity)))
      .returning({ id: products.id });
    if (!stockUpdated) throw new ApiError(409, `Insufficient stock for product ${product.name}`);

    const [item] = await transaction
      .update(orderItems)
      .set({ productId, quantity, unitPrice: product.price, updatedAt: new Date() })
      .where(eq(orderItems.id, id))
      .returning();
    await transaction
      .update(orders)
      .set({ totalPrice: recalculateTotal, updatedAt: new Date() })
      .where(eq(orders.id, existing.orderId));
    return item;
  });

export const deleteOrderItem = async (id: string): Promise<void> => {
  await db.transaction(async (transaction) => {
    const [item] = await transaction.select().from(orderItems).where(eq(orderItems.id, id)).limit(1);
    if (!item) throw new ApiError(404, "Order item not found");

    await transaction
      .update(products)
      .set({ quantityInStock: sql`${products.quantityInStock} + ${item.quantity}`, updatedAt: new Date() })
      .where(eq(products.id, item.productId));
    await transaction.delete(orderItems).where(eq(orderItems.id, id));
    await transaction
      .update(orders)
      .set({ totalPrice: recalculateTotal, updatedAt: new Date() })
      .where(eq(orders.id, item.orderId));
  });
};
