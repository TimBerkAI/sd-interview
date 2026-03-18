import { CheckCircle } from 'lucide-react';
import type { Section, RoomAnswer } from '../types';

interface SectionNavbarProps {
  sections: Section[];
  currentIndex: number;
  onSectionChange: (index: number) => void;
  answers: RoomAnswer[];
}

export function SectionNavbar({
  sections,
  currentIndex,
  onSectionChange,
  answers,
}: SectionNavbarProps) {
  return (
    <div className="w-20 bg-gray-950 border-r border-gray-800 flex flex-col items-center py-6 gap-3">
      {sections.map((section, index) => {
        const answer = answers[index];
        const hasAnswer = answer?.candidate_answer && answer.candidate_answer.trim();
        const isCurrent = index === currentIndex;

        return (
          <button
            key={section.id}
            onClick={() => onSectionChange(index)}
            className={`relative w-14 h-14 rounded-2xl flex items-center justify-center font-semibold text-lg transition-all ${
              isCurrent
                ? 'bg-white text-gray-900 shadow-lg scale-110'
                : hasAnswer
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {index + 1}
            {hasAnswer && !isCurrent && (
              <CheckCircle className="absolute -top-1 -right-1 w-4 h-4 text-green-400 fill-green-400" />
            )}
          </button>
        );
      })}
    </div>
  );
}
