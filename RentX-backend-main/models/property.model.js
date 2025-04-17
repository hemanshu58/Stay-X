const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  monthlyRent: {
    type: Number,
    required: true,
  },
  securityDeposit: {
    type: Number,
    default: 0,
  },
  facilities: [
    {
      facility: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Facility",
        required: true,
      },
      value: {
        type: mongoose.Schema.Types.Mixed, // Can store dynamic values (e.g., number of rooms, boolean, string)
        required: true,
      },
    },
  ],
  images: [
    {
      type: String,
      required: true,
    },
  ],
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  likeCount: {
    type: Number,
    default: 0,
  },
  userRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
});

const Property = mongoose.model("Property", PropertySchema);
module.exports = Property;