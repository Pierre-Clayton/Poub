import React, { useState } from "react";
import { API_BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { logout } from "../firebaseClient";
import ReactMarkdown from "react-markdown";

// Assurez-vous d'ajouter cette règle CSS globale dans votre fichier CSS :
// @keyframes spin {
//   from { transform: rotate(0deg); }
//   to { transform: rotate(360deg); }
// }

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

export default function Chat({ token }) {
  const [query, setQuery] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSend() {
    if (!query.trim() || isLoading) return;
    // Ajout immédiat du message utilisateur
    const userMessage = { role: "user", content: query };
    setChatLog(old => [...old, userMessage]);
    setIsLoading(true);
    const currentQuery = query;
    setQuery("");

    try {
      const resp = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          query: currentQuery,
          top_k: 3,
          temperature: 0.7
        })
      });
      const data = await resp.json();
      const assistantMessage = {
        role: "assistant",
        content: data.answer || data.error
      };
      setChatLog(old => [...old, assistantMessage]);
    } catch (err) {
      console.error(err);
      setChatLog(old => [...old, { role: "assistant", content: "Error: " + err.message }]);
    }
    setIsLoading(false);
  }

  async function handleLogout() {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Roboto', 'Helvetica Neue', Arial, sans-serif",
      color: "#333",
      background: "linear-gradient(135deg, #f0f8ff, #e6f2ff)",
      padding: "1rem"
    }}>
      {/* Header épuré */}
      <header style={{
        padding: "1rem",
        textAlign: "center",
        borderBottom: "1px solid #ccc",
        marginBottom: "1rem"
      }}>
        <h2 style={{ margin: 0, fontSize: "2rem", color: "#3162ff" }}>Chat</h2>
        <button onClick={handleLogout} style={{
          position: "absolute",
          right: "1rem",
          top: "1rem",
          padding: "0.5rem 1rem",
          background: "#3162ff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}>
          Logout
        </button>
      </header>

      {/* Zone de chat à hauteur fixe */}
      <div style={{
        flex: "1",
        maxHeight: "76vh",
        padding: "1rem 2rem",
        overflowY: "auto",
        marginBottom: "1rem",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}>
        {chatLog.map((msg, i) => (
          <div key={i} style={{
            marginBottom: "1rem",
            padding: "0.75rem",
            background: msg.role === "assistant" ? "#f8f9fb" : "#e6f2ff",
            borderRadius: "8px"
          }}>
            <strong style={{ textTransform: "capitalize" }}>
              {msg.role === "assistant" ? "ProjectPath LM" : "You"}:
            </strong>{" "}
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
            <strong style={{ textTransform: "capitalize" }}>ProjectPath LM:</strong>
            <Spinner />
          </div>
        )}
      </div>

      {/* Zone d'envoi */}
      <div style={{
        padding: "1rem 2rem",
        borderTop: "1px solid #ccc",
        display: "flex",
        gap: "1rem"
      }}>
        <input
          type="text"
          placeholder="Ask something..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          disabled={isLoading}
          style={{
            flex: "1",
            padding: "0.75rem",
            fontSize: "1rem",
            borderRadius: "4px",
            border: "1px solid #ccc"
          }}
        />
        <button onClick={handleSend} disabled={isLoading} style={{
          padding: "0.75rem 1rem",
          background: "#3162ff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: isLoading ? "not-allowed" : "pointer",
          fontSize: "1rem"
        }}>
          Send
        </button>
      </div>
    </div>
  );
}
