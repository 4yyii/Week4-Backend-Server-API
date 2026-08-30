# Inventory System REST API

A production-ready RESTful API for an **Inventory System** built with **TypeScript**, **Express**, **Drizzle ORM**, and **PostgreSQL** (hosted on **Railway**).

---

## 🌟 Key Features

- **Authentication & Authorization**: Secure JWT authentication with Access & Refresh Token rotation and Role-Based Access Control (`admin` and `user` roles).
- **Product & Category Management**: Full CRUD operations for categories and products, owned by users and manageable by admins.
- **Pagination & Search**: Standardized pagination (`page`, `size`) and fuzzy search filtering (`search`, `categoryId`) on list endpoints.
- **Transactional Stock Management**: Automatic stock deduction when creating orders, stock availability check with `409 Conflict` handling, and automatic stock restoration upon order deletion.
- **Security & Production Hardening**: Rate limiting (`express-rate-limit`), security HTTP headers (`helmet`), response compression (`compression`), and structured logging (`winston` + `morgan`).
- **Comprehensive Integration Testing**: Automated integration API test suite using **Vitest** and **Supertest** (23 tests passing).
- **Deployment Ready**: Fully configured for **Railway** deployment with PM2 (`ecosystem.config.json`).

---

## 📁 Project Architecture

```text
inventory-system/
├── dist/                     # Compiled JavaScript output
├── src/
│   ├── application/          # Express app configuration (web.ts)
│   ├── config/               # App configuration & Zod env validation
│   ├── controllers/          # HTTP request handlers
│   ├── db/                   # Drizzle ORM schema, DB connection & seed script
│   ├── middlewares/          # Auth, RBAC, error handling, rate limiting & validation
│   ├── routes/               # Express API routing definitions
│   ├── services/             # Core business logic & database queries
│   ├── utils/                # Helper utilities (API error, JWT, response format)
│   ├── validations/          # Zod request validation schemas
│   └── index.ts              # Server entry point
├── tests/                    # Vitest integration test suites
│   ├── auth.test.ts
│   ├── category.test.ts
│   ├── product.test.ts
│   └── order.test.ts
├── drizzle.config.ts         # Drizzle Kit configuration
├── ecosystem.config.json     # PM2 deployment process file for Railway
└── package.json
```

---

## 🛠️ Tech Stack & Dependencies

- **Runtime**: Node.js >= 20.0.0
- **Language**: TypeScript 5+
- **Framework**: Express 5
- **ORM & Database**: Drizzle ORM + PostgreSQL (`pg` driver)
- **Validation**: Zod
- **Authentication**: `jsonwebtoken`, `bcryptjs`
- **Testing**: Vitest + Supertest
- **Process Manager**: PM2

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` or `.env.development`:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:password@host:port/database
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters
CORS_ORIGIN=*

# Required for DB Seeding
ADMIN_EMAIL=admin@inventory.com
ADMIN_PASSWORD=admin12345password
```

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env` file with your PostgreSQL connection string:
```bash
cp .env.example .env
```

### 3. Sync Database Schema & Seed Data
Push the Drizzle schema to your PostgreSQL database and seed the initial admin account:
```bash
npm run db:push
npm run db:seed
```

### 4. Run Development Server
```bash
npm run dev
```
The server will start at `http://localhost:3000`.

---

## 🧪 Running Tests

Execute the automated integration test suite using Vitest:

```bash
# Run integration tests once
npm test

# Run type check
npm run typecheck
```

---

## 📚 API Endpoints Documentation

All response payloads follow a unified JSON structure:
- **Success**: `{ "success": true, "message"?: string, "data": ... }`
- **Paginated List**: `{ "success": true, "data": [...], "meta": { "page": 1, "size": 10, "total": 42, "totalPages": 5 } }`
- **Error**: `{ "success": false, "message": string, "details"?: any }`

### 🔑 Authentication (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Authenticate user & return token pair |
| `POST` | `/api/auth/refresh` | Public | Obtain new access token using refresh token |
| `POST` | `/api/auth/logout` | Public | Revoke refresh token |

### 👤 Users (`/api/users`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users` | Admin | Get paginated list of users (`?page=1&size=10`) |
| `POST` | `/api/users` | Admin | Create a user |
| `GET` | `/api/users/:userId` | Admin | Get user by ID |
| `PUT` | `/api/users/:userId` | Admin | Update user details |
| `DELETE` | `/api/users/:userId` | Admin | Delete user |
| `GET` | `/api/users/:userId/products` | User/Admin | Get products owned by a specific user |
| `GET` | `/api/users/:userId/orders` | Admin | Get orders created by a specific user |

### 🏷️ Categories (`/api/categories`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/categories` | Authenticated | Get paginated list of categories (`?page=1&size=10`) |
| `POST` | `/api/categories` | Admin | Create a category |
| `GET` | `/api/categories/:categoryId` | Authenticated | Get category by ID |
| `PUT` | `/api/categories/:categoryId` | Admin | Update category |
| `DELETE` | `/api/categories/:categoryId` | Admin | Delete category |

### 📦 Products (`/api/products`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Authenticated | Search & get paginated products (`?page=1&size=10&search=keyword&categoryId=uuid`) |
| `POST` | `/api/products` | Authenticated | Create product |
| `GET` | `/api/products/:productId` | Authenticated | Get product by ID |
| `PUT` | `/api/products/:productId` | Owner/Admin | Update product details or stock |
| `DELETE` | `/api/products/:productId` | Owner/Admin | Delete product |

### 🛒 Orders & Order Items (`/api/orders`, `/api/order-items`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/orders` | Admin | Get paginated list of orders |
| `POST` | `/api/orders` | Admin | Create order with items (auto-deducts stock) |
| `GET` | `/api/orders/:orderId` | Admin | Get order details with items |
| `PUT` | `/api/orders/:orderId` | Admin | Update order customer info |
| `DELETE` | `/api/orders/:orderId` | Admin | Delete order (auto-restores product stock) |
| `GET` | `/api/orders/:orderId/order-items` | Admin | Get items inside a specific order |
| `GET` | `/api/order-items` | Admin | Get paginated list of all order items |
| `POST` | `/api/order-items` | Admin | Add item to order |
| `PUT` | `/api/order-items/:orderItemId` | Admin | Update order item quantity |
| `DELETE` | `/api/order-items/:orderItemId` | Admin | Delete item from order |

---

## 🚂 Deployment to Railway

Follow these steps to deploy your Inventory System API on Railway:

### Step 1: Push Code to GitHub
Ensure all changes are committed and pushed to your GitHub repository.

### Step 2: Create Railway Project
1. Log in to [Railway](https://railway.app/).
2. Click **+ New Project** -> **Provision PostgreSQL**.
3. Once the database is ready, copy the **`DATABASE_URL`** (or connection credentials) from the **Variables** tab of the PostgreSQL plugin.

### Step 3: Deploy Web Service from Repository
1. In the same Railway project dashboard, click **+ New** -> **GitHub Repo**.
2. Select your repository.
3. In the Web Service settings, configure **Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `3000` (or leave Railway to inject `PORT`)
   - `DATABASE_URL`: `${{ Postgres.DATABASE_URL }}` (Railway variable reference)
   - `JWT_SECRET`: `your-strong-production-jwt-secret-key`
   - `CORS_ORIGIN`: `*`
   - `ADMIN_EMAIL`: `admin@inventory.com`
   - `ADMIN_PASSWORD`: `your-secure-admin-password`

### Step 4: Configure Build & Start Commands
Under **Settings** -> **Build & Deploy**:
- **Build Command**: `npm run build && npm run db:push && npm run db:seed`
- **Start Command**: `npm run start` (or `npx pm2-runtime start ecosystem.config.json`)

### Step 5: Verify Deployment
Railway will generate a public domain URL (e.g., `https://inventory-system-production.up.railway.app`).
Verify the server state:
- Health check: `GET https://your-app.up.railway.app/health`
- Root response: `GET https://your-app.up.railway.app/`

---

## 📄 License

This project is licensed under the ISC License.
