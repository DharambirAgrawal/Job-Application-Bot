import React, { useState, useEffect } from "react";

const MIN_LENGTH = 40;

const JobDescriptionModal = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const [text, setText] = useState("");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setText("");
      setTouched(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);

    if (text.trim().length < MIN_LENGTH) {
      return;
    }

    if (onSubmit) {
      onSubmit(text.trim());
    }
  };

  const remaining = MIN_LENGTH - text.trim().length;
  const showError = touched && text.trim().length < MIN_LENGTH;

  return (
    <div
      className="fixed inset-0 z-1000001 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">
              No selection detected
            </p>
            <h3 className="text-lg font-semibold text-slate-900">
              Paste the job description
            </h3>
            <p className="text-sm text-slate-500">
              We will generate a tailored cover letter from this text.
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

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-slate-800"
              htmlFor="job-description-input"
            >
              Job description
            </label>
            <textarea
              id="job-description-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="Paste the job description here..."
              className="w-full min-h-[180px] rounded-xl border border-slate-200 bg-slate-50 focus:bg-white px-4 py-3 text-sm text-slate-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-vertical"
              spellCheck="true"
              required
            />
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>
                {Math.max(remaining, 0)} more characters helps us personalise.
              </span>
              <span className={showError ? "text-red-500" : ""}>
                {text.trim().length} characters
              </span>
            </div>
            {showError && (
              <p className="text-xs text-red-500">
                Please add at least {MIN_LENGTH} characters so we have enough
                context.
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 animate-spin"
                >
                  <path d="M4.5 12a1.5 1.5 0 003 0 1.5 1.5 0 00-3 0zM10.5 12a1.5 1.5 0 003 0 1.5 1.5 0 00-3 0zM16.5 12a1.5 1.5 0 003 0 1.5 1.5 0 00-3 0z" />
                </svg>
              )}
              Generate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobDescriptionModal;
