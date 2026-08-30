import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, pool } from "./index.js";
import { users } from "./schema.js";

const name = process.env.ADMIN_NAME ?? "Inventory Admin";
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!email || !password || password.length < 8) {
  throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD (minimum 8 characters) are required");
}

const passwordHash = await bcrypt.hash(password, 12);
const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);

if (existing) {
  await db
    .update(users)
    .set({ name, password: passwordHash, role: "admin", updatedAt: new Date() })
    .where(eq(users.id, existing.id));
  console.log(`Updated admin user: ${email}`);
} else {
  await db.insert(users).values({ name, email, password: passwordHash, role: "admin" });
  console.log(`Created admin user: ${email}`);
}

await pool.end();
