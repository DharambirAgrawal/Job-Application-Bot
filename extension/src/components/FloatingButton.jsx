/**
 * Floating action button component
 * Main entry point for the extension UI
 * @module components/FloatingButton
 */

import React, { useEffect } from "react";

/**
 * Floating button component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the actions menu is open
 * @param {Function} props.onClick - Click handler
 * @param {Function} props.onMouseDown - Mouse down handler for dragging
 * @param {Function} props.onMouseMove - Mouse move handler for dragging
 * @param {Function} props.onMouseUp - Mouse up handler for dragging
 * @param {boolean} props.isDragging - Whether the button is being dragged
 * @returns {JSX.Element} Floating button element
 */
const FloatingButton = ({
  isOpen,
  onClick,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  isDragging,
}) => {
  // Add global mouse event listeners for dragging
  useEffect(() => {
    if (onMouseMove) {
      document.addEventListener("mousemove", onMouseMove);
    }
    if (onMouseUp) {
      document.addEventListener("mouseup", onMouseUp);
    }

    return () => {
      if (onMouseMove) {
        document.removeEventListener("mousemove", onMouseMove);
      }
      if (onMouseUp) {
        document.removeEventListener("mouseup", onMouseUp);
      }
    };
  }, [onMouseMove, onMouseUp]);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseDown={onMouseDown}
      data-job-assistant-element="fab"
      className={`
        job-assistant-fab
        w-14 h-14 rounded-full
        bg-linear-to-br from-indigo-600 to-purple-600
        shadow-lg shadow-indigo-500/30
        flex items-center justify-center
        transition-all duration-200
        hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/40
        active:scale-95
        ${isDragging ? "cursor-grabbing" : "cursor-grab"}
      `}
      style={{
        width: "56px",
        height: "56px",
        borderRadius: "9999px",
        background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
        boxShadow: "0 10px 25px rgba(79, 70, 229, 0.35)",
        border: "none",
      }}
      aria-label="Job Assistant Menu"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 18 18"
        fill="none"
        className={`
          job-assistant-fab-icon
          w-5 h-5 text-white
          transition-transform duration-300
          ${isOpen ? "rotate-45" : "rotate-0"}
        `}
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 1v16M1 9h16"
        />
      </svg>
    </button>
  );
};

export default FloatingButton;
