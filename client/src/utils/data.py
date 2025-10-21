

FILETYPE = {
    "coverletter": [".docx"],
    "resume": [".pdf", ".docx"]
}

FOLDERS= ["coverletters", "resumes"]

PROMPTS= {
            "cover_letter": (
                "Using the following information, write a professional and tailored cover letter:\n\n"
                "{input_text}\n\n"
                "Ensure it is concise, structured, and appropriate for a job application."
            ),
            "summary": (
                "Summarize the following text in a few clear bullet points:\n\n{input_text}"
            ),
            "email_reply": (
                "Generate a polite and professional email reply to the following message:\n\n{input_text}"
            ),
}