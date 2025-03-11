import React, { useState } from "react";
import { signIn, registerUser } from "../firebaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      if (mode === "login") {
        await signIn(email, pass);
      } else {
        await registerUser(email, pass);
      }
      // Redirige vers la liste des projets une fois connecté
      navigate("/webapp/projects");
    } catch (err) {
      setError(err.message || "Authentication error");
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #f0f8ff, #e6f2ff)"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "500px",
        background: "#fff",
        padding: "2rem",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        textAlign: "center"
      }}>
        <h2 style={{ marginBottom: "1.5rem", color: "#3162ff" }}>
          {mode === "login" ? "Login" : "Register"}
        </h2>
        {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ marginBottom: "0.75em", padding: "0.5em", width: "100%", fontSize: "1rem" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
            style={{ marginBottom: "0.75em", padding: "0.5em", width: "100%", fontSize: "1rem" }}
          />
          <button type="submit" style={{
            padding: "0.75em",
            width: "100%",
            background: "#3162ff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            fontSize: "1rem",
            cursor: "pointer",
            marginBottom: "1rem"
          }}>
            {mode === "login" ? "Login" : "Register"}
          </button>
        </form>
        <button
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          style={{
            padding: "0.5em 1em",
            background: "transparent",
            border: "none",
            color: "#3162ff",
            textDecoration: "underline",
            cursor: "pointer"
          }}
        >
          {mode === "login"
            ? "Need an account? Register"
            : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}
