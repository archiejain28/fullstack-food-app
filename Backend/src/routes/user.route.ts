import express from "express";
import UserController from "../controllers/user.controller.ts";
import { authMiddleware } from "../middleware/auth.middleware.ts";
import { isLoggedUserAdmin } from "../middleware/roles.middleware.ts";

const router = express.Router();
const userController = new UserController();

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *               phone_no:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 */

router.post("/register", authMiddleware, userController.register);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: get users list
 *     tags:
 *       - Users
 *     responses:
 *       201:
 *         description: User fetched successfully
 */

router.get("/", authMiddleware, userController.getUsers);

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: get my profile
 *     tags:
 *       - User Profile
 *     responses:
 *       201:
 *         description: User fetched successfully
 */

router.get("/profile", authMiddleware, userController.getUserProfile);

/**
 * @swagger
 * /users/profile/updateAddress:
 *   patch:
 *     summary: Update User Address
 *     tags:
 *       - User Profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Address updated successfully
 */

router.patch(
  "/profile/updateAddress",
  authMiddleware,
  userController.updateUserProfile,
);

/**
 * @swagger
 * /users/profile/updatePhoneNumber:
 *   patch:
 *     summary: Update User Phone Number
 *     tags:
 *       - User Profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone_no:
 *                 type: string
 *     responses:
 *       201:
 *         description: Phone Number updated successfully
 */

router.patch(
  "/profile/updatePhoneNumber",
  authMiddleware,
  userController.updateUserProfile,
);

/**
 * @swagger
 * /users/admin/updateUserRole/{id}:
 *   patch:
 *     summary: Update User Role
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newRole:
 *                 type: string
 *     responses:
 *       201:
 *         description: Role updated successfully
 */

router.patch(
  "/admin/updateUserRole/:id",
  authMiddleware,
  isLoggedUserAdmin,
  userController.updateUserProfile,
);

export default router;
