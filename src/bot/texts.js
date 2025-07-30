const texts = {
  // Confirmation
  done: "Tayyor ✅",
  confirm: `✅ Tasdiqlash`,
  confirmAndSave: `✅ Tasdiqlash va Saqlash`,
  ticketSaved: `✅ Chipta muvaffaqiyatli saqlandi!`,

  // Cancel
  cancel: `❌ Bekor Qilish`,
  operationCancelled: `❌ Operatsiya bekor qilindi.`,
  cancelAndRestart: `❌ Bekor Qilish va Qaytadan Boshlash`,

  // Booking
  addNewTicket: `📝 Yangi Chipta Qo'shish`,
  enterClientTelegram: `📱 Iltimos, mijozning Telegram hisobini kiriting (foydalanuvchi nomi yoki telefon):`,

  // For booking steps
  selectDate: `📅 Iltimos, sanani tanlang:`,
  selectPrice: `💰 Iltimos, narxni tanlang:`,
  selectDirection: `✈️ Iltimos, yo'nalishni tanlang:`,
  invalidDate: `❌ Iltimos, klaviaturadan to'g'ri sanani tanlang.`,
  invalidPrice: `❌ Iltimos, klaviaturadan to'g'ri narxni tanlang.`,
  invalidDirection: `❌ Iltimos, klaviaturadan to'g'ri yo'nalishni tanlang.`,
  uploadAtLeastOneDocument: `❌ Davom etishdan oldin kamida bitta hujjat yuklang.`,
  get sendDocuments() {
    return `📎 Iltimos, hujjatlarni (rasmlarni) yuboring. Tugagach, <b>${this.done}</b> deb yozing:`;
  },
};

module.exports = texts;
