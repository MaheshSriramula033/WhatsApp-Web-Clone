// server/controllers/chatController.js
const Message = require("../models/Message");

// Get all chats grouped by wa_id
exports.getAllChats = async (req, res) => {
  try {
    const chats = await Message.aggregate([
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: "$wa_id",
          name: { $first: "$name" },
          latestMessage: { $first: "$text" },
          timestamp: { $first: "$timestamp" },
        },
      },
      {
        $sort: { timestamp: -1 },
      },
    ]);
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: "Failed to get chats" });
  }
};

// Get messages for a specific user
exports.getMessagesByUser = async (req, res) => {
  try {
    const { wa_id } = req.params;
    const messages = await Message.find({ wa_id }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to get messages" });
  }
};

// Store a new message
exports.sendMessage = async (req, res) => {
  try {
    const { wa_id, name, text, fromMe } = req.body;
    const newMsg = new Message({ wa_id, name, text, fromMe, status: "sent" });
    await newMsg.save();
    res.status(201).json(newMsg);
  } catch (err) {
    res.status(400).json({ error: "Failed to send message" });
  }
};
