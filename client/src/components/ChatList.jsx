import React from "react";
import "../styles/ChatList.css"

const ChatList = ({ chats, onSelectChat, selectedChat }) => {
  return (
    <div className="chat-list">
      <div className="p-3 fw-bold fs-5 border-bottom bg-light">Chats</div>
      <ul className="list-group list-group-flush">
        {chats.map((chat) => {
          const lastMessage =
            chat.messages && chat.messages.length > 0
              ? chat.messages[chat.messages.length - 1].text
              : "No messages yet";

          return (
            <li
              key={chat.wa_id}
              className={`list-group-item list-group-item-action ${
                selectedChat && selectedChat.wa_id === chat.wa_id ? "active" : ""
              }`}
              onClick={() => onSelectChat({ ...chat })} // ✅ FIX: no inline comment here
            >
              <div className="fw-semibold">{chat.name || "Unknown User"}</div>
              <div className="text-muted small">{lastMessage}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ChatList;
