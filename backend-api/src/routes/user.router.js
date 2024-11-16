const express = require("express")
const usersController = require("../controllers/users.controller")
const { methodNotAllowed } = require("../controllers/errors.controller")
const avatarUpload = require("../middlewares/avatar-upload.middleware")

const router = express.Router();

module.exports.setup = (app) => {
  app.use("/api/v1/users", router);
  //signup
  /**
   * @swagger
   * /api/v1/users/signup:
   *   post:
   *     summary: Create a new user
   *     description: Create a new user
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             $ref: '#/components/schemas/User'
   *     tags:
   *       - users
   *     responses:
   *       '201':
   *         description: A new user
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
   *                     user:
   *                       $ref: '#/components/schemas/User'
   *       '400':
   *           $ref: '#/components/responses/400BadRequest'
   *       '500':
   *           $ref: '#/components/responses/500InternalError'
   */
  router.post("/signup", avatarUpload, usersController.createUser);

  //login
  /**
   * @swagger
   * /api/v1/users/login:
   *   post:
   *     summary: Log in
   *     description: Log in with email and password
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginRequest'
   *     tags:
   *       - users
   *     responses:
   *       '201':
   *         description: Login successfully!
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
   *                     user:
   *                       $ref: '#/components/schemas/LoginRequest'
   *       '400':
   *           $ref: '#/components/responses/400BadRequest'
   *       '500':
   *           $ref: '#/components/responses/500InternalError'
   */
  router.post("/login", usersController.login);
  //logout
  router.post("/logout", usersController.logout);
  router.all("/", methodNotAllowed);

  /**
   * @swagger
   * /api/v1/users/{id}:
   *  get:
   *    summary: Get user by id
   *    description: Get user by id
   *    parameters:
   *      - $ref: '#/components/parameters/userId'
   *    tags:
   *      - users
   *    responses:
   *      '200':
   *        description: A user created successfully!
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                  description: The response status
   *                  enum: [success]
   *                data:
   *                  type: object
   *                  properties:
   *                    user:
   *                      $ref: '#/components/schemas/User'
   *      '404':
   *        $ref: '#/components/responses/404NotFound'
   *      '500':
   *        $ref: '#/components/responses/500InternalError'
   */
  router.get("/:id", usersController.getUser);

  /**
   * @swagger
   * /api/v1/users/{id}:
   *   delete:
   *     summary: Delete user by ID
   *     description: Delete user by ID
   *     parameters:
   *       - $ref: '#/components/parameters/userId'
   *     tags:
   *       - users
   *     responses:
   *       '200':
   *         description: User deleted!
   *       '400':
   *          $ref: '#/components/responses/400BadRequest'
   *       '404':
   *          $ref: '#/components/responses/404NotFound'
   *       '500':
   *          $ref: '#/components/responses/500InternalError'
   */
  router.delete("/:id", usersController.deleteUser);

  /**
   * @swagger
   *  /api/v1/users/{id}:
   *    put:
   *      summary: Update user by ID
   *      description: Update user by ID
   *      parameters:
   *        - $ref: '#/components/parameters/userId'
   *      requestBody:
   *        required: true
   *        content:
   *          multipart/form-data:
   *            schema:
   *              $ref: '#/components/schemas/User'
   *      tags:
   *        - users
   *      responses:
   *        '200':
   *          description: An updated user info
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  status:
   *                    type: string
   *                    description: The response status
   *                    enum: [success]
   *                  data:
   *                    type: object
   *                    properties:
   *                      user:
   *                        $ref: '#/components/schemas/User'
   *        '400':
   *          $ref: '#/components/responses/400BadRequest'
   *        '404':
   *          $ref: '#/components/responses/404NotFound'
   *        '500':
   *          $ref: '#/components/responses/500InternalError'
   *
   *
   */
  router.put("/:id", avatarUpload, usersController.updatedUserInfo);
  router.all("/:id", methodNotAllowed);
}


