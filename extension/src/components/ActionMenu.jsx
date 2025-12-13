/**
 * Action menu component with buttons for extension features
 * Displays available actions when the floating button is clicked
 * @module components/ActionMenu
 */

import React from "react";
import { isFeatureEnabled } from "../config";

/**
 * Action button component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Action button element
 */
const ActionButton = ({
  icon,
  label,
  onClick,
  disabled = false,
  isPrimary = false,
  status = null,
}) => {
  return (
    <div className="relative group">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`
          w-11 h-11 rounded-full
          flex items-center justify-center
          transition-all duration-200
          shadow-md hover:shadow-lg
          ${
            disabled
              ? "opacity-50 cursor-not-allowed bg-white border border-gray-200"
              : isPrimary
              ? "bg-linear-to-br from-indigo-50 to-blue-50 border border-indigo-200 text-indigo-600 hover:from-indigo-100 hover:to-blue-100 hover:scale-105"
              : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:scale-105"
          }
          ${!disabled && "hover:-translate-y-0.5"}
        `}
      >
        <div className="w-[18px] h-[18px]">{icon}</div>

        {/* Status indicator */}
        {status && (
          <span
            className={`
              absolute -top-0.5 -right-0.5
              w-3 h-3 rounded-full border-2 border-white
              ${status === "ready" && "bg-green-500"}
              ${status === "loading" && "bg-yellow-500 animate-pulse"}
              ${status === "error" && "bg-red-500"}
            `}
          />
        )}
      </button>

      {/* Tooltip */}
      <div
        className="
          absolute right-[52px] top-1/2 -translate-y-1/2
          bg-gray-900 text-white text-xs font-medium
          px-2 py-1 rounded whitespace-nowrap
          opacity-0 group-hover:opacity-100
          pointer-events-none transition-opacity duration-200
          z-999997
        "
      >
        {label}
        <div
          className="
            absolute left-full top-1/2 -translate-y-1/2
            border-[3px] border-transparent border-l-gray-900
          "
        />
      </div>
    </div>
  );
};

/**
 * Action menu component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the menu is open
 * @param {Function} props.onGenerateCoverLetter - Cover letter generation handler
 * @param {Function} props.onGenerateResume - Resume generation handler
 * @param {Function} props.onAbout - About modal handler
 * @param {string} props.coverLetterStatus - Status of cover letter generation
 * @param {string} props.resumeStatus - Status of resume generation
 * @param {boolean} props.isLoading - Whether an action is in progress
 * @returns {JSX.Element} Action menu element
 */
const ActionMenu = ({
  isOpen,
  onGenerateCoverLetter,
  onGenerateResume,
  onAbout,
  onProfile,
  coverLetterStatus = null,
  resumeStatus = null,
  profileStatus = null,
  isLoading = false,
}) => {
  const features = {
    coverLetter: isFeatureEnabled("coverLetterGeneration"),
    resume: isFeatureEnabled("resumeGeneration"),
    resumeAnalysis: isFeatureEnabled("resumeAnalysis"),
    profileUploads: isFeatureEnabled("profileUploads"),
  };

  return (
    <div
      className={`
        flex flex-col items-center gap-1.5
        transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)
        ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-5 pointer-events-none"
        }
      `}
    >
      {/* Cover Letter Generation Button */}
      {features.coverLetter && (
        <ActionButton
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
              <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
            </svg>
          }
          label="Generate Cover Letter"
          onClick={onGenerateCoverLetter}
          isPrimary={true}
          disabled={isLoading}
          status={coverLetterStatus}
        />
      )}

      {/* Resume Generation Button */}
      {features.resume && (
        <ActionButton
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M4.5 4.125C4.5 3.504 5.004 3 5.625 3h7.5c.621 0 1.125.504 1.125 1.125V9.75H9.75a2.25 2.25 0 00-2.25 2.25v6.75H5.625A1.125 1.125 0 014.5 17.625v-13.5z" />
              <path d="M9.75 10.875c0-.621.504-1.125 1.125-1.125h6.75c.621 0 1.125.504 1.125 1.125v9c0 .621-.504 1.125-1.125 1.125h-6.75A1.125 1.125 0 019.75 19.875v-9z" />
            </svg>
          }
          label="Generate Resume"
          onClick={onGenerateResume}
          isPrimary={false}
          disabled={isLoading}
          status={resumeStatus}
        />
      )}

      {/* Profile uploads */}
      {features.profileUploads && (
        <ActionButton
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25a4.5 4.5 0 00-4.5 4.5v.75a4.5 4.5 0 009 0v-.75A4.5 4.5 0 0012 2.25zm-2.25 5.25a2.25 2.25 0 114.5 0v.75a2.25 2.25 0 11-4.5 0v-.75z"
                clipRule="evenodd"
              />
              <path d="M4.5 20.25A7.5 7.5 0 0112 12.75a7.5 7.5 0 017.5 7.5.75.75 0 01-.75.75h-15a.75.75 0 01-.75-.75z" />
            </svg>
          }
          label="Profile uploads"
          onClick={onProfile}
          disabled={isLoading}
          status={profileStatus}
        />
      )}

      {/* Resume Analysis Button (Coming Soon) */}
      {features.resumeAnalysis && (
        <ActionButton
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
            </svg>
          }
          label="Analyze Resume (Coming Soon)"
          disabled={true}
        />
      )}

      {/* About Button */}
      <ActionButton
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
              clipRule="evenodd"
            />
          </svg>
        }
        label="About & Portal"
        onClick={onAbout}
        disabled={isLoading}
      />
    </div>
  );
};

export default ActionMenu;
