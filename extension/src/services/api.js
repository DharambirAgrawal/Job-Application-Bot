import { getApiEndpoint, getApiKey } from "../config";
class APIService {
  static async generateCoverLetter(jobDescription) {
    try {
      const endpoint = getApiEndpoint("generateCoverLetter");

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": getApiKey(),
        },
        body: JSON.stringify({
          job_description: jobDescription,
        }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to generate cover letter";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      return response.blob();
    } catch (error) {
      console.error("API error while generating cover letter", error);

      if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("NetworkError")
      ) {
        throw new Error(
          "🌐 Network error: Cannot reach the API. Check if the backend is running."
        );
      } else if (error.message.includes("CORS")) {
        throw new Error(
          "🔒 CORS error: API not configured for cross-origin requests."
        );
      }

      throw error;
    }
  }

  static async uploadFile(file, filetype, foldername = "") {
    try {
      const endpoint = getApiEndpoint("upload");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("filetype", filetype);
      if (foldername) {
        formData.append("foldername", foldername);
      }

      const response = await fetch(endpoint, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "x-api-key": getApiKey(),
        },
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = "Failed to upload file";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      return response.json();
    } catch (error) {
      console.error("Upload error", error);
      throw error;
    }
  }

  static async convertToPdf(docxBlob) {
    try {
      const endpoint = getApiEndpoint("convertToPdf");

      const formData = new FormData();
      formData.append("file", docxBlob, "document.docx");

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "x-api-key": getApiKey(),
        },
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = "Failed to convert to PDF";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      return response.blob();
    } catch (error) {
      console.error("API error while converting to PDF", error);

      if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("NetworkError")
      ) {
        throw new Error(
          "🌐 Network error: Cannot reach the API. Check if the backend is running."
        );
      }

      throw error;
    }
  }

  static async convertHtmlToPdf(htmlContent) {
    try {
      const endpoint = getApiEndpoint("convertHtmlToPdf");

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": getApiKey(),
        },
        body: JSON.stringify({
          html: htmlContent,
        }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to convert HTML to PDF";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      return response.blob();
    } catch (error) {
      console.error("API error while converting HTML to PDF", error);
      throw error;
    }
  }

  static async testConnection() {
    try {
      const endpoint = getApiEndpoint("hello");

      const response = await fetch(endpoint, {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
      });

      return response.ok;
    } catch (error) {
      console.error("❌ Connection test failed:", error.message);
      console.error("Full error:", error);
      return false;
    }
  }
}

export default APIService;
