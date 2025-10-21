'use client';

import { useState } from 'react';

export default function CoverLetterSection() {
  const [jobDescription, setJobDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState('');

  const MAX_WORDS = 800;

  const countWords = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const wordCount = countWords(text);

    if (wordCount <= MAX_WORDS) {
      setJobDescription(text);
    }
  };

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      alert('Please enter a job description');
      return;
    }

    setIsGenerating(true);

    try {
      // Dummy API call - replace with actual backend call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Dummy generated cover letter
      const dummyCoverLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the position described. With my background and skills, I believe I would be an excellent fit for this role.

Based on the job description you provided, I have relevant experience in the key areas mentioned. My professional background aligns well with the requirements, and I am excited about the opportunity to contribute to your team.

I am confident that my skills and passion make me a strong candidate for this position. I look forward to the opportunity to discuss how I can add value to your organization.

Thank you for considering my application.

Best regards,
[Your Name]`;

      setGeneratedCoverLetter(dummyCoverLetter);
    } catch (error) {
      console.error('Error generating cover letter:', error);
      alert('Failed to generate cover letter');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClear = () => {
    setJobDescription('');
    setGeneratedCoverLetter('');
  };

  const wordCount = countWords(jobDescription);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Cover Letter Generator</h2>
      
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">
              Job Description
            </label>
            <span className={`text-sm ${wordCount > MAX_WORDS * 0.9 ? 'text-red-600' : 'text-gray-500'}`}>
              {wordCount} / {MAX_WORDS} words
            </span>
          </div>
          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={handleInputChange}
            placeholder="Paste the job description here (max 800 words)..."
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-700"
          />
          <p className="mt-1 text-xs text-gray-500">
            Enter the job description to generate a tailored cover letter
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !jobDescription.trim()}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isGenerating ? 'Generating...' : 'Generate Cover Letter'}
          </button>
          <button
            onClick={handleClear}
            disabled={!jobDescription && !generatedCoverLetter}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors font-medium text-gray-700"
          >
            Clear
          </button>
        </div>

        {generatedCoverLetter && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Generated Cover Letter</h3>
            <div className="bg-gray-50 rounded-md p-4">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                {generatedCoverLetter}
              </pre>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedCoverLetter);
                alert('Cover letter copied to clipboard!');
              }}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium text-sm"
            >
              Copy to Clipboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
