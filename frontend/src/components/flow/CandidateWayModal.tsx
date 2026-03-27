import { useState } from 'react';
import { X, User, Calendar, Tag, ChevronRight, CheckCircle, Clock, ThumbsUp, ThumbsDown, Minus, UserCheck, Loader } from 'lucide-react';
import type { CandidateWay, WaySection } from '../../types';
import { SectionDecision, FlowSectionType, WayDecision, WaySectionStatus } from '../../types';
import { SectionDetailModal } from './SectionDetailModal';
import { api } from '../../services/api';

interface CandidateWayModalProps {
  way: CandidateWay;
  onClose: () => void;
  onUpdate: (updated: CandidateWay) => void;
}

const TYPE_CONFIG: Record<string, { label: string; cls: string }> = {
  [FlowSectionType.HR]: { label: 'HR', cls: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
  [FlowSectionType.TECH]: { label: 'Tech', cls: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
  [FlowSectionType.SYSTEM_DESIGN]: { label: 'System Design', cls: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' },
  [FlowSectionType.TEAM]: { label: 'Team', cls: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
};

const STATUS_ICONS: Record<string, React.FC<{ className?: string }>> = {
  [WaySectionStatus.NEW]: Clock,
  [WaySectionStatus.IN_PROGRESS]: Loader,
  [WaySectionStatus.END]: CheckCircle,
};

const STATUS_COLORS: Record<string, string> = {
  [WaySectionStatus.NEW]: 'text-gray-400',
  [WaySectionStatus.IN_PROGRESS]: 'text-blue-500',
  [WaySectionStatus.END]: 'text-green-500',
};

const DECISION_ICONS: Record<string, React.FC<{ className?: string }>> = {
  [SectionDecision.PENDING]: Minus,
  [SectionDecision.RECOMMENDED]: ThumbsUp,
  [SectionDecision.REFUSE]: ThumbsDown,
};

const DECISION_COLORS: Record<string, string> = {
  [SectionDecision.PENDING]: 'text-gray-400',
  [SectionDecision.RECOMMENDED]: 'text-green-500',
  [SectionDecision.REFUSE]: 'text-red-500',
};

const WAY_DECISION_OPTIONS: { value: WayDecision; label: string; activeCls: string; dotCls: string }[] = [
  { value: WayDecision.IN_PROGRESS, label: 'In Progress', activeCls: 'bg-blue-600 text-white border-blue-600', dotCls: 'bg-blue-500' },
  { value: WayDecision.ON_HOLD, label: 'On Hold', activeCls: 'bg-yellow-500 text-white border-yellow-500', dotCls: 'bg-yellow-500' },
  { value: WayDecision.HIRED, label: 'Hired', activeCls: 'bg-green-600 text-white border-green-600', dotCls: 'bg-green-500' },
  { value: WayDecision.REJECTED, label: 'Rejected', activeCls: 'bg-red-600 text-white border-red-600', dotCls: 'bg-red-500' },
];

const DECISION_LABEL: Record<string, string> = {
  [WayDecision.HIRED]: 'Hired',
  [WayDecision.REJECTED]: 'Rejected',
  [WayDecision.IN_PROGRESS]: 'In Progress',
  [WayDecision.ON_HOLD]: 'On Hold',
};

const DECISION_BADGE_CLS: Record<string, string> = {
  [WayDecision.HIRED]: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
  [WayDecision.REJECTED]: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
  [WayDecision.IN_PROGRESS]: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  [WayDecision.ON_HOLD]: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
};

export function CandidateWayModal({ way, onClose, onUpdate }: CandidateWayModalProps) {
  const [sections, setSections] = useState<WaySection[]>(way.sections);
  const [selectedSection, setSelectedSection] = useState<WaySection | null>(null);
  const [currentDecision, setCurrentDecision] = useState<WayDecision>(way.decision);
  const [changingDecision, setChangingDecision] = useState(false);
  const [showDecisionPicker, setShowDecisionPicker] = useState(false);

  const completedCount = sections.filter(
    (s) => s.status === WaySectionStatus.END
  ).length;

  const handleSectionSave = (updated: WaySection) => {
    const next = sections.map((s) => (s.id === updated.id ? updated : s));
    setSections(next);
    onUpdate({ ...way, sections: next, decision: currentDecision });
    setSelectedSection(null);
  };

  const handleDecisionChange = async (decision: WayDecision) => {
    if (decision === currentDecision) {
      setShowDecisionPicker(false);
      return;
    }
    setChangingDecision(true);
    const ok = await api.updateWay(way.id, { decision });
    if (ok) {
      setCurrentDecision(decision);
      onUpdate({ ...way, sections, decision });
    }
    setChangingDecision(false);
    setShowDecisionPicker(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

        <div className="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
          <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white leading-tight text-base">
                    {way.candidate?.full_name || 'Candidate'}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {way.specialty} · Way #{way.id}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <button
                    onClick={() => setShowDecisionPicker((v) => !v)}
                    disabled={changingDecision}
                    className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all hover:opacity-80 ${DECISION_BADGE_CLS[currentDecision]}`}
                  >
                    {changingDecision ? 'Saving...' : DECISION_LABEL[currentDecision] || currentDecision}
                  </button>

                  {showDecisionPicker && (
                    <div className="absolute top-full left-0 mt-1 z-10 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl p-1.5 min-w-[160px]">
                      {WAY_DECISION_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => handleDecisionChange(opt.value)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left ${
                            currentDecision === opt.value
                              ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${opt.dotCls}`} />
                          {opt.label}
                          {currentDecision === opt.value && (
                            <UserCheck className="w-3.5 h-3.5 ml-auto text-gray-400" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {way.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md"
                  >
                    <Tag className="w-3 h-3" />
                    {tag.name}
                  </span>
                ))}

                {way.period_start && (
                  <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(way.period_start).toLocaleDateString()}
                    {way.period_end && ` → ${new Date(way.period_end).toLocaleDateString()}`}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              className="ml-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-6 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Sections
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {completedCount}/{sections.length} confirmed
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {sections.length === 0 ? (
              <div className="py-12 text-center text-sm text-gray-400 dark:text-gray-500">
                No sections
              </div>
            ) : (
              sections
                .slice()
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((section) => {
                  const StatusIcon = STATUS_ICONS[section.status] || Clock;
                  const DecisionIcon = DECISION_ICONS[section.decision] || Minus;
                  const typeConfig = TYPE_CONFIG[section.type] || { label: section.type, cls: 'bg-gray-100 text-gray-600' };

                  return (
                    <button
                      key={section.id}
                      onClick={() => setSelectedSection(section)}
                      className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 transition-all text-left group"
                    >
                      <StatusIcon className={`w-4 h-4 flex-shrink-0 ${STATUS_COLORS[section.status] || 'text-gray-400'}`} />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {section.name}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-md font-medium flex-shrink-0 ${typeConfig.cls}`}>
                            {typeConfig.label}
                          </span>
                        </div>
                        {section.review && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                            {section.review.replace(/<[^>]*>/g, '')}
                          </p>
                        )}
                        {section.skill_assessments && section.skill_assessments.length > 0 && (
                          <div className="flex items-center gap-1.5 mt-1">
                            {section.skill_assessments.slice(0, 3).map((sa, i) => (
                              <span key={i} className="text-xs text-gray-400 dark:text-gray-500">
                                {sa.skill}{sa.score != null ? ` ${sa.score}/5` : ''}
                              </span>
                            ))}
                            {section.skill_assessments.length > 3 && (
                              <span className="text-xs text-gray-300 dark:text-gray-600">
                                +{section.skill_assessments.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <DecisionIcon className={`w-4 h-4 ${DECISION_COLORS[section.decision]}`} />
                        <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors" />
                      </div>
                    </button>
                  );
                })
            )}
          </div>

          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-gray-400 dark:text-gray-500">Interview progress</span>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {sections.length ? Math.round((completedCount / sections.length) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
              <div
                className="bg-gray-900 dark:bg-white h-1.5 rounded-full transition-all duration-500"
                style={{ width: sections.length ? `${(completedCount / sections.length) * 100}%` : '0%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {selectedSection && (
        <SectionDetailModal
          section={selectedSection}
          onClose={() => setSelectedSection(null)}
          onSave={handleSectionSave}
        />
      )}
    </>
  );
}
