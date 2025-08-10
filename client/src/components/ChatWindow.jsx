import React, { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

const ChatWindow = ({ chat, onSendMessage, onBack }) => {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSendMessage(message);
    setMessage("");
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat?.messages]);

  if (!chat) {
    return (
      <div className="chat-window d-flex flex-column justify-content-center align-items-center">
        <div className="no-chat">
          <h5>Please select a chat to view messages</h5>
          <p className="text-muted">Your conversation will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        {onBack && (
          <button className="back-button me-2" onClick={onBack}>
            ←
          </button>
        )}
        <div>
          <div className="fw-bold">{chat.name || "Unknown User"}</div>
          <div className="text-muted small">{chat.wa_id}</div>
        </div>
      </div>

      <div className="chat-messages">
        {chat.messages.map((msg, index) => (
          <MessageBubble key={index} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatWindow;
