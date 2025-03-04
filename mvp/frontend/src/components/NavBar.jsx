import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function NavBar({ inWebapp }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Vérifie si la route contient "/webapp"
  const isInWebapp = location.pathname.includes("/webapp");

  const handleTryProjectPath = () => {
    navigate("/webapp/login");
  };

  const handleLeaveWebApp = () => {
    navigate("/");
  };

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem 2rem",
      backgroundColor: "#fff",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      position: "fixed",
      width: "100%",
      top: 0,
      zIndex: 1000
    }}>
      {/* Logo */}
      <div className="nav-left">
        <Link to="/" style={{ fontSize: "1.75rem", fontWeight: "bold", color: "#3162ff" }}>
          ProjectPath.ai
        </Link>
      </div>

      {/* Navigation Links 
          On n'affiche PAS les liens si on est dans la WebApp */}
      {!isInWebapp && (
        <div className="nav-center">
          <ul style={{
            display: "flex",
            listStyle: "none",
            margin: 0,
            padding: 0,
            gap: "1.5rem"
          }}>
            <li><a href="#header" style={{ textDecoration: "none", color: "#333" }}>Home</a></li>
            <li><a href="#mission" style={{ textDecoration: "none", color: "#333" }}>Mission</a></li>
            <li><a href="#problem" style={{ textDecoration: "none", color: "#333" }}>Problem</a></li>
            <li><a href="#solution" style={{ textDecoration: "none", color: "#333" }}>Solution</a></li>
            <li><a href="#technology" style={{ textDecoration: "none", color: "#333" }}>Technology</a></li>
            <li><a href="#business" style={{ textDecoration: "none", color: "#333" }}>Business</a></li>
            <li><a href="#team" style={{ textDecoration: "none", color: "#333" }}>Team</a></li>
            <li><a href="#contact" style={{ textDecoration: "none", color: "#333" }}>Contact</a></li>
          </ul>
        </div>
      )}

      {/* Action Button */}
      <div className="nav-right">
        {inWebapp ? (
          <button onClick={handleLeaveWebApp} style={{
            padding: "0.5rem 1rem",
            background: "#3162ff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}>
            Leave WebApp &amp; Go Home
          </button>
        ) : (
          <button onClick={handleTryProjectPath} style={{
            padding: "0.5rem 1rem",
            background: "#3162ff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}>
            Try ProjectPath
          </button>
        )}
      </div>
    </nav>
  );
}
