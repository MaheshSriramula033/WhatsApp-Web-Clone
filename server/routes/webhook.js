// server/routes/webhook.js
const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

router.post("/", async (req, res) => {
  try {
    const payload = req.body;

    if (
      payload.payload_type === "whatsapp_webhook" &&
      payload.metaData?.entry?.[0]?.changes?.[0]?.value?.messages
    ) {
      const messageObj = payload.metaData.entry[0].changes[0].value.messages[0];
      const contact = payload.metaData.entry[0].changes[0].value.contacts[0];

      const msg = {
        id: messageObj.id,
        wa_id: messageObj.from,
        name: contact.profile.name,
        text: messageObj.text.body,
        fromMe: false,
        timestamp: new Date(Number(messageObj.timestamp) * 1000),
        status: "sent",
      };

      await Message.create(msg);
      return res.status(200).json({ success: true });
    }

    res.status(400).json({ success: false, message: "Invalid payload format" });
  } catch (err) {
    console.error("❌ Webhook error:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

module.exports = router;
