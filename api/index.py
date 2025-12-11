import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from features.supabase_storage import SupabaseStorage  # the helper class from earlier
from utils.data import FILETYPE, FOLDERS
from features.gemini_api import GeminiTextGenerator
from utils.documentUtils import DocumentUtils

from helper.helper import prepare_text_for_gemini, prepare_job_desc_text_gemini, parse_gemini_json

app = Flask(__name__)
CORS(
    app,
    resources={r"/api/*": {"origins": "*"}},
    allow_headers=["Content-Type", "x-api-key"],
    expose_headers=["Content-Type"],
)
load_dotenv()
# Load Supabase credentials from environment
SUPABASE_ENDPOINT = os.getenv("SUPABASE_ENDPOINT")
SUPABASE_BUCKET = os.getenv("SUPABASE_BUCKET")
SUPABASE_ACCESS_KEY = os.getenv("SUPABASE_ACCESS_KEY")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")

# Initialize Supabase Storage
storage = SupabaseStorage(
    endpoint=SUPABASE_ENDPOINT,
    bucket=SUPABASE_BUCKET,
    access_key=SUPABASE_ACCESS_KEY,
    secret_key=SUPABASE_SECRET_KEY,
)

# Initialize gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
gemini = GeminiTextGenerator(api_key=GEMINI_API_KEY)

# Simple API key auth (set API_KEY env var in backend and frontend)
API_KEY = os.getenv("API_KEY", "e")


@app.before_request
def require_api_key():
    # Allow health/public endpoints without API key
    if request.path in ["/api/hello", "/api/python"]:
        return None

    # Allow CORS preflight to proceed
    if request.method == "OPTIONS":
        return None

    provided_key = request.headers.get("x-api-key")
    if not provided_key or provided_key != API_KEY:
        return jsonify({"error": "Unauthorized: missing or invalid API key"}), 401

    return None

@app.route("/api/upload", methods=["POST"])
def upload_file():
    """
    Upload file to Supabase Storage.
    Expects multipart/form-data with:
    - file (required)
    - foldername (optional)
    - filetype: "coverletter" or "resume"
    """
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    foldername = request.form.get("foldername", "").strip()
    filetype = request.form.get("filetype", "").lower().strip()

    if not file:
        return jsonify({"error": "No file uploaded"}), 400
    if foldername not in FOLDERS and filetype not in FILETYPE:
        return jsonify({"error": "Either foldername or filetype must be provided"}), 400

    if filetype and filetype not in FILETYPE:
        return jsonify({"error": f"Invalid filetype. Must be one of {list(FILETYPE.keys())}."}), 400

    # Validate file extension
    filename = secure_filename(file.filename)
    if not filename.lower().endswith((".pdf", ".docx")):
        return jsonify({"error": "Only .pdf and .docx files are allowed"}), 400
    
    # Enforce filetype-specific extensions
    if filetype == "coverletter":
        if not filename.lower().endswith(tuple(FILETYPE["coverletter"])):
            return jsonify({"error": f"Cover letters must be {FILETYPE['coverletter']} files only."}), 400
    elif filetype == "resume":
        if not filename.lower().endswith(tuple(FILETYPE["resume"])):
            return jsonify({"error": f"Resumes must be {FILETYPE['resume']} files only."}), 400

    # Construct a consistent folder structure
    folder = foldername or filetype

    # Preserve original file extension
    ext = os.path.splitext(filename)[1].lower()
    upload_name = f"{filetype}{ext}"

    try:
        # Wrap bytes in BytesIO so it behaves like a file
        from io import BytesIO
        file_bytes = file.read()
        file_stream = BytesIO(file_bytes)
        # uploading the resume or cover letter
        result = storage.upload_file(file_stream, upload_name, folder=folder)

        if filetype == "resume":   
            file_stream = BytesIO(file_bytes)
            extracted_text = DocumentUtils.extract_text(file_stream)

            # 2️⃣ Prepare text for Gemini
            extracted_text = prepare_text_for_gemini(extracted_text)

            # 3️⃣ Generate summary using Gemini
            summary_text = gemini.generate(extracted_text, "summary")

            # Prepare a summary filename
            summary_filename = "resume_summary.txt"
            summary_bytes = summary_text.encode("utf-8")
            
            # Upload summary to Supabase under 'summary' folder
            storage.upload_file(summary_bytes, summary_filename, folder="summary")

        return jsonify({
            "message": "File uploaded successfully",
            "bucket": result["bucket"],
            "key": result["key"],
        }), 200
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500


@app.route("/api/generate_coverletter", methods=["POST"])
def generate_coverletter():
    """
    Generate a cover letter using the uploaded resume and job description.
    """
    data = request.json
    job_description = data.get("job_description", "").strip()

    if not job_description:
        return jsonify({"error": "job_description is required."}), 400

    # 1️⃣ Prepare resume text for Gemini
    prepared_text = prepare_job_desc_text_gemini(job_description)

    # getting the summary or user
    file_stream = storage.fetch_file("resume_summary.txt", folder="summary")

    summary = file_stream.read().decode("utf-8")

    # 2️⃣ Generate cover letter using Gemini
    result = gemini.generate(text=summary, second_text=job_description, task="cover_letter")
    coverletter_data = parse_gemini_json(result)

    print("Generated Cover Letter Data:", coverletter_data)

    # getting coverletter format
    coverletter_template = storage.fetch_file("coverletter.docx", folder="coverletters")
    updated_docx_stream = DocumentUtils.update_docx_placeholders(
        doc_source=coverletter_template,
        replacements=coverletter_data
    )

    # return jsonify({"cover_letter": cover_letter_data}), 200
    from flask import send_file
    return send_file(
    updated_docx_stream,
    as_attachment=True,
    download_name="cover_letter.docx",
    mimetype="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
)


@app.route("/api/convert_to_pdf", methods=["POST"])
def convert_to_pdf():
    """
    Convert an uploaded DOCX file to PDF.
    """
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    if not file or file.filename == "":
        return jsonify({"error": "No file uploaded"}), 400

    if not file.filename.lower().endswith(".docx"):
        return jsonify({"error": "Only .docx files are allowed"}), 400

    try:
        pdf_stream = DocumentUtils.convert_docx_to_pdf(file)
        
        from flask import send_file
        return send_file(
            pdf_stream,
            as_attachment=True,
            download_name=f"{os.path.splitext(file.filename)[0]}.pdf",
            mimetype="application/pdf"
        )
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500


@app.route("/api/html_to_pdf", methods=["POST"])
def html_to_pdf():
    """
    Convert HTML content to PDF using Playwright (headless Chromium).
    Expects JSON with:
    - html (required): The HTML content to convert.
    """
    data = request.json
    html_content = data.get("html", "")

    if not html_content:
        return jsonify({"error": "html content is required"}), 400

    try:
        from playwright.sync_api import sync_playwright
        from io import BytesIO

        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            page.set_content(html_content, wait_until="networkidle")
            pdf_bytes = page.pdf(format="Letter", print_background=True)
            browser.close()

        pdf_stream = BytesIO(pdf_bytes)
        pdf_stream.seek(0)

        from flask import send_file
        return send_file(
            pdf_stream,
            as_attachment=True,
            download_name="cover_letter.pdf",
            mimetype="application/pdf"
        )
    except Exception as e:
        print(f"Playwright error: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/python")
def hello_world():
    return f"<p>Hello, World!</p>"


@app.route("/api/hello")
def hello():
    return "<p>Hello again!</p>"


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)

