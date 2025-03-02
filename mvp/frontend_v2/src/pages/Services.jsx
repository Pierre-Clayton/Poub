import React from "react";
import { API_BASE_URL } from "../config";

export default function Services({ token }) {
  return (
    <main className="services-page">
      <header className="services-hero">
        <h1>Services</h1>
        <p>
          Discover how ProjectPath can transform your workflow with advanced
          analytics, machine learning, and seamless integrations.
        </p>
      </header>

      <section className="services-list">
        <div className="service-item">
          <h2>Machine Learning</h2>
          <p>Predict trends and optimize decisions in real time.</p>
        </div>
        <div className="service-item">
          <h2>Dynamic Milestone Tracking</h2>
          <p>Stay ahead with real-time updates for every project milestone.</p>
        </div>
        <div className="service-item">
          <h2>Adaptive Planning</h2>
          <p>Plan projects flexibly to meet evolving needs.</p>
        </div>
        <div className="service-item">
          <h2>Seamless Collaboration</h2>
          <p>Empower teams with integrated chat, file sharing, and analytics.</p>
        </div>
      </section>
    </main>
  );
}
