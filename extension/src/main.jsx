/**
 * Content script entry point for Job Application Assistant Chrome Extension
 * Injects the React app into the host page
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

/**
 * Initialize the extension on the page
 */
function initExtension() {
  // Check if extension is already initialized
  if (document.getElementById('job-assistant-root')) {
    console.warn('Job Assistant Extension already initialized');
    return;
  }

  // Create root container for the extension
  const rootContainer = document.createElement('div');
  rootContainer.id = 'job-assistant-root';
  
  // Add to page
  document.body.appendChild(rootContainer);

  // Render React app
  createRoot(rootContainer).render(
    <StrictMode>
      <App />
    </StrictMode>
  );

  console.log('✅ Job Assistant Extension initialized');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initExtension);
} else {
  initExtension();
}

