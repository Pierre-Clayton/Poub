// mvp/frontend/src/App.jsx

import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { Auth } from "aws-amplify";
import "./awsAmplify";  // Import de la configuration Amplify

import MarketingHome from "./pages/MarketingHome";
import Login from "./pages/Login";
import MBTIQuiz from "./pages/MBTIQuiz";
import FileUpload from "./pages/FileUpload";
import Chat from "./pages/Chat";

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

function AppRoutes({ user, token }) {
  const isInWebapp = window.location.pathname.startsWith("/webapp");

  return (
    <>
      <NavBar inWebapp={isInWebapp} />
      <Routes>
        <Route path="/" element={<MarketingHome />} />
        <Route path="/webapp/login" element={<Login />} />
        <Route path="/webapp/mbti" element={user ? <MBTIQuiz token={token} /> : <Navigate to="/webapp/login" />} />
        <Route path="/webapp/upload" element={user ? <FileUpload token={token} /> : <Navigate to="/webapp/login" />} />
        <Route path="/webapp/chat" element={user ? <Chat token={token} /> : <Navigate to="/webapp/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((currentUser) => {
        setUser(currentUser);
        return Auth.currentSession();
      })
      .then((session) => {
        setToken(session.getIdToken().getJwtToken());
      })
      .catch(() => {
        setUser(null);
        setToken("");
      });
  }, []);

  return (
    <Router>
      <AppRoutes user={user} token={token} />
    </Router>
  );
}
