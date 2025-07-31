// Bot instance
const bot = require("./bot");

// Handlers
const photoHandler = require("./handlers/photo");
const messageHandler = require("./handlers/message");

// Commands
const startCommand = require("./commands/start");
const statsCommand = require("./commands/stats");
const addAdminCommand = require("./commands/addAdmin");
const removeAdminCommand = require("./commands/removeAdmin");
const controlAdminsCommand = require("./commands/controlAdmins");

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

// // Listen any messages
bot.on("message", messageHandler);

// // Listen photo messages
bot.on("photo", photoHandler);
