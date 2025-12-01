# Job-Application-Bot

A platform that uses AI (Gemini API) to dynamically update Word documents based on user input and job descriptions.

## Features

- Upload Word cover letter template (.docx)
- Upload resume for context
- Configure template zones to update (placeholders)
- Paste Job Description for AI processing
- Preview rendered version of updated letter
- Export as PDF or Word (.docx)
- Future goal: Resume customization

## Technology Stack

- **Backend**: Python FastAPI
- **AI**: Gemini AI API
- **Word Document Processing**: python-docx
- **PDF Conversion**: pdfkit or docx2pdf
- **Database**: SQLite (can be upgraded to PostgreSQL)

## Installation

1. Clone the repository
2. Install dependencies:

```
pip install -r requirements.txt
```

3. Set up your Gemini API key in `.env` file
4. Run the application:

```
uvicorn app.main:app --reload
```

## API Documentation

When running, API documentation is available at:

- Swagger UI: `/docs`
- ReDoc: `/redoc`

## Project Structure

```
/Job-Application-Bot
│
├── app/
│   ├── main.py                  # FastAPI app entry
│   ├── routes/
│   │   ├── upload.py            # Upload Word/resume
│   │   ├── generate.py          # Gemini interaction
│   │   ├── preview.py           # Preview updates
│   │   └── download.py          # PDF/docx download
│   ├── services/
│   │   ├── word_processor.py    # Using python-docx
│   │   ├── gemini_client.py     # Call Gemini API
│   │   └── user_profile.py      # Store/retrieve user info
│   └── models/
│       └── schema.py            # Pydantic models
│
├── templates/                   # Default .docx template files
├── static/                      # Output files (PDFs, etc)
├── requirements.txt
└── README.md
```
