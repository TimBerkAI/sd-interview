import { FileText } from 'lucide-react';
import type { Section, Task } from '../types';

interface ConditionsPanelProps {
  section?: Section;
  task: Task;
}

const SECTION_TYPE_COLORS: Record<string, string> = {
  REQUIREMENTS: 'bg-purple-500',
  CALCULATION: 'bg-orange-500',
  DATA_MODEL: 'bg-green-500',
  API: 'bg-blue-500',
  HLD: 'bg-indigo-500',
  LLD: 'bg-pink-500',
  RISKS: 'bg-red-500',
};

export function ConditionsPanel({ section, task }: ConditionsPanelProps) {
  return (
    <div className="border-b border-gray-700 p-4">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="w-4 h-4 text-gray-400" />
        <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
          Conditions
        </h3>
      </div>

      <div className="space-y-3">
        {section && (
          <div className="p-3 bg-gray-700/50 rounded-xl border border-gray-600">
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  SECTION_TYPE_COLORS[section.type] || 'bg-gray-500'
                }`}
              ></div>
              <span className="text-xs font-medium text-gray-300 uppercase">
                {section.type.replace('_', ' ')}
              </span>
            </div>
            {section.description && (
              <p className="text-xs text-gray-400 leading-relaxed">
                {section.description}
              </p>
            )}
          </div>
        )}

        {task.description && (
          <div className="p-3 bg-gray-700/30 rounded-xl border border-gray-600/50">
            <p className="text-xs font-medium text-gray-300 mb-2">Task Overview</p>
            <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-wrap">
              {task.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
