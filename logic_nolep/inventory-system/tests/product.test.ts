import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";
import app from "../src/application/web.js";

describe("Product API Integration Tests", () => {
  let userToken = "";
  let categoryId = "";
  let createdProductId = "";
  let uniqueKeyword = "";

  beforeAll(async () => {
    const timestamp = Date.now();
    uniqueKeyword = `SpecialWidget_${timestamp}`;

    const adminRes = await request(app).post("/api/auth/login").send({
      email: "admin@inventory.com",
      password: "admin12345password",
    });
    const adminToken = adminRes.body.data.tokens.accessToken;

    const catRes = await request(app)
      .post("/api/categories")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: `Cat for Product ${timestamp}` });
    categoryId = catRes.body.data.id;

    const userRes = await request(app).post("/api/auth/register").send({
      name: "Product Test User",
      email: `product_user_${timestamp}@example.com`,
      password: "Password123!",
    });
    userToken = userRes.body.data.tokens.accessToken;
  });

  it("POST /api/products - should create a new product", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: uniqueKeyword,
        description: `This is a ${uniqueKeyword} description`,
        price: 99.99,
        quantityInStock: 50,
        categoryId,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe(uniqueKeyword);
    createdProductId = res.body.data.id;
  });

  it("GET /api/products - should return paginated list of products", async () => {
    const res = await request(app)
      .get("/api/products?page=1&size=10")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.meta).toHaveProperty("page", 1);
    expect(res.body.meta).toHaveProperty("size", 10);
  });

  it("GET /api/products?search=... - should search products by text query", async () => {
    const res = await request(app)
      .get(`/api/products?search=${uniqueKeyword}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data[0].name).toBe(uniqueKeyword);
  });

  it("GET /api/products?categoryId=... - should filter products by category ID", async () => {
    const res = await request(app)
      .get(`/api/products?categoryId=${categoryId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data[0].categoryId).toBe(categoryId);
  });

  it("PUT /api/products/:productId - should update existing product", async () => {
    const res = await request(app)
      .put(`/api/products/${createdProductId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ price: 149.99, quantityInStock: 45 });

    expect(res.status).toBe(200);
    expect(res.body.data.price).toBe(149.99);
    expect(res.body.data.quantityInStock).toBe(45);
  });

  it("DELETE /api/products/:productId - should delete product", async () => {
    const res = await request(app)
      .delete(`/api/products/${createdProductId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
  });
});
