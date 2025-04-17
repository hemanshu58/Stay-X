const bcryptjs = require("bcryptjs");
const User = require("../models/user.model.js");
const Property = require("../models/property.model.js");
const { errorHandler } = require("../utils/error.js");

// Here next function has implementation that how to handle(print) the error Object4

// req.params.id is the id of the user that is being sent in the URL
// req.user.id is the id of the user that is logged in which is set in the middleware
/* So, authMiddleware is doing authentication(setting up the current user in Request) and 
   authorization is done by checking - if(req.user.id === req.params.id) */

// Test Route
const test = (req, res) => {
  res.json({
    message: "Hello, this is from User router",
  });
};

// Create User
const createUser = async (req, res, next) => {
  const { name, email, password, mobileNumber } = req.body;

  try {
    const newUser = new User({ name, email, password, mobileNumber });
    await newUser.save();
    res.status(201).json("User Created Successfully!");
  } catch (error) {
    next(error);
  }
};

// Get User by ID
const getUser = async (req, res, next) => {
  try {
    // Find the user by ID
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(errorHandler(404, "User not found!"));
    }

    // Exclude the password from the response
    const { password: pass, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  // Ensure the user is updating their own account
  if (req.user.id !== req.params.id && !req.user.isAdmin) {
    return next(errorHandler(401, "You can only update your own account!"));
  }

  try {
    const updates = {};
    const allowedFields = [
      'name', 'email', 'password', 'avatar', 'mobileNumber', 
      'isBlocked', 'hasSubscription'
    ];

    // Dynamically add only the fields that exist in req.body
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Fetch the existing user
    const existingUser = await User.findById(req.params.id);
    if (!existingUser) {
      return next(errorHandler(404, "User not found"));
    }

    // Check if the new password is provided and different from the old one
    if (updates.password) {
      if (updates.password && (updates.password != existingUser.password)) {
        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        updates.password = await bcrypt.hash(updates.password, salt);
      } else {
        // If passwords are the same, don't update the password field
        delete updates.password;
      }
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );

    // Exclude the password field from the response
    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// Delete User
const deleteUser = async (req, res, next) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    try {
      // Delete all properties associated with the user
      await Property.deleteMany({ userRef: req.params.id });
      await User.findByIdAndDelete(req.params.id);
      res.clearCookie("access_token");
      res.status(200).json("User has been deleted successfully.");
    } catch (error) {
      next(error);
    }
  } else {
    return next(
      errorHandler(
        401,
        "You can only delete your account or if you are an admin!"
      )
    );
  }
};

// Get User Properties
const getUserProperties = async (req, res, next) => {
  try {
    const Properties = await Property.find({ userRef: req.params.id });
    res.status(200).json(Properties);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  test,
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserProperties,
};
