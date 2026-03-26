import { useState } from 'react';
import { X, Save, CheckCircle, Clock, AlertCircle, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';
import { api } from '../../services/api';
import type { WaySection } from '../../types';
import { SectionDecision, SectionStatus, FlowSectionType } from '../../types';

interface SectionDetailModalProps {
  section: WaySection;
  onClose: () => void;
  onSave: (updated: WaySection) => void;
}

const TYPE_LABELS: Record<string, string> = {
  [FlowSectionType.HR]: 'HR',
  [FlowSectionType.TECH]: 'Technical',
  [FlowSectionType.SYSTEM_DESIGN]: 'System Design',
  [FlowSectionType.TEAM]: 'Team',
};

const STATUS_OPTIONS = [
  { value: SectionStatus.NEW, label: 'New', icon: Clock, cls: 'text-gray-500' },
  { value: SectionStatus.IN_PROGRESS, label: 'In Progress', icon: AlertCircle, cls: 'text-blue-500' },
  { value: SectionStatus.END, label: 'Completed', icon: CheckCircle, cls: 'text-green-500' },
];

const DECISION_OPTIONS = [
  { value: SectionDecision.PENDING, label: 'Pending', icon: Minus, cls: 'text-gray-500' },
  { value: SectionDecision.RECOMMENDED, label: 'Recommended', icon: ThumbsUp, cls: 'text-green-500' },
  { value: SectionDecision.REFUSE, label: 'Refused', icon: ThumbsDown, cls: 'text-red-500' },
];

export function SectionDetailModal({ section, onClose, onSave }: SectionDetailModalProps) {
  const [review, setReview] = useState(section.review || '');
  const [status, setStatus] = useState(section.status);
  const [decision, setDecision] = useState(section.decision);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const ok = await api.updateSection(section.id, { review, status, decision });
    if (ok) {
      onSave({ ...section, review, status, decision });
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{section.name}</h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {TYPE_LABELS[section.type] || section.type}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Status
            </label>
            <div className="flex gap-2">
              {STATUS_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setStatus(opt.value)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      status === opt.value
                        ? 'bg-gray-900 dark:bg-white border-gray-900 dark:border-white text-white dark:text-gray-900'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${status === opt.value ? 'text-current' : opt.cls}`} />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Decision
            </label>
            <div className="flex gap-2">
              {DECISION_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setDecision(opt.value)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      decision === opt.value
                        ? 'bg-gray-900 dark:bg-white border-gray-900 dark:border-white text-white dark:text-gray-900'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${decision === opt.value ? 'text-current' : opt.cls}`} />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {section.skill_assessments && section.skill_assessments.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Skill Assessments
              </label>
              <div className="space-y-2">
                {section.skill_assessments.map((sa, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-3 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">{sa.skill}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <div
                            key={s}
                            className={`w-2.5 h-2.5 rounded-full ${
                              s <= sa.score
                                ? 'bg-gray-900 dark:bg-white'
                                : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 w-6 text-right">
                        {sa.score}/5
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Review Notes
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Add review notes..."
              rows={6}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900/20 dark:focus:ring-white/20 resize-none"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
