const express = require("express");
const router = express.Router();
const {
  test,
  createCategory,
  getCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");
const isAdmin = require("../middleware/adminMiddleware");
const authenticate = require("../middleware/authMiddleware");

// Test Route
router.get("/test", test);

// Create Category (Admin only)
router.post("/", authenticate, isAdmin, createCategory);

// Get a Category by ID
router.get("/:id", authenticate, getCategory);

// Get All Categories
router.get("/", getAllCategories);

// Update Category (Admin only)
router.put("/:id", authenticate, isAdmin, updateCategory);

// Delete Category (Admin only)
router.delete("/:id", authenticate, isAdmin, deleteCategory);

module.exports = router;
