// Bot instance
const bot = require("./bot");

// Texts
const texts = require("./texts");

// Handlers
const photoHandler = require("./handlers/photo");
const messageHandler = require("./handlers/message");

// Helpers
const { escapeRegExp } = require("../utils/helpers");

// Regexes
const bookingInfoRegex = new RegExp(texts.ticketInfo);
const bookingFilesRegex = new RegExp(escapeRegExp(texts.ticketFiles));
const bookingFilesWithoutInfoRegex = new RegExp(
  escapeRegExp(texts.ticketFilesWithoutInfo)
);

// Commands
const startCommand = require("./commands/start");
const statsCommand = require("./commands/stats");
const addAdminCommand = require("./commands/addAdmin");
const removeAdminCommand = require("./commands/removeAdmin");
const controlAdminsCommand = require("./commands/controlAdmins");
const getBookingInfoCommand = require("./commands/getBookingInfo");
const getBookingFilesCommand = require("./commands/getBookingFiles");
const getBookingFilesWithoutInfoCommand = require("./commands/getBookingFilesWithoutInfo");

// Start command for Greeting
bot.onText(/\/start/, startCommand);

// Control admins (Only for owner)
bot.onText(/👥 Adminlarni Boshqarish/, controlAdminsCommand);

// Add admin (Only for owner)
bot.onText(/\/add_admin (\d+|\w+)(?:\s+(.+))?/, addAdminCommand);

// Remove admin (Only for owner)
bot.onText(/\/remove_admin (.+)/, removeAdminCommand);

// Get statistics
bot.onText(/📊 Statistikani Ko'rish/, statsCommand);

// Get booking info
bot.onText(bookingInfoRegex, getBookingInfoCommand);

// Get booking files
bot.onText(bookingFilesRegex, getBookingFilesCommand);

// Get booking files without info
bot.onText(bookingFilesWithoutInfoRegex, getBookingFilesWithoutInfoCommand);

// // Listen any messages
bot.on("message", messageHandler);

// // Listen photo messages
bot.on("photo", photoHandler);
