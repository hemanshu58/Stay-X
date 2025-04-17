const express = require("express");
const router = express.Router();
const {
  test,
  createProperty,
  getProperty,
  getAllProperties,
  updateProperty,
  deleteProperty,
  likeProperty,
  dislikeProperty,
} = require("../controllers/property.controller");
const authenticate = require("../middleware/authMiddleware");

router.get("/test", test);

router.get("/", getAllProperties);
router.get("/:id", getProperty);
router.post("/", authenticate, createProperty);
router.put("/:id", authenticate, updateProperty);
router.put("/:id/like", authenticate, likeProperty);
router.put("/:id/dislike", authenticate, dislikeProperty);
router.delete("/:id", authenticate, deleteProperty);

module.exports = router;
