import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseClient";

import MarketingHome from "./pages/MarketingHome";
import Login from "./pages/Login";
import MBTIQuiz from "./pages/MBTIQuiz";
import FileUpload from "./pages/FileUpload";
import Chat from "./pages/Chat";

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

function AppRoutes({ user, token }) {
  const location = useLocation();
  const navigate = useNavigate();
  const inWebapp = location.pathname.startsWith("/webapp");

  // Protected route wrapper for WebApp flow pages.
  function PrivateRoute({ children }) {
    if (!user) {
      return <Navigate to="/webapp/login" />;
    }
    return children;
  }

  return (
    <>
      <NavBar inWebapp={inWebapp} />
      <Routes>
        {/* Marketing homepage */}
        <Route path="/" element={<MarketingHome />} />

        {/* WebApp flow */}
        <Route path="/webapp/login" element={<Login />} />
        <Route
          path="/webapp/mbti"
          element={
            <PrivateRoute>
              <MBTIQuiz token={token} />
            </PrivateRoute>
          }
        />
        <Route
          path="/webapp/upload"
          element={
            <PrivateRoute>
              <FileUpload token={token} />
            </PrivateRoute>
          }
        />
        <Route
          path="/webapp/chat"
          element={
            <PrivateRoute>
              <Chat token={token} />
            </PrivateRoute>
          }
        />

        {/* Fallback */}
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

  return (
    <Router>
      <AppRoutes user={user} token={token} />
    </Router>
  );
}
