const channelId = process.env.PRIVATE_CHANNEL_ID;
const channelUrl = process.env.PRIVATE_CHANNEL_URL;

// Texts
const texts = require("../texts");

// Helpers
const {
  isAdmin,
  getState,
  setState,
  generateTicketPhotoPreview,
} = require("../../utils/helpers");

// Models
const Admin = require("../../models/Admin");

// Hooks
const useMessage = require("../hooks/useMessage");

const photoHandler = async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const isAdminUser = await isAdmin(chatId);
  const { reply, sendPhoto } = useMessage(chatId);

  // Check if the user is not an admin
  if (!isAdminUser) return;

  // Check if the user is an admin
  const state = await getState(userId);

  if (!state || state.name !== "documents") return;

  try {
    // Eng yuqori sifatli rasmni olish
    const photo = msg.photo[msg.photo.length - 1];

    // Get admin
    const admin = await Admin.findOne({ userId: chatId });

    // Rasmni maxfiy kanalga yo'naltirish
    const sendedPhoto = await sendPhoto(
      channelId,
      photo.file_id,
      generateTicketPhotoPreview(state, admin.name)
    );

    const postLink = `${channelUrl}/${sendedPhoto.message_id}`;
    const doc = { postLink, channelMessageId: sendedPhoto.message_id };

    const updatedDocs = [...(state.data?.documents || []), doc];
    await setState(userId, { ...state.data, documents: updatedDocs });

    await reply(texts.documentUploaded(updatedDocs.length));
  } catch (error) {
    console.error("Rasmni yuklashda xatolik:", error);
    await reply(texts.documentUploadError);
  }
};

module.exports = photoHandler;
