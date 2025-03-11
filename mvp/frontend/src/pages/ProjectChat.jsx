// mvp/frontend/src/pages/ProjectChat.jsx
import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

function Spinner() {
  return (
    <div style={{
      border: "4px solid #f3f3f3",
      borderTop: "4px solid #3162ff",
      borderRadius: "50%",
      width: "24px",
      height: "24px",
      animation: "spin 1s linear infinite"
    }} />
  );
}

export default function ProjectChat({ token }) {
  const { project_id } = useParams();
  const [chatLog, setChatLog] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE_URL}/projects/${project_id}/chat`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setChatLog(data.chat_history || []))
      .catch(console.error);
  }, [project_id, token]);

  const handleSend = async () => {
    if (!query.trim() || isLoading) return;
    const userMessage = { role: "user", content: query };
    setChatLog(old => [...old, { ...userMessage, timestamp: new Date().toISOString() }]);
    setIsLoading(true);
    const currentQuery = query;
    setQuery("");
    try {
      const res = await fetch(`${API_BASE_URL}/projects/${project_id}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: "user", content: currentQuery })
      });
      const data = await res.json();
      setChatLog(old => [...old, { role: "assistant", content: data.content || data.answer || "No response", timestamp: new Date().toISOString() }]);
    } catch (err) {
      console.error(err);
      setChatLog(old => [...old, { role: "assistant", content: "Error: " + err.message, timestamp: new Date().toISOString() }]);
    }
    setIsLoading(false);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "1rem" }}>Back to Project</button>
      <h1>Project Chat</h1>
      <div style={{
        border: "1px solid #ccc",
        borderRadius: "4px",
        padding: "1rem",
        height: "300px",
        overflowY: "auto",
        background: "#fff",
        marginBottom: "1rem"
      }}>
        {chatLog.map((msg, i) => (
          <div key={i} style={{
            marginBottom: "1rem",
            padding: "0.75rem",
            background: msg.role === "assistant" ? "#f8f9fb" : "#e6f2ff",
            borderRadius: "8px"
          }}>
            <strong style={{ textTransform: "capitalize" }}>
              {msg.role === "assistant" ? "ProjectPath LM" : "You"}
            :</strong>{" "}
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        ))}
        {isLoading && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1rem"
          }}>
            <strong>ProjectPath LM:</strong>
            <Spinner />
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <input
          type="text"
          placeholder="Type a message..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if(e.key === "Enter") handleSend(); }}
          disabled={isLoading}
          style={{ flex: 1, padding: "0.75rem", border: "1px solid #ccc", borderRadius: "4px" }}
        />
        <button onClick={handleSend} disabled={isLoading} style={{ padding: "0.75rem 1rem", background: "#3162ff", color: "#fff", border: "none", borderRadius: "4px" }}>
          Send
        </button>
      </div>
    </div>
  );
}
