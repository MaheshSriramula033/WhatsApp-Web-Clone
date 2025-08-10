import React, { useState, useEffect, useRef } from "react";
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";
import { io } from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/App.css";

const socket = io("https://whatsapp-web-clone-eksp.onrender.com");

const App = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const socketRef = useRef(socket);

  // Fetch chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch("https://whatsapp-web-clone-eksp.onrender.com/api/messages/chats");
        const data = await res.json();
        setChats(data);
      } catch (err) {
        console.error("Failed to fetch chats", err);
      }
    };
    fetchChats();
  }, []);

  // Socket listeners
useEffect(() => {
  const socket = socketRef.current;

  const handleNewMessage = (message) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.wa_id === message.wa_id
          ? { ...chat, messages: [...chat.messages, message] }
          : chat
      )
    );
  };

  const handleMessageStatusUpdated = ({ messageId, status }) => {
    setChats((prevChats) =>
      prevChats.map((chat) => ({
        ...chat,
        messages: chat.messages.map((msg) =>
          msg.id === messageId ? { ...msg, status } : msg
        ),
      }))
    );

    setSelectedChat((prevSelectedChat) => {
      if (!prevSelectedChat) return prevSelectedChat;

      const updatedMessages = prevSelectedChat.messages.map((msg) =>
        msg.id === messageId ? { ...msg, status } : msg
      );
      return { ...prevSelectedChat, messages: updatedMessages };
    });
  };

  socket.on("newMessage", handleNewMessage);
  socket.on("messageStatusUpdated", handleMessageStatusUpdated);

  return () => {
    socket.off("newMessage", handleNewMessage);
    socket.off("messageStatusUpdated", handleMessageStatusUpdated);
  };
}, []);


  // Responsive handling
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Add new message to chats
  const updateChatWithNewMessage = (message) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.wa_id === message.wa_id
          ? { ...chat, messages: [...chat.messages, message] }
          : chat
      )
    );
  };

  // Update message read/delivered status
  const updateMessageStatus = (messageId, status) => {
    setChats((prevChats) =>
      prevChats.map((chat) => ({
        ...chat,
        messages: chat.messages.map((msg) =>
          msg.id === messageId ? { ...msg, status } : msg
        ),
      }))
    );

    if (selectedChat) {
      const updatedMessages = selectedChat.messages.map((msg) =>
        msg.id === messageId ? { ...msg, status } : msg
      );
      setSelectedChat({ ...selectedChat, messages: updatedMessages });
    }
  };

  // Select chat
  const handleSelectChat = (chat) => {
    const latestChat = chats.find((c) => c.wa_id === chat.wa_id);
    if (!latestChat) return;

    // Force re-render by changing reference
    const newSelected = {
      ...latestChat,
      messages: [...latestChat.messages],
    };
    setSelectedChat(newSelected);

    // Emit read status update
    latestChat.messages.forEach((msg) => {
      if (msg.status !== "read") {
        socketRef.current.emit("updateStatus", {
          messageId: msg.id,
          status: "read",
        });
      }
    });
  };

  // Send message
  const handleSendMessage = async (text) => {
    const newMessage = {
      id: Date.now().toString(),
      type: "user",
      text,
      timestamp: Date.now(),
      status: "sent",
      wa_id: selectedChat.wa_id,
    };

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.wa_id === selectedChat.wa_id
          ? { ...chat, messages: [...chat.messages, newMessage] }
          : chat
      )
    );

    setSelectedChat((prev) => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));

    try {
      socketRef.current.emit("sendMessage", newMessage);
      await fetch("https://whatsapp-web-clone-eksp.onrender.com/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wa_id: selectedChat.wa_id,
          name: selectedChat.name,
          text,
        }),
      });
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  const handleBack = () => setSelectedChat(null);

  return (
    <div
      className={`container-fluid vh-100 overflow-hidden ${
        isMobile && selectedChat ? "mobile-chat-view" : ""
      }`}
    >
      <div className="row h-100 flex-nowrap">
        {/* Chat List */}
        <div
          className={`col-4 border-end p-0 d-flex flex-column ${
            isMobile && selectedChat ? "d-none" : ""
          }`}
        >
          <ChatList
            chats={chats}
            onSelectChat={handleSelectChat}
            selectedChat={selectedChat}
          />
        </div>

        {/* Chat Window */}
        <div
          className={`col-8 p-0 d-flex flex-column ${
            isMobile && !selectedChat ? "d-none" : isMobile ? "w-100" : ""
          }`}
        >
          <ChatWindow
            chat={selectedChat}
            onSendMessage={handleSendMessage}
            onBack={isMobile ? handleBack : null}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
