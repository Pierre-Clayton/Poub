import React, { useState } from "react";

export default function FileUpload({ token }) {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("pdf");
  const [response, setResponse] = useState(null);

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const endpoint = fileType === "pdf" ? "/parse-pdf" : "/parse-csv";

    try {
      const res = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.log(err);
      setResponse({ error: String(err) });
    }
  }

  return (
    <div className="container">
      <h3>Upload Documents</h3>
      <select value={fileType} onChange={(e) => setFileType(e.target.value)}>
        <option value="pdf">PDF</option>
        <option value="csv">CSV</option>
      </select>
      <br />
      <input 
        type="file" 
        accept={fileType === "pdf" ? "application/pdf" : ".csv"} 
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={handleUpload}>Upload</button>
      {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
    </div>
  );
}
