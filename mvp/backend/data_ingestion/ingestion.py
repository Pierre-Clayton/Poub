# backend/data_ingestion/ingestion.py

def chunk_text(text: str, chunk_size: int = 500, chunk_overlap: int = 50) -> list[str]:
    """
    Splits the text into overlapping chunks for better retrieval/LLM usage.
    
    :param text: The full string to chunk
    :param chunk_size: The maximum number of characters per chunk
    :param chunk_overlap: The number of characters to overlap between chunks
    :return: List of text chunks
    """
    # Replace newlines with spaces (optional)
    text = text.replace('\n', ' ')
    
    chunks = []
    start = 0
    text_length = len(text)

    while start < text_length:
        end = min(start + chunk_size, text_length)
        chunk = text[start:end]
        chunks.append(chunk.strip())
        start += chunk_size - chunk_overlap  # move start by chunk_size minus overlap
    
    return chunks
