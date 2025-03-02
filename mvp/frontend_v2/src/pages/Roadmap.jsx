import React from "react";

export default function Roadmap() {
  return (
    <main className="roadmap-page">
      <header className="roadmap-hero">
        <h1>Roadmap</h1>
        <p>Here’s how data visualization evolves at ProjectPath</p>
      </header>

      <section className="roadmap-section">
        <h2>What is data visualization?</h2>
        <p>
          Data visualization is the graphical representation of information and
          data. By using visual elements like charts, graphs, and maps, data
          visualization tools provide an accessible way to see and understand
          trends, outliers, and patterns in data.
        </p>
      </section>

      <section className="roadmap-section">
        <h2>Types of data visualization</h2>
        <ul>
          <li>Bar charts</li>
          <li>Line graphs</li>
          <li>Scatter plots</li>
          <li>Heat maps</li>
        </ul>
      </section>

      <section className="roadmap-section">
        <h2>Data visualization practices</h2>
        <p>
          In the future, ProjectPath aims to incorporate more interactive
          dashboards, real-time streaming data, and advanced predictive
          visualizations.
        </p>
      </section>
    </main>
  );
}
