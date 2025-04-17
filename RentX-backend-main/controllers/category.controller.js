const Category = require("../models/category.model.js");
const { errorHandler } = require("../utils/error.js");

// Test Route
const test = (req, res) => {
  res.json({
    message: "Hello, this is from Category router",
  });
};

// Create Category
const createCategory = async (req, res, next) => {
  const { name, iconImage, facilities } = req.body;

  try {
    const newCategory = new Category({ name, iconImage, facilities });
    await newCategory.save();
    res.status(201).json("Category Created Successfully!");
  } catch (error) {
    next(error);
  }
};

// Get Category by ID
const getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id).populate("facilities");
    if (!category) {
      return next(errorHandler(404, "Category not found!"));
    }
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

// Get All Categories
const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().populate("facilities");
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

// Update Category
const updateCategory = async (req, res, next) => {
  try {
    const updates = {};
    const allowedFields = ['name', 'iconImage', 'facilities'];

    // Dynamically add only the fields that exist in req.body
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    ).populate("facilities");

    if (!updatedCategory) {
      return next(errorHandler(404, "Category not found!"));
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    next(error);
  }
};

// Delete Category
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return next(errorHandler(404, "Category not found!"));
    }
    res.status(200).json("Category has been deleted successfully.");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  test,
  createCategory,
  getCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
