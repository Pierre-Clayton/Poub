import React from "react";

export default function Pricing() {
  return (
    <main className="pricing-page">
      <header className="pricing-hero">
        <h1>Pricing</h1>
        <p>
          Technology doesn’t just help you work faster—it helps you work
          smarter. Benefit from flexible plans that scale with you.
        </p>
      </header>

      <section className="pricing-tiers">
        <div className="tier">
          <h2>ProjectPath Basic</h2>
          <p className="price">$39 / mo</p>
          <ul>
            <li>Basic analytics</li>
            <li>5 projects</li>
            <li>Community support</li>
          </ul>
          <button>Get Started</button>
        </div>
        <div className="tier">
          <h2>ProjectPath Pro</h2>
          <p className="price">$10c / user / mo</p>
          <ul>
            <li>Advanced analytics</li>
            <li>Unlimited projects</li>
            <li>Email support</li>
          </ul>
          <button>Get Started</button>
        </div>
        <div className="tier">
          <h2>Enterprise</h2>
          <p className="price">$20k / year</p>
          <ul>
            <li>Custom solutions</li>
            <li>Dedicated support</li>
            <li>On-prem or cloud</li>
          </ul>
          <button>Contact Sales</button>
        </div>
      </section>
    </main>
  );
}
