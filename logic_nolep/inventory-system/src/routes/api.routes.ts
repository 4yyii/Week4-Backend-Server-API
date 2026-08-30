import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as authController from "../controllers/auth.controller.js";
import * as categoryController from "../controllers/category.controller.js";
import * as orderItemController from "../controllers/order-item.controller.js";
import * as orderController from "../controllers/order.controller.js";
import * as productController from "../controllers/product.controller.js";
import * as userController from "../controllers/user.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";
import {
  createCategoryBody,
  createOrderBody,
  createOrderItemBody,
  createProductBody,
  createUserBody,
  idParams,
  loginBody,
  logoutBody,
  paginationQuery,
  productQuery,
  refreshBody,
  registerBody,
  updateCategoryBody,
  updateOrderBody,
  updateOrderItemBody,
  updateProductBody,
  updateUserBody,
} from "../validations/schemas.js";

export const apiRouter = Router();
const adminOnly = authorize("admin");
const authRateLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: "draft-8" });

apiRouter.post("/api/auth/register", authRateLimit, validate({ body: registerBody }), asyncHandler(authController.register));
apiRouter.post("/api/auth/login", authRateLimit, validate({ body: loginBody }), asyncHandler(authController.login));
apiRouter.post("/api/auth/refresh", authRateLimit, validate({ body: refreshBody }), asyncHandler(authController.refresh));
apiRouter.post("/api/auth/logout", validate({ body: logoutBody }), asyncHandler(authController.logout));

apiRouter.use("/api/users", authenticate);
apiRouter.post("/api/users", adminOnly, validate({ body: createUserBody }), asyncHandler(userController.createUser));
apiRouter.get("/api/users", adminOnly, validate({ query: paginationQuery }), asyncHandler(userController.getUsers));
apiRouter.get(
  "/api/users/:userId/products",
  validate({ params: idParams("userId"), query: paginationQuery }),
  asyncHandler(productController.getProductsByUser),
);
apiRouter.get(
  "/api/users/:userId/orders",
  adminOnly,
  validate({ params: idParams("userId"), query: paginationQuery }),
  asyncHandler(orderController.getOrdersByUser),
);
apiRouter.get(
  "/api/users/:userId",
  adminOnly,
  validate({ params: idParams("userId") }),
  asyncHandler(userController.getUserById),
);
apiRouter.put(
  "/api/users/:userId",
  adminOnly,
  validate({ params: idParams("userId"), body: updateUserBody }),
  asyncHandler(userController.updateUser),
);
apiRouter.delete(
  "/api/users/:userId",
  adminOnly,
  validate({ params: idParams("userId") }),
  asyncHandler(userController.deleteUser),
);

apiRouter.use("/api/products", authenticate);
apiRouter.post("/api/products", validate({ body: createProductBody }), asyncHandler(productController.createProduct));
apiRouter.get("/api/products", validate({ query: productQuery }), asyncHandler(productController.getProducts));
apiRouter.get(
  "/api/products/:productId",
  validate({ params: idParams("productId") }),
  asyncHandler(productController.getProductById),
);
apiRouter.put(
  "/api/products/:productId",
  validate({ params: idParams("productId"), body: updateProductBody }),
  asyncHandler(productController.updateProduct),
);
apiRouter.delete(
  "/api/products/:productId",
  validate({ params: idParams("productId") }),
  asyncHandler(productController.deleteProduct),
);

apiRouter.use("/api/categories", authenticate);
apiRouter.post(
  "/api/categories",
  adminOnly,
  validate({ body: createCategoryBody }),
  asyncHandler(categoryController.createCategory),
);
apiRouter.get("/api/categories", validate({ query: paginationQuery }), asyncHandler(categoryController.getCategories));
apiRouter.get(
  "/api/categories/:categoryId",
  validate({ params: idParams("categoryId") }),
  asyncHandler(categoryController.getCategoryById),
);
apiRouter.put(
  "/api/categories/:categoryId",
  adminOnly,
  validate({ params: idParams("categoryId"), body: updateCategoryBody }),
  asyncHandler(categoryController.updateCategory),
);
apiRouter.delete(
  "/api/categories/:categoryId",
  adminOnly,
  validate({ params: idParams("categoryId") }),
  asyncHandler(categoryController.deleteCategory),
);

apiRouter.use("/api/orders", authenticate, adminOnly);
apiRouter.post("/api/orders", validate({ body: createOrderBody }), asyncHandler(orderController.createOrder));
apiRouter.get("/api/orders", validate({ query: paginationQuery }), asyncHandler(orderController.getOrders));
apiRouter.get(
  "/api/orders/:orderId/order-items",
  validate({ params: idParams("orderId"), query: paginationQuery }),
  asyncHandler(orderItemController.getOrderItemsByOrder),
);
apiRouter.get(
  "/api/orders/:orderId",
  validate({ params: idParams("orderId") }),
  asyncHandler(orderController.getOrderById),
);
apiRouter.put(
  "/api/orders/:orderId",
  validate({ params: idParams("orderId"), body: updateOrderBody }),
  asyncHandler(orderController.updateOrder),
);
apiRouter.delete(
  "/api/orders/:orderId",
  validate({ params: idParams("orderId") }),
  asyncHandler(orderController.deleteOrder),
);

apiRouter.use("/api/order-items", authenticate, adminOnly);
apiRouter.post(
  "/api/order-items",
  validate({ body: createOrderItemBody }),
  asyncHandler(orderItemController.createOrderItem),
);
apiRouter.get("/api/order-items", validate({ query: paginationQuery }), asyncHandler(orderItemController.getOrderItems));
apiRouter.get(
  "/api/order-items/:orderItemId",
  validate({ params: idParams("orderItemId") }),
  asyncHandler(orderItemController.getOrderItemById),
);
apiRouter.put(
  "/api/order-items/:orderItemId",
  validate({ params: idParams("orderItemId"), body: updateOrderItemBody }),
  asyncHandler(orderItemController.updateOrderItem),
);
apiRouter.delete(
  "/api/order-items/:orderItemId",
  validate({ params: idParams("orderItemId") }),
  asyncHandler(orderItemController.deleteOrderItem),
);
