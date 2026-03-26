import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { User, Calendar, Tag, ChevronRight } from 'lucide-react';
import { api } from '../../services/api';
import type { CandidateWay } from '../../types';
import { WayDecision, SectionStatus } from '../../types';
import { CandidateWayModal } from './CandidateWayModal';

const COLUMNS: { key: WayDecision; label: string; headerCls: string; dotCls: string }[] = [
  {
    key: WayDecision.IN_PROGRESS,
    label: 'In Progress',
    headerCls: 'text-blue-600 dark:text-blue-400',
    dotCls: 'bg-blue-500',
  },
  {
    key: WayDecision.ON_HOLD,
    label: 'On Hold',
    headerCls: 'text-yellow-600 dark:text-yellow-400',
    dotCls: 'bg-yellow-500',
  },
  {
    key: WayDecision.HIRED,
    label: 'Hired',
    headerCls: 'text-green-600 dark:text-green-400',
    dotCls: 'bg-green-500',
  },
  {
    key: WayDecision.REJECTED,
    label: 'Rejected',
    headerCls: 'text-red-600 dark:text-red-400',
    dotCls: 'bg-red-500',
  },
];

export function KanbanBoard() {
  const [ways, setWays] = useState<CandidateWay[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWay, setSelectedWay] = useState<CandidateWay | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    api.getWays().then((data) => {
      setWays(data);
      setLoading(false);

      const highlight = searchParams.get('highlight');
      if (highlight) {
        const found = data.find((w) => w.id === Number(highlight));
        if (found) setSelectedWay(found);
      }
    });
  }, []);

  const handleWayUpdate = (updated: CandidateWay) => {
    setWays((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
    setSelectedWay(updated);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kanban Board</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {ways.length} candidate way{ways.length !== 1 ? 's' : ''} total
        </p>
      </div>

      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-5 h-full min-w-max">
          {COLUMNS.map((col) => {
            const colWays = ways.filter((w) => w.decision === col.key);

            return (
              <div key={col.key} className="w-72 flex flex-col">
                <div className="flex items-center gap-2.5 mb-4 px-1">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${col.dotCls}`} />
                  <span className={`text-sm font-semibold ${col.headerCls}`}>{col.label}</span>
                  <span className="ml-auto text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                    {colWays.length}
                  </span>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                  {colWays.length === 0 && (
                    <div className="flex items-center justify-center py-12 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                      <span className="text-xs text-gray-400 dark:text-gray-600">Empty</span>
                    </div>
                  )}

                  {colWays.map((way) => (
                    <WayCard
                      key={way.id}
                      way={way}
                      onClick={() => setSelectedWay(way)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedWay && (
        <CandidateWayModal
          way={selectedWay}
          onClose={() => setSelectedWay(null)}
          onUpdate={handleWayUpdate}
        />
      )}
    </div>
  );
}

function WayCard({ way, onClick }: { way: CandidateWay; onClick: () => void }) {
  const completedSections = way.sections.filter((s) => s.status === SectionStatus.CONFIRMED).length;
  const totalSections = way.sections.length;
  const progress = totalSections ? (completedSections / totalSections) * 100 : 0;

  return (
    <button
      onClick={onClick}
      className="w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 hover:border-gray-400 dark:hover:border-gray-600 hover:shadow-md transition-all text-left group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight truncate">
              {way.candidate?.full_name || 'Unknown'}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{way.specialty}</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors flex-shrink-0 mt-0.5" />
      </div>

      {way.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {way.tags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-md"
            >
              <Tag className="w-2.5 h-2.5" />
              {tag.name}
            </span>
          ))}
        </div>
      )}

      {totalSections > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400 dark:text-gray-500">Progress</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {completedSections}/{totalSections}
            </span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
            <div
              className="bg-gray-900 dark:bg-white h-1.5 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {way.period_start && (
        <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
          <Calendar className="w-3 h-3" />
          {new Date(way.period_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      )}
    </button>
  );
}
