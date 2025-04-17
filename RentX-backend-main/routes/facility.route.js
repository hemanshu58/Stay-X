const express = require("express");
const router = express.Router();
const {
  test,
  createFacility,
  getFacility,
  getAllFacilities,
  updateFacility,
  deleteFacility,
} = require("../controllers/facility.controller");
const isAdmin = require("../middleware/adminMiddleware");
const authenticate = require("../middleware/authMiddleware");

// Test Route
router.get("/test", test);

// Create Facility (Admin only)
router.post("/", authenticate, isAdmin, createFacility);

// Get a Facility by ID
router.get("/:id", authenticate, getFacility);

// Get All Facilities
router.get("/", getAllFacilities);

// Update Facility (Admin only)
router.put("/:id", authenticate, isAdmin, updateFacility);

// Delete Facility (Admin only)
router.delete("/:id", authenticate, isAdmin, deleteFacility);

module.exports = router;
