// Helpers
const {
  isAdmin,
  isOwner,
  createMainMenu,
  createOwnerMenu,
} = require("../../utils/helpers");

// Hooks
const useMessage = require("../hooks/useMessage");

const startCommand = async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const { reply } = useMessage(chatId);
  const isAdminUser = await isAdmin(userId);

  if (isAdminUser) {
    const isOwnerUser = isOwner(userId);
    const menu = isOwnerUser ? createOwnerMenu : createMainMenu;

    const welcomeText = isOwnerUser
      ? "👑 Xush kelibsiz, Ega! Variantni tanlang:"
      : "👨‍💼 Xush kelibsiz, Admin! Variantni tanlang:";

    return await reply(welcomeText, menu());
  }

  reply(
    `❌ Sizga ushbu botdan foydalanish ruxsati yo'q. <code>${chatId}</code>`
  );
};

module.exports = startCommand;
