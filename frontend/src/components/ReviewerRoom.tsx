import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, MessageSquare, Star } from 'lucide-react';
import { api } from '../services/api';
import type { RoomWithDetails, RoomAnswer } from '../types';
import { ReviewEditor } from './ReviewEditor';

export function ReviewerRoom() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<RoomWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [localReviews, setLocalReviews] = useState<
    Record<number, { comment: string; mark: number | null }>
  >({});

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
    const data = await api.getRoomByToken(token, true);

    if (!data) {
      alert('Room not found or you do not have access');
      navigate('/');
      return;
    }

    setRoom(data);

    const reviews: Record<number, { comment: string; mark: number | null }> = {};
    data.answers.forEach((answer) => {
      reviews[answer.id] = {
        comment: answer.reviewer_comment || '',
        mark: answer.mark,
      };
    });
    setLocalReviews(reviews);

    setLoading(false);
  };

  const handleReviewChange = (
    answerId: number,
    comment: string,
    mark: number | null
  ) => {
    setLocalReviews((prev) => ({
      ...prev,
      [answerId]: { comment, mark },
    }));
  };

  const handleSave = async (answerId: number) => {
    setSaving(true);
    const review = localReviews[answerId];
    const success = await api.updateReviewerFeedback(
      answerId,
      review.comment,
      review.mark
    );

    if (success) {
      await loadRoom();
    } else {
      alert('Failed to save review');
    }

    setSaving(false);
  };

  const handleComplete = async () => {
    if (!room) return;

    const unanswered = room.answers.filter(
      (a) => !localReviews[a.id]?.mark
    );

    if (unanswered.length > 0) {
      const confirmed = window.confirm(
        `You have ${unanswered.length} sections without marks. Do you want to complete the review anyway?`
      );
      if (!confirmed) return;
    }

    for (const answer of room.answers) {
      const review = localReviews[answer.id];
      await api.updateReviewerFeedback(answer.id, review.comment, review.mark);
    }

    const success = await api.updateRoomStatus(room.id, 'COMPLETED');

    if (success) {
      alert('Review completed successfully!');
      await loadRoom();
    } else {
      alert('Failed to complete review');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading review room...</p>
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
  const reviewedCount = room.answers.filter((a) => localReviews[a.id]?.mark).length;
  const totalScore = room.answers.reduce(
    (sum, a) => sum + (localReviews[a.id]?.mark || 0),
    0
  );
  const maxScore = room.answers.length * 5;
  const averageScore = reviewedCount > 0 ? (totalScore / reviewedCount).toFixed(1) : '0.0';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Review: {room.name}
              </h1>
              <p className="text-sm text-gray-600 mt-1">{room.task.name}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm text-gray-600">Reviewed</p>
                <p className="text-lg font-semibold text-gray-900">
                  {reviewedCount} / {room.answers.length}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-lg font-semibold text-gray-900">
                  {averageScore} / 5.0
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-lg font-semibold text-gray-900">
                  {totalScore} / {maxScore}
                </p>
              </div>
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
                  const review = localReviews[answer.id];
                  const hasReview = review?.mark !== null;
                  const isCurrent = index === currentSectionIndex;

                  return (
                    <button
                      key={answer.id}
                      onClick={() => setCurrentSectionIndex(index)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        isCurrent
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : hasReview
                          ? 'text-gray-700 hover:bg-gray-50'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{answer.section.name}</span>
                        <div className="flex items-center gap-1 ml-2">
                          {review?.mark && (
                            <span className="flex items-center gap-1 text-xs font-medium">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              {review.mark}
                            </span>
                          )}
                          {hasReview && (
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </nav>

              {!isCompleted && (
                <button
                  onClick={handleComplete}
                  className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Complete Review
                </button>
              )}
            </div>
          </aside>

          <main className="lg:col-span-3">
            {currentAnswer && (
              <ReviewEditor
                answer={currentAnswer}
                comment={localReviews[currentAnswer.id]?.comment || ''}
                mark={localReviews[currentAnswer.id]?.mark || null}
                onChange={(comment, mark) =>
                  handleReviewChange(currentAnswer.id, comment, mark)
                }
                onSave={() => handleSave(currentAnswer.id)}
                saving={saving}
                disabled={isCompleted}
              />
            )}

            <div className="mt-6 flex items-center justify-between">
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    setCurrentSectionIndex(Math.max(0, currentSectionIndex - 1))
                  }
                  disabled={currentSectionIndex === 0}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentSectionIndex(
                      Math.min(room.answers.length - 1, currentSectionIndex + 1)
                    )
                  }
                  disabled={currentSectionIndex === room.answers.length - 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>

              {isCompleted && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Review Completed</span>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
