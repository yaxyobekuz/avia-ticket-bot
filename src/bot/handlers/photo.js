// Helpers
const {
  isAdmin,
  isOwner,
  getState,
  setState,
  clearState,
  getAllowedDates,
  generateBookingPreview,
  getFormattedCurrentTime,
} = require("../../utils/helpers");

const photoHandler = async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!(await isAdmin(userId))) return;

  const state = await getState(userId);
  if (!state || state.step !== "documents") return;

  try {
    // Eng yuqori sifatli rasmni olish
    const photo = msg.photo[msg.photo.length - 1];
    const fileId = photo.file_id;

    // Rasmni maxfiy kanalga yo'naltirish
    const forwardedMsg = await bot.forwardMessage(
      channelId,
      chatId,
      msg.message_id
    );

    // Fayl havolasini yaratish
    const channelUsername = channelId.replace("@", "");
    const fileLink = `https://t.me/${channelUsername}/${forwardedMsg.message_id}`;

    // Hujjat ma'lumotlarini holatga qo'shish
    const documentInfo = {
      fileName: `Hujjat_${Date.now()}.jpg`,
      channelMessageId: forwardedMsg.message_id,
      fileLink: fileLink,
    };

    const updatedDocuments = [...(state.documents || []), documentInfo];
    await setState(userId, { ...state, documents: updatedDocuments });

    await bot.sendMessage(
      chatId,
      `✅ Hujjat muvaffaqiyatli yuklandi! (Jami ${updatedDocuments.length} ta fayl)\nQo'shimcha hujjatlar yuboring yoki davom etish uchun "tayyor" deb yozing.`
    );
  } catch (error) {
    console.error("Rasmni ishlashda xatolik:", error);
    await bot.sendMessage(
      chatId,
      "❌ Hujjatni yuklashda xatolik. Iltimos, qaytadan urinib ko'ring."
    );
  }
};

module.exports = photoHandler;
