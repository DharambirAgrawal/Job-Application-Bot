import { renderAsync as renderDocx } from "docx-preview";
import docxPreviewInlineStyles from "../styles/docxPreview.css?inline";
import "../styles/docxPreview.css";
import * as mammoth from "mammoth/mammoth.browser";

class DocumentProcessor {
  static assertBrowser() {
    if (typeof window === "undefined" || typeof document === "undefined") {
      throw new Error("Document processing requires a browser environment.");
    }
  }

  static async docxToHtml(docxBlob) {
    this.assertBrowser();
    const arrayBuffer = await docxBlob.arrayBuffer();

    const previewHtml = await this.tryDocxPreview(arrayBuffer);
    if (previewHtml) {
      return previewHtml;
    }

    const fallbackHtml = await this.tryMammoth(arrayBuffer);
    if (fallbackHtml) {
      return fallbackHtml;
    }

    throw new Error("Failed to preview document");
  }

  static async tryDocxPreview(arrayBuffer) {
    try {
      const container = document.createElement("div");
      container.className = "job-assistant-docx-preview";

      await renderDocx(arrayBuffer, container, null, {
        className: "docx-preview-content",
        inWrapper: false,
        ignoreWidth: false,
        ignoreHeight: false,
        experimental: true,
        renderHeaders: true,
        useMathMLPolyfill: true,
        breakPages: false,
      });

      return `
        <style data-docx-preview>
          ${docxPreviewInlineStyles}
        </style>
        ${container.innerHTML}
      `;
    } catch (error) {
      console.warn("docx-preview failed, falling back to mammoth:", error);
      return null;
    }
  }

  static async tryMammoth(arrayBuffer) {
    if (!mammoth || typeof mammoth.convertToHtml !== "function") {
      return null;
    }

    try {
      const result = await mammoth.convertToHtml(
        { arrayBuffer },
        {
          styleMap: [
            "p.Heading1 => h1",
            "p.Heading2 => h2",
            "p.Heading3 => h3",
            "p.Title => h1",
            "p.Subtitle => h2",
          ],
        }
      );

      return `
        <style data-docx-preview>
          ${docxPreviewInlineStyles}
        </style>
        <div class="docx-preview-content">${result.value}</div>
      `;
    } catch (error) {
      console.error("mammoth conversion failed:", error);
      return null;
    }
  }
}

export default DocumentProcessor;
