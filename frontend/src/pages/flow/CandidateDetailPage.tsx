import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, ExternalLink, Calendar, SquareKanban as KanbanSquare } from 'lucide-react';
import { api } from '../../services/api';
import type { Candidate, CandidateWay } from '../../types';
import { WayDecision, WayStatus } from '../../types';

type CandidateWithWays = Candidate & { ways: CandidateWay[] };

const DECISION_CONFIG: Record<string, { label: string; cls: string }> = {
  [WayDecision.HIRED]: { label: 'Нанят', cls: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
  [WayDecision.REJECTED]: { label: 'Отклонено', cls: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' },
  [WayDecision.IN_PROGRESS]: { label: 'В процессе', cls: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
  [WayDecision.ON_HOLD]: { label: 'Резерв', cls: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' },
};

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  [WayStatus.ACTIVE]: { label: 'Активный', cls: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
  [WayStatus.COMPLETED]: { label: 'Завершённый', cls: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400' },
  [WayStatus.CANCELLED]: { label: 'Отменённый', cls: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' },
};

export function CandidateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<CandidateWithWays | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.getCandidate(Number(id)).then((data) => {
      setCandidate(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white" />
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        Кандидат не найден
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl">
      <Link
        to="/flow/candidates"
        className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Вернуться к кандидатам
      </Link>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center flex-shrink-0">
            <User className="w-7 h-7 text-gray-500 dark:text-gray-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{candidate.full_name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {candidate.specialty}
              </span>
              <span className="text-gray-300 dark:text-gray-600">·</span>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(candidate.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
            </div>
          </div>
        </div>

        {candidate.description && (
          <div
            className="mt-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed prose dark:prose-invert prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: candidate.description }}
          />
        )}

        {candidate.links && candidate.links.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {candidate.links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {link.label || link.url}
              </a>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <KanbanSquare className="w-4 h-4" />
          Пути ({candidate.ways.length})
        </h2>

        {candidate.ways.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500">Пока нет данных</p>
        ) : (
          <div className="space-y-3">
            {candidate.ways.map((way) => {
              const decision = DECISION_CONFIG[way.decision] || { label: way.decision, cls: 'bg-gray-100 text-gray-600' };
              const status = STATUS_CONFIG[way.status] || { label: way.status, cls: 'bg-gray-100 text-gray-600' };
              return (
                <Link
                  key={way.id}
                  to={`/flow/ways?highlight=${way.id}`}
                  className="block bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:border-gray-400 dark:hover:border-gray-600 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {way.specialty}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${status.cls}`}>
                        {status.label}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${decision.cls}`}>
                        {decision.label}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                    <span>{way.sections.length} sections</span>
                    {way.period_start && (
                      <span>Since {new Date(way.period_start).toLocaleDateString()}</span>
                    )}
                    {way.tags.length > 0 && (
                      <div className="flex gap-1">
                        {way.tags.map((tag) => (
                          <span key={tag.id} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
