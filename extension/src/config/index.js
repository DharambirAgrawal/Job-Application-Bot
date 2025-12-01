/**
 * Configuration management for the Chrome Extension
 * Handles environment switching between development and production
 * @module config
 */

/**
 * Main configuration object
 * Change ENVIRONMENT to switch between 'development' and 'production'
 */
const detectEnvironment = () => {
  try {
    const metaEnv = typeof import.meta !== "undefined" ? import.meta.env : null;
    const explicitEnv = metaEnv && metaEnv.VITE_APP_ENV;
    if (explicitEnv && ["development", "production"].includes(explicitEnv)) {
      return explicitEnv;
    }
    const mode = metaEnv && metaEnv.MODE;
    if (mode === "development") {
      return "development";
    }
  } catch (error) {
    console.warn(
      "Unable to detect environment from Vite. Falling back to production.",
      error
    );
  }
  return "production";
};

const CONFIG = {
  // Change this to switch environments
  ENVIRONMENT: detectEnvironment(), // 'development' or 'production'

  // API endpoints for different environments
  API_ENDPOINTS: {
    development: {
      baseUrl: "http://127.0.0.1:5000",
      generateCoverLetter: "/api/generate_coverletter",
      upload: "/api/upload",
      hello: "/api/hello",
      convertToPdf: "/api/convert_to_pdf",
    },
    production: {
      baseUrl: "https://project981.pythonanywhere.com",
      generateCoverLetter: "/api/generate_coverletter",
      upload: "/api/upload",
      hello: "/api/hello",
      convertToPdf: "/api/convert_to_pdf",
    },
  },

  // UI Configuration
  UI: {
    floatingButtonSize: 56,
    floatingButtonColor: "#4F46E5",
    animationDuration: 300,
    dropdownWidth: 232,
    portalUrl: "https://project981.pythonanywhere.com",
    minSelectionLength: 80, // Minimum characters for auto-show
  },

  // Feature flags - enable/disable features
  FEATURES: {
    coverLetterGeneration: true,
    resumeAnalysis: false,
    jobMatching: false,
  },
};

/**
 * Get the current API base URL based on environment
 * @returns {string} The base URL for the current environment
 */
export const getApiBaseUrl = () => {
  return CONFIG.API_ENDPOINTS[CONFIG.ENVIRONMENT].baseUrl;
};

/**
 * Get the full API endpoint URL
 * @param {string} endpointName - Name of the endpoint (e.g., 'generateCoverLetter')
 * @returns {string} Full endpoint URL
 */
export const getApiEndpoint = (endpointName) => {
  const endpoints = CONFIG.API_ENDPOINTS[CONFIG.ENVIRONMENT];
  return endpoints.baseUrl + endpoints[endpointName];
};

/**
 * Check if a feature is enabled
 * @param {string} featureName - Name of the feature
 * @returns {boolean} Whether the feature is enabled
 */
export const isFeatureEnabled = (featureName) => {
  return CONFIG.FEATURES[featureName] || false;
};

/**
 * Get UI configuration value
 * @param {string} key - Configuration key
 * @returns {*} Configuration value
 */
export const getUIConfig = (key) => {
  return CONFIG.UI[key];
};

/**
 * Get current environment
 * @returns {string} Current environment name
 */
export const getEnvironment = () => {
  return CONFIG.ENVIRONMENT;
};

/**
 * Check if running in development mode
 * @returns {boolean} True if in development mode
 */
export const isDevelopment = () => {
  return CONFIG.ENVIRONMENT === "development";
};

/**
 * Check if running in production mode
 * @returns {boolean} True if in production mode
 */
export const isProduction = () => {
  return CONFIG.ENVIRONMENT === "production";
};

export default CONFIG;
