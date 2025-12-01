import re
import json
MAX_CHARS = 15000  # adjust for Gemini context

def prepare_text_for_gemini(text, max_chars=MAX_CHARS):
    
    text = ''.join(c for c in text if c.isprintable())  # remove weird chars
    text = re.sub(r'\s+', ' ', text)                    # normalize whitespace
    text = re.sub(r'([!?.,])\1+', r'\1', text)         # repeated punctuation
    text = re.sub(r'Page \d+ of \d+', '', text, flags=re.IGNORECASE)
    text = re.sub(r'Confidential', '', text, flags=re.IGNORECASE)
    
    # Step 3: Split into pseudo-sentences (at punctuation or line breaks)
    sentences = re.split(r'(?<=[.!?])\s+|\n+', text)
    
    # Step 4: Filter out very short sentences
    filtered_sentences = [s.strip() for s in sentences if len(s.split()) >= 2]
    
    # Step 5: Truncate intelligently
    truncated_text = ""
    for sentence in filtered_sentences:
        if len(truncated_text) + len(sentence) + 1 > max_chars:
            break
        truncated_text += sentence + " "
    
    return truncated_text.strip()


def prepare_job_desc_text_gemini(job_text, max_chars=MAX_CHARS):
    """
    Clean and truncate job description text for LLM summarization or matching.
    
    Args:
        job_text (str): raw job description text (from user upload or form)
        max_chars (int): max number of characters to keep
        
    Returns:
        str: cleaned, truncated, Gemini-ready job description
    """
    # Step 1: Basic cleaning
    text = ''.join(c for c in job_text if c.isprintable())  # remove non-printables
    text = re.sub(r'\s+', ' ', text)                        # normalize whitespace
    text = re.sub(r'([!?.,])\1+', r'\1', text)              # repeated punctuation
    text = re.sub(r'Page \d+ of \d+', '', text, flags=re.IGNORECASE)
    text = re.sub(r'Confidential', '', text, flags=re.IGNORECASE)

    # Step 2: Optional — remove repetitive boilerplate phrases (optional)
    text = re.sub(r'(?i)(about\s+us|who\s+we\s+are|our\s+mission)[:\- ]+', '', text)
    text = re.sub(r'(?i)(equal\s+opportunity\s+employer|diversity\s+statement).*', '', text)

    # Step 3: Split into pseudo-sentences (no NLTK)
    sentences = re.split(r'(?<=[.!?])\s+|\n+', text)

    # Step 4: Filter out short/unhelpful lines
    filtered_sentences = [s.strip() for s in sentences if len(s.split()) >= 3]

    # Step 5: Truncate intelligently
    truncated_text = ""
    for sentence in filtered_sentences:
        if len(truncated_text) + len(sentence) + 1 > max_chars:
            break
        truncated_text += sentence + " "

    return truncated_text.strip()



def parse_gemini_json(output_text: str) -> dict:
    """
    Parse Gemini's JSON-like response into a real Python dict.
    Handles common formatting issues automatically.
    """
    # Extract the JSON portion (anything between { and })
    match = re.search(r"\{[\s\S]*\}", output_text)
    if not match:
        raise ValueError("No valid JSON object found in Gemini response.")
    
    json_str = match.group(0)

    # Fix potential minor JSON issues
    json_str = json_str.replace("’", "'")  # smart quotes
    json_str = json_str.replace("“", '"').replace("”", '"')  # fancy quotes
    json_str = re.sub(r",\s*}", "}", json_str)  # trailing commas

    # Try parsing
    try:
        data = json.loads(json_str)
    except json.JSONDecodeError as e:
        raise ValueError(f"Gemini returned invalid JSON: {e}\nRaw text:\n{json_str}")
    
    return data
