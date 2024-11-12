const express = require("express");

const restaurantController = require("../controllers/restaurant.controller");
const { methodNotAllowed } = require("../controllers/errors.controller");

const { avatarUpload } = require("../middlewares/image-upload.middleware");

const restaurantRouter = express.Router();

module.exports.setup = (app) => {
  app.use("/api/v1/restaurant", restaurantRouter);

  /**
   * @swagger
   * /api/v1/restaurant/{userId}:
   *   get:
   *     summary: Get restaurant information
   *     description: Get restaurant information based on userId
   *     parameters:
   *       - $ref: '#/components/parameters/userIdParam'
   *     tags:
   *       - restaurant
   *     responses:
   *       200:
   *         description: Successfully retrieved restaurant information
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
   *                     restaurant:
   *                       $ref: '#/components/schemas/Restaurant'
   *       404:
   *         description: Resource not found
   *         $ref: '#/components/responses/404NotFound'
   *
   *       500:
   *         description: Internal server error
   *         $ref: '#/components/responses/500InternalServerError'
   */

  restaurantRouter.get("/:userId", restaurantController.getRestaurant);

  /**
   * @swagger
   * /api/v1/restaurant/{restaurantId}/orders/all:
   *   get:
   *     summary: Get all restaurant active orders (no finished orders)
   *     description: Get all restaurant active orders (no finished orders)
   *     tags:
   *       - restaurant
   *     parameters:
   *       - $ref: '#/components/parameters/restaurantIdParam'
   *       - $ref: '#/components/parameters/limitParam'
   *       - $ref: '#/components/parameters/pageParam'
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
   *                         $ref: '#/components/schemas/Orders'
   *                     metadata:
   *                       - $ref: '#/components/schemas/PaginationMetadata'
   *
   *       500:
   *         description: Internal server error
   *         $ref: '#/components/responses/500InternalServerError'
   */

  restaurantRouter.get(
    "/:restaurantId/orders/all",
    restaurantController.getRestaurantOrders
  );

  /**
   * @swagger
   * /api/v1/restaurant/orders/{orderId}:
   *   patch:
   *     summary: Update order status
   *     description: Updates order status
   *     tags:
   *       - restaurant
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
   *        $ref: '#/components/responses/500InternalServerError'
   */

  restaurantRouter.patch(
    "/orders/:orderId",
    restaurantController.updateOrderStatus
  );
  /**
   * @swagger
   * /api/v1/restaurant/{userId}/:
   *  put:
   *    summary: Update restaurant information
   *    description: Update restaurant information
   *    parameters:
   *      - $ref: '#/components/parameters/userIdParam'
   *    tags:
   *      - restaurant
   *    requestBody:
   *      required: true
   *      content:
   *        multipart/form-data:
   *          schema:
   *            $ref: '#/components/schemas/Restaurant'
   *    responses:
   *      200NoData:
   *        description: Order status updated successfully
   *        $ref: '#/components/responses/200NoData'
   * 
   *      400:
   *         description: Bad Request
   *         $ref: '#/components/responses/400BadRequest'      
   * 
   *      404:
   *        description: Resource not found
   *        $ref: '#/components/responses/404NotFound'
   *
   *      500:
   *        description: Internal server error
   *        $ref: '#/components/responses/500InternalServerError'
   */

  restaurantRouter.put(
    "/:userId",
    avatarUpload,
    restaurantController.updateRestaurant
  );

  restaurantRouter.all("*", methodNotAllowed);
};
