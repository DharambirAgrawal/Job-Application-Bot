/**
 * About modal component
 * Displays information about the extension and link to the portal
 * @module components/AboutModal
 */

import React from 'react';
import { getApiBaseUrl, getUIConfig } from '../config';

/**
 * About modal component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Close handler
 * @returns {JSX.Element} About modal element
 */
const AboutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const portalUrl = getUIConfig('portalUrl') || getApiBaseUrl();

  return (
    <div
      className="
        fixed inset-0 z-1000000
        flex items-center justify-center
        bg-slate-900/60 backdrop-blur-sm
        px-8 sm:px-6
        animate-fadeIn
      "
      onClick={onClose}
    >
      <div
        className="
          relative w-full max-w-lg sm:max-w-xl
          bg-white/95 rounded-3xl shadow-2xl shadow-indigo-500/10
          border border-slate-100/80
          flex flex-col
          max-h-[85vh]
          overflow-hidden
        "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 px-7 pt-7 pb-6 border-b border-slate-100/80">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-500/80">
              About
            </span>
            <h3 className="text-2xl font-semibold text-slate-900">
              Job Assistant
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Keep applications aligned by managing resumes and AI cover letters in one place.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="
              inline-flex h-9 w-9 items-center justify-center
              rounded-full border border-slate-200
              text-slate-500 hover:text-slate-700
              hover:border-slate-300 hover:bg-slate-50
              transition-colors duration-200
            "
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-6">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 px-5 py-4 text-sm text-slate-600 leading-relaxed">
            Job Assistant keeps every tailored cover letter, resume update, and application note in sync so you never lose track of what was sent where.
          </div>

          <ul className="space-y-3">
            {[
              'Upload or update your resume before applying',
              'Store tailored cover letters for each role',
              'Pick up drafts from any device instantly'
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-slate-800">
                <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="w-3.5 h-3.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12.5l4 4L19 7" />
                  </svg>
                </span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>

          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 text-sm text-indigo-700">
            <p className="font-medium mb-1">Need the full workspace?</p>
            <p className="leading-relaxed">
              Open the Job Assistant portal to manage documents, share drafts, and sync updates with your job search.
            </p>
          </div>
        </div>

        <div className="px-7 pb-7 pt-4 border-t border-slate-100/80">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              Portal uses the same credentials as your extension.
            </p>
            <a
              href={portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center justify-center gap-2
                rounded-xl px-5 py-3
                bg-linear-to-r from-indigo-600 to-purple-600
                text-sm font-semibold text-white shadow-md shadow-indigo-500/30
                hover:shadow-lg hover:shadow-indigo-500/40
                hover:-translate-y-0.5
                transition-all duration-200
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="w-4 h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 5.25h10.5m0 0v10.5m0-10.5L5.25 18.75" />
              </svg>
              Open application portal
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
