// Shared types for the dashboard application

export interface ProfileData {
  resume: File | null;
  coverLetter: File | null;
}

export interface ProfileResponse {
  success: boolean;
  message?: string;
  data?: {
    resumeUrl?: string;
    coverLetterUrl?: string;
  };
}

export interface CoverLetterRequest {
  jobDescription: string;
}

export interface CoverLetterResponse {
  success: boolean;
  message?: string;
  data?: {
    coverLetter: string;
  };
}

export type TabType = 'profile' | 'coverletter';
