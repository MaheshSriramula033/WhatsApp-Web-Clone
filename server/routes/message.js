const express = require("express");
const router = express.Router();
const Message = require("../models/Message");


// Get all distinct chats with their latest message
router.get("/chats", async (req, res) => {
  try {
    // Fetch all messages and group them by wa_id
    const messages = await Message.find().sort({ timestamp: 1 });

    const chatMap = {};

    messages.forEach((msg) => {
      if (!chatMap[msg.wa_id]) {
        chatMap[msg.wa_id] = {
          wa_id: msg.wa_id,
          name: msg.name,
          messages: [],
        };
      }
      chatMap[msg.wa_id].messages.push({
        id: msg.id,
        type: msg.fromMe ? "user" : "bot",
        text: msg.text,
        timestamp: msg.timestamp,
        status: msg.status,
      });
    });

    res.json(Object.values(chatMap));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch chats" });
  }
});

// POST: Send message
router.post("/send", async (req, res) => {
  const { wa_id, text } = req.body;

  if (!wa_id || !text) return res.status(400).json({ error: "Missing fields" });

  try {
    const message = new Message({
      wa_id,
      fromMe: true,
      text,
      type: "user",
      timestamp: Date.now(),
      status: "sent",
    });

    await message.save();
 // Simulate "delivered" after 2 seconds
    setTimeout(async () => {
      await Message.findByIdAndUpdate(message._id, {
        status: "delivered",
      });

      // Simulate "read" after 5 seconds
      setTimeout(async () => {
        await Message.findByIdAndUpdate(message._id, {
          status: "read",
        });
      }, 3000);
    }, 2000);

    res.status(200).json({ success: true, message });
  } catch (err) {
    console.error("Error saving message:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
});


module.exports = router;
