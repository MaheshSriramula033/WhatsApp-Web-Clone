import React from "react";
import "../styles/MessageBubble.css";

const MessageBubble = ({ message }) => {
  const isSentByUser = message.type === "user";
  const bubbleClass = isSentByUser ? "sent" : "received";

  // Choose icon based on status
  let statusIcon = "✓";
  if (message.status === "delivered") statusIcon = "✓✓";
  if (message.status === "read") statusIcon = (
    <span style={{ color: "#0A7CFF" }}>✓✓</span> // blue for read
  );

  return (
    <div className={`message-bubble ${bubbleClass}`}>
      <div className="bubble-content">
        <div className="message-text">{message.text}</div>
        <div className="message-meta">
          {/*  time in nice format */}
          <span className="time">
            {new Date(message.timestamp).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </span>

          {/*Show status only for user messages */}
          {isSentByUser && <span className="status ms-2">{statusIcon}</span>}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
