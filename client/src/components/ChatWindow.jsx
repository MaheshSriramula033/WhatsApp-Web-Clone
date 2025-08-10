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

  // If no chat is selected, show a placeholder screen
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
    <div className="chat-window d-flex flex-column">
      <div className="chat-header p-2 border-bottom d-flex align-items-center">
        {onBack && (
          <button
            className="btn btn-sm btn-outline-secondary me-2"
            onClick={onBack}
          >
            ←
          </button>
        )}
        <div>
          <div className="fw-bold">{chat.name || "Unknown User"}</div>
          <div className="text-muted small">{chat.wa_id}</div>
        </div>
      </div>

      <div className="chat-messages flex-grow-1 overflow-auto p-3">
        {chat.messages.map((msg, index) => (
          <MessageBubble key={index} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chat-input d-flex p-2 border-top">
        <input
          type="text"
          className="form-control me-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button type="submit" className="btn btn-primary">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
