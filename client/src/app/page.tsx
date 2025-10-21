import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Job Application Bot
        </h1>
        <p className="text-gray-600 mb-8">
          Streamline your job application process with AI-powered tools
        </p>
        
        <Link
          href="/dashboard"
          className="inline-block w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Go to Dashboard
        </Link>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Features</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✓ Upload and manage your resume</li>
            <li>✓ Generate custom cover letters</li>
            <li>✓ AI-powered job matching</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
