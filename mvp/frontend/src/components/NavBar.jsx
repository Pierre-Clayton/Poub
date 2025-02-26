import React from "react";

export default function NavBar({ user, onSectionChange, onLogout }) {
  if (!user) return null;

  return (
    <nav>
      <button onClick={() => onSectionChange("upload")}>Upload Docs</button>
      <button onClick={() => onSectionChange("quiz")}>MBTI Quiz</button>
      <button onClick={() => onSectionChange("chat")}>Chat</button>
      <button onClick={onLogout}>Logout</button>
    </nav>
  );
}
