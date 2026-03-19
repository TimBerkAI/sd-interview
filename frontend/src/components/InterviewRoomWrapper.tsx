import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { InterviewRoom } from './InterviewRoom';
import { api } from '../services/api';

export function InterviewRoomWrapper() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [validating, setValidating] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    validateToken();
  }, [token, navigate]);

  const validateToken = async () => {
    if (!token) return;

    setValidating(true);
    const session = await api.validateToken(token);

    if (!session) {
      alert('Invalid token or room not found');
      navigate('/');
      return;
    }

    setValidating(false);
  };

  if (!token || validating) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading room...</p>
        </div>
      </div>
    );
  }

  return <InterviewRoom token={token} />;
}
