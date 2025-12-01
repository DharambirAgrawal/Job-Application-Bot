/**
 * Custom hook for making elements draggable
 * Allows floating UI elements to be repositioned by user
 * @module hooks/useDraggable
 */

import { useState, useCallback, useRef } from 'react';

/**
 * Custom hook for drag functionality
 * @param {Object} initialPosition - Initial {x, y} position
 * @returns {Object} Drag state and event handlers
 */
const useDraggable = (initialPosition = { x: null, y: null }) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
  const hasMoved = useRef(false);

  /**
   * Handle drag start
   */
  const handleMouseDown = useCallback((e) => {
    // Get current position
    const element = e.currentTarget.parentElement || e.currentTarget;
    const rect = element.getBoundingClientRect();
    
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      posX: rect.left,
      posY: rect.top
    };
    
    hasMoved.current = false;
    setIsDragging(false); // Don't set dragging true until actual movement
  }, []);

  /**
   * Handle drag movement
   */
  const handleMouseMove = useCallback((e) => {
    if (!dragStartRef.current.x) return;

    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    
    // Only consider it dragging if moved more than 5px
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      setIsDragging(true);
      hasMoved.current = true;
      
      const newX = dragStartRef.current.posX + deltaX;
      const newY = dragStartRef.current.posY + deltaY;
      
      // Keep within viewport bounds
      const maxX = window.innerWidth - 70;
      const maxY = window.innerHeight - 70;
      
      const boundedX = Math.max(20, Math.min(newX, maxX));
      const boundedY = Math.max(20, Math.min(newY, maxY));
      
      setPosition({ x: boundedX, y: boundedY });
    }
  }, []);

  /**
   * Handle drag end
   */
  const handleMouseUp = useCallback(() => {
    if (dragStartRef.current.x) {
      // Small delay before resetting to allow click handlers to check isDragging
      setTimeout(() => {
        setIsDragging(false);
      }, 100);
      
      dragStartRef.current = { x: 0, y: 0, posX: 0, posY: 0 };
    }
  }, []);

  /**
   * Reset position to initial
   */
  const resetPosition = useCallback(() => {
    setPosition(initialPosition);
  }, [initialPosition]);

  /**
   * Get style object for positioning
   */
  const getPositionStyle = useCallback(() => {
    if (position.x !== null && position.y !== null) {
      return {
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        right: 'auto',
        bottom: 'auto'
      };
    }
    return {};
  }, [position]);

  return {
    position,
    isDragging,
    hasMovedRef: hasMoved,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    resetPosition,
    getPositionStyle
  };
};

export default useDraggable;
