'use client';

import { useState } from 'react';
import ProfileSection from './ProfileSection';
import CoverLetterSection from './CoverLetterSection';

type Tab = 'profile' | 'coverletter';

export default function DashboardLayout() {
  const [activeTab, setActiveTab] = useState<Tab>('coverletter');

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Job Application Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your profile and generate cover letters</p>
        </header>

        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex gap-8">
                <button
                onClick={() => setActiveTab('coverletter')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'coverletter'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Cover Letter
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'profile'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Profile
              </button>
              
            </nav>
          </div>
        </div>

        <div className="max-w-4xl">
          {activeTab === 'coverletter' && <CoverLetterSection />}
          {activeTab === 'profile' && <ProfileSection />}
        </div>
      </div>
    </div>
  );
}
