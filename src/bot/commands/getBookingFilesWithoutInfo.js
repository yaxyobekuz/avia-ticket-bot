const channelId = process.env.PRIVATE_CHANNEL_ID;

// Texts
const texts = require("../texts");

// Helpers
const {
  isAdmin,
  isOwner,
  getState,
  clearState,
  createMainMenu,
  createOwnerMenu,
} = require("../../utils/helpers");

// Models
const Booking = require("../../models/Booking");

// Hooks
const useMessage = require("../hooks/useMessage");

const getBookingFilesWithoutInfoCommand = async (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;
  const isOwnerUser = isOwner(chatId);
  const isAdminUser = await isAdmin(chatId);
  const { reply, copyMessage } = useMessage(chatId, text);

  // Check if the user is not an admin
  if (!isAdminUser) return;

  // Check if the user is an admin
  const state = await getState(chatId);
  if (state.name !== "booking_info") return;

  clearState(chatId);
  const menu = isOwnerUser ? createOwnerMenu : createMainMenu;
  const booking = await Booking.findById(state.data.bookingId);

  if (!booking) return reply(texts.ticketNotFound, menu());

  for (let index = 0; index < booking.documents.length; index++) {
    const doc = booking.documents[index];
    const isLastDoc = booking.documents.length - 1 === index;

    const options = isLastDoc ? menu() : {};
    const docIndex = `<b>Hujjat ${index + 1}</b>\n\n`;

    await copyMessage(channelId, doc.channelMessageId, {
      caption: docIndex,
      ...options,
    }).catch(() => reply(`Hujjat ${index + 1} topilmadi...`));
  }
};

module.exports = getBookingFilesWithoutInfoCommand;
