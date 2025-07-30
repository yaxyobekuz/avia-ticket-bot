// Models
const Admin = require("../../models/Admin");

// Hooks
const useMessage = require("../hooks/useMessage");

// Helpers
const { isOwner } = require("../../utils/helpers");

const controlAdminsCommand = async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const isOwnerUser = isOwner(userId);

  // Check if the user is not owner
  if (!isOwnerUser) return;

  // Check if the user is the owner
  const admins = await Admin.find();
  const { reply } = useMessage(chatId);
  let adminList = "<b>Hozirgi Adminlar:</b>\n\n";

  if (admins.length === 0) {
    adminList += "Adminlar topilmadi.";
  } else {
    admins.forEach(({ userId, name }, index) => {
      adminList += `${index + 1}. ${name}: <code>${userId}</code>\n`;
    });
  }

  adminList += `\n💡 Admin qo'shish uchun menga /add_admin <i>123456789</i> formatida xabar yuboring.`;
  adminList += `\n💡 Adminni olib tashlash uchun /remove_admin <i>123456789</i> dan foydalaning`;

  reply(adminList); // Send message to the owner
};

module.exports = controlAdminsCommand;
