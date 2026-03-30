import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Code, Users, SquareKanban as KanbanSquare, Settings } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

const FEATURES = [
  {
    icon: Building2,
    title: 'Architecture Interviews',
    description: 'Structured system design interviews with template-based sections, real-time collaboration and scoring.',
    href: '/arch',
    label: 'Open room',
  },
  {
    icon: Code,
    title: 'Technical Interviews',
    description: 'Conduct hands-on coding sessions with theory and practice tasks, live score tracking per criteria.',
    href: '/tech',
    label: 'Open room',
  },
  {
    icon: Users,
    title: 'Candidate Profiles',
    description: 'Maintain a searchable database of candidates with specialty filters, links and full history.',
    href: '/admin/flow/candidates',
    label: 'View candidates',
  },
  {
    icon: KanbanSquare,
    title: 'Hiring Kanban',
    description: 'Track every hiring process on a drag-and-drop board across In Progress, On Hold, Hired, Rejected columns.',
    href: '/admin/flow/kanban',
    label: 'Open board',
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="absolute top-5 right-5 flex items-center gap-3">
        <Link
          to="/admin"
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-800 rounded-xl hover:border-gray-400 dark:hover:border-gray-600 transition-all"
        >
          <Settings className="w-3.5 h-3.5" />
          Admin
        </Link>
        <ThemeToggle />
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-32 pb-20">
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 dark:bg-white rounded-2xl mb-6 shadow-lg">
            <Building2 className="w-8 h-8 text-white dark:text-gray-900" />
          </div>

          <h1 className="text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
            Interview Platform
          </h1>

          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
            A focused toolkit for structured technical and architecture interviews — with real-time collaboration, scoring, and hiring flow management.
          </p>

          <div className="flex items-center justify-center gap-3 mt-8">
            <Link
              to="/arch"
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-sm"
            >
              Architecture Interview
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/tech"
              className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 hover:border-gray-400 dark:hover:border-gray-600 transition-all"
            >
              Technical Interview
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {FEATURES.map(({ icon: Icon, title, description, href, label }) => (
            <Link
              key={href}
              to={href}
              className="group bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:border-gray-400 dark:hover:border-gray-600 hover:shadow-sm transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:border-gray-400 dark:group-hover:border-gray-600 transition-all">
                  <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>
                  <span className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                    {label}
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
