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

// Queue for processing photos by user
const userPhotoQueues = new Map();

// Process single photo with retry mechanism
const processPhotoWithRetry = async (userId, photoData, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const state = await getState(userId);

      // Double check state is still valid
      if (!state || state.name !== "documents") {
        throw new Error("Invalid state during processing");
      }

      // Get fresh admin data
      const admin = await Admin.findOne({ userId: photoData.chatId });
      if (!admin) {
        throw new Error("Admin not found");
      }

      // Send photo to channel
      const { sendPhoto } = useMessage(photoData.chatId);
      const sendedPhoto = await sendPhoto(
        channelId,
        photoData.fileId,
        generateTicketPhotoPreview(state, admin.name)
      );

      // Create document object
      const postLink = `${channelUrl}/${sendedPhoto.message_id}`;
      const doc = {
        postLink,
        channelMessageId: sendedPhoto.message_id,
        timestamp: Date.now(), // Add timestamp for tracking
      };

      // Update state with new document - get fresh state to avoid conflicts
      const currentState = await getState(userId);
      const updatedDocs = [...(currentState.data?.documents || []), doc];

      await setState(userId, {
        ...currentState.data,
        documents: updatedDocs,
      });

      return { success: true, docCount: updatedDocs.length };
    } catch (error) {
      console.error(`Photo processing attempt ${attempt} failed:`, error);

      if (attempt === maxRetries) {
        throw error; // Re-throw on final attempt
      }

      // Wait before retry (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
    }
  }
};

// Process photo queue for specific user
const processPhotoQueue = async (userId) => {
  const queue = userPhotoQueues.get(userId);
  if (!queue || queue.processing || queue.photos.length === 0) {
    return;
  }

  queue.processing = true;

  while (queue.photos.length > 0) {
    const photoData = queue.photos.shift();
    const { reply } = useMessage(photoData.chatId);

    try {
      const result = await processPhotoWithRetry(userId, photoData);
      await reply(texts.documentUploaded(result.docCount));
    } catch (error) {
      console.error("Final photo processing error:", error);
      await reply(texts.documentUploadError);
    }
  }

  queue.processing = false;

  // Clean up empty queue
  if (queue.photos.length === 0) {
    userPhotoQueues.delete(userId);
  }
};

const photoHandler = async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  try {
    // Check admin status
    const isAdminUser = await isAdmin(chatId);
    if (!isAdminUser) return;

    // Check user state
    const state = await getState(userId);
    if (!state || state.name !== "documents") return;

    // Get highest quality photo
    const photo = msg.photo[msg.photo.length - 1];

    // Initialize queue for user if doesn't exist
    if (!userPhotoQueues.has(userId)) {
      userPhotoQueues.set(userId, {
        photos: [],
        processing: false,
      });
    }

    // Add photo to user's queue
    const photoData = {
      fileId: photo.file_id,
      chatId: chatId,
      timestamp: Date.now(),
    };

    userPhotoQueues.get(userId).photos.push(photoData);

    // Process queue (will handle one photo at a time)
    await processPhotoQueue(userId);
  } catch (error) {
    console.error("Photo handler error:", error);
    const { reply } = useMessage(chatId);
    await reply(texts.documentUploadError);
  }
};

module.exports = photoHandler;
