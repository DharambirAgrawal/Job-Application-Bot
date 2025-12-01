/**
 * Custom hook for detecting text selection on the page
 * Automatically shows the menu when user selects text above minimum length
 * @module hooks/useTextSelection
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { getUIConfig } from '../config';

/**
 * Custom hook for handling text selection
 * @param {Function} onTextSelected - Callback when text is selected
 * @param {Function} onSelectionCleared - Callback when selection is cleared
 * @returns {Object} Selection state and methods
 */
const useTextSelection = (onTextSelected, onSelectionCleared) => {
  const [selectedText, setSelectedText] = useState('');
  const selectionTimeoutRef = useRef(null);
  const minSelectionLength = getUIConfig('minSelectionLength') || 100;
  const isSelectingRef = useRef(false);

  const clearScheduledSelection = useCallback(() => {
    if (selectionTimeoutRef.current) {
      clearTimeout(selectionTimeoutRef.current);
      selectionTimeoutRef.current = null;
    }
  }, []);

  const normalizeSelectionText = (rawText) => {
    return rawText.replace(/\s+/g, ' ').trim();
  };

  /**
   * Handle text selection change
   */
  const handleSelectionChange = useCallback(() => {
    if (isSelectingRef.current) {
      return;
    }

    const selection = typeof window !== 'undefined' ? window.getSelection() : null;
    if (!selection || selection.rangeCount === 0) {
      if (selectedText) {
        setSelectedText('');
        if (onSelectionCleared) {
          onSelectionCleared();
        }
      }
      clearScheduledSelection();
      return;
    }

    const text = normalizeSelectionText(selection.toString());

    clearScheduledSelection();

    selectionTimeoutRef.current = setTimeout(() => {
      if (text.length === 0) {
        if (selectedText) {
          setSelectedText('');
          if (onSelectionCleared) {
            onSelectionCleared();
          }
        }
        return;
      }

      if (text.length >= minSelectionLength || text.split(' ').length > 10) {
        setSelectedText(text);
        if (onTextSelected) {
          onTextSelected(text);
        }
      }
    }, 180);
  }, [clearScheduledSelection, minSelectionLength, onSelectionCleared, onTextSelected, selectedText]);

  /**
   * Handle mouse up event for selection
   */
  const handleMouseUp = useCallback(() => {
    isSelectingRef.current = false;
    handleSelectionChange();
  }, [handleSelectionChange]);

  const handleMouseDown = useCallback(() => {
    isSelectingRef.current = true;
    clearScheduledSelection();
  }, [clearScheduledSelection]);

  /**
   * Clear the selected text
   */
  const clearSelection = useCallback(() => {
    setSelectedText('');
    clearScheduledSelection();
    if (typeof window !== 'undefined') {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
      }
    }
  }, [clearScheduledSelection]);

  // Setup event listeners
  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('keyup', handleSelectionChange);
    document.addEventListener('touchend', handleMouseUp);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('touchstart', handleMouseDown);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('keyup', handleSelectionChange);
      document.removeEventListener('touchend', handleMouseUp);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('touchstart', handleMouseDown);
      clearScheduledSelection();
    };
  }, [clearScheduledSelection, handleMouseDown, handleMouseUp, handleSelectionChange]);

  return {
    selectedText,
    clearSelection,
    hasSelection: selectedText.length > 0
  };
};

export default useTextSelection;
