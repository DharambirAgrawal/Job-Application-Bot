"use client";

import { useState } from "react";

export default function ProfileSection() {
  const [resume, setResume] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState<File | null>(null);

  const [isSubmittingResume, setIsSubmittingResume] = useState(false);
  const [isSubmittingCover, setIsSubmittingCover] = useState(false);

  const [message, setMessage] = useState<{ type: "success" | "error" | null; text: string }>({
    type: null,
    text: "",
  });

  // --- File Validation ---
  const validateFile = (file: File, type: "resume" | "coverLetter"): boolean => {
    const allowedResume = [".pdf", ".docx"];
    const allowedCover = [".docx"];
    const ext = file.name.toLowerCase().split(".").pop() || "";

    if (type === "coverLetter" && !allowedCover.includes(`.${ext}`)) {
      setMessage({ type: "error", text: "Cover letter must be a .docx file." });
      return false;
    }

    if (type === "resume" && !allowedResume.includes(`.${ext}`)) {
      setMessage({ type: "error", text: "Resume must be a .pdf or .docx file." });
      return false;
    }

    setMessage({ type: null, text: "" });
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "resume" | "coverLetter") => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    if (!validateFile(file, type)) {
      e.target.value = ""; // reset invalid selection
      return;
    }

    if (type === "resume") {
      setResume(file);
    } else {
      setCoverLetter(file);
    }
  };

  // --- Upload Helper ---
  const uploadFile = async (file: File, filetype: string, foldername: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("filetype", filetype);
    formData.append("foldername", foldername);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Upload failed");

    return data;
  };

  // --- Resume Upload ---
  const handleResumeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume) return;

    setIsSubmittingResume(true);
    setMessage({ type: null, text: "" });

    try {
      const data = await uploadFile(resume, "resume", "resumes");
      setMessage({ type: "success", text: "Resume uploaded successfully!" });
      console.log("Resume upload:", data);
      setResume(null);
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Failed to upload resume" });
      console.error("Resume upload error:", error);
    } finally {
      setIsSubmittingResume(false);
    }
  };

  // --- Cover Letter Upload ---
  const handleCoverLetterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverLetter) return;

    setIsSubmittingCover(true);
    setMessage({ type: null, text: "" });

    try {
      const data = await uploadFile(coverLetter, "coverletter", "coverletters");
      setMessage({ type: "success", text: "Cover letter uploaded successfully!" });
      console.log("Cover letter upload:", data);
      setCoverLetter(null);
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Failed to upload cover letter" });
      console.error("Cover letter upload error:", error);
    } finally {
      setIsSubmittingCover(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-8">
      <h2 className="text-2xl font-semibold text-gray-800">Profile</h2>

      {/* Feedback Message */}
      {message.text && (
        <div
          className={`p-3 rounded-md text-sm font-medium ${
            message.type === "success"
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-red-100 text-red-800 border border-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Resume Upload */}
      <form onSubmit={handleResumeSubmit} className="space-y-4">
        <div>
          <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-2">
            Resume (.pdf or .docx)
          </label>
          <input
            type="file"
            id="resume"
            accept=".pdf,.docx"
            onChange={(e) => handleFileChange(e, "resume")}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 
                       file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />
          {resume && <p className="mt-2 text-sm text-gray-600">Selected: {resume.name}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmittingResume || !resume}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 
                     disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isSubmittingResume ? "Uploading Resume..." : "Submit Resume"}
        </button>
      </form>

      {/* Cover Letter Upload */}
      <form onSubmit={handleCoverLetterSubmit} className="space-y-4">
        <div>
          <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
            Cover Letter (.docx only)
          </label>
          <input
            type="file"
            id="coverLetter"
            accept=".docx"
            onChange={(e) => handleFileChange(e, "coverLetter")}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 
                       file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
          />
          {coverLetter && <p className="mt-2 text-sm text-gray-600">Selected: {coverLetter.name}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmittingCover || !coverLetter}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 
                     disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isSubmittingCover ? "Uploading Cover Letter..." : "Submit Cover Letter"}
        </button>
      </form>
    </div>
  );
}
