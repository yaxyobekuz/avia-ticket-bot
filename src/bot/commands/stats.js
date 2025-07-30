// Models
const Admin = require("../../models/Admin");
const Booking = require("../../models/Booking");

// Hooks
const useMessage = require("../hooks/useMessage");

// Helpers
const { isAdmin, isOwner } = require("../../utils/helpers");

const statsCommand = async (msg) => {
  const chatId = msg.chat.id;
  const { reply } = useMessage(chatId);
  const isAdminUser = await isAdmin(chatId);

  // Check if the user is not an admin
  if (!isAdminUser) return;

  // Check if the user is an admin
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const totalBookings = await Booking.countDocuments();

  const todayBookings = await Booking.countDocuments({
    createdAt: { $gte: todayStart.toISOString() },
  });

  let stats = `📊 <b>Statistika</b>

<b>Jami Bronlar:</b> ${totalBookings}
<b>Bugungi Bronlar:</b> ${todayBookings}`;

  if (isOwner(chatId)) {
    const totalAdmins = await Admin.countDocuments();
    stats += `\n<b>Jami adminlar:</b> ${totalAdmins}`;
  }

  stats += "\n\n📈 Ajoyib ishni davom eting!";

  await reply(stats);
};

module.exports = statsCommand;
