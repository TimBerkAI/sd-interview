import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Check, RefreshCw, Copy } from 'lucide-react';
import { api } from '../../../services/api';
import type { ArchRoom, ArchTask, ArchTemplate } from '../../../types';
import { RoomStatus } from '../../../types';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
  ACTIVE: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  COMPLETED: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  CANCELLED: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
};

const EMPTY_FORM = {
  name: '',
  description: '',
  task_id: '',
  template_id: '',
  started_at: '',
  ended_at: '',
};

function toDatetimeLocal(iso: string) {
  if (!iso) return '';
  return iso.substring(0, 16);
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).catch(() => {});
}

export function ArchRoomsPage() {
  const [rooms, setRooms] = useState<ArchRoom[]>([]);
  const [tasks, setTasks] = useState<ArchTask[]>([]);
  const [templates, setTemplates] = useState<ArchTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    const [r, t, tmpl] = await Promise.all([api.getArchRooms(), api.getArchTasks(), api.getArchTemplates()]);
    setRooms(r);
    setTasks(t);
    setTemplates(tmpl);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const startEdit = (room: ArchRoom) => {
    setEditingId(room.id);
    setShowCreate(false);
    setForm({
      name: room.name,
      description: room.description || '',
      task_id: String(room.task_id),
      template_id: String(room.template_id),
      started_at: toDatetimeLocal(room.started_at),
      ended_at: toDatetimeLocal(room.ended_at),
    });
  };

  const cancelEdit = () => { setEditingId(null); setForm({ ...EMPTY_FORM }); };

  const saveEdit = async (id: number) => {
    setSaving(true);
    await api.updateArchRoom(id, {
      name: form.name,
      description: form.description || null,
      task_id: parseInt(form.task_id),
      template_id: parseInt(form.template_id),
      started_at: form.started_at,
      ended_at: form.ended_at,
    } as Partial<ArchRoom>);
    await load();
    cancelEdit();
    setSaving(false);
  };

  const startCreate = () => {
    setShowCreate(true);
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
  };

  const saveCreate = async () => {
    setSaving(true);
    await api.createArchRoom({
      name: form.name,
      description: form.description || null,
      task_id: parseInt(form.task_id),
      template_id: parseInt(form.template_id),
      started_at: form.started_at,
      ended_at: form.ended_at,
    });
    await load();
    setShowCreate(false);
    setSaving(false);
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this room?')) return;
    await api.deleteArchRoom(id);
    setRooms((prev) => prev.filter((r) => r.id !== id));
  };

  const regenerate = async (id: number) => {
    if (!confirm('Regenerate answers? Existing answers will be deleted.')) return;
    setRegenerating(id);
    await api.regenerateArchRoomAnswers(id);
    setRegenerating(null);
  };

  const isFormValid = form.name.trim() && form.task_id && form.template_id && form.started_at && form.ended_at;

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white" />
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Arch Rooms</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{rooms.length} room{rooms.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={startCreate}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-all"
        >
          <Plus className="w-4 h-4" />
          New Room
        </button>
      </div>

      {showCreate && (
        <div className="mb-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">New Room</h3>
          <RoomForm form={form} onChange={setForm} tasks={tasks} templates={templates} />
          <div className="flex gap-2 mt-4">
            <button onClick={saveCreate} disabled={saving || !isFormValid} className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-gray-800 dark:hover:bg-gray-100 transition-all">
              <Check className="w-4 h-4" />
              Create
            </button>
            <button onClick={() => setShowCreate(false)} className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        {rooms.length === 0 ? (
          <div className="py-16 text-center text-gray-400 dark:text-gray-600 text-sm">No rooms yet</div>
        ) : (
          <table className="w-full">
            <thead className="border-b border-gray-100 dark:border-gray-800">
              <tr className="text-xs text-gray-400 dark:text-gray-600 uppercase tracking-wide">
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Task / Template</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Tokens</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {rooms.map((room) =>
                editingId === room.id ? (
                  <tr key={room.id}>
                    <td colSpan={5} className="px-6 py-4">
                      <RoomForm form={form} onChange={setForm} tasks={tasks} templates={templates} />
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => saveEdit(room.id)} disabled={saving || !isFormValid} className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-gray-800 dark:hover:bg-gray-100 transition-all">
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
                  <tr key={room.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{room.name}</p>
                      {room.description && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate max-w-xs">{room.description}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-gray-600 dark:text-gray-400">{room.task?.name || `Task #${room.task_id}`}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">{room.template?.name || `Template #${room.template_id}`}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-lg ${STATUS_COLORS[room.status] || ''}`}>
                        {room.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <button onClick={() => copyToClipboard(room.candidate_token)} className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                          <Copy className="w-3 h-3" />
                          <span className="truncate max-w-[120px]">{room.candidate_token}</span>
                        </button>
                        <button onClick={() => copyToClipboard(room.reviewer_token)} className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                          <Copy className="w-3 h-3" />
                          <span className="truncate max-w-[120px]">{room.reviewer_token}</span>
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => regenerate(room.id)}
                          disabled={regenerating === room.id}
                          title="Regenerate answers"
                          className="p-1.5 text-gray-400 dark:text-gray-600 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all disabled:opacity-40"
                        >
                          <RefreshCw className={`w-4 h-4 ${regenerating === room.id ? 'animate-spin' : ''}`} />
                        </button>
                        <button onClick={() => startEdit(room)} className="p-1.5 text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => remove(room.id)} className="p-1.5 text-gray-400 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all">
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

interface RoomFormProps {
  form: typeof EMPTY_FORM;
  onChange: (f: typeof EMPTY_FORM) => void;
  tasks: ArchTask[];
  templates: ArchTemplate[];
}

function RoomForm({ form, onChange, tasks, templates }: RoomFormProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <input
        value={form.name}
        onChange={(e) => onChange({ ...form, name: e.target.value })}
        placeholder="Room name *"
        className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 dark:focus:ring-white/20"
      />
      <input
        value={form.description}
        onChange={(e) => onChange({ ...form, description: e.target.value })}
        placeholder="Description"
        className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 dark:focus:ring-white/20"
      />
      <select
        value={form.task_id}
        onChange={(e) => onChange({ ...form, task_id: e.target.value })}
        className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900/20 dark:focus:ring-white/20"
      >
        <option value="">Select task *</option>
        {tasks.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
      </select>
      <select
        value={form.template_id}
        onChange={(e) => onChange({ ...form, template_id: e.target.value })}
        className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900/20 dark:focus:ring-white/20"
      >
        <option value="">Select template *</option>
        {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
      </select>
      <div>
        <label className="block text-xs text-gray-400 dark:text-gray-600 mb-1">Start *</label>
        <input
          type="datetime-local"
          value={form.started_at}
          onChange={(e) => onChange({ ...form, started_at: e.target.value })}
          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900/20 dark:focus:ring-white/20"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-400 dark:text-gray-600 mb-1">End *</label>
        <input
          type="datetime-local"
          value={form.ended_at}
          onChange={(e) => onChange({ ...form, ended_at: e.target.value })}
          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900/20 dark:focus:ring-white/20"
        />
      </div>
    </div>
  );
}

// Unused RoomStatus import reference kept for completeness
const _roomStatus = RoomStatus;
void _roomStatus;
