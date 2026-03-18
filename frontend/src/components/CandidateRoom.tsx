import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Save, CheckCircle } from 'lucide-react';
import { api } from '../services/api';
import type { RoomWithDetails, RoomAnswer } from '../types';
import { SectionEditor } from './SectionEditor';
import { Timer } from './Timer';

export function CandidateRoom() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<RoomWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [localAnswers, setLocalAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    loadRoom();
  }, [token]);

  const loadRoom = async () => {
    if (!token) return;

    setLoading(true);
    const data = await api.getRoomByToken(token, false);

    if (!data) {
      alert('Room not found or you do not have access');
      navigate('/');
      return;
    }

    setRoom(data);

    const answers: Record<number, string> = {};
    data.answers.forEach(answer => {
      answers[answer.id] = answer.candidate_answer || '';
    });
    setLocalAnswers(answers);

    setLoading(false);
  };

  const handleAnswerChange = (answerId: number, value: string) => {
    setLocalAnswers(prev => ({
      ...prev,
      [answerId]: value,
    }));
  };

  const handleSave = async (answerId: number) => {
    setSaving(true);
    const success = await api.updateCandidateAnswer(answerId, localAnswers[answerId] || '');

    if (success) {
      await loadRoom();
    } else {
      alert('Failed to save answer');
    }

    setSaving(false);
  };

  const handleSubmit = async () => {
    if (!room) return;

    const confirmed = window.confirm(
      'Are you sure you want to submit your answers? You will not be able to edit them after submission.'
    );

    if (!confirmed) return;

    for (const answer of room.answers) {
      await api.updateCandidateAnswer(answer.id, localAnswers[answer.id] || '');
    }

    const success = await api.updateRoomStatus(room.id, 'COMPLETED');

    if (success) {
      alert('Your answers have been submitted successfully!');
      await loadRoom();
    } else {
      alert('Failed to submit answers');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading interview room...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Room not found</p>
        </div>
      </div>
    );
  }

  const currentAnswer = room.answers[currentSectionIndex];
  const isCompleted = room.status === 'COMPLETED';
  const completedCount = room.answers.filter(a => a.candidate_answer && a.candidate_answer.trim()).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{room.name}</h1>
              <p className="text-sm text-gray-600 mt-1">{room.task.name}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm text-gray-600">Progress</p>
                <p className="text-lg font-semibold text-gray-900">
                  {completedCount} / {room.answers.length}
                </p>
              </div>
              <Timer startTime={room.started_at} endTime={room.ended_at} />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-24">
              <h2 className="font-semibold text-gray-900 mb-4">Sections</h2>
              <nav className="space-y-1">
                {room.answers.map((answer, index) => {
                  const hasAnswer = answer.candidate_answer && answer.candidate_answer.trim();
                  const isCurrent = index === currentSectionIndex;

                  return (
                    <button
                      key={answer.id}
                      onClick={() => setCurrentSectionIndex(index)}
                      disabled={isCompleted}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        isCurrent
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : hasAnswer
                          ? 'text-gray-700 hover:bg-gray-50'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{answer.section.name}</span>
                        {hasAnswer && (
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 ml-2" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          <main className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {room.task.description && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h3 className="font-semibold text-blue-900 mb-2">Task Description</h3>
                  <p className="text-blue-800 whitespace-pre-wrap">{room.task.description}</p>
                </div>
              )}

              {currentAnswer && (
                <SectionEditor
                  answer={currentAnswer}
                  value={localAnswers[currentAnswer.id] || ''}
                  onChange={(value) => handleAnswerChange(currentAnswer.id, value)}
                  onSave={() => handleSave(currentAnswer.id)}
                  saving={saving}
                  disabled={isCompleted}
                />
              )}

              <div className="mt-6 flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentSectionIndex(Math.max(0, currentSectionIndex - 1))}
                    disabled={currentSectionIndex === 0 || isCompleted}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentSectionIndex(Math.min(room.answers.length - 1, currentSectionIndex + 1))
                    }
                    disabled={currentSectionIndex === room.answers.length - 1 || isCompleted}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>

                {!isCompleted && (
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Submit All Answers
                  </button>
                )}

                {isCompleted && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Submitted</span>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
