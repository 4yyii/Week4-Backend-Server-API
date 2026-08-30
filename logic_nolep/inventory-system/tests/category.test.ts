import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";
import app from "../src/application/web.js";

describe("Category API Integration Tests", () => {
  let adminToken = "";
  let userToken = "";
  let createdCategoryId = "";

  beforeAll(async () => {
    const adminRes = await request(app).post("/api/auth/login").send({
      email: "admin@inventory.com",
      password: "admin12345password",
    });
    adminToken = adminRes.body.data.tokens.accessToken;

    const userEmail = `user_cat_${Date.now()}@example.com`;
    const userRes = await request(app).post("/api/auth/register").send({
      name: "Standard User Category",
      email: userEmail,
      password: "Password123!",
    });
    userToken = userRes.body.data.tokens.accessToken;
  });

  it("POST /api/categories - non-admin should get 403 Forbidden", async () => {
    const res = await request(app)
      .post("/api/categories")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: `Category test ${Date.now()}` });
    expect(res.status).toBe(403);
  });

  it("POST /api/categories - admin should create category", async () => {
    const name = `Electronics ${Date.now()}`;
    const res = await request(app)
      .post("/api/categories")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe(name);
    createdCategoryId = res.body.data.id;
  });

  it("GET /api/categories - should return paginated list of categories", async () => {
    const res = await request(app)
      .get("/api/categories?page=1&size=5")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.meta).toHaveProperty("page", 1);
    expect(res.body.meta).toHaveProperty("size", 5);
    expect(res.body.meta).toHaveProperty("total");
    expect(res.body.meta).toHaveProperty("totalPages");
  });

  it("GET /api/categories/:categoryId - should return category by ID", async () => {
    const res = await request(app)
      .get(`/api/categories/${createdCategoryId}`)
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(createdCategoryId);
  });

  it("PUT /api/categories/:categoryId - admin should update category", async () => {
    const updatedName = `Updated Electronics ${Date.now()}`;
    const res = await request(app)
      .put(`/api/categories/${createdCategoryId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: updatedName });
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe(updatedName);
  });

  it("DELETE /api/categories/:categoryId - admin should delete category", async () => {
    const res = await request(app)
      .delete(`/api/categories/${createdCategoryId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
  });
});
