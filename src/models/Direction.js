const mongoose = require("mongoose");

const directionSchema = new mongoose.Schema({
  name: { type: String, default: "Noma'lum" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Direction", directionSchema);
