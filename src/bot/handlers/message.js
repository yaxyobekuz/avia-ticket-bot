const appsScriptUrl = process.env.APPS_SCRIPT_URL;

// Texts
const texts = require("../texts");

// Helpers
const {
  isAdmin,
  isOwner,
  getState,
  setState,
  clearState,
  createMainMenu,
  createOwnerMenu,
  createCancelMenu,
  createDateKeyboard,
  createPriceKeyboard,
  createConfirmationMenu,
  generateBookingPreview,
  createDirectionKeyboard,
  createConfirmationKeyboard,
  createBookingInfoMenu,
} = require("../../utils/helpers");

// Models
const Admin = require("../../models/Admin");
const Ticket = require("../../models/Ticket");
const Booking = require("../../models/Booking");

// Hooks
const useMessage = require("../hooks/useMessage");

// Services
const { GoogleSheetsService } = require("../../services/googleSheets");

const messageHandler = async (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;
  const isAdminUser = await isAdmin(chatId);
  const { reply, matches } = useMessage(chatId, text);

  // Check if the user is not an admin
  if (!isAdminUser) return;

  // Check if the user is an admin
  const state = await getState(chatId);

  // Add a new ticket
  if (matches(texts.addNewTicket)) {
    await setState(chatId, { name: "client_contact", documents: [] });
    return await reply(texts.enterClientTelegram, createCancelMenu());
  }

  // Cancel operation
  if (matches(texts.cancel) || matches(texts.cancelAndRestart)) {
    await clearState(chatId);
    const menu = isOwner(chatId) ? createOwnerMenu : createMainMenu;
    return await reply(texts.operationCancelled, menu());
  }

  // If no state, return
  if (!state) return;
  const checkState = (targetName) => state.name === targetName;

  // Step: booking_info
  if (
    checkState("booking_info") &&
    !matches(texts.ticketInfo) &&
    !matches(texts.ticketFiles) &&
    !matches(texts.ticketFilesWithoutInfo)
  ) {
    if (text?.startsWith("/start")) return;
    return await reply(texts.invalidKeyboard, createBookingInfoMenu());
  }

  // Step: client_contact
  if (checkState("client_contact")) {
    if (!text) {
      return await reply(texts.invalidData, createCancelMenu());
    }

    await setState(chatId, {
      ...state.data,
      name: "direction",
      clientContact: text,
    });

    return await reply(texts.selectDirection, await createDirectionKeyboard());
  }

  // Step: direction
  if (checkState("direction")) {
    const isValidDirection = await Ticket.exists({ direction: text });

    if (!isValidDirection) {
      return await reply(
        texts.invalidDirection,
        await createDirectionKeyboard()
      );
    }

    await setState(chatId, { ...state.data, direction: text, name: "date" });

    return await reply(texts.selectDate, await createDateKeyboard(text));
  }

  // Step: date
  if (checkState("date")) {
    const isValidDate = await Ticket.exists({
      date: text,
      direction: state.data.direction,
    });

    if (!isValidDate) {
      return await reply(
        texts.invalidDate,
        createDateKeyboard(state.data.direction)
      );
    }

    await setState(chatId, { ...state.data, date: text, name: "price" });

    return await reply(
      texts.selectPrice,
      await createPriceKeyboard(state.data.direction, text)
    );
  }

  // Step: price
  if (checkState("price")) {
    const isValidPrice = await Ticket.exists({
      price: parseInt(text),
      date: state.data.date,
      direction: state.data.direction,
    });

    if (!isValidPrice) {
      return await reply(
        texts.invalidPrice,
        await createPriceKeyboard(state.data.direction, state.data.date)
      );
    }

    await setState(chatId, { ...state.data, price: text, name: "documents" });
    await reply(texts.sendDocuments, createConfirmationMenu());
  }

  // Step: documents
  if (checkState("documents")) {
    if (!matches(texts.done)) return;

    if (!state.data.documents || state.data.documents?.length === 0) {
      await reply(texts.uploadAtLeastOneDocument, createConfirmationMenu());
      return;
    }

    const admin = await Admin.findOne({ userId: chatId });
    const adminName = admin ? admin.name : "Admin";

    // Generate booking preview
    const preview = generateBookingPreview(state, adminName);

    await setState(chatId, { ...state.data, name: "confirmation", adminName });

    return await reply(preview, createConfirmationKeyboard());
  }

  // Step: confirmation
  if (checkState("confirmation")) {
    if (!matches(texts.confirmAndSave)) return;
    const menu = isOwner(chatId) ? createOwnerMenu : createMainMenu;

    const { date, adminName, direction, documents, price, clientContact } =
      state.data;

    const bookingData = {
      date,
      direction,
      documents,
      clientContact,
      addedBy: chatId,
      admin: adminName,
      price: parseInt(price) || 0,
    };

    // Save to database
    Booking.create(bookingData).then(async (savedBooking) => {
      // Save to Google Sheets
      const sheetsService = new GoogleSheetsService(appsScriptUrl);
      sheetsService
        .writeBookingToSheets({
          ...bookingData,
          id: savedBooking._id,
          createdAt: savedBooking.createdAt,
        })
        .then(() => reply(texts.ticketSavedToSheets))
        .catch(() => reply(texts.ticketSavedErrorInSheets));

      await clearState(chatId);
      await reply(texts.ticketSaved, menu());
    });
  }
};

module.exports = messageHandler;
