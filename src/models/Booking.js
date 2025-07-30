const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  date: { type: String, required: true },
  price: { type: Number, required: true },
  admin: { type: String, required: true },
  documents: { type: Array, required: true },
  direction: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  clientContact: { type: String, required: true },
});

module.exports = mongoose.model("Booking", bookingSchema);
