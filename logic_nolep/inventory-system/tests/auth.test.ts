import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../src/application/web.js";

describe("Auth API Integration Tests", () => {
  const timestamp = Date.now();
  const testUser = {
    name: "Test User Auth",
    email: `auth_test_${timestamp}@example.com`,
    password: "Password123!",
  };

  let accessToken = "";
  let refreshToken = "";

  it("POST /api/auth/register - should successfully register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testUser.email);
    expect(res.body.data.tokens).toHaveProperty("accessToken");
    expect(res.body.data.tokens).toHaveProperty("refreshToken");
    accessToken = res.body.data.tokens.accessToken;
    refreshToken = res.body.data.tokens.refreshToken;
  });

  it("POST /api/auth/register - should fail on duplicate email", async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it("POST /api/auth/login - should login user with correct credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.tokens).toHaveProperty("accessToken");
    accessToken = res.body.data.tokens.accessToken;
    refreshToken = res.body.data.tokens.refreshToken;
  });

  it("POST /api/auth/login - should fail with wrong password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: "wrongpassword",
    });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("POST /api/auth/refresh - should refresh access token", async () => {
    const res = await request(app).post("/api/auth/refresh").send({ refreshToken });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("accessToken");
    refreshToken = res.body.data.refreshToken;
  });

  it("POST /api/auth/logout - should logout user and invalidate refresh token", async () => {
    const res = await request(app).post("/api/auth/logout").send({ refreshToken });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
