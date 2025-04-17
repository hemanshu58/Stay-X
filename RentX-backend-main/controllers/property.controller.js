const Property = require("../models/property.model.js");
const User = require("../models/user.model.js");
const { errorHandler } = require("../utils/error.js");
const Slider = require("../models/slider.model.js");

// Test Route
const test = (req, res) => {
  res.json({
    message: "Hello, this is from Property router",
  });
};

// Create Property
const createProperty = async (req, res, next) => {
  const {
    title,
    description,
    category,
    monthlyRent,
    securityDeposit,
    facilities,
    images,
    address,
    city,
    state,
    country,
    likeCount,
  } = req.body;
  const userRef = req.user.id;

  try {
    const newProperty = new Property({
      title,
      description,
      category,
      monthlyRent,
      securityDeposit: securityDeposit || 0,
      facilities,
      images,
      address,
      city,
      state,
      country,
      likeCount: likeCount || 0, 
      userRef,
    });
    await newProperty.save();
    res.status(201).json("Property Created Successfully!");
  } catch (error) {
    next(error);
  }
};

// Get Property by ID
const getProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate("category")
      .populate("facilities");
    if (!property) {
      return next(errorHandler(404, "Property not found!"));
    }
    res.status(200).json(property);
  } catch (error) {
    next(error);
  }
};

// Get All Properties
const getAllProperties = async (req, res, next) => {
  try {
    const properties = await Property.find()
      .populate("category")
      .populate("facilities");
    res.status(200).json(properties);
  } catch (error) {
    next(error);
  }
};

// Update Property
const updateProperty = async (req, res, next) => {
  // Ensure the user is updating their own property
  const property = await Property.findById(req.params.id);
  if (!property) return next(errorHandler(404, "Property not found!"));
  if (req.user.id !== property.userRef.toString()) {
    return next(errorHandler(401, "You can only update your own property!"));
  }

  try {
    // Filter out only the fields that are present in req.body
    const updates = {};
    const allowedFields = [
      "title",
      "description",
      "category",
      "monthlyRent",
      "securityDeposit",
      "facilities",
      "images",
      "address",
      "city",
      "state",
      "country",
      "likeCount",
    ];

    // Dynamically add only the fields that exist in req.body
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    )
      .populate("category")
      .populate("facilities");

    res.status(200).json(updatedProperty);
  } catch (error) {
    next(error);
  }
};

// Delete Property
const deleteProperty = async (req, res, next) => {
  const property = await Property.findById(req.params.id);
  if (!property) return next(errorHandler(404, "Property not found!"));
  
  // Check if the user is the owner or an admin
  if (req.user.id !== property.userRef.toString() && !req.user.isAdmin) {
    return next(errorHandler(401, "You can only delete your own property!"));
  }

  try {
    // Delete the property
    await Property.findByIdAndDelete(req.params.id);
    
    // Delete the property from the slider
    await Slider.findOneAndDelete({ property: req.params.id });

    // Remove the property from all users' favouriteProperties
    await User.updateMany(
      { favouriteProperties: property._id }, // Find users who have this property in their favourites
      { $pull: { favouriteProperties: property._id } } // Remove the property from their favouriteProperties
    );
    
    res.status(200).json("Property has been deleted successfully.");
  } catch (error) {
    next(error);
  }
};


// Like a property
const likeProperty = async (req, res, next) => {
  const propertyId = req.params.id;
  const userId = req.user.id;

  try {
    // Find the property by ID
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the property is already in the user's favourites
    if (user.favouriteProperties.includes(propertyId)) {
      return res.status(400).json({ message: "Property already liked" });
    }

    // Add the property to the user's favourite properties
    user.favouriteProperties.push(propertyId);
    await user.save();

    // Increment the property's like count
    property.likeCount += 1;
    await property.save();

    res.status(200).json({ message: "Property liked successfully", likeCount: property.likeCount });
  } catch (error) {
    next(error);
  }
};

// Dislike a property
const dislikeProperty = async (req, res, next) => {
  const propertyId = req.params.id;
  const userId = req.user.id;

  try {
    // Find the property by ID
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the property is in the user's favourites
    if (!user.favouriteProperties.includes(propertyId)) {
      return res.status(400).json({ message: "Property not in favourites" });
    }

    // Remove the property from the user's favourite properties
    user.favouriteProperties = user.favouriteProperties.filter(
      (favProperty) => favProperty.toString() !== propertyId
    );
    await user.save();

    // Decrement the property's like count
    property.likeCount -= 1;
    await property.save();

    res.status(200).json({ message: "Property disliked successfully", likeCount: property.likeCount });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  test,
  createProperty,
  getProperty,
  getAllProperties,
  updateProperty,
  deleteProperty,
  likeProperty,
  dislikeProperty,
};
