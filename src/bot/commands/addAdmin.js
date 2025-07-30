// Hooks
const useMessage = require("../hooks/useMessage");

// Helpers
const { isOwner } = require("../../utils/helpers");

// Models
const Admin = require("../../models/Admin");
const AdminState = require("../../models/AdminState");

const addAdminCommand = async (msg, match) => {
  const chatId = msg.from.id;
  const newAdminId = match[1].trim();
  const isOwnerUser = isOwner(chatId);
  const { reply } = useMessage(chatId);
  const newAdminName = match[2]?.trim() || "Admin";

  // Check if the user is not owner
  if (!isOwnerUser) return;

  // Check if the user is the owner
  try {
    const admin = { role: "admin", userId: newAdminId, name: newAdminName };

    await Admin.create(admin);
    await AdminState.create({ userId: newAdminId });

    await reply(`✅ Admin muvaffaqiyatli qo'shildi: <i>${newAdminId}</i>`);
  } catch (error) {
    console.log(error);
    await reply("❌ Admin qo'shishda xatolik.");
  }
};

module.exports = addAdminCommand;
