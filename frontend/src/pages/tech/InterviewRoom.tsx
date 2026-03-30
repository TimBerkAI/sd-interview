import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Code as Code2, BookOpen } from 'lucide-react';
import { api } from '../../services/api';
import { useWebSocket, WSMessage } from '../../hooks/useWebSocket';
import type { TechRoomSession, TechRoomAnswer, ScoreScale } from '../../types';
import { ThemeToggle } from '../../components/ThemeToggle';

export function TechInterviewRoomWrapper() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<TechRoomSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/tech');
      return;
    }
    api.validateTechToken(token).then((s) => {
      if (!s) {
        alert('Invalid token or room not found');
        navigate('/tech');
        return;
      }
      setSession(s);
      setLoading(false);
    });
  }, [token, navigate]);

  if (loading || !session) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading room...</p>
        </div>
      </div>
    );
  }

  return <TechInterviewRoom session={session} />;
}

interface TechInterviewRoomProps {
  session: TechRoomSession;
}

function TechInterviewRoom({ session }: TechInterviewRoomProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, TechRoomAnswer>>(
    new Map(session.room.answers.map((a) => [a.id, a]))
  );
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const answersArray = useMemo(() => {
    return session.room.answers.map((a) => answers.get(a.id) || a);
  }, [answers, session.room.answers]);

  const currentAnswer = answersArray[currentIndex];
  const total = answersArray.length;

  const handleWSMessage = useCallback((message: WSMessage) => {
    if (message.type === 'answer_updated') {
      const { id, candidate_answer } = message.payload;
      setAnswers((prev) => {
        const existing = prev.get(id);
        if (!existing) return prev;
        return new Map(prev).set(id, { ...existing, candidate_answer });
      });
    } else if (message.type === 'score_updated') {
      const { answerId, score } = message.payload;
      setAnswers((prev) => {
        const existing = prev.get(answerId);
        if (!existing) return prev;
        return new Map(prev).set(answerId, { ...existing, score });
      });
    } else if (message.type === 'comment_updated') {
      const { answerId, comment } = message.payload;
      setAnswers((prev) => {
        const existing = prev.get(answerId);
        if (!existing) return prev;
        return new Map(prev).set(answerId, { ...existing, reviewer_comment: comment });
      });
    }
  }, []);

  const wsUrl = useMemo(() => {
    const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const base = import.meta.env.VITE_WS_URL || `${proto}//${window.location.host}`;
    return `${base}/ws/tech/${session.room.id}/`;
  }, [session.room.id]);

  const wsOptions = useMemo(() => ({ onMessage: handleWSMessage }), [handleWSMessage]);
  const { isConnected, sendMessage } = useWebSocket(wsUrl, wsOptions);

  const handleAnswerChange = useCallback(
    (text: string) => {
      if (!currentAnswer) return;
      setAnswers((prev) => new Map(prev).set(currentAnswer.id, { ...currentAnswer, candidate_answer: text }));

      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(async () => {
        await api.updateTechAnswer(currentAnswer.id, text);
        sendMessage({ type: 'update_answer', payload: { answerId: currentAnswer.id, text } });
      }, 1000);
    },
    [currentAnswer, sendMessage]
  );

  const handleCommentChange = useCallback(
    (comment: string) => {
      if (!currentAnswer || session.role !== 'reviewer') return;
      setAnswers((prev) => new Map(prev).set(currentAnswer.id, { ...currentAnswer, reviewer_comment: comment }));

      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(async () => {
        await api.updateTechFeedback(currentAnswer.id, comment, currentAnswer.score);
        sendMessage({ type: 'update_comment', payload: { answerId: currentAnswer.id, comment } });
      }, 1000);
    },
    [currentAnswer, session.role, sendMessage]
  );

  const handleScoreChange = useCallback(
    async (criteriaKey: string, value: number) => {
      if (!currentAnswer || session.role !== 'reviewer') return;
      const newScore = { ...(currentAnswer.score || {}), [criteriaKey]: value };
      setAnswers((prev) => new Map(prev).set(currentAnswer.id, { ...currentAnswer, score: newScore }));
      await api.updateTechFeedback(currentAnswer.id, currentAnswer.reviewer_comment || '', newScore);
      sendMessage({ type: 'update_score', payload: { answerId: currentAnswer.id, score: newScore } });
    },
    [currentAnswer, session.role, sendMessage]
  );

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center">
            <Code2 className="w-4 h-4 text-white dark:text-gray-900" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{session.room.name}</h1>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Task {currentIndex + 1} of {total}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs ${isConnected ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-500'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            {isConnected ? 'Connected' : 'Offline'}
          </div>
          <div className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
            {session.role}
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-56 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-y-auto">
          <div className="p-3 space-y-1">
            {answersArray.map((answer, i) => (
              <button
                key={answer.id}
                onClick={() => setCurrentIndex(i)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all ${
                  i === currentIndex
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  {answer.task.type === 'THEORY' ? (
                    <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
                  ) : (
                    <Code2 className="w-3.5 h-3.5 flex-shrink-0" />
                  )}
                  <span className="truncate leading-tight">{answer.task.name}</span>
                </div>
                <div className={`text-xs mt-0.5 ${i === currentIndex ? 'text-gray-300 dark:text-gray-600' : 'text-gray-400 dark:text-gray-500'}`}>
                  {answer.task.type === 'THEORY' ? 'Theory' : 'Practice'}
                </div>
              </button>
            ))}
          </div>
        </aside>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            {currentAnswer && (
              <>
                <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">{currentAnswer.task.name}</h2>
                  {currentAnswer.task.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                      {currentAnswer.task.description}
                    </p>
                  )}
                </div>

                <div className="flex-1 p-4 overflow-hidden">
                  <textarea
                    value={currentAnswer.candidate_answer || ''}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    readOnly={session.role === 'reviewer'}
                    placeholder={session.role === 'reviewer' ? 'Waiting for candidate response...' : 'Type your answer here...'}
                    className={`w-full h-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900/20 dark:focus:ring-white/20 font-mono text-sm resize-none ${session.role === 'reviewer' ? 'cursor-default' : ''}`}
                  />
                </div>

                <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                    disabled={currentIndex === 0}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {currentIndex + 1} / {total}
                  </span>
                  <button
                    onClick={() => setCurrentIndex((i) => Math.min(total - 1, i + 1))}
                    disabled={currentIndex === total - 1}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>

          {session.role === 'reviewer' && currentAnswer && (
            <aside className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col overflow-y-auto">
              <ScorePanel
                answer={currentAnswer}
                onScoreChange={handleScoreChange}
                onCommentChange={handleCommentChange}
              />
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

interface ScorePanelProps {
  answer: TechRoomAnswer;
  onScoreChange: (key: string, value: number) => void;
  onCommentChange: (comment: string) => void;
}

function ScorePanel({ answer, onScoreChange, onCommentChange }: ScorePanelProps) {
  const scoreScale: ScoreScale[] = answer.task.score_scale || [];

  return (
    <div className="p-4 space-y-5">
      <div>
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Score
        </h3>
        {scoreScale.length > 0 ? (
          <div className="space-y-2">
            {scoreScale.map((scale) => (
              <div key={scale.score} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 dark:text-gray-400 leading-tight line-clamp-2 flex-1 pr-2">
                    {scale.comment}
                  </span>
                  <button
                    onClick={() => onScoreChange('overall', scale.score)}
                    className={`flex-shrink-0 w-8 h-8 rounded-lg text-sm font-semibold transition-all ${
                      (answer.score?.overall ?? 0) === scale.score
                        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {scale.score}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 dark:text-gray-500">No score scale defined</p>
        )}

        {answer.score?.overall != null && (
          <div className="mt-3 px-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <span className="text-xs text-gray-500 dark:text-gray-400">Selected: </span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {answer.score.overall}/5
            </span>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
          Comment
        </h3>
        <textarea
          value={answer.reviewer_comment || ''}
          onChange={(e) => onCommentChange(e.target.value)}
          placeholder="Add reviewer comment..."
          rows={6}
          className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900/20 dark:focus:ring-white/20 resize-none"
        />
      </div>
    </div>
  );
}
