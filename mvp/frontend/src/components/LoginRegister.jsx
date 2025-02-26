import React, { useState } from "react";
import { signIn, registerUser } from "../firebaseClient";

export default function LoginRegister({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [mode, setMode] = useState("login");
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    try {
      if (mode === "login") {
        await signIn(email, pass);
      } else {
        await registerUser(email, pass);
      }
      onLoginSuccess();
    } catch (err) {
      setError(err.message || String(err));
    }
  }

  return (
    <div className="container">
      <h2>{mode === "login" ? "Login" : "Register"}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          required 
        />
        <button type="submit">{mode === "login" ? "Login" : "Register"}</button>
      </form>
      <button onClick={() => setMode(mode === "login" ? "register" : "login")}>
        {mode === "login" ? "Need an account?" : "Already have an account?"}
      </button>
    </div>
  );
}
