import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { User, Calendar, Tag, ChevronRight } from 'lucide-react';
import { api } from '../../services/api';
import type { CandidateWay } from '../../types';
import { WayDecision, WaySectionStatus } from '../../types';
import { CandidateWayModal } from './CandidateWayModal';

const COLUMNS: { key: WayDecision; label: string; headerCls: string; dotCls: string; dropCls: string }[] = [
  {
    key: WayDecision.IN_PROGRESS,
    label: 'In Progress',
    headerCls: 'text-blue-600 dark:text-blue-400',
    dotCls: 'bg-blue-500',
    dropCls: 'bg-blue-50 dark:bg-blue-900/10 border-blue-300 dark:border-blue-700',
  },
  {
    key: WayDecision.ON_HOLD,
    label: 'On Hold',
    headerCls: 'text-yellow-600 dark:text-yellow-400',
    dotCls: 'bg-yellow-500',
    dropCls: 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-300 dark:border-yellow-700',
  },
  {
    key: WayDecision.HIRED,
    label: 'Hired',
    headerCls: 'text-green-600 dark:text-green-400',
    dotCls: 'bg-green-500',
    dropCls: 'bg-green-50 dark:bg-green-900/10 border-green-300 dark:border-green-700',
  },
  {
    key: WayDecision.REJECTED,
    label: 'Rejected',
    headerCls: 'text-red-600 dark:text-red-400',
    dotCls: 'bg-red-500',
    dropCls: 'bg-red-50 dark:bg-red-900/10 border-red-300 dark:border-red-700',
  },
];

export function KanbanBoard() {
  const [ways, setWays] = useState<CandidateWay[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWay, setSelectedWay] = useState<CandidateWay | null>(null);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [overColumn, setOverColumn] = useState<WayDecision | null>(null);
  const [searchParams] = useSearchParams();
  const dragWayRef = useRef<CandidateWay | null>(null);

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

  const handleDragStart = (way: CandidateWay) => {
    setDraggingId(way.id);
    dragWayRef.current = way;
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setOverColumn(null);
    dragWayRef.current = null;
  };

  const handleDrop = async (targetDecision: WayDecision) => {
    const way = dragWayRef.current;
    if (!way || way.decision === targetDecision) {
      setDraggingId(null);
      setOverColumn(null);
      dragWayRef.current = null;
      return;
    }

    const updated = { ...way, decision: targetDecision };
    setWays((prev) => prev.map((w) => (w.id === way.id ? updated : w)));
    setDraggingId(null);
    setOverColumn(null);
    dragWayRef.current = null;

    await api.updateWay(way.id, { decision: targetDecision });
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
            const isDragOver = overColumn === col.key;

            return (
              <div
                key={col.key}
                className="w-72 flex flex-col"
                onDragOver={(e) => {
                  e.preventDefault();
                  setOverColumn(col.key);
                }}
                onDragLeave={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setOverColumn(null);
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDrop(col.key);
                }}
              >
                <div className="flex items-center gap-2.5 mb-4 px-1">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${col.dotCls}`} />
                  <span className={`text-sm font-semibold ${col.headerCls}`}>{col.label}</span>
                  <span className="ml-auto text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                    {colWays.length}
                  </span>
                </div>

                <div
                  className={`flex-1 space-y-3 overflow-y-auto pr-1 rounded-2xl border-2 transition-all duration-150 p-1 ${
                    isDragOver && draggingId !== null
                      ? `${col.dropCls} border-dashed`
                      : 'border-transparent'
                  }`}
                >
                  {colWays.length === 0 && !isDragOver && (
                    <div className="flex items-center justify-center py-12 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                      <span className="text-xs text-gray-400 dark:text-gray-600">Empty</span>
                    </div>
                  )}

                  {colWays.map((way) => (
                    <WayCard
                      key={way.id}
                      way={way}
                      isDragging={draggingId === way.id}
                      onClick={() => setSelectedWay(way)}
                      onDragStart={() => handleDragStart(way)}
                      onDragEnd={handleDragEnd}
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

interface WayCardProps {
  way: CandidateWay;
  isDragging: boolean;
  onClick: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

function WayCard({ way, isDragging, onClick, onDragStart, onDragEnd }: WayCardProps) {
  const completedSections = way.sections.filter((s) => s.status === WaySectionStatus.END).length;
  const totalSections = way.sections.length;
  const progress = totalSections ? (completedSections / totalSections) * 100 : 0;

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move';
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={`w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 hover:border-gray-400 dark:hover:border-gray-600 hover:shadow-md transition-all text-left group cursor-grab active:cursor-grabbing select-none ${
        isDragging ? 'opacity-40 scale-95 shadow-lg' : 'opacity-100'
      }`}
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
    </div>
  );
}
