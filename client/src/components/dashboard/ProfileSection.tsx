'use client';

import { useState } from 'react';

export default function ProfileSection() {
  const [resume, setResume] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState<File | null>(null);
  const [isSubmittingResume, setIsSubmittingResume] = useState(false);
  const [isSubmittingCover, setIsSubmittingCover] = useState(false);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'resume' | 'coverLetter'
  ) => {
    const file = e.target.files?.[0] || null;
    if (type === 'resume') {
      setResume(file);
    } else {
      setCoverLetter(file);
    }
  };

  const handleResumeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume) return;

    setIsSubmittingResume(true);
    try {
      const formData = new FormData();
      formData.append('resume', resume);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert('Resume submitted successfully!');
      setResume(null);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Resume submission failed:', error);
      alert('Failed to submit resume');
    } finally {
      setIsSubmittingResume(false);
    }
  };

  const handleCoverLetterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverLetter) return;

    setIsSubmittingCover(true);
    try {
      const formData = new FormData();
      formData.append('coverLetter', coverLetter);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert('Cover letter submitted successfully!');
      setCoverLetter(null);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Cover letter submission failed:', error);
      alert('Failed to submit cover letter');
    } finally {
      setIsSubmittingCover(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-8">
      <h2 className="text-2xl font-semibold text-gray-800">Profile</h2>

      {/* Resume Upload Form */}
      <form onSubmit={handleResumeSubmit} className="space-y-4">
        <div>
          <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-2">
            Resume (PDF, DOC, DOCX)
          </label>
          <input
            type="file"
            id="resume"
            accept=".pdf,.doc,.docx"
            onChange={(e) => handleFileChange(e, 'resume')}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />
          {resume && (
            <p className="mt-2 text-sm text-gray-600">Selected: {resume.name}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmittingResume || !resume}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isSubmittingResume ? 'Submitting Resume...' : 'Submit Resume'}
        </button>
      </form>

      {/* Cover Letter Upload Form */}
      <form onSubmit={handleCoverLetterSubmit} className="space-y-4">
        <div>
          <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
            Cover Letter (PDF, DOC, DOCX)
          </label>
          <input
            type="file"
            id="coverLetter"
            accept=".pdf,.doc,.docx"
            onChange={(e) => handleFileChange(e, 'coverLetter')}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />
          {coverLetter && (
            <p className="mt-2 text-sm text-gray-600">Selected: {coverLetter.name}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmittingCover || !coverLetter}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isSubmittingCover ? 'Submitting Cover Letter...' : 'Submit Cover Letter'}
        </button>
      </form>
    </div>
  );
}
