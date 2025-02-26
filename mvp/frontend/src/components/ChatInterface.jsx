import React, { useState } from "react";

export default function ChatInterface({ token }) {
  const [query, setQuery] = useState("");
  const [chatLog, setChatLog] = useState([]); // local log

  async function handleSend() {
    if (!query.trim()) return;
    // call /chat
    try {
      const resp = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          query,
          top_k: 3,
          temperature: 0.7
        })
      });
      const data = await resp.json();

      setChatLog((old) => [
        ...old, 
        { role: "user", content: query }, 
        { role: "assistant", content: data.answer || data.error }
      ]);
      setQuery("");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="container">
      <h3>Chatbot</h3>
      <div style={{ border: "1px solid #ccc", padding: "10px", maxHeight: "200px", overflowY: "auto" }}>
        {chatLog.map((m, i) => (
          <div key={i} style={{ marginBottom: "0.5em" }}>
            <strong>{m.role}:</strong> {m.content}
          </div>
        ))}
      </div>
      <div>
        <input 
          type="text" 
          placeholder="Ask something..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if(e.key === 'Enter') handleSend() }}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
