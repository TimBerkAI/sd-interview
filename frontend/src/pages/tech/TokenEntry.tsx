import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code as Code2 } from 'lucide-react';
import { ThemeToggle } from '../../components/ThemeToggle';

export function TechTokenEntry() {
  const navigate = useNavigate();
  const [token, setToken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      navigate(`/tech/room/${token.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="absolute top-5 right-5">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 dark:bg-white rounded-2xl mb-4 shadow-lg">
            <Code2 className="w-8 h-8 text-white dark:text-gray-900" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Tech Interview</h1>
          <p className="text-gray-500 dark:text-gray-400">Enter your access token to join</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter your token..."
              className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={!token.trim()}
            className="w-full py-4 px-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-950 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            Join Room
          </button>
        </form>

        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-gray-200 dark:border-gray-700/50">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Demo tokens: <br />
            <code className="text-gray-900 dark:text-white">candidate-backend-python-senior-demo</code>
            <br />
            <code className="text-gray-900 dark:text-white">reviewer-backend-python-senior-demo</code>
          </p>
        </div>
      </div>
    </div>
  );
}
