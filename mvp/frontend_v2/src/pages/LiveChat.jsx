import React, { useState } from "react";
import { API_BASE_URL } from "../config";

export default function LiveChat({ token }) {
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState("");

  const handleSend = async () => {
    if (!inputVal.trim()) return;
    // Example: could call your /chat or a different endpoint
    // For now, let's just mock the assistant response
    setMessages((prev) => [...prev, { role: "user", text: inputVal }]);
    setMessages((prev) => [...prev, { role: "assistant", text: "Hello from Live Chat!" }]);
    setInputVal("");
  };

  return (
    <main className="livechat-page">
      <h1>Live Chat</h1>
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-msg ${msg.role}`}>
            <strong>{msg.role}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Ask a question..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </main>
  );
}
