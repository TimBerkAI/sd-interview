import { Save, Star } from 'lucide-react';
import type { RoomAnswer, Section } from '../types';

interface ReviewEditorProps {
  answer: RoomAnswer & { section: Section };
  comment: string;
  mark: number | null;
  onChange: (comment: string, mark: number | null) => void;
  onSave: () => void;
  saving: boolean;
  disabled: boolean;
}

const SECTION_TYPE_LABELS: Record<string, string> = {
  REQUIREMENTS: 'Requirements',
  CALCULATION: 'Calculation',
  DATA_MODEL: 'Data Model',
  API: 'API Design',
  HLD: 'High-Level Design',
  LLD: 'Low-Level Design',
  RISKS: 'Risks & Considerations',
};

const SECTION_TYPE_COLORS: Record<string, string> = {
  REQUIREMENTS: 'bg-purple-100 text-purple-800',
  CALCULATION: 'bg-orange-100 text-orange-800',
  DATA_MODEL: 'bg-green-100 text-green-800',
  API: 'bg-blue-100 text-blue-800',
  HLD: 'bg-indigo-100 text-indigo-800',
  LLD: 'bg-pink-100 text-pink-800',
  RISKS: 'bg-red-100 text-red-800',
};

export function ReviewEditor({
  answer,
  comment,
  mark,
  onChange,
  onSave,
  saving,
  disabled,
}: ReviewEditorProps) {
  const { section } = answer;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl font-bold text-gray-900">{section.name}</h2>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              SECTION_TYPE_COLORS[section.type] || 'bg-gray-100 text-gray-800'
            }`}
          >
            {SECTION_TYPE_LABELS[section.type] || section.type}
          </span>
        </div>
        {section.description && (
          <p className="text-gray-600 text-sm">{section.description}</p>
        )}
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Candidate's Answer
        </h3>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          {answer.candidate_answer ? (
            <p className="text-gray-900 whitespace-pre-wrap font-mono text-sm">
              {answer.candidate_answer}
            </p>
          ) : (
            <p className="text-gray-500 italic">No answer provided</p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Score</h3>
        {section.score_scale && section.score_scale.length > 0 ? (
          <div className="space-y-2">
            {section.score_scale.map((scale) => (
              <button
                key={scale.score}
                onClick={() => onChange(scale.comment || comment, scale.score)}
                disabled={disabled}
                className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                  mark === scale.score
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < scale.score
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium text-gray-900">
                      {scale.score} / 5
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">{scale.comment}</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((score) => (
              <button
                key={score}
                onClick={() => onChange(comment, score)}
                disabled={disabled}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                  mark === score
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex flex-col items-center gap-1">
                  <Star
                    className={`w-5 h-5 ${
                      mark === score
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-400'
                    }`}
                  />
                  <span className="text-sm font-medium">{score}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Comments
        </label>
        <textarea
          value={comment}
          onChange={(e) => onChange(e.target.value, mark)}
          disabled={disabled}
          rows={8}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder="Add your feedback here..."
        />
      </div>

      {!disabled && (
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Review'}
        </button>
      )}
    </div>
  );
}
