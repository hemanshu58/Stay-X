const mongoose = require("mongoose");

const SliderSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true, // Optional: to indicate if the slider item is active
  },
});

const Slider = mongoose.model("Slider", SliderSchema);
module.exports = Slider;
