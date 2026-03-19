import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { InterviewRoom } from './InterviewRoom';

export function InterviewRoomWrapper() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  if (!token) {
    return null;
  }

  return <InterviewRoom token={token} />;
}
