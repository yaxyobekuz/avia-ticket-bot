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
  generateTicketPhotoPreview,
} = require("../../utils/helpers");

// Models
const Booking = require("../../models/Booking");

// Hooks
const useMessage = require("../hooks/useMessage");

const getBookingInfoCommand = async (msg, match) => {
  const text = msg.text;
  const chatId = msg.chat.id;
  const isOwnerUser = isOwner(chatId);
  const isAdminUser = await isAdmin(chatId);
  const { reply } = useMessage(chatId, text);

  // Check if the user is not an admin
  if (!isAdminUser) return;

  // Check if the user is an admin
  const state = await getState(chatId);
  if (state.name !== "booking_info") return;

  const menu = isOwnerUser ? createOwnerMenu : createMainMenu;
  const booking = await Booking.findById(state.data.bookingId);

  if (!booking) return reply(texts.ticketNotFound, menu());

  const info = generateTicketPhotoPreview(
    { data: booking },
    booking.admin,
    true
  );

  await clearState(chatId);
  return await reply(info, menu());
};

module.exports = getBookingInfoCommand;
