import React from "react";

export default function AboutUs() {
  return (
    <main className="about-page">
      <header className="about-hero">
        <h1>Contacts & About Us</h1>
        <p>Who we are and what we stand for</p>
      </header>

      <section className="about-mission">
        <h2>Who we are</h2>
        <p>
          ProjectPath is a team of data scientists, engineers, and storytellers
          dedicated to empowering organizations with AI-driven project
          management tools.
        </p>
      </section>

      <section className="about-stats">
        <h2>ProjectPath in numbers</h2>
        <div className="stats-grid">
          <div>
            <h3>1830+</h3>
            <p>Projects completed</p>
          </div>
          <div>
            <h3>220</h3>
            <p>Team members</p>
          </div>
          <div>
            <h3>390</h3>
            <p>Partners worldwide</p>
          </div>
          <div>
            <h3>834+</h3>
            <p>Positive reviews</p>
          </div>
        </div>
      </section>

      <section className="about-customers">
        <h2>Our customers say</h2>
        <p>
          "ProjectPath helped our team stay organized and on track—now we can
          easily see progress and celebrate milestones!"
        </p>
      </section>
    </main>
  );
}
