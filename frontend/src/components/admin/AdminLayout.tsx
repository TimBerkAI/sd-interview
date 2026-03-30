import { NavLink, Outlet } from 'react-router-dom';
import { BookOpen, LayoutGrid as Layout, DoorOpen, Code, Server, Settings } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
    isActive
      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
  }`;

export function AdminLayout() {
  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-950 flex overflow-hidden">
      <aside className="w-60 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <div className="px-5 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
          <Settings className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-bold tracking-widest uppercase text-gray-900 dark:text-white">
            Admin
          </span>
        </div>

        <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
          <div>
            <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600">
              Architecture
            </p>
            <div className="space-y-1">
              <NavLink to="/admin/arch/tasks" className={navLinkClass}>
                <BookOpen className="w-4 h-4" />
                Tasks
              </NavLink>
              <NavLink to="/admin/arch/templates" className={navLinkClass}>
                <Layout className="w-4 h-4" />
                Templates
              </NavLink>
              <NavLink to="/admin/arch/rooms" className={navLinkClass}>
                <DoorOpen className="w-4 h-4" />
                Rooms
              </NavLink>
            </div>
          </div>

          <div>
            <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600">
              Technical
            </p>
            <div className="space-y-1">
              <NavLink to="/admin/tech/tasks" className={navLinkClass}>
                <Code className="w-4 h-4" />
                Tasks
              </NavLink>
              <NavLink to="/admin/tech/rooms" className={navLinkClass}>
                <Server className="w-4 h-4" />
                Rooms
              </NavLink>
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <span className="text-xs text-gray-400">Theme</span>
          <ThemeToggle />
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
