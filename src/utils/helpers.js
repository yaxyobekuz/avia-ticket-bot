const ownerId = process.env.OWNER_ID;
const texts = require("../bot/texts");
const Admin = require("../models/Admin");
const Ticket = require("../models/Ticket");
const AdminState = require("../models/AdminState");

// Check admin
const isAdmin = async (userId) => {
  return (await Admin.findOne({ userId })) !== null;
};

// Check owner
const isOwner = (userId) => {
  return userId === Number(ownerId);
};

// Get admin state data
const getState = async (userId) => {
  return await AdminState.findOne({ userId });
};

// Set admin state data
const setState = async (userId, state) => {
  await AdminState.findOneAndUpdate(
    { userId },
    {
      data: state,
      name: state.name,
    }
  );
};

// Clear admin state data
const clearState = async (userId) => {
  await AdminState.findOneAndUpdate({ userId }, { data: {}, name: "" });
};

// Generates an array of next 30 days in "day-month" format with Uzbek month names
const getAllowedDates = () => {
  const dates = [];
  const today = new Date();

  for (let i = 1; i <= 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const day = date.getDate();
    const month = date.toLocaleString("uz", { month: "long" });
    dates.push(`${day}-${month}`);
  }

  return dates;
};

// Creates main menu keyboard for admins
const createMainMenu = () => ({
  reply_markup: {
    resize_keyboard: true,
    one_time_keyboard: false,
    keyboard: [["📝 Yangi Chipta Qo'shish"], ["📊 Statistikani Ko'rish"]],
  },
});

// Creates owner menu keyboard with admin management options
const createOwnerMenu = () => ({
  reply_markup: {
    keyboard: [
      ["📝 Yangi Chipta Qo'shish"],
      ["👥 Adminlarni Boshqarish", "📊 Statistikani Ko'rish"],
    ],
    resize_keyboard: true,
    one_time_keyboard: false,
  },
});

// Creates cancel operation keyboard
const createCancelMenu = () => ({
  reply_markup: {
    resize_keyboard: true,
    keyboard: [[texts.cancel]],
  },
});

// Creates confirm operation keyboard
const createConfirmationMenu = () => ({
  reply_markup: {
    resize_keyboard: true,
    keyboard: [[texts.done], [texts.cancel]],
  },
});

// Creates keyboard for selecting directions
const createDirectionKeyboard = async () => {
  const tickets = await Ticket.find();
  const uniqueDirections = [...new Set(tickets.map((t) => t.direction))];
  const keyboard = uniqueDirections.map((direction) => [direction]);

  keyboard.push([texts.cancel]);

  return {
    reply_markup: {
      keyboard: keyboard,
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  };
};

// Creates keyboard with available dates (3 dates per row)
const createDateKeyboard = async (direction) => {
  const tickets = await Ticket.find({ direction });
  const uniqueDates = [...new Set(tickets.map((t) => t.date))];
  const keyboard = uniqueDates.map((date) => [date]);

  keyboard.push([texts.cancel]);

  return {
    reply_markup: {
      keyboard: keyboard,
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  };
};

// Creates keyboard for selecting prices
const createPriceKeyboard = async (direction, date) => {
  const tickets = await Ticket.find({ direction, date });
  const uniquePrices = [...new Set(tickets.map((t) => `${t.price}$`))];
  const keyboard = uniquePrices.map((price) => [price]);

  keyboard.push([texts.cancel]);

  return {
    reply_markup: {
      keyboard: keyboard,
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  };
};

// Creates confirmation keyboard for saving or canceling booking
const createConfirmationKeyboard = () => ({
  reply_markup: {
    resize_keyboard: true,
    one_time_keyboard: true,
    keyboard: [[texts.confirm], [texts.cancel]],
  },
});

// Get formatted Uzbekistan local time
const getFormattedCurrentTime = () => {
  const now = new Date();
  const day = now.getDate();
  const year = now.getFullYear();
  const hours = now.getHours().toString().padStart(2, "0");
  const month = now.toLocaleString("uz", { month: "long" });
  const minutes = now.getMinutes().toString().padStart(2, "0");

  return `${day}-${month}, ${year} ${hours}:${minutes}`;
};

// Generate booking preview text
const generateBookingPreview = (state, adminName) => {
  const { documents, clientContact, date, direction, price } = state.data;
  const documentsCount = documents ? documents.length : 0;

  return `📋 <b>Chipta Ma'lumotlari Ko'rinishi</b>

<b>Admin:</b> ${adminName}
<b>Mijoz:</b> ${clientContact}
<b>Sana:</b> ${date}
<b>Yo'nalish:</b> ${direction}
<b>Narx:</b> ${price}
<b>Hujjatlar:</b> ${documentsCount} ta fayl yuklandi
<b>Yaratilgan Vaqt:</b> ${getFormattedCurrentTime()}

Yuqoridagi ma'lumotlarni ko'rib chiqing. Hammasi to'g'rimi?`;
};

// Generate ticket photo preview text
const generateTicketPhotoPreview = (state, adminName) => {
  const { clientContact, date, direction, price } = state.data || {};

  return `<b>Admin:</b> ${adminName}
<b>Mijoz:</b> ${clientContact}
<b>Sana:</b> ${date}
<b>Yo'nalish:</b> ${direction}
<b>Narx:</b> ${price}
<b>Yaratilgan Vaqt:</b> ${getFormattedCurrentTime()}`;
};

module.exports = {
  isAdmin,
  isOwner,
  getState,
  setState,
  clearState,
  createMainMenu,
  getAllowedDates,
  createOwnerMenu,
  createCancelMenu,
  createDateKeyboard,
  createPriceKeyboard,
  generateBookingPreview,
  createConfirmationMenu,
  createDirectionKeyboard,
  getFormattedCurrentTime,
  generateTicketPhotoPreview,
  createConfirmationKeyboard,
};
