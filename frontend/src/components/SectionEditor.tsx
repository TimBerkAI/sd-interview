import { Save } from 'lucide-react';
import type { RoomAnswer, Section } from '../types';

interface SectionEditorProps {
  answer: RoomAnswer & { section: Section };
  value: string;
  onChange: (value: string) => void;
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

export function SectionEditor({
  answer,
  value,
  onChange,
  onSave,
  saving,
  disabled,
}: SectionEditorProps) {
  const { section } = answer;

  return (
    <div>
      <div className="mb-4">
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

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Answer
        </label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          rows={15}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed font-mono text-sm"
          placeholder="Write your answer here..."
        />
      </div>

      {!disabled && (
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Answer'}
        </button>
      )}
    </div>
  );
}
