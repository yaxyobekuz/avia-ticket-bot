const texts = {
  home: `Bosh menyuga qaytdingiz!`,

  // Ticket
  ticketInfo: `Chipta ma'lumotlari 📄`,
  ticketNotFound: `Chipta topilmadi! 🤷‍♂️`,
  ticketFiles: `Chipta fayllari \(\ma'lumotlar bilan) 📂`,
  ticketFilesWithoutInfo: `Chipta fayllari (ma'lumotlarsiz) 📁`,
  selectFromMenu: `Quyidagi menyuda o'zingizga keraklisini tanlang: 👇`,

  // Cancel
  cancel: `❌ Bekor Qilish`,
  operationCancelled: `❌ Operatsiya bekor qilindi.`,
  cancelAndRestart: `❌ Bekor Qilish va Qaytadan Boshlash`,
  ticketSavedErrorInSheets: `❌ Chipta Google sheetsga saqlanmadi!`,

  // Confirmation
  done: "Tayyor ✅",
  confirm: `✅ Tasdiqlash`,
  confirmAndSave: `✅ Tasdiqlash va Saqlash`,
  ticketSavedToSheets: `✅ Chipta muvaffaqiyatli Google sheetsga saqlandi!`,
  ticketSaved: `✅ Chipta muvaffaqiyatli saqlandi va Google sheetsga saqlanmoqda...`,

  // Booking
  addNewTicket: `📝 Yangi Chipta Qo'shish`,
  enterClientTelegram: `📱 Iltimos, mijozning Telegram hisobini kiriting (foydalanuvchi nomi yoki telefon):`,

  // For booking steps
  selectDate: `📅 Iltimos, sanani tanlang:`,
  selectPrice: `💰 Iltimos, narxni tanlang:`,
  selectDirection: `✈️ Iltimos, yo'nalishni tanlang:`,
  invalidDate: `❌ Iltimos, klaviaturadan to'g'ri sanani tanlang.`,
  invalidPrice: `❌ Iltimos, klaviaturadan to'g'ri narxni tanlang.`,
  invalidData: `❌ Iltimos, mijoz ma'lumotlarini to'g'ri kiriting.`,
  invalidDirection: `❌ Iltimos, klaviaturadan to'g'ri yo'nalishni tanlang.`,
  invalidKeyboard: `❌ Iltimos, menyuda berilgan variantlardan birini tanlang.`,
  uploadAtLeastOneDocument: `❌ Davom etishdan oldin kamida bitta hujjat yuklang.`,
  documentUploadError: `❌ Hujjatni yuklashda xatolik. Iltimos, qaytadan urinib ko'ring.`,
  get sendDocuments() {
    return `📎 Iltimos, hujjatlarni (rasmlarni) yuboring. Tugagach, <b>${this.done}</b> deb yozing:`;
  },
  documentUploaded: (docsCount) => {
    return `✅ Hujjat muvaffaqiyatli yuklandi! (Jami ${docsCount} ta fayl)\nQo'shimcha hujjatlar yuboring yoki davom etish uchun <b>${texts.done}</b> deb yozing.`;
  },
};

module.exports = texts;
