// client/src/components/ChatLayout.js
import React, { useState, useEffect } from "react";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import axios from "axios";

const ChatLayout = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/chats");
        setChats(res.data);
      } catch (error) {
        console.error("Error fetching chats", error);
      }
    };
    fetchChats();
  }, []);

  return (
    <div className="chat-layout d-flex">
      <ChatList chats={chats} onSelectChat={setSelectedChat} />
      <ChatWindow wa_id={selectedChat} />
    </div>
  );
};

export default ChatLayout;
