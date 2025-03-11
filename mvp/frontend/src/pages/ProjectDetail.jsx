// mvp/frontend/src/pages/ProjectDetail.jsx
import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import { useParams, useNavigate } from "react-router-dom";

export default function ProjectDetail({ token }) {
  const { project_id } = useParams();
  const [project, setProject] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch project details
    fetch(`${API_BASE_URL}/projects/${project_id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setProject(data))
      .catch(console.error);

    // Fetch project documents
    fetch(`${API_BASE_URL}/projects/${project_id}/documents`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setDocuments(data.documents))
      .catch(console.error);
  }, [project_id, token]);

  const handleUploadDocument = async (e) => {
    e.preventDefault();
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target.result;
      const documentData = { filename: file.name, content };
      try {
        const res = await fetch(`${API_BASE_URL}/projects/${project_id}/documents`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(documentData)
        });
        const newDoc = await res.json();
        setDocuments([...documents, newDoc]);
      } catch (err) {
        console.error(err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "1rem" }}>Back to Projects</button>
      {project ? (
        <>
          <h1>{project.name}</h1>
          <p>{project.description}</p>
          <h2>Documents</h2>
          <form onSubmit={handleUploadDocument} style={{ marginBottom: "2rem" }}>
            <input 
              type="file" 
              onChange={(e) => setFile(e.target.files[0])} 
              required 
              style={{ marginRight: "1rem" }}
            />
            <button type="submit" style={{ padding: "0.5rem 1rem" }}>Upload Document</button>
          </form>
          <ul>
            {documents.map(doc => (
              <li key={doc.document_id}>{doc.filename}</li>
            ))}
          </ul>
          <button 
            onClick={() => navigate(`/webapp/projects/${project_id}/chat`)}
            style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
          >
            Go to Project Chat
          </button>
        </>
      ) : (
        <p>Loading project details...</p>
      )}
    </div>
  );
}
