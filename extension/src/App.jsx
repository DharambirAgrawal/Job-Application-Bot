import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import FloatingButton from "./components/FloatingButton";
import ActionMenu from "./components/ActionMenu";
import PreviewModal from "./components/PreviewModal";
import JobDescriptionModal from "./components/JobDescriptionModal";
import { PROFILE_UPLOADS_STORAGE_KEY } from "./components/profileStorage";
import Toast from "./components/Toast";
import useDraggable from "./hooks/useDraggable";
import useTextSelection from "./hooks/useTextSelection";
import useModal from "./hooks/useModal";
import useToast from "./hooks/useToast";
import APIService from "./services/api";
import { getEnvironment, getApiBaseUrl } from "./config";
import "./index.css";

const LazyAboutModal = lazy(() => import("./components/AboutModal"));
const LazyProfileModal = lazy(() => import("./components/ProfileModal"));

function App() {
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [coverLetterStatus, setCoverLetterStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDocxBlob, setCurrentDocxBlob] = useState(null);
  const [profileUploads, setProfileUploads] = useState({});

  const {
    isDragging,
    hasMovedRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    getPositionStyle,
  } = useDraggable({ x: null, y: null });

  const { toast, showToast } = useToast();

  const {
    isOpen: isAboutOpen,
    openModal: openAbout,
    closeModal: closeAbout,
  } = useModal();

  const {
    isOpen: isPreviewOpen,
    openModal: openPreview,
    closeModal: closePreview,
  } = useModal(() => {
    setCurrentDocxBlob(null);
  });

  const {
    isOpen: isManualInputOpen,
    openModal: openManualInput,
    closeModal: closeManualInput,
  } = useModal();

  const {
    isOpen: isProfileOpen,
    openModal: openProfile,
    closeModal: closeProfile,
  } = useModal();

  const { selectedText: autoSelectedText, clearSelection } = useTextSelection(
    (text) => {
      setSelectedText(text);
      setCoverLetterStatus("ready");
      setIsActionsOpen(true);
    },
    () => {
      setSelectedText("");
      setCoverLetterStatus(null);
      setIsActionsOpen(false);
    }
  );

  const toggleActions = useCallback(() => {
    if (!isDragging && !hasMovedRef.current) {
      setIsActionsOpen((prev) => !prev);
    }
  }, [isDragging, hasMovedRef]);

  const closeActions = useCallback(() => {
    setIsActionsOpen(false);
    setTimeout(() => {
      if (!isActionsOpen) {
        setSelectedText("");
        clearSelection();
        setCoverLetterStatus(null);
      }
    }, 300);
  }, [isActionsOpen, clearSelection]);

  const handleGenerateCoverLetter = async () => {
    const textToUse = selectedText || autoSelectedText;

    if (!textToUse) {
      openManualInput();
      return;
    }

    await startGeneration(textToUse);
  };

  const startGeneration = async (text) => {
    try {
      if (!text || text.trim().length === 0) {
        showToast("Please provide a job description first", "error");
        return;
      }

      setIsLoading(true);
      setCoverLetterStatus("loading");
      showToast("Generating cover letter...", "info");

      const blob = await APIService.generateCoverLetter(text);

      showToast("Cover letter generated successfully!", "success");
      setCurrentDocxBlob(blob);
      openPreview();

      setSelectedText("");
      clearSelection();
      setCoverLetterStatus(null);
      closeActions();
      closeManualInput();
    } catch (error) {
      console.error("Error generating cover letter:", error);
      showToast(error.message || "Failed to generate cover letter", "error");
      setCoverLetterStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAbout = () => {
    openAbout();
    closeActions();
  };

  const handleProfile = () => {
    openProfile();
    closeActions();
  };

  const handleDownloadComplete = (format) => {
    showToast(`${format.toUpperCase()} downloaded successfully!`, "success");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      const target = e.target;
      const isInsideUI = target.closest("[data-job-assistant]");

      if (isInsideUI || !isActionsOpen) {
        return;
      }

      const selection =
        typeof window !== "undefined" ? window.getSelection() : null;
      const activeSelection =
        selection && selection.toString().trim().length > 0;
      const storedSelection =
        (selectedText && selectedText.length > 0) ||
        (autoSelectedText && autoSelectedText.length > 0);

      if (activeSelection || storedSelection) {
        return;
      }

      closeActions();
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isActionsOpen, closeActions, selectedText, autoSelectedText]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return () => {};
    }

    let cancelled = false;

    const logToTestPage = (message) => {
      if (
        typeof window !== "undefined" &&
        typeof window.logTest === "function"
      ) {
        window.logTest(message);
      }
    };

    const updateEnvironmentStatus = () => {
      const environment = getEnvironment();
      const envLabel =
        environment.charAt(0).toUpperCase() + environment.slice(1);
      const statusNode = document.getElementById("config-env-text");
      if (statusNode) {
        statusNode.textContent = envLabel;
      }

      const configNode = document.getElementById("config-env");
      if (configNode) {
        configNode.textContent = environment;
      }

      const envIndicator = document.getElementById("config-status");
      if (envIndicator) {
        envIndicator.classList.remove("loading", "error");
      }

      const apiUrlNode = document.getElementById("config-api");
      if (apiUrlNode) {
        apiUrlNode.textContent = getApiBaseUrl();
      }

      const extensionStatusText = document.getElementById(
        "extension-loaded-text"
      );
      if (extensionStatusText) {
        extensionStatusText.textContent = "Loaded";
      }

      logToTestPage(
        `🌍 Environment detected: ${environment} (${getApiBaseUrl()})`
      );
    };

    const updateApiStatus = async () => {
      const indicator = document.getElementById("api-status");
      const statusText = document.getElementById("api-status-text");

      indicator?.classList.add("loading");
      if (statusText) {
        statusText.textContent = "Checking...";
      }

      try {
        const isOnline = await APIService.testConnection();

        if (cancelled) {
          return;
        }

        indicator?.classList.remove("loading");

        if (isOnline) {
          indicator?.classList.remove("error");
          if (statusText) {
            statusText.textContent = "Online";
          }
          logToTestPage("✅ Backend API reachable");
        } else {
          indicator?.classList.add("error");
          if (statusText) {
            statusText.textContent = "Offline";
          }
          logToTestPage("❌ Backend API unreachable");
        }
      } catch (error) {
        if (!cancelled) {
          indicator?.classList.add("error");
          indicator?.classList.remove("loading");
          if (statusText) {
            statusText.textContent = "Error";
          }
          logToTestPage(`⚠️ API status check failed: ${error.message}`);
        }
      }
    };

    const refreshStatus = () => {
      updateEnvironmentStatus();
      updateApiStatus();
    };

    updateEnvironmentStatus();
    updateApiStatus();

    document.addEventListener("job-assistant:refresh-status", refreshStatus);

    return () => {
      cancelled = true;
      document.removeEventListener(
        "job-assistant:refresh-status",
        refreshStatus
      );
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const stored = window.localStorage.getItem(PROFILE_UPLOADS_STORAGE_KEY);
      if (stored) {
        setProfileUploads(JSON.parse(stored));
      }
    } catch (error) {
      console.warn("Could not read profile uploads from storage", error);
    }
  }, []);

  const profileStatus =
    profileUploads &&
    (profileUploads.coverletter ||
      profileUploads.resume ||
      profileUploads.summary)
      ? "ready"
      : null;

  return (
    <>
      <div
        data-job-assistant="fab-container"
        className="fixed bottom-6 right-6 z-999999 flex flex-col items-center gap-2 select-none"
        style={{ ...getPositionStyle(), zIndex: 2147483647 }}
      >
        <ActionMenu
          isOpen={isActionsOpen}
          onGenerateCoverLetter={handleGenerateCoverLetter}
          onAbout={handleAbout}
          onProfile={handleProfile}
          coverLetterStatus={coverLetterStatus}
          isLoading={isLoading}
          profileStatus={profileStatus}
        />

        <FloatingButton
          isOpen={isActionsOpen}
          onClick={toggleActions}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          isDragging={isDragging}
        />
      </div>

      <Suspense fallback={null}>
        <LazyAboutModal isOpen={isAboutOpen} onClose={closeAbout} />
      </Suspense>

      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={closePreview}
        docxBlob={currentDocxBlob}
        onDownloadComplete={handleDownloadComplete}
      />

      <JobDescriptionModal
        isOpen={isManualInputOpen}
        onClose={closeManualInput}
        onSubmit={startGeneration}
        isSubmitting={isLoading}
      />

      <Suspense fallback={null}>
        <LazyProfileModal
          isOpen={isProfileOpen}
          onClose={closeProfile}
          uploads={profileUploads}
          onUploadsChange={setProfileUploads}
          showToast={showToast}
        />
      </Suspense>

      <Toast toast={toast} />
    </>
  );
}

export default App;
