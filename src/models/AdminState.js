const mongoose = require("mongoose");

const adminStateSchema = new mongoose.Schema({
  name: { type: String },
  data: { type: Object },
  userId: { type: Number, unique: true, required: true },
});

module.exports = mongoose.model("AdminState", adminStateSchema);
