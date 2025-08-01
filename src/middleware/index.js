const authenticateRequest = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (token !== process.env.SYNC_SECRET_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
};

module.exports = { authenticateRequest };
