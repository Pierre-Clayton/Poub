import React from "react";

export default function Footer() {
  return (
    <footer style={{
      background: "linear-gradient(135deg, #3162ff, #254eda)",
      color: "#fff",
      padding: "1.5rem",
      textAlign: "center"
    }}>
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "1.5rem",
        marginBottom: "1rem"
      }}>
        <div style={{ flex: "1 1 180px" }}>
          <h3 style={{ fontSize: "1.75rem", margin: "0" }}>6</h3>
          <p style={{ margin: "0.5rem 0", fontSize: "0.9rem" }}>Months since our launch</p>
        </div>
        <div style={{ flex: "1 1 180px" }}>
          <h3 style={{ fontSize: "1.75rem", margin: "0" }}>5</h3>
          <p style={{ margin: "0.5rem 0", fontSize: "0.9rem" }}>Team members</p>
        </div>
        <div style={{ flex: "1 1 180px" }}>
          <h3 style={{ fontSize: "1.75rem", margin: "0" }}>$5,000</h3>
          <p style={{ margin: "0.5rem 0", fontSize: "0.9rem" }}>Funding (in AWS Credit)</p>
        </div>
      </div>
      <div style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>
        <p>Empowering teams with AI-driven narrative project management. Follow us on{" "}
          <a 
            href="https://www.linkedin.com/company/projectpath-ai" 
            style={{ color: "#fff", textDecoration: "underline" }}
          >
            LinkedIn
          </a>. © {new Date().getFullYear()} ProjectPath, Inc. All rights reserved. </p>
      </div>
    </footer>
  );
}
