import React, { useState, useEffect } from "react";

export default function QuizMBTI({ token }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    // fetch questions
    fetch("http://127.0.0.1:8000/mbti_quiz", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(r => r.json())
      .then(data => {
        if (data.questions) {
          setQuestions(data.questions);
          setAnswers(new Array(data.questions.length).fill(""));
        }
      })
      .catch(console.error);
  }, [token]);

  function handleChangeAnswer(idx, val) {
    const newAnswers = [...answers];
    newAnswers[idx] = val;
    setAnswers(newAnswers);
  }

  async function handleSubmit() {
    const userIdResp = await fetch("http://127.0.0.1:8000/mbti_quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        user_id: "some_user", // or you can store your user’s actual UID from the token
        answers
      })
    });

    const data = await userIdResp.json();
    setResult(data);
  }

  return (
    <div className="container">
      <h3>MBTI Quiz</h3>
      {questions.map((q, idx) => (
        <div key={q.question_id} style={{ marginBottom: "0.75em" }}>
          <strong>{q.question_text}</strong>
          <br/>
          {q.options.map((option) => (
            <label key={option} style={{ marginRight: "1em" }}>
              <input 
                type="radio"
                name={`q${idx}`}
                value={option}
                checked={answers[idx] === option}
                onChange={() => handleChangeAnswer(idx, option)}
              />
              {option}
            </label>
          ))}
        </div>
      ))}
      <button onClick={handleSubmit}>Submit Quiz</button>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
