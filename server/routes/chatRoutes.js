// server/routes/chatRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllChats,
  getMessagesByUser,
  sendMessage,
} = require("../controllers/chatController");

// Get all unique chats (grouped by wa_id)
router.get("/chats", getAllChats);

// Get all messages for a specific user
router.get("/chats/:wa_id", getMessagesByUser);

// Post a new message
router.post("/messages", sendMessage);

module.exports = router;
