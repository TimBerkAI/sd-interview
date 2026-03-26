import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, ExternalLink, Calendar, ChevronRight, Search, ChevronLeft } from 'lucide-react';
import { api } from '../../services/api';
import type { Candidate } from '../../types';

const SPECIALTY_LABELS: Record<string, string> = {
  BE: 'Backend',
  FE: 'Frontend',
  QA: 'QA',
  MOB: 'Mobile',
  DEVOPS: 'DevOps',
};

const SPECIALTY_COLORS: Record<string, string> = {
  BE: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  FE: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  QA: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  MOB: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  DEVOPS: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
};

const ALL_SPECIALTIES = ['BE', 'FE', 'QA', 'MOB', 'DEVOPS'];
const PAGE_SIZE = 9;

export function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.getCandidates().then((data) => {
      setCandidates(data);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    let result = candidates;
    if (specialtyFilter) {
      result = result.filter((c) => c.specialty === specialtyFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (c) =>
          c.full_name.toLowerCase().includes(q) ||
          (c.description && c.description.toLowerCase().includes(q))
      );
    }
    return result;
  }, [candidates, search, specialtyFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleSpecialtyChange = (spec: string | null) => {
    setSpecialtyFilter(spec);
    setPage(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Candidates</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {filtered.length} of {candidates.length} candidate{candidates.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by name or description..."
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900/20 dark:focus:ring-white/20 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleSpecialtyChange(null)}
            className={`text-xs font-medium px-3 py-2 rounded-lg border transition-all ${
              specialtyFilter === null
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-900'
            }`}
          >
            All
          </button>
          {ALL_SPECIALTIES.map((spec) => (
            <button
              key={spec}
              onClick={() => handleSpecialtyChange(spec === specialtyFilter ? null : spec)}
              className={`text-xs font-medium px-3 py-2 rounded-lg border transition-all ${
                specialtyFilter === spec
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-900'
              }`}
            >
              {SPECIALTY_LABELS[spec] || spec}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">No candidates found</p>
          {(search || specialtyFilter) && (
            <button
              onClick={() => { handleSearchChange(''); handleSpecialtyChange(null); }}
              className="mt-3 text-xs text-gray-400 dark:text-gray-500 underline hover:text-gray-600 dark:hover:text-gray-300"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paginated.map((candidate) => (
              <Link
                key={candidate.id}
                to={`/flow/candidates/${candidate.id}`}
                className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 hover:border-gray-400 dark:hover:border-gray-600 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${SPECIALTY_COLORS[candidate.specialty] || 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                      {SPECIALTY_LABELS[candidate.specialty] || candidate.specialty}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors" />
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-2 leading-tight">
                  {candidate.full_name}
                </h3>

                {candidate.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                    {candidate.description.replace(/<[^>]*>/g, '')}
                  </p>
                )}

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(candidate.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>

                  {candidate.links && candidate.links.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                      <ExternalLink className="w-3.5 h-3.5" />
                      {candidate.links.length} link{candidate.links.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                const isNear = Math.abs(p - currentPage) <= 1 || p === 1 || p === totalPages;
                const showEllipsisBefore = p === currentPage - 2 && currentPage > 3;
                const showEllipsisAfter = p === currentPage + 2 && currentPage < totalPages - 2;

                if (showEllipsisBefore || showEllipsisAfter) {
                  return (
                    <span key={p} className="text-xs text-gray-400 dark:text-gray-600 px-1">
                      ...
                    </span>
                  );
                }
                if (!isNear) return null;

                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all ${
                      currentPage === p
                        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                        : 'border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
