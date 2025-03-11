// mvp/frontend/src/pages/MBTIQuiz.jsx
import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseClient";

export default function MBTIQuiz({ token }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();
  const [uid, setUid] = useState(null);

  useEffect(() => {
    // Récupérer l'uid depuis Firebase Auth
    if (auth.currentUser) {
      setUid(auth.currentUser.uid);
    }
    fetch(`${API_BASE_URL}/mbti_quiz`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.questions) {
          setQuestions(data.questions);
          setAnswers(new Array(data.questions.length).fill(""));
        }
      })
      .catch(console.error);
  }, [token]);

  async function handleSubmit() {
    try {
      // Envoyer les réponses au quiz
      const res = await fetch(`${API_BASE_URL}/mbti_quiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ user_id: uid, answers })
      });
      const data = await res.json();
      setResult(data);
      // Stocker définitivement le résultat MBTI
      const personalityRes = await fetch(`${API_BASE_URL}/submit_personality`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: uid,
          personality_type: data.personality_type || "Undefined"
        })
      });
      const personalityData = await personalityRes.json();
      console.log("Personality stored:", personalityData);
      navigate("/webapp/projects");
    } catch (err) {
      console.error(err);
    }
  }

  function handleSkip() {
    navigate("/webapp/projects");
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #f0f8ff, #e6f2ff)",
      padding: "2rem"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "800px",
        background: "#fff",
        padding: "2rem",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ marginBottom: "1.5rem", color: "#3162ff", textAlign: "center"}}>MBTI Quiz</h2>
        {questions.length > 0 ? (
          <div>
            {questions.map((q, idx) => (
              <div key={q.question_id} style={{ marginBottom: "1.5rem" }}>
                <p style={{
                  fontSize: "1rem",
                  fontWeight: "bold",
                  marginBottom: "0.5rem"
                }}>{q.question_text}</p>
                <div style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "1rem"
                }}>
                  {q.options.map((option) => (
                    <label key={option} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "0.95rem"
                    }}>
                      <input
                        type="radio"
                        name={`q${idx}`}
                        value={option}
                        checked={answers[idx] === option}
                        onChange={() => {
                          const newAns = [...answers];
                          newAns[idx] = option;
                          setAnswers(newAns);
                        }}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <div style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              justifyContent: "center"
            }}>
              <button onClick={handleSubmit} style={{
                padding: "0.75rem 1rem",
                background: "#3162ff",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "1rem"
              }}>
                Submit Quiz
              </button>
              <button onClick={handleSkip} style={{
                padding: "0.75rem 1rem",
                background: "#ccc",
                color: "#333",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "1rem"
              }}>
                Skip Quiz
              </button>
            </div>
          </div>
        ) : (
          <p style={{ textAlign: "center", fontSize: "1rem" }}>Loading questions...</p>
        )}
        {result && (
          <div style={{
            marginTop: "1.5rem",
            background: "#f8f9fb",
            padding: "1.5rem",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
          }}>
            <pre style={{ fontSize: "0.95rem" }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
