# backend/data_ingestion/csv_ingestion.py

import csv
from app.data_ingestion.ingestion import chunk_text
from pathlib import Path

def parse_csv(file_path: str, chunk_size=500, chunk_overlap=50) -> list[str]:
    """
    Reads a CSV file and returns list of text chunks (concatenated rows).
    """
    csv_path = Path(file_path)
    if not csv_path.is_file():
        raise FileNotFoundError(f"File not found: {file_path}")
    
    rows_text = []
    with open(csv_path, 'r', encoding='utf-8', newline='') as f:
        reader = csv.reader(f)
        for row in reader:
            # Join row fields with a space or comma
            row_str = " ".join(row)
            rows_text.append(row_str)
    
    # Combine all rows into one big string
    full_text = "\n".join(rows_text)
    # Chunk it
    chunks = chunk_text(full_text, chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    return chunks
