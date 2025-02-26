# Project Path MVP – Current Progress (Day 1 to Day 4)

This repository contains the **backend** implementation for our MVP, focusing on **document ingestion**, **chunking**, **embedding**, and **retrieval** features. The primary technologies used so far are:

- **Python** (FastAPI) for the server
- **PyPDF2** for PDF parsing
- **csv** (standard library) for CSV parsing
- **sentence-transformers** for text embeddings
- **In-memory** data structure for storing document chunks and embeddings
- **Naive** cosine similarity for retrieval

---

## Table of Contents

- [Project Path MVP – Current Progress (Day 1 to Day 4)](#project-path-mvp--current-progress-day-1-to-day-4)
  - [Table of Contents](#table-of-contents)
  - [Architecture Overview](#architecture-overview)
  - [Installation \& Setup](#installation--setup)
  - [Folder Structure](#folder-structure)
  - [Endpoints](#endpoints)
    - [1. Health Check](#1-health-check)
    - [2. Parse PDF](#2-parse-pdf)
    - [3. Parse CSV](#3-parse-csv)
    - [4. Documents Store (Debug)](#4-documents-store-debug)
    - [5. Search](#5-search)
  - [Ingestion Workflow (PDF \& CSV)](#ingestion-workflow-pdf--csv)
  - [Embedding \& Retrieval](#embedding--retrieval)
  - [Next Steps](#next-steps)
  - [Contact / Contribution](#contact--contribution)

---

## Architecture Overview

1. **Upload Documents**:
   - Users can upload PDFs or CSVs.
   - The system **parses** the content, **chunks** the text, and **embeds** each chunk.  
   - The results (chunk text + embeddings) are stored in an in-memory dictionary.
2. **Search**:
   - The user submits a text query.
   - The system computes an embedding of the query, does a **cosine similarity** against all stored chunks, and returns the top matches.

**Note**: Currently, all data is in-memory for demonstration and quick prototyping.

---

## Installation & Setup

1. **Clone the repository** (assuming you’re in the `mvp` folder at the root):
   ```bash
   cd mvp/backend
   ```
2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
   The `requirements.txt` includes:
   - **PyPDF2** for PDF parsing
   - **sentence-transformers** for text embeddings
   - (And any other libraries we’ve added along the way)

3. **Run the server**:
   ```bash
   uvicorn app:app --reload
   ```
   The server will be available at `http://127.0.0.1:8000`.

4. **Open API Docs**:  
   Navigate to `http://127.0.0.1:8000/docs` to see all endpoints and test them directly in your browser.

---

## Folder Structure

Below is the relevant backend structure so far:

```
backend/
├── data_ingestion/
│   ├── ingestion.py        # Shared utilities (chunk_text) or general ingestion logic
│   ├── pdf_ingestion.py    # PDF parsing + chunking
│   └── csv_ingestion.py    # CSV parsing + chunking
├── retrieval/
│   ├── embeddings.py       # SentenceTransformers model loading & embedding functions
│   ├── utils.py            # Cosine similarity or other retrieval utilities
│   └── search.py           # search_in_documents_store() function
├── app.py                  # FastAPI application, endpoints for ingestion & search
├── requirements.txt        # Python dependencies
└── ...
```

---

## Endpoints

### 1. Health Check
- **GET** `/health`  
  **Description**: A simple endpoint to verify the server is running.  
  **Response**: `{"status": "ok"}`

### 2. Parse PDF
- **POST** `/parse-pdf`  
  **Parameters**:  
  - File upload (`multipart/form-data`)  
  **Process**:  
  1. Saves file to a temporary location.  
  2. **Parses** and **chunks** the PDF text (default chunk size ~500 characters, overlap ~50).  
  3. **Generates embeddings** for each chunk via SentenceTransformers.  
  4. Stores chunk text + embeddings in memory under `documents_store`.  
  **Response**: JSON with:
    - `filename`
    - `num_chunks`
    - `sample_chunk`
    - `sample_embedding`

### 3. Parse CSV
- **POST** `/parse-csv`  
  **Parameters**:  
  - File upload (`multipart/form-data`)  
  **Process**:  
  1. Saves file to a temporary location.  
  2. **Parses** CSV rows, concatenates them into text, then **chunks** the text.  
  3. **Generates embeddings** for each chunk.  
  4. Stores chunk text + embeddings in memory.  
  **Response**: Similar to `/parse-pdf`.

### 4. Documents Store (Debug)
- **GET** `/documents_store`  
  **Description**: Returns a summary of what has been uploaded. Does **not** show all embeddings (to avoid huge JSON).  
  **Response**:  
  ```json
  {
    "somefile.pdf": {
      "total_chunks": 12,
      "first_100_chars_of_first_chunk": "..."
    },
    "anotherfile.csv": {
      "total_chunks": 7,
      "first_100_chars_of_first_chunk": "..."
    }
  }
  ```

### 5. Search
- **POST** `/search`  
  **Payload**:
  ```json
  {
    "query": "User question or search string",
    "top_k": 3
  }
  ```
  **Process**:
  1. Computes embedding of the `query`.  
  2. For each chunk in `documents_store`, calculates cosine similarity with the query embedding.  
  3. Returns the top `top_k` matches (default 3).  
  **Response**:
  ```json
  {
    "query": "User question or search string",
    "top_k": 3,
    "results": [
      {
        "filename": "example.pdf",
        "chunk": "Relevant chunk text...",
        "score": 0.78
      },
      ...
    ]
  }
  ```

---

## Ingestion Workflow (PDF & CSV)

1. **User uploads file** (PDF or CSV) via the respective endpoint.  
2. **Server reads and parses** the file content.  
   - PDF: uses `PyPDF2.PdfReader` to extract page text.  
   - CSV: uses Python’s built-in `csv.reader` to read rows.  
3. **Chunking**: The extracted text is chunked into segments (default ~500 characters) with overlap (~50 characters) for better retrieval performance.  
4. **Embedding**: Each chunk is turned into a numeric vector using a **SentenceTransformers** model (e.g., `all-MiniLM-L6-v2`).  
5. **Storing**: We store a list of dicts for each file in an in-memory dictionary:  
   ```python
   documents_store[file.filename] = [
     {"chunk": "chunk_text", "embedding": np.array([...])},
     ...
   ]
   ```
6. **Optional Debug**: Check `/documents_store` for a quick summary.

---

## Embedding & Retrieval

- **Embeddings**: We load the model once and then use `model.encode()` to get a 384-dimensional vector (for `all-MiniLM-L6-v2`) representing each chunk.  
- **Cosine Similarity**: For retrieval, we compute the cosine similarity between the user query’s embedding and each chunk embedding.  
- **Top-k Ranking**: We sort all chunks by similarity score and return the highest matches.  

**Current Approach**:  
- Entirely in-memory. Great for demonstration or small-scale projects, but not scalable for large files or multi-user environments.  
- Next step will be to integrate a more robust storage system or vector database for production-readiness.

---

## Next Steps

1. **Integrate a Vector Database or AWS OpenSearch**  
   - For larger-scale usage and more advanced features (scalable search, metadata filters, synonyms, etc.).  
2. **Add LLM-based Q&A**  
   - Once we can retrieve the top relevant chunks, we can feed them into an LLM (like AWS Bedrock) to generate a final answer.  
3. **User Authentication & Persistent Storage**  
   - Move from in-memory to a real database (SQL or NoSQL) to store user data, chat history, and document references.  
4. **Front-End Integration**  
   - Expose these endpoints in a user-friendly UI, including file uploads, a chat interface, and search boxes.

---

## Contact / Contribution

- **Full-Stack Engineer**: Implement the CI/CD logic and deploy the app on AWS. Feel free to build a **front-end** that calls these endpoints for user uploads and queries.  
- **Data Scientist** (current tasks): This is the person working on ingestion, embeddings, and retrieval logic.  
- **Project Manager**: Overseeing daily tasks, verifying we meet MVP milestones.

To contribute code, see the guidelines in our [CONTRIBUTING.md](docs/CONTRIBUTING.md) (coming soon).