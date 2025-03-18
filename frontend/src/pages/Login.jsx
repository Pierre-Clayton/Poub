import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function handleLogin() {
    try {
      await Auth.federatedSignIn(); // Opens Cognito Hosted UI
      navigate("/webapp/mbti");  
    } catch (err) {
      setError(err.message || "Authentication failed.");
    }
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div style={{ textAlign: "center", padding: "2rem", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", background: "#fff" }}>
        <h2>Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button onClick={handleLogin} style={{ padding: "1rem", background: "#3162ff", color: "#fff", border: "none", borderRadius: "4px" }}>
          Sign in with AWS Cognito
        </button>
      </div>
    </div>
  );
}
