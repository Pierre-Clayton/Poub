import React, { useState } from "react";
import { API_BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";

export default function FileUpload({ token }) {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("pdf");
  const [response, setResponse] = useState(null);
  const navigate = useNavigate();

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const endpoint = fileType === "pdf" ? "/parse-pdf" : "/parse-csv";

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      setResponse(data);
      // Après une upload réussi, naviguer vers la page de chat
      navigate("/webapp/chat");
    } catch (err) {
      console.error(err);
      setResponse({ error: String(err) });
    }
  }

  function handleSkip() {
    navigate("/webapp/chat");
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #f0f8ff, #e6f2ff)",
      padding: "2rem"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "600px",
        background: "#fff",
        padding: "2rem",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        textAlign: "center"
      }}>
        <h2 style={{ marginBottom: "1.5rem", color: "#3162ff" }}>
          Upload Your Documents
        </h2>
        <form onSubmit={handleUpload}>
          <div style={{ marginBottom: "1rem" }}>
            <select
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              style={{
                padding: "0.5em",
                width: "100%",
                fontSize: "1rem",
                marginBottom: "0.75em"
              }}
            >
              <option value="pdf">PDF</option>
              <option value="csv">CSV</option>
            </select>
            <input
              type="file"
              accept={fileType === "pdf" ? "application/pdf" : ".csv"}
              onChange={(e) => setFile(e.target.files[0])}
              style={{
                padding: "0.5em",
                width: "100%",
                fontSize: "1rem",
                marginBottom: "0.75em"
              }}
            />
          </div>
          <button type="submit" style={{
            padding: "0.75rem 1rem",
            width: "100%",
            background: "#3162ff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "1rem",
            marginBottom: "1rem"
          }}>
            Upload
          </button>
        </form>
        {response && (
          <div style={{
            marginTop: "1.5rem",
            background: "#f8f9fb",
            padding: "1rem",
            borderRadius: "8px",
            textAlign: "left"
          }}>
            <pre style={{ fontSize: "0.95rem" }}>
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
        <button onClick={handleSkip} style={{
          marginTop: "1rem",
          padding: "0.75rem 1rem",
          width: "100%",
          background: "#ccc",
          color: "#333",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "1rem"
        }}>
          Skip Upload
        </button>
      </div>
    </div>
  );
}
