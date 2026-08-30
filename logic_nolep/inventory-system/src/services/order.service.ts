import { and, asc, count, eq, gte, inArray, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { orderItems, orders, products, users } from "../db/schema.js";
import { ApiError } from "../utils/api-error.js";

export type CreateOrderInput = {
  date?: Date;
  customerName: string;
  customerEmail: string;
  userId: string;
  items: Array<{ productId: string; quantity: number }>;
};

export const createOrder = async (input: CreateOrderInput) =>
  db.transaction(async (transaction) => {
    const selectedProducts = await transaction
      .select()
      .from(products)
      .where(inArray(products.id, input.items.map((item) => item.productId)));
    const productsById = new Map(selectedProducts.map((product) => [product.id, product]));

    const [order] = await transaction
      .insert(orders)
      .values({
        ...(input.date ? { date: input.date } : {}),
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        userId: input.userId,
        totalPrice: 0,
      })
      .returning();
    if (!order) throw new ApiError(500, "Unable to create order");

    let totalPrice = 0;
    for (const item of input.items) {
      const product = productsById.get(item.productId);
      if (!product) throw new ApiError(404, `Product ${item.productId} was not found`);

      const [stockUpdated] = await transaction
        .update(products)
        .set({ quantityInStock: sql`${products.quantityInStock} - ${item.quantity}`, updatedAt: new Date() })
        .where(and(eq(products.id, product.id), gte(products.quantityInStock, item.quantity)))
        .returning({ id: products.id });
      if (!stockUpdated) throw new ApiError(409, `Insufficient stock for product ${product.name}`);

      await transaction.insert(orderItems).values({
        orderId: order.id,
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.price,
      });
      totalPrice += product.price * item.quantity;
    }

    const [completedOrder] = await transaction
      .update(orders)
      .set({ totalPrice, updatedAt: new Date() })
      .where(eq(orders.id, order.id))
      .returning();
    return completedOrder;
  });

export const getOrders = async (options: { page?: number; size?: number } = {}) => {
  const page = options.page ? Number(options.page) : 1;
  const size = options.size ? Number(options.size) : 10;
  const offset = (page - 1) * size;

  const [totalResult] = await db
    .select({ total: count() })
    .from(orders)
    .innerJoin(users, eq(orders.userId, users.id));

  const total = Number(totalResult?.total ?? 0);
  const totalPages = Math.ceil(total / size) || 1;

  const items = await db
    .select({
      id: orders.id,
      date: orders.date,
      totalPrice: orders.totalPrice,
      customerName: orders.customerName,
      customerEmail: orders.customerEmail,
      userId: orders.userId,
      userName: users.name,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
    })
    .from(orders)
    .innerJoin(users, eq(orders.userId, users.id))
    .orderBy(asc(orders.date))
    .limit(size)
    .offset(offset);

  return { items, meta: { page, size, total, totalPages } };
};

export const getOrderById = async (id: string) => {
  const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (!order) throw new ApiError(404, "Order not found");
  const items = await db
    .select({
      id: orderItems.id,
      productId: orderItems.productId,
      productName: products.name,
      quantity: orderItems.quantity,
      unitPrice: orderItems.unitPrice,
      subtotal: sql<number>`${orderItems.quantity} * ${orderItems.unitPrice}`,
      createdAt: orderItems.createdAt,
      updatedAt: orderItems.updatedAt,
    })
    .from(orderItems)
    .innerJoin(products, eq(orderItems.productId, products.id))
    .where(eq(orderItems.orderId, id));
  return { ...order, items };
};

export const getOrdersByUser = async (userId: string, options: { page?: number; size?: number } = {}) => {
  const [user] = await db.select({ id: users.id }).from(users).where(eq(users.id, userId)).limit(1);
  if (!user) throw new ApiError(404, "User not found");

  const page = options.page ? Number(options.page) : 1;
  const size = options.size ? Number(options.size) : 10;
  const offset = (page - 1) * size;

  const whereClause = eq(orders.userId, userId);
  const [totalResult] = await db.select({ total: count() }).from(orders).where(whereClause);
  const total = Number(totalResult?.total ?? 0);
  const totalPages = Math.ceil(total / size) || 1;

  const items = await db.select().from(orders).where(whereClause).orderBy(asc(orders.date)).limit(size).offset(offset);
  return { items, meta: { page, size, total, totalPages } };
};

export const updateOrder = async (
  id: string,
  input: Partial<{ date: Date; customerName: string; customerEmail: string; userId: string }>,
) => {
  const [order] = await db
    .update(orders)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(orders.id, id))
    .returning();
  if (!order) throw new ApiError(404, "Order not found");
  return order;
};

export const deleteOrder = async (id: string): Promise<void> => {
  await db.transaction(async (transaction) => {
    const [order] = await transaction.select({ id: orders.id }).from(orders).where(eq(orders.id, id)).limit(1);
    if (!order) throw new ApiError(404, "Order not found");

    const items = await transaction.select().from(orderItems).where(eq(orderItems.orderId, id));
    for (const item of items) {
      await transaction
        .update(products)
        .set({ quantityInStock: sql`${products.quantityInStock} + ${item.quantity}`, updatedAt: new Date() })
        .where(eq(products.id, item.productId));
    }
    await transaction.delete(orders).where(eq(orders.id, id));
  });
};
