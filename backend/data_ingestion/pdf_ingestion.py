# backend/data_ingestion/pdf_ingestion.py 

import PyPDF2
from pathlib import Path
from data_ingestion.ingestion import chunk_text

def parse_pdf(file_path: str, chunk_size=500, chunk_overlap=50) -> list[str]:
    """
    Reads a PDF file, returns a list of text chunks.
    """
    pdf_path = Path(file_path)
    if not pdf_path.is_file():
        raise FileNotFoundError(f"File not found: {file_path}")
    
    text_content = []
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        for page_num in range(len(reader.pages)):
            page = reader.pages[page_num]
            page_text = page.extract_text()
            if page_text:
                text_content.append(page_text)
    
    full_text = "\n".join(text_content)
    # Now chunk the text
    chunks = chunk_text(full_text, chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    return chunks
