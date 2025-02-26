import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, logout } from "./firebaseClient";

import LoginRegister from "./components/LoginRegister";
import NavBar from "./components/NavBar";
import FileUpload from "./components/FileUpload";
import QuizMBTI from "./components/QuizMBTI";
import ChatInterface from "./components/ChatInterface";

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [section, setSection] = useState("upload");

  useEffect(() => {
    // watch for auth changes
    onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const t = await firebaseUser.getIdToken();
        setToken(t);
      } else {
        setToken("");
      }
    });
  }, []);

  function handleLogout() {
    logout().then(() => {
      setUser(null);
      setToken("");
    });
  }

  if (!user) {
    return <LoginRegister onLoginSuccess={() => { /* triggers onAuthStateChanged */ }} />;
  }

  return (
    <div>
      <NavBar user={user} onSectionChange={setSection} onLogout={handleLogout} />
      {section === "upload" && <FileUpload token={token} />}
      {section === "quiz" && <QuizMBTI token={token} />}
      {section === "chat" && <ChatInterface token={token} />}
    </div>
  );
}
