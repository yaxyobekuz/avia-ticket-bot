const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: { type: String, default: "Admin" },
  createdAt: { type: Date, default: Date.now },
  userId: { type: Number, unique: true, required: true },
  role: { type: String, default: "admin", enum: ["admin", "owner"] },
});

module.exports = mongoose.model("Admin", adminSchema);
