import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft, Check, Code } from 'lucide-react';
import { api } from '../../../services/api';
import type { AdminTechTask } from '../../../types';
import { TechTaskStatus, TechTaskType, Specialty } from '../../../types';
import { RichTextEditor } from '../../../components/RichTextEditor';

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
  AWAITING_CONFIRMATION: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  CONFIRMED: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  ARCHIVED: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
};

const TYPE_COLORS: Record<string, string> = {
  THEORY: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  PRACTICE: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
};

export function TechTasksPage() {
  const [tasks, setTasks] = useState<AdminTechTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    setTasks(await api.getTechTasks());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const remove = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!confirm('Delete this task?')) return;
    setDeleting(id);
    await api.deleteTechTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setDeleting(null);
  };

  const createNew = async () => {
    const task = await api.createTechTask({
      name: 'New Task',
      specialty: Specialty.BE,
      type: TechTaskType.THEORY,
      status: TechTaskStatus.DRAFT,
      score_scale: [],
    } as Partial<AdminTechTask>);
    if (task) navigate(`/admin/tech/tasks/${task.id}`);
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tech Tasks</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={createNew}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-all"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Code className="w-10 h-10 text-gray-300 dark:text-gray-700 mb-3" />
          <p className="text-sm text-gray-400 dark:text-gray-600">No tasks yet. Create your first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => navigate(`/admin/tech/tasks/${task.id}`)}
              className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 cursor-pointer hover:border-gray-400 dark:hover:border-gray-600 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug line-clamp-2">{task.name}</h3>
                <button
                  onClick={(e) => remove(e, task.id)}
                  disabled={deleting === task.id}
                  className="flex-shrink-0 p-1.5 text-gray-300 dark:text-gray-700 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-40"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {task.description && (
                <div
                  className="text-xs text-gray-400 dark:text-gray-500 line-clamp-3 mb-3 leading-relaxed prose dark:prose-invert prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: task.description }}
                />
              )}

              <div className="flex items-center gap-2 flex-wrap mt-auto pt-2">
                <span className={`text-xs font-medium px-2 py-1 rounded-lg ${TYPE_COLORS[task.type] || ''}`}>
                  {task.type}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">{task.specialty}</span>
                <span className={`ml-auto text-xs font-medium px-2 py-1 rounded-lg ${STATUS_COLORS[task.status] || ''}`}>
                  {task.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function TechTaskEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    specialty: Specialty.BE,
    type: TechTaskType.THEORY,
    description: '',
    status: TechTaskStatus.DRAFT,
    score_scale: '[]',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.getTechTask(Number(id)).then((task) => {
      if (task) {
        setForm({
          name: task.name,
          specialty: task.specialty,
          type: task.type,
          description: task.description || '',
          status: task.status,
          score_scale: JSON.stringify(task.score_scale, null, 2),
        });
      }
      setLoading(false);
    });
  }, [id]);

  const save = async () => {
    if (!id) return;
    setSaving(true);
    let parsedScale = [];
    try { parsedScale = JSON.parse(form.score_scale); } catch { parsedScale = []; }
    await api.updateTechTask(Number(id), {
      name: form.name,
      specialty: form.specialty,
      type: form.type,
      description: form.description || null,
      status: form.status,
      score_scale: parsedScale,
    } as Partial<AdminTechTask>);
    setSaving(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white" />
    </div>
  );

  return (
    <div className="p-8 max-w-3xl">
      <button
        onClick={() => navigate('/admin/tech/tasks')}
        className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Tasks
      </button>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 space-y-5">
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Task name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 dark:focus:ring-white/20"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as TechTaskType })}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900/20 dark:focus:ring-white/20"
            >
              {Object.values(TechTaskType).map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Specialty</label>
            <select
              value={form.specialty}
              onChange={(e) => setForm({ ...form, specialty: e.target.value as Specialty })}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900/20 dark:focus:ring-white/20"
            >
              {Object.values(Specialty).map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as TechTaskStatus })}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900/20 dark:focus:ring-white/20"
            >
              {Object.values(TechTaskStatus).map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Description</label>
          <RichTextEditor
            value={form.description}
            onChange={(html) => setForm({ ...form, description: html })}
            placeholder="Describe the task..."
            minHeight="140px"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Score scale (JSON)</label>
          <textarea
            value={form.score_scale}
            onChange={(e) => setForm({ ...form, score_scale: e.target.value })}
            rows={4}
            placeholder='[{"score": 1, "comment": "Poor"}, {"score": 5, "comment": "Excellent"}]'
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 font-mono focus:outline-none focus:ring-2 focus:ring-gray-900/20 dark:focus:ring-white/20 resize-none"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={save}
            disabled={saving || !form.name.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-gray-800 dark:hover:bg-gray-100 transition-all"
          >
            <Check className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={() => navigate('/admin/tech/tasks')}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
