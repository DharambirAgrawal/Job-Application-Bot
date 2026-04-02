/**
 * Content script entry point for Job Application Assistant Chrome Extension
 * Injects the React app into the host page
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import stylesText from './index.css?inline'
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

  const shadowRoot = rootContainer.attachShadow({ mode: 'open' });

  const styleElement = document.createElement('style');
  styleElement.textContent = stylesText;

  shadowRoot.appendChild(styleElement);

  const appContainer = document.createElement('div');
  appContainer.setAttribute('data-job-assistant-root', 'true');
  shadowRoot.appendChild(appContainer);

  // Render React app
  createRoot(appContainer).render(
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

