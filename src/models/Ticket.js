const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  count: { type: Number, default: 1 },
  date: { type: String, required: true },
  time: { type: String, required: true },
  price: { type: Number, required: true },
  direction: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  type: { type: String, default: "ketish", enum: ["qaytish", "ketish"] },
});

module.exports = mongoose.model("Ticket", ticketSchema);
