const mongoose = require("mongoose");

const FacilitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  iconImage: {
    type: String,
    required: true,
  },
  type: {
    type: String, // e.g., 'radio', 'text', etc.
    required: true,
  },
});

const Facility = mongoose.model("Facility", FacilitySchema);
module.exports = Facility;
