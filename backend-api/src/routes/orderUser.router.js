const express = require("express");
const userOrderController = require("../controllers/orderUser.controller");
const { methodNotAllowed } = require("../controllers/errors.controller");

const router = express.Router();

module.exports.setup = (app) => {
  app.use("/api/v1/users", router);

  /**
   * @swagger
   * /api/v1/users/{userId}/orders/all:
   *   get:
   *     summary: Get all restaurant active orders (no finished orders)
   *     description: Get all restaurant active orders (no finished orders)
   *     tags:
   *       - orders
   *     parameters:
   *       - $ref: '#/components/parameters/userId'
   *       - $ref: '#/components/limitParam'
   *       - $ref: '#/components/pageParam'
   *     responses:
   *       200:
   *         description: List of restaurant orders
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   description: The response status
   *                   enum: [success]
   *                 data:
   *                   type: object
   *                   properties:
   *                     orders:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/Order'
   *                     metadata:
   *                       - $ref: '#/components/schemas/PaginationMetadata'
   *
   *       500:
   *         description: Internal server error
   *         $ref: '#/components/responses/500InternalError'
   */

  router.get("/", userOrderController.getUserOrders);

  /**
   * @swagger
   * /api/v1/users/orders:
   *   post:
   *     summary: Create a new order
   *     description: Create a new order
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             $ref: '#/components/schemas/Order'
   *     tags:
   *       - orders
   *     responses:
   *       '201':
   *         description: A new order
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   description: The response status
   *                   enum: [success]
   *                 data:
   *                   type: object
   *                   properties:
   *                     order:
   *                       $ref: '#/components/schemas/Order'
   *       '400':
   *           $ref: '#/components/responses/400BadRequest'
   *       '500':
   *           $ref: '#/components/responses/500InternalError'
   */
  router.post("/", userOrderController.createUserOrder);
  router.all("/", methodNotAllowed);

  /**
   * @swagger
   * /api/v1/users/orders/{orderId}:
   *   patch:
   *     summary: Update order status
   *     description: Updates order status
   *     tags:
   *       - orders
   *     parameters:
   *       - $ref: '#/components/parameters/orderIdParam'
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               status:
   *                 type: string
   *                 default: wait
   *                 description: The new status of the order
   *     responses:
   *       200NoData:
   *         description: Order status updated successfully
   *         $ref: '#/components/responses/200NoData'
   *
   *       400:
   *         description: Bad Request
   *         $ref: '#/components/responses/400BadRequest'
   *
   *       404:
   *         description: Resource not found
   *         $ref: '#/components/responses/404NotFound'
   *
   *       500:
   *        description: Internal server error
   *        $ref: '#/components/responses/500InternalError'
   */
  router.patch("/:id", userOrderController.updateOrderStatus);

  router.all("/:id", methodNotAllowed);
}