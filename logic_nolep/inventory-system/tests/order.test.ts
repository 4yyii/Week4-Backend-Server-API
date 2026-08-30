import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";
import app from "../src/application/web.js";

describe("Order API & Stock Deduction Integration Tests", () => {
  let adminToken = "";
  let adminUserId = "";
  let userToken = "";
  let categoryId = "";
  let productId = "";
  let createdOrderId = "";

  beforeAll(async () => {
    const timestamp = Date.now();

    const adminRes = await request(app).post("/api/auth/login").send({
      email: "admin@inventory.com",
      password: "admin12345password",
    });
    adminToken = adminRes.body.data.tokens.accessToken;
    adminUserId = adminRes.body.data.user.id;

    const userRes = await request(app).post("/api/auth/register").send({
      name: "Order Test User",
      email: `order_user_${timestamp}@example.com`,
      password: "Password123!",
    });
    userToken = userRes.body.data.tokens.accessToken;

    const catRes = await request(app)
      .post("/api/categories")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: `Category Order ${timestamp}` });
    categoryId = catRes.body.data.id;

    const prodRes = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: `Order Product ${timestamp}`,
        description: "Stock test product",
        price: 50.0,
        quantityInStock: 10,
        categoryId,
      });
    productId = prodRes.body.data.id;
  });

  it("POST /api/orders - regular user should get 403 Forbidden", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        customerName: "Jane Doe",
        customerEmail: "jane@example.com",
        userId: adminUserId,
        items: [{ productId, quantity: 2 }],
      });
    expect(res.status).toBe(403);
  });

  it("POST /api/orders - should create order and auto-deduct stock", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        customerName: "John Doe",
        customerEmail: "john@example.com",
        userId: adminUserId,
        items: [{ productId, quantity: 3 }],
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalPrice).toBe(150);
    createdOrderId = res.body.data.id;

    // Check product stock: should now be 7 (10 - 3)
    const prodRes = await request(app)
      .get(`/api/products/${productId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(prodRes.body.data.quantityInStock).toBe(7);
  });

  it("POST /api/orders - should return 409 Conflict if stock is insufficient", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        customerName: "Overbuyer",
        customerEmail: "over@example.com",
        userId: adminUserId,
        items: [{ productId, quantity: 100 }], // Available: 7
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it("GET /api/orders - should return paginated list of orders", async () => {
    const res = await request(app)
      .get("/api/orders?page=1&size=5")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.meta).toHaveProperty("page", 1);
    expect(res.body.meta).toHaveProperty("size", 5);
  });

  it("DELETE /api/orders/:orderId - should delete order and restore stock", async () => {
    const res = await request(app)
      .delete(`/api/orders/${createdOrderId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);

    // Check product stock: should be restored back to 10 (7 + 3)
    const prodRes = await request(app)
      .get(`/api/products/${productId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(prodRes.body.data.quantityInStock).toBe(10);
  });
});
