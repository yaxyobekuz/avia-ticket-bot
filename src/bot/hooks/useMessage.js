const bot = require("../bot");

/**
 * Creates a message utility for a specific chat.
 * @param {number|string} chatId - The Telegram chat ID.
 * @param {string} targetMessage - The reference message to compare with.
 * @returns {{ reply: Function, matches: Function }}
 */

const useMessage = (chatId, targetMessage) => {
  const reply = async (text, options = {}) => {
    await bot.sendMessage(chatId, text, {
      parse_mode: "HTML",
      ...options,
    });
  };

  const copyMessage = async (channelId, messageId, options = {}) => {
    return await bot.copyMessage(chatId, channelId, messageId, {
      parse_mode: "HTML",
      ...options,
    });
  };

  const sendPhoto = async (chatId, photoUrl, caption) => {
    return await bot.sendPhoto(chatId, photoUrl, {
      caption,
      parse_mode: "HTML",
    });
  };

  const matches = (input) => {
    if (!input?.trim() || !targetMessage?.trim()) return false;
    return input.trim().toLowerCase() === targetMessage.trim().toLowerCase();
  };

  return { reply, matches, sendPhoto, copyMessage };
};

module.exports = useMessage;
