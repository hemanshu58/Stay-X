const express = require("express");
const router = express.Router();
const {
  getAllSliders,
  createSlider,
  updateSlider,
  deleteSlider,
} = require("../controllers/slider.controller");
const isAdmin = require("../middleware/adminMiddleware");
const authenticate = require("../middleware/authMiddleware");

// Get All Sliders (No authentication required)
router.get("/", getAllSliders);

// Create a Slider (Admin only)
router.post("/", authenticate, isAdmin, createSlider);

// Update a Slider (Admin only)
router.put("/:id", authenticate, isAdmin, updateSlider);

// Delete a Slider (Admin only)
router.delete("/:id", authenticate, isAdmin, deleteSlider);

module.exports = router;
