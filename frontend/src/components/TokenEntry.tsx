import { useState } from 'react';
import { LogIn } from 'lucide-react';

interface TokenEntryProps {
  onSubmit: (token: string) => void;
  loading: boolean;
}

export function TokenEntry({ onSubmit, loading }: TokenEntryProps) {
  const [token, setToken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      onSubmit(token.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-4 shadow-2xl">
            <LogIn className="w-8 h-8 text-gray-900" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Interview Room</h1>
          <p className="text-gray-400">Enter your access token to join</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter your token..."
              disabled={loading}
              className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading || !token.trim()}
            className="w-full py-4 px-6 bg-white text-gray-900 rounded-2xl font-semibold hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl"
          >
            {loading ? 'Joining...' : 'Join Room'}
          </button>
        </form>

        <div className="mt-8 p-4 bg-gray-800/30 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
          <p className="text-sm text-gray-400 text-center">
            Demo tokens: <br />
            <code className="text-white">candidate_demo_token_12345</code>
            <br />
            <code className="text-white">reviewer_demo_token_67890</code>
          </p>
        </div>
      </div>
    </div>
  );
}
