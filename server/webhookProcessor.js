// server/webhookProcessor.js
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Message = require("./models/Message");
require("dotenv").config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));

const payloadsDir = path.join(__dirname, "..", "webhook_payloads"); // Make sure payloads are in this folder

const processPayloads = async () => {
  const files = fs.readdirSync(payloadsDir);

for (const file of files) {
  const filePath = path.join(payloadsDir, file);
  const content = fs.readFileSync(filePath, "utf-8");
  const payload = JSON.parse(content);

  // ✅ New Format: WhatsApp webhook payload
  if (payload.payload_type === "whatsapp_webhook") {
    const entry = payload.metaData.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;

    const contact = value?.contacts?.[0];
    const message = value?.messages?.[0];

    if (message && contact) {
      const wa_id = contact.wa_id;
      const name = contact.profile?.name || "Unknown";
      const text = message?.text?.body || "";
      const id = message.id;
      const timestamp = new Date(+message.timestamp * 1000); // convert from Unix

      await Message.create({
        id,
        wa_id,
        name,
        text,
        fromMe: false,
        timestamp,
        status: "sent"
      });
    }
  }

  // ✅ Old Format: Flat test payloads
  else if (payload.type === "message") {
    const { id, wa_id, name, text, timestamp, fromMe } = payload;

    await Message.create({
      id,
      wa_id,
      name,
      text,
      fromMe,
      timestamp: new Date(timestamp),
      status: "sent",
    });
  } 
  
  else if (payload.type === "status") {
    const { meta_msg_id, status } = payload;

    await Message.findOneAndUpdate(
      { id: meta_msg_id },
      { status }
    );
  }
}

  console.log("✅ Payloads processed.");
  mongoose.disconnect();
};

processPayloads().catch((err) => {
  console.error("Error processing payloads:", err);
  mongoose.disconnect();
});
