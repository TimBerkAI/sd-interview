import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck } from 'lucide-react';

export function Home() {
  const navigate = useNavigate();
  const [candidateToken, setCandidateToken] = useState('');
  const [reviewerToken, setReviewerToken] = useState('');

  const handleCandidateAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (candidateToken.trim()) {
      navigate(`/room/${candidateToken.trim()}`);
    }
  };

  const handleReviewerAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewerToken.trim()) {
      navigate(`/interview/${reviewerToken.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Interview Room System
          </h1>
          <p className="text-gray-600">
            Access your interview room or review session using your unique token
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Candidate</h2>
                <p className="text-sm text-gray-600">Take your interview</p>
              </div>
            </div>

            <form onSubmit={handleCandidateAccess}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter your candidate token
              </label>
              <input
                type="text"
                value={candidateToken}
                onChange={(e) => setCandidateToken(e.target.value)}
                placeholder="Enter token..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              />
              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Access Interview Room
              </button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> You will be able to view the task
                description and submit your answers for each section.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Reviewer</h2>
                <p className="text-sm text-gray-600">Review submissions</p>
              </div>
            </div>

            <form onSubmit={handleReviewerAccess}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter your reviewer token
              </label>
              <input
                type="text"
                value={reviewerToken}
                onChange={(e) => setReviewerToken(e.target.value)}
                placeholder="Enter token..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent mb-4"
              />
              <button
                type="submit"
                className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
              >
                Access Review Room
              </button>
            </form>

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Note:</strong> You will be able to review candidate
                answers, add comments, and assign scores.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
