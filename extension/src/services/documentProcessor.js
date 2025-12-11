class DocumentProcessor {
  static previewStylesPromise = null;

  static assertBrowser() {
    if (typeof window === "undefined" || typeof document === "undefined") {
      throw new Error("Document processing requires a browser environment.");
    }
  }

  static async loadPreviewStyles() {
    if (!this.previewStylesPromise) {
      this.previewStylesPromise = import(
        "../styles/docxPreview.css?inline"
      ).then((mod) => mod.default || "");
    }

    return this.previewStylesPromise;
  }

  static async docxToHtml(docxBlob) {
    this.assertBrowser();
    const [arrayBuffer, previewStyles] = await Promise.all([
      docxBlob.arrayBuffer(),
      this.loadPreviewStyles(),
    ]);

    const previewHtml = await this.tryDocxPreview(arrayBuffer, previewStyles);
    if (previewHtml) {
      return previewHtml;
    }

    const fallbackHtml = await this.tryMammoth(arrayBuffer, previewStyles);
    if (fallbackHtml) {
      return fallbackHtml;
    }

    throw new Error("Failed to preview document");
  }

  static async tryDocxPreview(arrayBuffer, previewStyles) {
    try {
      const { renderAsync: renderDocx } = await import("docx-preview");
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
          ${previewStyles}
        </style>
        ${container.innerHTML}
      `;
    } catch (error) {
      console.warn("docx-preview failed, falling back to mammoth:", error);
      return null;
    }
  }

  static async tryMammoth(arrayBuffer, previewStyles) {
    let mammoth;

    try {
      mammoth = await import("mammoth/mammoth.browser");
    } catch (error) {
      console.warn("mammoth import failed:", error);
      return null;
    }

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
          ${previewStyles}
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
