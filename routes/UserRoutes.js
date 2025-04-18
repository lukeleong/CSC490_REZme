// routes/UserRoutes.js
console.log('UserRoutes.js file has been loaded!');
const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController');
const middleware = require('../middleware/middleware');
const authenticateJWT = require('../server').authenticateJWT;

// Admin-only routes
router.put("/:UserId/admin", authenticateJWT, middleware.checkAdminStatus, userController.adminUpdateUser);
router.post("/:UserId/admin-delete", authenticateJWT, middleware.checkAdminStatus, userController.adminDeleteUser);
router.get("/all", authenticateJWT, middleware.checkAdminStatus, userController.getAllUsersAdmin);

// Test route
router.get("/test-route", userController.testRoute);

// User search (admin only)
router.get("/findUsers", authenticateJWT, userController.findUsers);

// Authentication routes
router.post("/signup", userController.signup);
router.post("/google-login", userController.googleLogin);
router.post("/login", userController.login);
router.post("/forgot-password", userController.forgotPassword);
router.get("/reset-password", userController.getResetPassword);
router.post("/reset-password", userController.resetPassword);

// User profile routes
router.get("/profile", authenticateJWT, userController.getProfile);
router.post("/change-password", authenticateJWT, userController.changePassword);
router.post("/delete-account", authenticateJWT, userController.deleteAccount);

// Admin check
router.get("/admin-check", authenticateJWT, userController.checkAdmin);

// User management routes
router.get("/", userController.getAllUsers);
router.get("/:userId", authenticateJWT, userController.getUserById);
router.put("/:UserId", authenticateJWT, userController.updateUser);
router.delete("/:UserId", authenticateJWT, userController.deleteUser);



// AI assistance
router.post('/ask-hf-ai', authenticateJWT, userController.askHfAi);

module.exports = router;