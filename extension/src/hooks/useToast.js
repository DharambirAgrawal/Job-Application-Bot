/**
 * Custom hook for showing toast notifications
 * Manages toast state and auto-dismissal
 * @module hooks/useToast
 */

import { useState, useCallback } from 'react';

/**
 * Custom hook for toast notifications
 * @returns {Object} Toast state and methods
 */
const useToast = () => {
  const [toast, setToast] = useState(null);

  /**
   * Show a toast notification
   * @param {string} message - Toast message
   * @param {string} type - Toast type: 'success', 'error', 'info'
   * @param {number} duration - Duration in ms (default: 4000)
   */
  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const toastData = {
      id: Date.now(),
      message,
      type
    };
    
    setToast(toastData);
    
    // Auto dismiss after duration
    setTimeout(() => {
      setToast(null);
    }, duration);
  }, []);

  /**
   * Dismiss the current toast
   */
  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  return {
    toast,
    showToast,
    dismissToast
  };
};

export default useToast;
