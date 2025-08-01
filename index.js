require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const ownerId = process.env.OWNER_ID;
const mongoUrl = process.env.MONGO_URL;
const Admin = require("./src/models/Admin");
const Ticket = require("./src/models/Ticket");
const AdminState = require("./src/models/AdminState");
const { authenticateRequest } = require("./src/middleware");

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

const app = express();
app.use(express.json());

// Sync tickets endpoint
app.post("/api/sync-tickets", authenticateRequest, async (req, res) => {
  try {
    const { tickets, sheetType } = req.body;

    // Clear existing tickets of this type
    await Ticket.deleteMany({ type: sheetType.toLowerCase() });

    // Process and save new tickets
    const processedTickets = tickets.map((ticket) => ({
      date: ticket.date,
      type: ticket.type,
      time: ticket.time,
      price: ticket.price,
      direction: ticket.direction,
      availableSeats: ticket.availableSeats,
    }));

    // Insert new tickets
    const savedTickets = await Ticket.insertMany(processedTickets);

    res.status(200).json({
      success: true,
      sheetType: sheetType,
      ticketsCount: savedTickets.length,
      message: `Synced ${savedTickets.length} tickets`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      details: error.message,
      error: "Failed to sync tickets",
    });
  }
});

// Get all tickets endpoint
app.get("/api/tickets", authenticateRequest, async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.json({ tickets, success: true, count: tickets.length });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to get tickets" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
