import React, { useRef, useState } from "react";
import emailjs from "emailjs-com";

export default function MarketingHome() {
  return (
    <main style={{ fontFamily: "'Roboto', 'Helvetica Neue', Arial, sans-serif", color: "#333" }}>
      {/* HEADER */}
      <header
        id="header"
        className="home-header"
        style={{
          textAlign: "center",
          padding: "4rem 2rem",
          background: "linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), url('/assets/1022_768.png') no-repeat center center",
          backgroundSize: "cover",
          color: "#fff"
        }}
      >
        <h1 style={{
          fontSize: "4.5rem",
          marginBottom: "0.5rem",
          textShadow: "2px 2px 4px rgba(0,0,0,0.8)"
        }}>
          ProjectPath.ai
        </h1>
        <p style={{
          fontSize: "2rem",
          marginBottom: "1rem",
          textShadow: "2px 2px 4px rgba(0,0,0,0.8)"
        }}>
          Helping People with Projects
        </p>
        <p style={{
          maxWidth: "700px",
          margin: "0 auto 2rem",
          lineHeight: "1.6",
          fontSize: "1.25rem",
          textShadow: "1px 1px 3px rgba(0,0,0,0.8)"
        }}>
          We integrate AI-driven storytelling into project management to transform traditional workflows into intuitive, engaging, and structured narratives.
        </p>
        <button
          onClick={() => window.open("https://chat.projectpath.ai", "_blank")}
          style={{
            padding: "1rem 2rem",
            background: "#3162ff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "1rem"
          }}
        >
          Try ProjectPath
        </button>
      </header>

      {/* MISSION & VISION */}
      <section id="mission" style={{ padding: "2rem" }}>
        <h2 style={{ textAlign: "center", fontSize: "2.5rem", marginBottom: "1.5rem" }}>
          Our Mission & Vision
        </h2>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "2rem",
          justifyContent: "center",
          padding: "1.5rem",
          background: "linear-gradient(135deg, #f0f8ff, #e6f2ff)",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}>
          <div style={{ flex: "1 1 400px", padding: "1rem" }}>
            <h3 style={{ color: "#3162ff", marginBottom: "0.5rem" }}>Our Mission</h3>
            <p style={{ lineHeight: "1.6", fontSize: "1rem" }}>
              ProjectPath.ai helps people with projects by transforming traditional task management into an engaging narrative experience. We empower teams with AI-driven insights, ensuring every milestone is a moment of progress.
            </p>
          </div>
          <div style={{ flex: "1 1 400px", padding: "1rem" }}>
            <h3 style={{ color: "#3162ff", marginBottom: "0.5rem" }}>Our Vision</h3>
            <p style={{ lineHeight: "1.6", fontSize: "1rem" }}>
              We envision a world where project management is not only efficient but also inspiring. Imagine an “Adobe Narrator” for projects that seamlessly integrates with tools like Jira, Trello, and Adobe Creative Suite to create dynamic, story-based workflows.
            </p>
          </div>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section id="problem" style={{ padding: "2rem", background: "#f8f9fb" }}>
        <h2 style={{ textAlign: "center", fontSize: "2.5rem", marginBottom: "1.5rem" }}>The Problem</h2>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "2rem",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.5rem",
          background: "linear-gradient(135deg, #fff, #f8f8f8)",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}>
          <div style={{ flex: "1 1 400px", padding: "1rem", textAlign: "left" }}>
            <p style={{ lineHeight: "1.6", fontSize: "1rem" }}>
              Traditional project management tools focus solely on tasks and deadlines, often neglecting the human element and the narrative behind every project.
            </p>
            <p style={{ lineHeight: "1.6", fontSize: "1rem", marginTop: "1rem" }}>
              This siloed approach leads to fragmented communication, delayed decision-making, and critical updates lost in endless emails and spreadsheets. Studies show that up to <strong>70% of projects fail</strong> due to poor collaboration, outdated tools, and the lack of real-time insights.
            </p>
            <p style={{ lineHeight: "1.6", fontSize: "1rem", marginTop: "1rem" }}>
              In today’s fast-paced world, teams require more than just a task list—they need clarity, engagement, and an adaptive workflow that tells the full story of a project. Without it, projects risk stagnation and failure.
            </p>
            <p style={{ lineHeight: "1.6", fontSize: "1rem", marginTop: "1rem" }}>
              At ProjectPath.ai, we view these challenges as opportunities to revolutionize project management by reintroducing narrative, context, and real-time insights to empower every team member.
            </p>
          </div>
          <div style={{ flex: "1 1 400px", padding: "1rem", textAlign: "center" }}>
            <img
              src="/assets/transforming_projects.png"
              alt="Challenges in project management"
              style={{
                width: "80%",
                maxWidth: "400px",
                height: "auto",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
              }}
            />
          </div>
        </div>
      </section>

      {/* OUR SOLUTION */}
      <section id="solution" style={{ padding: "2rem", background: "#fff" }}>
        <h2 style={{ textAlign: "center", fontSize: "2.5rem", marginBottom: "1.5rem" }}>Our Solution</h2>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: "2rem",
          padding: "1rem",
          background: "linear-gradient(135deg, #f0f8ff, #e6f2ff)",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}>
          <div style={{ flex: "1 1 400px", padding: "1rem" }}>
            <p style={{ lineHeight: "1.8", fontSize: "1rem" }}>
              ProjectPath.ai transforms your project management experience by integrating AI-driven narrative intelligence. We convert traditional, monotonous task lists into dynamic, engaging stories that empower your team. Our solution proactively identifies risks, fosters seamless collaboration, and adapts workflows to fit your unique needs.
            </p>
            <ul style={{ marginTop: "1rem", lineHeight: "1.8", fontSize: "1rem", paddingLeft: "1.5rem" }}>
              <li><strong>Proactive Risk Management:</strong> Identify and mitigate potential issues before they escalate.</li>
              <li><strong>Unified Collaboration:</strong> Centralize communication so every team member stays in sync.</li>
              <li><strong>Dynamic Workflow Adaptation:</strong> Modify strategies in real time with actionable insights.</li>
              <li><strong>Story-Driven Data Insights:</strong> Transform raw data into compelling narratives that drive decisions.</li>
            </ul>
          </div>
          <div style={{ flex: "1 1 400px", padding: "1rem", textAlign: "center" }}>
            <img
              src="/assets/ai_optimization.png"
              alt="AI-Powered Optimization"
              style={{
                width: "90%",
                maxWidth: "400px",
                height: "auto",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
              }}
            />
          </div>
        </div>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "2rem",
          marginTop: "2rem",
          justifyContent: "center"
        }}>
          <div style={{
            flex: "1 1 400px",
            padding: "1rem",
            background: "#fff",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            textAlign: "left"
          }}>
            <img
              src="/assets/dynamic_milestones.png"
              alt="Dynamic Milestone Tracking"
              style={{ width: "100%", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
            />
            <h3 style={{ color: "#3162ff", marginTop: "1rem", fontSize: "1.5rem" }}>Milestone Tracking</h3>
            <p style={{ lineHeight: "1.6", fontSize: "1rem" }}>
              Our platform provides real-time tracking of project milestones with visually engaging dashboards. Stay informed with proactive alerts and detailed updates that ensure every critical moment is celebrated.
            </p>
          </div>
          <div style={{
            flex: "1 1 400px",
            padding: "1rem",
            background: "#fff",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            textAlign: "left"
          }}>
            <img
              src="/assets/adaptive_planning.png"
              alt="Adaptive Planning"
              style={{ width: "100%", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
            />
            <h3 style={{ color: "#3162ff", marginTop: "1rem", fontSize: "1.5rem" }}>Adaptive Planning</h3>
            <p style={{ lineHeight: "1.6", fontSize: "1rem" }}>
              Leverage AI insights to adapt workflows on the fly. Our adaptive planning tool helps your team pivot quickly to new challenges, ensuring alignment with evolving project goals and maximizing overall efficiency.
            </p>
          </div>
        </div>
      </section>

      {/* OUR TECHNOLOGY */}
      <section id="technology" style={{ padding: "2rem", background: "#f8f9fb" }}>
        <h2 style={{ textAlign: "center", fontSize: "2.5rem", marginBottom: "1rem" }}>
          Our Technology
        </h2>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem"
        }}>
          <div style={{ width: "100%", textAlign: "center", padding: "1rem" }}>
            <img
              src="/assets/647_426.png"
              alt="Technology Scheme"
              style={{
                width: "90%",
                maxWidth: "1000px",
                height: "auto",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
              }}
            />
          </div>
          <div style={{ width: "100%", maxWidth: "900px", padding: "1rem", textAlign: "left" }}>
            <p style={{ lineHeight: "1.6", fontSize: "1rem" }}>
              At the heart of ProjectPath.ai is a state-of-the-art narrative-based AI model. Our platform utilizes an adaptive neural network that learns from user interactions and improves project workflows with contextual recommendations. With industry-specific customization, our solution is designed to integrate seamlessly with popular tools like Jira, Trello, and Adobe Creative Suite.
            </p>
          </div>
        </div>
      </section>

      {/* BUSINESS MODEL */}
      <section id="business" style={{ padding: "2rem" }}>
        <h2 style={{ textAlign: "center", fontSize: "2.5rem", marginBottom: "1.5rem" }}>
          Business Model & Market Opportunity
        </h2>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center", lineHeight: "1.6", fontSize: "1rem" }}>
          <p style={{ marginBottom: "1.5rem", textAlign: "left" }}>
            Our business model is built around a subscription-based pricing structure designed to suit a range of users—from individuals and startups to large enterprises.
          </p>
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "2rem",
            justifyContent: "center"
          }}>
            {/* Box 1: Monthly Subscriptions */}
            <div style={{
              flex: "1 1 220px",
              padding: "1.5rem",
              background: "#fff",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}>
              <h3 style={{ color: "#3162ff", marginBottom: "0.5rem" }}>Monthly Subscriptions</h3>
              <p style={{ fontSize: "0.95rem" }}>Ideal for individuals and small teams.</p>
              <p style={{ fontWeight: "bold", fontSize: "1rem", margin: "0.5rem 0" }}>$39/month</p>
              <ul style={{ textAlign: "left", fontSize: "0.95rem", paddingLeft: "1.5rem", lineHeight: "1.6" }}>
                <li>Core project management features</li>
                <li>Email support</li>
                <li>Regular updates</li>
              </ul>
            </div>

            {/* Box 2: Enterprise Licensing */}
            <div style={{
              flex: "1 1 220px",
              padding: "1.5rem",
              background: "#fff",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}>
              <h3 style={{ color: "#3162ff", marginBottom: "0.5rem" }}>Enterprise Licensing</h3>
              <p style={{ fontSize: "0.95rem" }}>Custom solutions for large organizations.</p>
              <p style={{ fontWeight: "bold", fontSize: "1rem", margin: "0.5rem 0" }}>$20,000+/year</p>
              <ul style={{ textAlign: "left", fontSize: "0.95rem", paddingLeft: "1.5rem", lineHeight: "1.6" }}>
                <li>Tailored integrations</li>
                <li>Dedicated account management</li>
                <li>Custom SLAs</li>
              </ul>
            </div>

            {/* Box 3: Premium Support Add-ons */}
            <div style={{
              flex: "1 1 220px",
              padding: "1.5rem",
              background: "#fff",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}>
              <h3 style={{ color: "#3162ff", marginBottom: "0.5rem" }}>Premium Support Add-ons</h3>
              <p style={{ fontSize: "0.95rem" }}>Enhanced support and service.</p>
              <p style={{ fontWeight: "bold", fontSize: "1rem", margin: "0.5rem 0" }}>$5,000/month</p>
              <ul style={{ textAlign: "left", fontSize: "0.95rem", paddingLeft: "1.5rem", lineHeight: "1.6" }}>
                <li>24/7 support</li>
                <li>Priority response</li>
                <li>Extended SLAs</li>
              </ul>
            </div>

            {/* Box 4: Additional Solutions */}
            <div style={{
              flex: "1 1 220px",
              padding: "1.5rem",
              background: "#fff",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}>
              <h3 style={{ color: "#3162ff", marginBottom: "0.5rem" }}>Additional Solutions</h3>
              <p style={{ fontSize: "0.95rem" }}>Complementary products &amp; services.</p>
              <p style={{ fontWeight: "bold", fontSize: "1rem", margin: "0.5rem 0" }}>Varies</p>
              <ul style={{ textAlign: "left", fontSize: "0.95rem", paddingLeft: "1.5rem", lineHeight: "1.6" }}>
                <li>Onboarding &amp; Training: $2,000 one-time</li>
                <li>Custom Integrations: $3,000+</li>
                <li>Certification Programs: $500 each</li>
              </ul>
            </div>
          </div>
          <p style={{ marginTop: "1.5rem", fontSize: "1rem", textAlign: "left" }}>
            With a Total Addressable Market in the billions and growing demand for AI-powered productivity tools, ProjectPath.ai is uniquely positioned to capture significant market share.
          </p>
        </div>
      </section>

      {/* GO-TO-MARKET STRATEGY */}
      <section style={{ padding: "2rem", background: "#e0e0e0" }}>
        <h2 style={{ textAlign: "center", fontSize: "2.5rem", marginBottom: "1rem" }}>
          Go-to-Market Strategy
        </h2>
        <div style={{ maxWidth: "900px", margin: "0 auto", lineHeight: "1.6", fontSize: "1rem" }}>
          <p>
            Our strategy is focused on a phased approach:
          </p>
          <ul style={{ marginLeft: "1.5rem", marginTop: "1rem" }}>
            <li><strong>Phase 1:</strong> Engage early adopters and run pilot programs to refine our platform.</li>
            <li><strong>Phase 2:</strong> Scale through strategic partnerships, inbound marketing, and targeted advertising.</li>
            <li><strong>Phase 3:</strong> Expand enterprise adoption with advanced integrations and a dedicated sales channel.</li>
          </ul>
          <p style={{ marginTop: "1rem" }}>
            We also invest in SEO, content marketing, webinars, and industry events to build a strong brand presence and foster community engagement.
          </p>
        </div>
      </section>

      {/* FINANCIAL ROADMAP (IMAGE) */}
      <section style={{ padding: "2rem", background: "#f8f9fb" }}>
        <h2 style={{ textAlign: "center", fontSize: "2.5rem", marginBottom: "1rem" }}>Financial Roadmap</h2>
        <div style={{ textAlign: "center" }}>
          <img
            src="/assets/financial_roadmap.png"
            alt="Financial Roadmap"
            style={{ maxWidth: "90%", height: "auto", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
          />
        </div>
        <p style={{ maxWidth: "900px", margin: "1rem auto", lineHeight: "1.6", fontSize: "1rem", textAlign: "left" }}>
          Our financial roadmap outlines our journey toward sustainable growth and profitability, highlighting key milestones from early adoption to international expansion.
        </p>
      </section>

      {/* TECH ROADMAP (IMAGE) */}
      <section style={{ padding: "2rem" }}>
        <h2 style={{ textAlign: "center", fontSize: "2.5rem", marginBottom: "1rem" }}>Tech Roadmap</h2>
        <div style={{ textAlign: "center" }}>
          <img
            src="/assets/tech_roadmap.png"
            alt="Tech Roadmap"
            style={{ maxWidth: "90%", height: "auto", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
          />
        </div>
        <p style={{ maxWidth: "900px", margin: "1rem auto", lineHeight: "1.6", fontSize: "1rem", textAlign: "left" }}>
          Our tech roadmap illustrates our commitment to continuous innovation, from initial CI/CD integration to full commercial rollout and AI-driven feature enhancements.
        </p>
      </section>

      {/* TEAM SECTION */}
      <section id="team" style={{ padding: "2rem", background: "#f8f9fb" }}>
        <h2 style={{ textAlign: "center", fontSize: "2.5rem", marginBottom: "1rem" }}>
          Meet Our Innovators
        </h2>
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", justifyContent: "center" }}>
          <div style={{ flex: "1 1 200px", padding: "1rem", textAlign: "center" }}>
            <img
              src="/assets/kevin.png"
              alt="Kevin Vaughn"
              style={{ width: "150px", height: "150px", borderRadius: "50%" }}
            />
            <h3 style={{ color: "#3162ff" }}>KEVIN VAUGHN</h3>
            <p style={{ lineHeight: "1.6", fontSize: "1rem" }}>
              Founder &amp; CEO<br />
              A graduate of Columbia University's School of the Arts and former Fulbright Scholar, Kevin is a decorated poet and translator who reimagined project management as narrative art.
            </p>
          </div>
          <div style={{ flex: "1 1 200px", padding: "1rem", textAlign: "center" }}>
            <img
              src="/assets/pierre.png"
              alt="Pierre Clayton"
              style={{ width: "150px", height: "150px", borderRadius: "50%" }}
            />
            <h3 style={{ color: "#3162ff" }}>PIERRE CLAYTON</h3>
            <p style={{ lineHeight: "1.6", fontSize: "1rem" }}>
              Co-Founder &amp; COO<br />
              A rising data scientist from ENSAE, Pierre brings technical expertise and innovative insights to drive our AI solutions.
            </p>
          </div>
          <div style={{ flex: "1 1 200px", padding: "1rem", textAlign: "center" }}>
            <img
              src="/assets/ross.png"
              alt="Ross Marshall"
              style={{ width: "150px", height: "150px", borderRadius: "50%" }}
            />
            <h3 style={{ color: "#3162ff" }}>ROSS MARSHALL</h3>
            <p style={{ lineHeight: "1.6", fontSize: "1rem" }}>
            Board Chair &amp; CFO <br />

 
A Harvard Business School graduate, Ross leverages his extensive experience to drive growth, optimize financial operations, and enhance organizational impact.
            </p>
          </div>
          <div style={{ flex: "1 1 200px", padding: "1rem", textAlign: "center" }}>
            <img
              src="/assets/wendy.png"
              alt="Wendy Pagano"
              style={{ width: "150px", height: "150px", borderRadius: "50%" }}
            />
            <h3 style={{ color: "#3162ff" }}>WENDY PAGANO</h3>
            <p style={{ lineHeight: "1.6", fontSize: "1rem" }}>
              Archival Engineer<br />
              With her background from Columbia and an MBA from UNC at Pembroke, Wendy transforms HR into a data-driven, innovative field.
            </p>
          </div>
          <div style={{ flex: "1 1 200px", padding: "1rem", textAlign: "center" }}>
            <img
              src="/assets/elvis.png"
              alt="Elvis Bando"
              style={{ width: "150px", height: "150px", borderRadius: "50%" }}
            />
            <h3 style={{ color: "#3162ff" }}>ELVIS BANDO</h3>
            <p style={{ lineHeight: "1.6", fontSize: "1rem" }}>
              Full-Stack Dev &amp; AWS Architect<br />
              A graduate of Kenyatta University, Elvis is an experienced entrepreneur specializing in MLOps and advanced AWS integrations.
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <ContactSection/>
    </main>
  );
}

function ContactSection() {
    const form = useRef();
    const [messageSent, setMessageSent] = useState(false);
    const [loading, setLoading] = useState(false);
  
    const sendEmail = (e) => {
      e.preventDefault();
      setLoading(true);
  
      emailjs
        .sendForm(
          "service_61i41xg",   // Remplacez par votre service ID EmailJS
          "template_gjx7hse", // Remplacez par votre template ID EmailJS
          form.current,
          "i7A7Qggcvld0R_Soq"  // Remplacez par votre clé publique EmailJS
        )
        .then(
          (result) => {
            console.log(result.text);
            setMessageSent(true);
            setLoading(false);
            form.current.reset();
          },
          (error) => {
            console.log(error.text);
            setLoading(false);
          }
        );
    };
  
    return (
      <section id="contact" style={{ padding: "2rem", background: "#e0e0e0" }}>
        <h2 style={{ textAlign: "center", fontSize: "2.5rem", marginBottom: "1.5rem" }}>
          Get in Touch
        </h2>
        <form
          ref={form}
          onSubmit={sendEmail}
          style={{
            maxWidth: "500px",
            margin: "0 auto",
            background: "#fff",
            padding: "1.5rem",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
          }}
        >
          {/* Nom de l'utilisateur */}
          <input
            type="text"
            name="user_name"
            placeholder="Name *"
            required
            style={{ marginBottom: "0.75em", padding: "0.5em", width: "100%" }}
          />
  
          {/* Adresse email de l'utilisateur (reply_to) */}
          <input
            type="email"
            name="reply_to"
            placeholder="Email address *"
            required
            style={{ marginBottom: "0.75em", padding: "0.5em", width: "100%" }}
          />
  
          {/* Numéro de téléphone */}
          <input
            type="tel"
            name="user_phone"
            placeholder="Phone number *"
            required
            style={{ marginBottom: "0.75em", padding: "0.5em", width: "100%" }}
          />
  
          {/* Message de l'utilisateur */}
          <textarea
            name="message"
            placeholder="Message *"
            required
            style={{ marginBottom: "0.75em", padding: "0.5em", width: "100%", minHeight: "120px" }}
          ></textarea>
  
          <button
            type="submit"
            style={{
              marginTop: "1em",
              padding: "0.75em",
              width: "100%",
              background: "#3162ff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
  
        {messageSent && (
          <p style={{ textAlign: "center", marginTop: "1rem", color: "#3162ff" }}>
            Thank you! Your message has been sent.
          </p>
        )}
  
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <p>kevin.vaughn@projectpath.ai</p>
          <p>Paris, IDF FR</p>
        </div>
      </section>
    );
  }