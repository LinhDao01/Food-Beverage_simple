const express = require("express");

const dishesController = require("../controllers/dishes.controller");
const { methodNotAllowed } = require("../controllers/errors.controller");

const {
  avatarUpload,
  dishImageUpload,
} = require("../middlewares/image-upload.middleware");

const dishesRouter = express.Router();

module.exports.setup = (app) => {
  app.use("/api/v1/dishes", dishesRouter);

/**
   * @swagger
   * /api/v1/dishes/:
   *  get:
   *    summary: Get dishes by filter
   *    description: Get dishes by filter
   *    parameters:
   *      - in: query
   *        name: restaurantId
   *        schema:
   *          type: integer
   *        description: Get dish based on restaurant id
   *        required: true
   *      - in: query
   *        name: name
   *        schema:
   *          type: string
   *        description: Filter by dish name
   *      - in: query
   *        name: minPrice
   *        schema:
   *          type: integer
   *        description: Minimum price for dish
   *      - in: query
   *        name: maxPrice
   *        schema:
   *          type: integer
   *        description: Maximum price for dish
   *      - $ref: '#/components/parameters/limitParam'
   *      - $ref: '#/components/parameters/pageParam'
   *    tags:
   *      - dishes
   *    responses:
   *       200:
   *         description: List of restaurant dishes that satisfied filter
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
   *                     dishes:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/Dishes'
   *                     metadata:
   *                       - $ref: '#/components/schemas/PaginationMetadata'
   *       404:
   *         description: Resource not found
   *         $ref: '#/components/responses/404NotFound'
   * 
   *       500:
   *         description: Internal server error
   *         $ref: '#/components/responses/500InternalServerError'
   */

  dishesRouter.get("/", dishesController.getManyDishes);

  /**
   * @swagger
   * /api/v1/dishes/{dishId}:
   *   get:
   *     summary: Get a dish information
   *     description: Get dish information based on dish id
   *     parameters:
   *       - $ref: '#/components/parameters/dishIdParam'
   *     tags:
   *       - dishes
   *     responses:
   *       200:
   *         description: Successfully retrieved dish information
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
   *                     dish:
   *                       $ref: '#/components/schemas/Dishes'
   *       404:
   *         description: Resource not found
   *         $ref: '#/components/responses/404NotFound'
   *
   *       500:
   *         description: Internal server error
   *         $ref: '#/components/responses/500InternalServerError'
   */

  dishesRouter.get("/:dishId", dishesController.getDishById);

/**
   * @swagger
   * /api/v1/dishes/add:
   *   post:
   *     summary: Create a new dish
   *     description: Create a new dish
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             $ref: '#/components/schemas/Dishes'
   *     tags:
   *       - dishes
   *     responses:
   *
   *       201DishCreated:
   *         description: Dish created
   *         $ref: '#/components/responses/201DishCreated'
   * 
   *       400:
   *         description: Bad Request
   *         $ref: '#/components/responses/400BadRequest'
   *
   *       500:
   *        description: Internal server error
   *        $ref: '#/components/responses/500InternalServerError'
   */

  dishesRouter.post("/add", dishImageUpload, dishesController.addDish);

  /**
   * @swagger
   * /api/v1/dishes/{dishId}/:
   *  put:
   *    summary: Update dish information
   *    description: Update dish information
   *    parameters:
   *      - $ref: '#/components/parameters/dishIdParam'
   *    tags:
   *      - dishes
   *    requestBody:
   *      required: true
   *      content:
   *        multipart/form-data:
   *          schema:
   *            $ref: '#/components/schemas/Dishes'
   *    responses:
   * 
   *      200NoData:
   *        description: Dish status updated successfully
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

  dishesRouter.put("/:dishId", dishImageUpload, dishesController.updateDish);

  /**
   * @swagger
   * /api/v1/dishes/{dishId}:
   *   patch:
   *     summary: Update dish price
   *     description: Updates dish price
   *     tags:
   *       - dishes
   *     parameters:
   *       - $ref: '#/components/parameters/dishIdParam'
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               price:
   *                 type: integer
   *                 description: The new price of the dish
   *                 minimum: 0
   *     responses:
   *       200NoData:
   *         description: Dish price updated successfully
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

  dishesRouter.patch("/:dishId",dishesController.updatePrice);

  /**
   * @swagger
   * /api/v1/dishes/{dishId}:
   *   delete:
   *     summary: Delete dish by ID
   *     description: Delete dish by ID
   *     parameters:
   *       - $ref: '#/components/parameters/dishIdParam'
   *     tags:
   *       - dishes
   *     responses:
   *       200:
   *         description: Dish deleted
   *         $ref: '#/components/responses/200NoData'
   *
   *       404:
   *         description: Resource not found
   *         $ref: '#/components/responses/404NotFound'
   *
   *       500:
   *        description: Internal server error
   *        $ref: '#/components/responses/500InternalServerError'
   */

  dishesRouter.delete("/:dishId", dishesController.deleteDish);

    /**
   * @swagger
   * /api/v1/dishes/{restaurantId}/all:
   *   delete:
   *     summary: Delete all dishes
   *     description: Delete all dishes
   *     parameters:
   *       - $ref: '#/components/parameters/restaurantIdParam'
   *     tags:
   *       - dishes
   *     responses:
   *       200:
   *         description: All dish deleted
   *         $ref: '#/components/responses/200NoData'
   *
   *       500:
   *        description: Internal server error
   *        $ref: '#/components/responses/500InternalServerError'
   */

  dishesRouter.delete("/:restaurantId/all", dishesController.deleteAllDishes);
  dishesRouter.all("*", methodNotAllowed);
};
