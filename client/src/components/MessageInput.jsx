// client/src/components/MessageInput.js
import React, { useState } from "react";

const MessageInput = ({ onSendMessage }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText("");
    }
  };

  return (
    <div className="input-box">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="btn btn-success">
          Send
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
