// Texts
const texts = require("../texts");

// Helpers
const {
  isAdmin,
  isOwner,
  getState,
  setState,
  createMainMenu,
  createOwnerMenu,
  createBookingInfoMenu,
  clearState,
} = require("../../utils/helpers");

// Regexes
const bookingIdRegex = /\/start (.+)/;

// Hooks
const useMessage = require("../hooks/useMessage");

const startCommand = async (msg) => {
  const text = msg.text;
  const chatId = msg.from.id;
  const { reply } = useMessage(chatId);
  const isAdminUser = await isAdmin(chatId);

  if (isAdminUser) {
    const isOwnerUser = isOwner(chatId);
    const state = await getState(chatId);
    const menu = isOwnerUser ? createOwnerMenu : createMainMenu;

    if (
      bookingIdRegex.test(text) &&
      (!state.name || state.name === "booking_info")
    ) {
      const bookingId = text.split(" ")[1];
      setState(chatId, { ...state.data, name: "booking_info", bookingId });
      return reply(texts.selectFromMenu, createBookingInfoMenu());
    }

    // Greeting
    const welcomeText = isOwnerUser
      ? "👑 Xush kelibsiz, Ega! Variantni tanlang:"
      : "👨‍💼 Xush kelibsiz, Admin! Variantni tanlang:";

    if (state.name) await clearState(chatId);
    const adminText = state.name ? texts.operationCancelled : welcomeText;

    return await reply(adminText, menu());
  }

  reply(
    `❌ Sizga ushbu botdan foydalanish ruxsati yo'q. <code>${chatId}</code>`
  );
};

module.exports = startCommand;
