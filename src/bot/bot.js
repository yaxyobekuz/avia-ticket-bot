const botToken = process.env.BOT_TOKEN;
const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(botToken, { polling: true });
module.exports = bot;
