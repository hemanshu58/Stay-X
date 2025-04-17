const Facility = require("../models/facility.model.js");
const { errorHandler } = require("../utils/error.js");

// Test Route
const test = (req, res) => {
  res.json({
    message: "Hello, this is from Facility router",
  });
};

// Create Facility
const createFacility = async (req, res, next) => {
  const { name, iconImage, type } = req.body;

  try {
    const newFacility = new Facility({ name, iconImage, type });
    await newFacility.save();
    res.status(201).json("Facility Created Successfully!");
  } catch (error) {
    next(error);
  }
};

// Get Facility by ID
const getFacility = async (req, res, next) => {
  try {
    const facility = await Facility.findById(req.params.id);
    if (!facility) {
      return next(errorHandler(404, "Facility not found!"));
    }
    res.status(200).json(facility);
  } catch (error) {
    next(error);
  }
};

// Get All Facilities
const getAllFacilities = async (req, res, next) => {
  try {
    const facilities = await Facility.find();
    res.status(200).json(facilities);
  } catch (error) {
    next(error);
  }
};

// Update Facility
const updateFacility = async (req, res, next) => {
  try {
    const updates = {};
    const allowedFields = ['name', 'iconImage', 'type'];

    // Dynamically add only the fields that exist in req.body
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Update the facility with only the provided fields
    const updatedFacility = await Facility.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );

    if (!updatedFacility) {
      return next(errorHandler(404, "Facility not found!"));
    }

    res.status(200).json(updatedFacility);
  } catch (error) {
    next(error);
  }
};

// Delete Facility
const deleteFacility = async (req, res, next) => {
  try {
    const facility = await Facility.findByIdAndDelete(req.params.id);
    if (!facility) {
      return next(errorHandler(404, "Facility not found!"));
    }
    res.status(200).json("Facility has been deleted successfully.");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  test,
  createFacility,
  getFacility,
  getAllFacilities,
  updateFacility,
  deleteFacility,
};
