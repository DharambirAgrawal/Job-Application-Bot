const CONFIG = {
  // Change this to switch environments
  ENVIRONMENT: "development", // 'development' or 'production'

  // API key (set VITE_JOB_ASSISTANT_API_KEY in your env)

  // API endpoints for different environments
  API_ENDPOINTS: {
    development: {
      baseUrl: "http://127.0.0.1:5000",
      generateCoverLetter: "/api/generate_coverletter",
      generateResume: "/api/generate_resume",
      upload: "/api/upload",
      uploadTemplate: "/api/upload-template",
      uploadSummary: "/api/upload-summary",
      hello: "/api/hello",
      convertToPdf: "/api/convert_to_pdf",
      convertHtmlToPdf: "/api/html_to_pdf",
    },
    production: {
      baseUrl: "https://job-application-bot-mw1m.onrender.com",
      generateCoverLetter: "/api/generate_coverletter",
      generateResume: "/api/generate_resume",
      upload: "/api/upload",
      uploadTemplate: "/api/upload-template",
      uploadSummary: "/api/upload-summary",
      hello: "/api/hello",
      convertToPdf: "/api/convert_to_pdf",
      convertHtmlToPdf: "/api/html_to_pdf",
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
    resumeGeneration: true,
    resumeAnalysis: false,
    jobMatching: false,
    profileUploads: true,
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

export const isProduction = () => {
  return CONFIG.ENVIRONMENT === "production";
};

export default CONFIG;
