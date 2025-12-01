/**
 * Custom hook for modal state management
 * Handles open/close state and keyboard events
 * @module hooks/useModal
 */

import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook for modal management
 * @param {Function} onClose - Optional callback when modal closes
 * @returns {Object} Modal state and methods
 */
const useModal = (onClose) => {
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Open the modal
   */
  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  /**
   * Close the modal
   */
  const closeModal = useCallback(() => {
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  /**
   * Toggle modal state
   */
  const toggleModal = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  /**
   * Handle escape key to close modal
   */
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeModal]);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal
  };
};

export default useModal;
