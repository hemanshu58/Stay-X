const express = require("express");
const router = express.Router();
const {
  test,
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserProperties,
} = require("../controllers/user.controller");
const isAdmin = require("../middleware/adminMiddleware");
const authenticate = require("../middleware/authMiddleware");

router.get("/test", test);

// Route to fetch all users, accessible only by admin users
router.get("/", authenticate, isAdmin, getAllUsers);
router.get("/:id", getUser);
router.get("/properties/:id", authenticate, getUserProperties);

//router.post("/", createUser);
router.put("/:id", authenticate, updateUser);

// Users can only delete their own data, or admins can delete any user (handled in controller)
router.delete("/:id", authenticate, deleteUser);

module.exports = router;
