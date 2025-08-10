// server/models/Message.js
const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  wa_id: { type: String, required: true },
  name: { type: String },
  text: { type: String, required: true },
  fromMe: { type: Boolean, required: true },
  status: { type: String, enum: ["sent", "delivered", "read"], default: "sent" },
  timestamp: { type: Date, default: Date.now },
  meta_msg_id: { type: String },
});

module.exports = mongoose.model("Message", MessageSchema);
