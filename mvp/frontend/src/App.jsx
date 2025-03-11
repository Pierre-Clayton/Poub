// mvp/frontend/src/App.jsx
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

// Import des pages
import MarketingHome from "./pages/MarketingHome";
import Login from "./pages/Login";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import ProjectChat from "./pages/ProjectChat";
import MBTIQuiz from "./pages/MBTIQuiz";

// Import des composants communs
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

function AppRoutes({ user, token, authInitialized }) {
  const location = useLocation();
  const inWebapp = location.pathname.startsWith("/webapp");

  function PrivateRoute({ children }) {
    if (!authInitialized) {
      return <div>Loading...</div>;
    }
    if (!user) {
      return <Navigate to="/webapp/login" />;
    }
    return children;
  }

  return (
    <>
      <NavBar inWebapp={inWebapp} />
      <Routes>
        {/* Page marketing accessible à tous */}
        <Route path="/" element={<MarketingHome />} />

        {/* Route de connexion */}
        <Route path="/webapp/login" element={<Login />} />

        {/* Routes de l'application protégées */}
        <Route
          path="/webapp/projects"
          element={
            <PrivateRoute>
              <Projects token={token} />
            </PrivateRoute>
          }
        />
        <Route
          path="/webapp/projects/:project_id"
          element={
            <PrivateRoute>
              <ProjectDetail token={token} />
            </PrivateRoute>
          }
        />
        <Route
          path="/webapp/projects/:project_id/chat"
          element={
            <PrivateRoute>
              <ProjectChat token={token} />
            </PrivateRoute>
          }
        />
        {/* Route pour accéder au test MBTI */}
        <Route
          path="/webapp/mbti"
          element={
            <PrivateRoute>
              <MBTIQuiz token={token} />
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
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setAuthInitialized(true);
      if (firebaseUser) {
        const t = await firebaseUser.getIdToken();
        setToken(t);
      } else {
        setToken("");
      }
    });
    return unsubscribe;
  }, []);

  return (
    <Router>
      <AppRoutes user={user} token={token} authInitialized={authInitialized} />
    </Router>
  );
}
