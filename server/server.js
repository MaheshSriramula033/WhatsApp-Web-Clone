const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const http = require('http'); // Required for socket.io
const { Server } = require('socket.io'); // Import socket.io

// Routes
const webhookRoute = require("./routes/webhook");
const messageRoutes = require("./routes/message");
const chatRoutes = require('./routes/chatRoutes');

// App initialization
const app = express();
const server = http.createServer(app); // Create server for socket.io to bind
const io = new Server(server, {
  cors: {
    origin: "*", // You can restrict this to your frontend domain
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', chatRoutes);
app.use('/webhook', webhookRoute);
app.use('/api/messages', messageRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Socket.io Logic
io.on('connection', (socket) => {
  console.log(`🟢 User connected: ${socket.id}`);

  // Listening for a new message sent by user
  socket.on('sendMessage', (data) => {
    // Broadcast to other users (optional)
    socket.broadcast.emit('newMessage', data);
  });

  // Update message status
  socket.on('updateStatus', ({ messageId, status }) => {
    // Broadcast to all clients to update UI
    io.emit('messageStatusUpdated', { messageId, status });
  });

  socket.on('disconnect', () => {
    console.log(`🔴 User disconnected: ${socket.id}`);
  });
});
