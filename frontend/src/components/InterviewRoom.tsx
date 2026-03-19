import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, MessageSquare, Star, Clock } from 'lucide-react';
import { api } from '../services/api';
import { useWebSocket, WSMessage } from '../hooks/useWebSocket';
import type { RoomSession, RoomAnswer, Section } from '../types';
import { SectionNavbar } from './SectionNavbar';
import { EditorPanel } from './EditorPanel';
import { ConditionsPanel } from './ConditionsPanel';
import { ScorePanel } from './ScorePanel';
import { CommentsPanel } from './CommentsPanel';

interface InterviewRoomProps {
  token: string;
}

export function InterviewRoom({ token }: InterviewRoomProps) {
  const navigate = useNavigate();
  const [session, setSession] = useState<RoomSession | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Map<number, RoomAnswer>>(new Map());

  const loadSession = async () => {
    const sessionData = await api.validateToken(token);
    if (!sessionData) {
      alert('Invalid token or room not found');
      navigate('/');
      return;
    }

    setSession(sessionData);
    const answersMap = new Map<number, RoomAnswer>();
    sessionData.room.answers.forEach((answer) => {
      answersMap.set(answer.id, answer);
    });
    setAnswers(answersMap);
    setLoading(false);
  };

  useEffect(() => {
    loadSession();
  }, [token]);

  const handleWSMessage = useCallback((message: WSMessage) => {
    console.log('WebSocket message:', message);

    switch (message.type) {
      case 'answer_updated':
        setAnswers((prev) => {
          const newMap = new Map(prev);
          const { id, candidate_answer } = message.payload;
          const existing = newMap.get(id);
          if (existing) {
            newMap.set(id, { ...existing, candidate_answer });
          }
          return newMap;
        });
        break;
      case 'score_updated':
        setAnswers((prev) => {
          const newMap = new Map(prev);
          const { answerId, mark } = message.payload;
          const existing = newMap.get(answerId);
          if (existing) {
            newMap.set(answerId, { ...existing, mark });
          }
          return newMap;
        });
        break;
      case 'comment_updated':
        setAnswers((prev) => {
          const newMap = new Map(prev);
          const { answerId, comment } = message.payload;
          const existing = newMap.get(answerId);
          if (existing) {
            newMap.set(answerId, { ...existing, reviewer_comment: comment });
          }
          return newMap;
        });
        break;
    }
  }, []);

  const wsUrl = session ? `${import.meta.env.VITE_WS_URL || `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`}/ws/${session.room.id}/` : null;
  const wsOptions = useMemo(() => ({
    onMessage: handleWSMessage,
  }), [handleWSMessage]);
  const { isConnected, sendMessage } = useWebSocket(wsUrl, wsOptions);

  const handleAnswerChange = async (text: string) => {
    if (!session) return;
    const currentAnswer = Array.from(answers.values())[currentSectionIndex];
    if (!currentAnswer) return;

    await api.updateCandidateAnswer(currentAnswer.id, text);

    sendMessage({
      type: 'update_answer',
      payload: {
        answerId: currentAnswer.id,
        text,
      },
    });
  };

  const handleScoreChange = async (score: number) => {
    if (!session || session.role !== 'reviewer') return;
    const currentAnswer = Array.from(answers.values())[currentSectionIndex];
    if (!currentAnswer) return;

    await api.updateReviewerFeedback(currentAnswer.id, currentAnswer.reviewer_comment || '', score);

    sendMessage({
      type: 'update_score',
      payload: {
        answerId: currentAnswer.id,
        score,
      },
    });
  };

  const handleCommentChange = async (comment: string) => {
    if (!session || session.role !== 'reviewer') return;
    const currentAnswer = Array.from(answers.values())[currentSectionIndex];
    if (!currentAnswer) return;

    await api.updateReviewerFeedback(currentAnswer.id, comment, currentAnswer.mark);

    sendMessage({
      type: 'update_comment',
      payload: {
        answerId: currentAnswer.id,
        comment,
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading room...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const answersArray = Array.from(answers.values());
  const currentAnswer = answersArray[currentSectionIndex];

  return (
    <div className="h-screen bg-gray-900 flex overflow-hidden">
      <SectionNavbar
        sections={session.room.answers.map((a) => a.section)}
        currentIndex={currentSectionIndex}
        onSectionChange={setCurrentSectionIndex}
        answers={answersArray}
      />

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col">
          <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-white">{session.room.name}</h1>
              <p className="text-sm text-gray-400 mt-1">{session.room.task.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 rounded-lg">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? 'bg-green-400' : 'bg-red-400'
                  }`}
                ></div>
                <span className="text-xs text-gray-300">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <div className="px-3 py-1.5 bg-gray-700 rounded-lg">
                <span className="text-xs font-medium text-white uppercase">
                  {session.role}
                </span>
              </div>
            </div>
          </div>

          <EditorPanel
            answer={currentAnswer}
            role={session.role}
            onAnswerChange={handleAnswerChange}
          />
        </div>

        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          <ConditionsPanel section={currentAnswer?.section} task={session.room.task} />

          {session.role === 'reviewer' && (
            <>
              <ScorePanel
                currentScore={currentAnswer?.mark || null}
                scoreScale={currentAnswer?.section.score_scale || []}
                onScoreChange={handleScoreChange}
              />
              <CommentsPanel
                comment={currentAnswer?.reviewer_comment || ''}
                onCommentChange={handleCommentChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
