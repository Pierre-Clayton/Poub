// mvp/frontend/src/pages/Projects.jsx
import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";

export default function Projects({ token }) {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE_URL}/projects`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setProjects(data.projects))
      .catch(console.error);
  }, [token]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    const projectData = { name, description };
    try {
      const res = await fetch(`${API_BASE_URL}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(projectData)
      });
      const newProject = await res.json();
      navigate(`/webapp/projects/${newProject.project_id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Your Projects</h1>
      <form onSubmit={handleCreateProject} style={{ marginBottom: "2rem" }}>
        <input 
          type="text" 
          placeholder="Project Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          required 
          style={{ padding: "0.5rem", marginRight: "1rem" }}
        />
        <input 
          type="text" 
          placeholder="Description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)}
          style={{ padding: "0.5rem", marginRight: "1rem" }}
        />
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>Create Project</button>
      </form>
      <ul>
        {projects.map(project => (
          <li key={project.project_id}>
            <a href={`/webapp/projects/${project.project_id}`}>{project.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
