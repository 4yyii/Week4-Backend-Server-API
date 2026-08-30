import { z } from "zod";

const uuid = z.uuid("Must be a valid UUID");
const name = z.string().trim().min(2).max(100);
const email = z.email().trim().toLowerCase().max(255);
const password = z.string().min(8).max(72);
const role = z.enum(["user", "admin"]);
const positiveMoney = z.coerce.number().finite().min(0).max(9_999_999_999.99);

export const idParams = (key: string) => z.object({ [key]: uuid });

export const registerBody = z.object({ name, email, password }).strict();
export const loginBody = z.object({ email, password: z.string().min(1) }).strict();
export const refreshBody = z.object({ refreshToken: z.string().min(1) }).strict();
export const logoutBody = refreshBody;

export const createUserBody = z
  .object({
    name,
    email,
    password,
    role: role.default("user"),
    isEmailVerified: z.boolean().default(false),
  })
  .strict();
export const updateUserBody = z
  .object({
    name: name.optional(),
    email: email.optional(),
    password: password.optional(),
    role: role.optional(),
    isEmailVerified: z.boolean().optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, "At least one field is required");

export const createCategoryBody = z.object({ name }).strict();
export const updateCategoryBody = createCategoryBody;

export const createProductBody = z
  .object({
    name: z.string().trim().min(2).max(150),
    description: z.string().trim().min(1).max(5000),
    price: positiveMoney,
    quantityInStock: z.coerce.number().int().min(0),
    categoryId: uuid,
    userId: uuid.optional(),
  })
  .strict();
export const updateProductBody = createProductBody
  .partial()
  .refine((value) => Object.keys(value).length > 0, "At least one field is required");

const orderItemInput = z.object({ productId: uuid, quantity: z.coerce.number().int().positive() }).strict();
export const createOrderBody = z
  .object({
    date: z.coerce.date().optional(),
    customerName: name,
    customerEmail: email,
    userId: uuid,
    items: z.array(orderItemInput).min(1),
  })
  .strict()
  .refine(
    ({ items }) => new Set(items.map((item) => item.productId)).size === items.length,
    "An order cannot contain the same product more than once",
  );
export const updateOrderBody = z
  .object({
    date: z.coerce.date().optional(),
    customerName: name.optional(),
    customerEmail: email.optional(),
    userId: uuid.optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, "At least one field is required");

export const createOrderItemBody = z
  .object({
    orderId: uuid,
    productId: uuid,
    quantity: z.coerce.number().int().positive(),
  })
  .strict();
export const updateOrderItemBody = z
  .object({
    productId: uuid.optional(),
    quantity: z.coerce.number().int().positive().optional(),
  })
  .strict()
export const paginationQuery = z
  .object({
    page: z.coerce.number().int().min(1).optional().default(1),
    size: z.coerce.number().int().min(1).max(100).optional().default(10),
  })
  .passthrough();

export const productQuery = z
  .object({
    page: z.coerce.number().int().min(1).optional().default(1),
    size: z.coerce.number().int().min(1).max(100).optional().default(10),
    search: z.string().trim().optional(),
    categoryId: uuid.optional(),
  })
  .passthrough();


