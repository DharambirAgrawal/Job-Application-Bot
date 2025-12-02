import React, { useState, useEffect } from "react";
import DocumentProcessor from "../services/documentProcessor";
import APIService from "../services/api";
const PreviewModal = ({ isOpen, onClose, docxBlob, onDownloadComplete }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [htmlContent, setHtmlContent] = useState("");
  const [error, setError] = useState(null);
  const [isDownloading, setIsDownloading] = useState({
    docx: false,
    pdf: false,
  });

  useEffect(() => {
    if (isOpen && docxBlob) {
      loadPreview();
    }
  }, [isOpen, docxBlob]);

  const loadPreview = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const html = await DocumentProcessor.docxToHtml(docxBlob);
      setHtmlContent(html);
    } catch (err) {
      console.error("Error loading preview:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (format) => {
    try {
      setIsDownloading((prev) => ({ ...prev, [format]: true }));

      if (format === "docx") {
        downloadFile(docxBlob, "cover-letter.docx");
      } else if (format === "pdf") {
        if (!htmlContent) {
          throw new Error("Preview content not available for PDF generation");
        }

        // Inject Google Fonts for signature fallback
        // We use 'Alex Brush' as a close alternative to 'Brush Script MT'
        // We also define a @font-face alias so that 'Brush Script MT' resolves to the remote font
        const fontFix = `
          <link href="https://fonts.googleapis.com/css2?family=Alex+Brush&display=swap" rel="stylesheet">
          <style>
            @font-face {
              font-family: 'Brush Script MT';
              src: local('Alex Brush'), url('https://fonts.gstatic.com/s/alexbrush/v22/RZZlgtuhnbJt2Qb6iF_I3w.woff2') format('woff2');
            }
            /* Also force replacement for variants just in case */
            [style*="Brush Script MT"], [style*="Brush Script Std"], [style*="Brush Script"] {
              font-family: 'Alex Brush', 'Brush Script MT', cursive !important;
            }
          </style>
        `;

        const pdfBlob = await APIService.convertHtmlToPdf(
          fontFix + htmlContent
        );
        if (!pdfBlob || pdfBlob.size === 0) {
          throw new Error("Generated PDF is empty");
        }
        downloadFile(pdfBlob, "cover-letter.pdf");
      }

      if (onDownloadComplete) {
        onDownloadComplete(format);
      }

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error("Download error:", err);
      setError(`Download failed: ${err.message}`);
    } finally {
      setIsDownloading((prev) => ({ ...prev, [format]: false }));
    }
  };

  const downloadFile = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div
      className="
        fixed inset-0 z-1000001
        bg-black/50 backdrop-blur-sm
        flex items-center justify-center
        animate-fadeIn
      "
      onClick={onClose}
    >
      <div
        className="
          bg-white rounded-2xl shadow-2xl
          w-[95%] max-w-4xl max-h-[90vh]
          overflow-hidden
          flex flex-col
          transform transition-all duration-300
          scale-100
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 shrink-0">
          <h3 className="text-lg font-bold text-gray-900">
            Cover Letter Preview
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="
              p-1 rounded-lg
              text-gray-600 hover:text-gray-900
              hover:bg-gray-100
              transition-colors duration-200
            "
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 mr-3 animate-spin"
              >
                <path d="M4.5 12a1.5 1.5 0 003 0 1.5 1.5 0 00-3 0zM10.5 12a1.5 1.5 0 003 0 1.5 1.5 0 00-3 0zM16.5 12a1.5 1.5 0 003 0 1.5 1.5 0 00-3 0z" />
              </svg>
              Loading preview...
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="text-yellow-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-12 h-12 mx-auto"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h4 className="text-gray-900 font-semibold mb-2">
                Preview Unavailable
              </h4>
              <p className="text-gray-600 mb-4">
                Unable to preview the document content, but you can still
                download it.
              </p>
              <p className="text-xs text-gray-500">{error}</p>
            </div>
          ) : (
            <div
              className="
                bg-white rounded-lg shadow-sm
                p-10 min-h-[600px]
                font-serif text-base leading-relaxed text-gray-900
              "
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 justify-end px-6 py-5 border-t border-gray-200 shrink-0">
          <button
            type="button"
            onClick={() => handleDownload("docx")}
            disabled={isDownloading.docx || isDownloading.pdf}
            className="
              inline-flex items-center gap-2
              px-4 py-2.5
              border border-gray-300 bg-white
              text-gray-900 font-medium text-sm
              rounded-lg
              hover:bg-gray-50 hover:border-gray-400
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
            "
          >
            {isDownloading.docx ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 animate-spin"
              >
                <path d="M4.5 12a1.5 1.5 0 003 0 1.5 1.5 0 00-3 0zM10.5 12a1.5 1.5 0 003 0 1.5 1.5 0 00-3 0zM16.5 12a1.5 1.5 0 003 0 1.5 1.5 0 00-3 0z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M5.625 1.5H9a3.75 3.75 0 013.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 013.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 01-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875zM9.75 14.25a.75.75 0 000 1.5H15a.75.75 0 000-1.5H9.75z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            Download DOCX
          </button>

          <button
            type="button"
            onClick={() => handleDownload("pdf")}
            disabled={isDownloading.docx || isDownloading.pdf}
            className="
              inline-flex items-center gap-2
              px-4 py-2.5
              bg-linear-to-br from-indigo-600 to-purple-600
              text-white font-semibold text-sm
              rounded-lg
              shadow-lg shadow-indigo-500/30
              hover:shadow-xl hover:shadow-indigo-500/40
              hover:-translate-y-0.5
              disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0
              transition-all duration-200
            "
          >
            {isDownloading.pdf ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 animate-spin"
              >
                <path d="M4.5 12a1.5 1.5 0 003 0 1.5 1.5 0 00-3 0zM10.5 12a1.5 1.5 0 003 0 1.5 1.5 0 00-3 0zM16.5 12a1.5 1.5 0 003 0 1.5 1.5 0 00-3 0z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M5.625 1.5H9a3.75 3.75 0 013.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 013.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 01-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875zM9.75 8.25a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5zM9 10.5a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5A.75.75 0 019 10.5zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H9.75z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
