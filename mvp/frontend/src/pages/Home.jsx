import React from "react";
import NewsletterForm from "../components/NewsletterForm";

export default function Home() {
  return (
    <main>
      <section className="home-hero">
        <div className="hero-text">
          <h1>Helping People with Projects</h1>
          <p>
            ProjectPath is a simple, powerful visual model to quickly see your
            projects, your team, and your progress. Let data tell the story.
          </p>
          <button>Get Started</button>
        </div>
        <div className="hero-image">
          <img src="/assets/hero_illustration.png" alt="Hero" />
        </div>
      </section>

      <section>
        <h2>Why ProjectPath?</h2>
        <p>
          We combine advanced analytics and user-friendly design to give you a
          complete overview of your work, all in one place.
        </p>
      </section>

      <section>
        <h2>Subscribe to our newsletter</h2>
        <NewsletterForm />
      </section>
    </main>
  );
}
