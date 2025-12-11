/**
 * Toast notification component
 * Displays temporary notification messages
 * @module components/Toast
 */

import React from 'react';

/**
 * Icon components for different toast types
 */
const SuccessIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className="w-6 h-6 text-green-500"
  >
    <path 
      fillRule="evenodd" 
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" 
      clipRule="evenodd" 
    />
  </svg>
);

const ErrorIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className="w-6 h-6 text-red-500"
  >
    <path 
      fillRule="evenodd" 
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" 
      clipRule="evenodd" 
    />
  </svg>
);

const InfoIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className="w-6 h-6 text-blue-500"
  >
    <path 
      fillRule="evenodd" 
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" 
      clipRule="evenodd" 
    />
  </svg>
);

/**
 * Toast component for displaying notifications
 * @param {Object} props - Component props
 * @param {Object} props.toast - Toast data with message, type, and id
 * @param {Function} props.onDismiss - Callback when toast is dismissed
 * @returns {JSX.Element|null} Toast element or null
 */
const Toast = ({ toast, onDismiss }) => {
  if (!toast) return null;

  const { message, type } = toast;

  // Icon mapping
  const iconMap = {
    success: <SuccessIcon />,
    error: <ErrorIcon />,
    info: <InfoIcon />
  };

  // Border color mapping
  const borderColorMap = {
    success: 'border-l-green-500',
    error: 'border-l-red-500',
    info: 'border-l-blue-500'
  };

  return (
    <div 
      className={`
        fixed top-5 right-5 z-1000002
        bg-white rounded-xl shadow-2xl
        flex items-center gap-3
        px-5 py-4 max-w-md
        border-l-4 ${borderColorMap[type]}
        animate-slideInRight
      `}
      role="alert"
    >
      {iconMap[type]}
      <span className="text-sm text-gray-900 font-medium flex-1">
        {message}
      </span>
    </div>
  );
};

export default Toast;
