import { Star } from 'lucide-react';
import type { ScoreScale } from '../types';

interface ScorePanelProps {
  currentScore: number | null;
  scoreScale: ScoreScale[];
  onScoreChange: (score: number) => void;
}

export function ScorePanel({ currentScore, scoreScale, onScoreChange }: ScorePanelProps) {
  return (
    <div className="border-b border-gray-700 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Star className="w-4 h-4 text-gray-400" />
        <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Score</h3>
      </div>

      <div className="space-y-2">
        {scoreScale.length > 0 ? (
          scoreScale.map((scale) => (
            <button
              key={scale.score}
              onClick={() => onScoreChange(scale.score)}
              className={`w-full p-3 rounded-xl border transition-all text-left ${
                currentScore === scale.score
                  ? 'bg-white border-white text-gray-900'
                  : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < scale.score
                          ? currentScore === scale.score
                            ? 'fill-yellow-500 text-yellow-500'
                            : 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-500'
                      }`}
                    />
                  ))}
                </div>
                <span
                  className={`text-xs font-bold ${
                    currentScore === scale.score ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {scale.score}/5
                </span>
              </div>
              <p
                className={`text-xs ${
                  currentScore === scale.score ? 'text-gray-700' : 'text-gray-400'
                }`}
              >
                {scale.comment}
              </p>
            </button>
          ))
        ) : (
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((score) => (
              <button
                key={score}
                onClick={() => onScoreChange(score)}
                className={`flex-1 p-3 rounded-xl border transition-all ${
                  currentScore === score
                    ? 'bg-white border-white'
                    : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'
                }`}
              >
                <Star
                  className={`w-5 h-5 mx-auto ${
                    currentScore === score
                      ? 'fill-yellow-500 text-yellow-500'
                      : 'text-gray-400'
                  }`}
                />
                <p
                  className={`text-xs font-medium text-center mt-1 ${
                    currentScore === score ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {score}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {currentScore && (
        <div className="mt-3 p-2 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="text-xs text-green-400 text-center font-medium">
            Score: {currentScore}/5
          </p>
        </div>
      )}
    </div>
  );
}
