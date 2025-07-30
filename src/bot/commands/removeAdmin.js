// Models
const Admin = require("../../models/Admin");

// Hooks
const useMessage = require("../hooks/useMessage");

// Helpers
const { isOwner } = require("../../utils/helpers");

const removeAdminCommand = async (msg, match) => {
  const chatId = msg.chat.id;
  const adminId = parseInt(match[1]);
  const isOwnerUser = isOwner(chatId);
  const { reply } = useMessage(chatId);

  // Check if the user is not owner
  if (!isOwnerUser || isNaN(adminId)) return;

  // Check if the user is the owner
  const result = await Admin.deleteOne({ userId: adminId, role: "admin" });

  if (result.deletedCount > 0) {
    return await reply(`✅ Admin olib tashlandi: ${adminId}`);
  }

  await reply("❌ Admin topilmadi yoki olib tashlab bo'lmaydi.");
};

module.exports = removeAdminCommand;
