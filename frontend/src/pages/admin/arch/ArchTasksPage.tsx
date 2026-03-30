import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { api } from '../../../services/api';
import type { ArchTask } from '../../../types';
import { TaskStatus } from '../../../types';

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
  AWAITING_CONFIRMATION: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  CONFIRMED: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  ARCHIVED: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
};

const EMPTY_FORM = { name: '', description: '', status: TaskStatus.DRAFT };

export function ArchTasksPage() {
  const [tasks, setTasks] = useState<ArchTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<typeof EMPTY_FORM>({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setTasks(await api.getArchTasks());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const startEdit = (task: ArchTask) => {
    setEditingId(task.id);
    setShowCreate(false);
    setForm({ name: task.name, description: task.description || '', status: task.status });
  };

  const cancelEdit = () => { setEditingId(null); setForm({ ...EMPTY_FORM }); };

  const saveEdit = async (id: number) => {
    setSaving(true);
    await api.updateArchTask(id, form);
    await load();
    cancelEdit();
    setSaving(false);
  };

  const startCreate = () => {
    setShowCreate(true);
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
  };

  const cancelCreate = () => { setShowCreate(false); setForm({ ...EMPTY_FORM }); };

  const saveCreate = async () => {
    setSaving(true);
    await api.createArchTask(form);
    await load();
    cancelCreate();
    setSaving(false);
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this task?')) return;
    await api.deleteArchTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white" />
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Arch Tasks</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={startCreate}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-all"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      {showCreate && (
        <div className="mb-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">New Task</h3>
          <TaskForm form={form} onChange={setForm} />
          <div className="flex gap-2 mt-4">
            <button
              onClick={saveCreate}
              disabled={saving || !form.name.trim()}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-gray-800 dark:hover:bg-gray-100 transition-all"
            >
              <Check className="w-4 h-4" />
              Create
            </button>
            <button onClick={cancelCreate} className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        {tasks.length === 0 ? (
          <div className="py-16 text-center text-gray-400 dark:text-gray-600 text-sm">No tasks yet</div>
        ) : (
          <table className="w-full">
            <thead className="border-b border-gray-100 dark:border-gray-800">
              <tr className="text-xs text-gray-400 dark:text-gray-600 uppercase tracking-wide">
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {tasks.map((task) =>
                editingId === task.id ? (
                  <tr key={task.id}>
                    <td colSpan={3} className="px-6 py-4">
                      <TaskForm form={form} onChange={setForm} />
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => saveEdit(task.id)}
                          disabled={saving || !form.name.trim()}
                          className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-gray-800 dark:hover:bg-gray-100 transition-all"
                        >
                          <Check className="w-4 h-4" />
                          Save
                        </button>
                        <button onClick={cancelEdit} className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{task.name}</p>
                      {task.description && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate max-w-xs">{task.description}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-lg ${STATUS_COLORS[task.status] || ''}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => startEdit(task)} className="p-1.5 text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => remove(task.id)} className="p-1.5 text-gray-400 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

interface TaskFormProps {
  form: { name: string; description: string; status: TaskStatus };
  onChange: (f: { name: string; description: string; status: TaskStatus }) => void;
}

function TaskForm({ form, onChange }: TaskFormProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <input
        value={form.name}
        onChange={(e) => onChange({ ...form, name: e.target.value })}
        placeholder="Task name *"
        className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 dark:focus:ring-white/20"
      />
      <input
        value={form.description}
        onChange={(e) => onChange({ ...form, description: e.target.value })}
        placeholder="Description"
        className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 dark:focus:ring-white/20"
      />
      <select
        value={form.status}
        onChange={(e) => onChange({ ...form, status: e.target.value as TaskStatus })}
        className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900/20 dark:focus:ring-white/20"
      >
        {Object.values(TaskStatus).map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>
  );
}
