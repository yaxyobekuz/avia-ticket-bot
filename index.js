require("dotenv").config();
const mongoose = require("mongoose");
const ownerId = process.env.OWNER_ID;
const mongoUrl = process.env.MONGO_URL;
const Admin = require("./src/models/Admin");
const AdminState = require("./src/models/AdminState");

// Connect to Mongo Database
const connectDatabase = async () => {
  try {
    await mongoose.connect(mongoUrl);
    console.log("Mango Baza ulandi! ✅🥭🗿");
  } catch (err) {
    console.error("MongoDB error ❌", err);
    process.exit(1);
  }
};

(async () => {
  await connectDatabase();

  const existingOwner = await Admin.findOne({ userId: ownerId });

  if (!existingOwner) {
    console.log("Ega ma'lumotlari qo'shildi. ✅");
    await AdminState.create({ userId: ownerId });
    await Admin.create({ name: "Ega", role: "owner", userId: ownerId });
  }

  console.log("Bot ishlayapti! 🤖");
})();

require("./src/bot");
