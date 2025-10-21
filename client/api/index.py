import os
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from features.supabase_storage import SupabaseStorage  # the helper class from earlier
from utils.data import FILETYPE, FOLDERS

app = Flask(__name__)

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
        result = storage.upload_file(file, upload_name, folder=folder)
        return jsonify({
            "message": "File uploaded successfully",
            "bucket": result["bucket"],
            "key": result["key"],
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/python")
def hello_world():
    return f"<p>Hello, World!</p>"


@app.route("/api/hello")
def hello():
    return "<p>Hello again!</p>"


if __name__ == "__main__":
    app.run(debug=True)
