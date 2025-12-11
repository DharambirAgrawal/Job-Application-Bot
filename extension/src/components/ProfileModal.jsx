import React, { useEffect, useMemo, useState } from "react";
import APIService from "../services/api";
import { PROFILE_UPLOADS_STORAGE_KEY } from "./profileStorage";

const formatDate = (value) => {
  if (!value) return null;
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleString();
  } catch (error) {
    return null;
  }
};

const persistUploads = (data) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      PROFILE_UPLOADS_STORAGE_KEY,
      JSON.stringify(data)
    );
  } catch (error) {
    console.warn("Could not persist profile uploads", error);
  }
};

const ProfileModal = ({
  isOpen,
  onClose,
  uploads,
  onUploadsChange,
  showToast,
}) => {
  const [coverLetterFile, setCoverLetterFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [summaryText, setSummaryText] = useState("");
  const [activeUpload, setActiveUpload] = useState(null);

  const fallbackUploads = useMemo(() => uploads || {}, [uploads]);

  useEffect(() => {
    if (!isOpen) {
      setCoverLetterFile(null);
      setResumeFile(null);
      setSummaryText("");
      setActiveUpload(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const updateUploads = (key, meta) => {
    const next = {
      ...fallbackUploads,
      [key]: meta,
    };
    onUploadsChange?.(next);
    persistUploads(next);
  };

  const handleTemplateUpload = async (type) => {
    const file = type === "coverletter" ? coverLetterFile : resumeFile;
    if (!file) {
      showToast?.("Please choose a .docx file first", "error");
      return;
    }

    if (!file.name.toLowerCase().endsWith(".docx")) {
      showToast?.("Only .docx files are allowed", "error");
      return;
    }

    const enforcedName = `${type}.docx`;
    const fileToSend =
      file.name === enforcedName
        ? file
        : new File([file], enforcedName, { type: file.type });

    try {
      setActiveUpload(type);
      await APIService.uploadTemplate(fileToSend, enforcedName);
      updateUploads(type, {
        date: new Date().toISOString(),
        filename: file.name,
      });
      showToast?.(
        `${type === "coverletter" ? "Cover letter" : "Resume"} uploaded`,
        "success"
      );
      if (type === "coverletter") {
        setCoverLetterFile(null);
      } else {
        setResumeFile(null);
      }
    } catch (error) {
      showToast?.(error.message || "Upload failed", "error");
    } finally {
      setActiveUpload(null);
    }
  };

  const handleSummaryUpload = async () => {
    const trimmed = summaryText.trim();
    if (!trimmed) {
      showToast?.("Please add a summary first", "error");
      return;
    }

    try {
      setActiveUpload("summary");
      await APIService.uploadSummary(trimmed);
      updateUploads("summary", {
        date: new Date().toISOString(),
        preview: trimmed.slice(0, 140),
      });
      showToast?.("Summary saved", "success");
      setSummaryText("");
    } catch (error) {
      showToast?.(error.message || "Could not save summary", "error");
    } finally {
      setActiveUpload(null);
    }
  };

  const renderMeta = (key) => {
    const meta = fallbackUploads[key];
    if (!meta) return "Not uploaded yet";

    const formattedDate = formatDate(meta.date);
    const parts = [formattedDate ? `Last uploaded ${formattedDate}` : null];
    if (meta.filename) {
      parts.push(`File: ${meta.filename}`);
    }
    if (key === "summary" && meta.preview) {
      parts.push(`Preview: ${meta.preview}`);
    }

    return parts.filter(Boolean).join(" · ");
  };

  return (
    <div
      className="fixed inset-0 z-1000001 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">
              Profile
            </p>
            <h3 className="text-lg font-semibold text-slate-900">
              Upload your resume, cover letter template, and summary
            </h3>
            <p className="text-sm text-slate-500">
              We will remember the last upload time locally so you know what is
              current.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6 py-5">
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Cover letter template
                </p>
                <p className="text-xs text-slate-500">
                  Upload coverletter.docx
                </p>
              </div>
              <span className="text-[11px] font-medium px-2 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                DOCX
              </span>
            </div>
            <div className="space-y-3">
              <input
                type="file"
                accept=".docx"
                onChange={(e) =>
                  setCoverLetterFile(e.target.files?.[0] || null)
                }
                className="w-full text-sm text-slate-700"
              />
              <p className="text-xs text-slate-500">
                {renderMeta("coverletter")}
              </p>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => handleTemplateUpload("coverletter")}
                  disabled={activeUpload === "coverletter"}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-linear-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold shadow-md shadow-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/40 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {activeUpload === "coverletter" && (
                    <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  )}
                  Upload
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">Resume</p>
                <p className="text-xs text-slate-500">Upload resume.docx</p>
              </div>
              <span className="text-[11px] font-medium px-2 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                DOCX
              </span>
            </div>
            <div className="space-y-3">
              <input
                type="file"
                accept=".docx"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-slate-700"
              />
              <p className="text-xs text-slate-500">{renderMeta("resume")}</p>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => handleTemplateUpload("resume")}
                  disabled={activeUpload === "resume"}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-linear-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold shadow-md shadow-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/40 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {activeUpload === "resume" && (
                    <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  )}
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">Summary</p>
                <p className="text-xs text-slate-500">
                  Paste a quick summary for reference
                </p>
              </div>
              <span className="text-[11px] font-medium px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                TEXT
              </span>
            </div>
            <textarea
              value={summaryText}
              onChange={(e) => setSummaryText(e.target.value)}
              placeholder="Paste or write a concise summary..."
              className="w-full min-h-[120px] rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
            <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
              <span>{renderMeta("summary")}</span>
              <button
                type="button"
                onClick={handleSummaryUpload}
                disabled={activeUpload === "summary"}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-linear-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold shadow-md shadow-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/40 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {activeUpload === "summary" && (
                  <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                )}
                Save summary
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { PROFILE_UPLOADS_STORAGE_KEY };
export default ProfileModal;
