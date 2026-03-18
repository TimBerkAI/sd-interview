import { useState, useEffect } from 'react';
import type { RoomAnswer, Section, UserRole } from '../types';

interface EditorPanelProps {
  answer: RoomAnswer & { section: Section };
  role: UserRole;
  onAnswerChange: (text: string) => void;
}

export function EditorPanel({ answer, role, onAnswerChange }: EditorPanelProps) {
  const [text, setText] = useState(answer?.candidate_answer || '');
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setText(answer?.candidate_answer || '');
  }, [answer?.id, answer?.candidate_answer]);

  const handleChange = (newText: string) => {
    setText(newText);

    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    const timeout = setTimeout(() => {
      onAnswerChange(newText);
    }, 1000);

    setSaveTimeout(timeout);
  };

  const isReadOnly = role === 'reviewer';

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">{answer?.section.name}</h2>
        {answer?.section.description && (
          <p className="text-sm text-gray-400 mt-1">{answer.section.description}</p>
        )}
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <textarea
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          readOnly={isReadOnly}
          placeholder={
            isReadOnly
              ? 'Waiting for candidate response...'
              : 'Type your answer here...'
          }
          className={`w-full h-full bg-gray-800/50 border border-gray-700 rounded-2xl p-6 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 font-mono text-sm resize-none ${
            isReadOnly ? 'cursor-default' : ''
          }`}
        />
      </div>
    </div>
  );
}
