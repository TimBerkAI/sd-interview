import { useEffect, useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  ChevronDown,
  ChevronRight,
  GripVertical,
} from 'lucide-react';
import { api } from '../../../services/api';
import type { ArchTemplate, ArchSection } from '../../../types';
import { TemplateStatus, Specialty, SectionType } from '../../../types';

const EMPTY_TEMPLATE_FORM = { name: '', specialty: '' as Specialty | '', status: TemplateStatus.DRAFT };
const EMPTY_SECTION_FORM = { name: '', description: '', order: 0, type: SectionType.HLD, score_scale: '[]' };

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
  AWAITING_CONFIRMATION: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  CONFIRMED: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  ARCHIVED: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
};

export function ArchTemplatesPage() {
  const [templates, setTemplates] = useState<ArchTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [editingTemplateId, setEditingTemplateId] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [templateForm, setTemplateForm] = useState({ ...EMPTY_TEMPLATE_FORM });
  const [saving, setSaving] = useState(false);
  const [addingSectionTo, setAddingSectionTo] = useState<number | null>(null);
  const [sectionForm, setSectionForm] = useState({ ...EMPTY_SECTION_FORM });
  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);
  const [editingSectionForm, setEditingSectionForm] = useState({ ...EMPTY_SECTION_FORM });

  const load = async () => {
    setLoading(true);
    setTemplates(await api.getArchTemplates());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleExpand = (id: number) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const startEditTemplate = (t: ArchTemplate) => {
    setEditingTemplateId(t.id);
    setShowCreate(false);
    setTemplateForm({ name: t.name, specialty: t.specialty || '', status: t.status });
  };

  const cancelEditTemplate = () => { setEditingTemplateId(null); };

  const saveTemplate = async (id: number) => {
    setSaving(true);
    const data: Record<string, unknown> = { name: templateForm.name, status: templateForm.status };
    if (templateForm.specialty) data.specialty = templateForm.specialty;
    await api.updateArchTemplate(id, data as Partial<ArchTemplate>);
    await load();
    cancelEditTemplate();
    setSaving(false);
  };

  const startCreate = () => {
    setShowCreate(true);
    setEditingTemplateId(null);
    setTemplateForm({ ...EMPTY_TEMPLATE_FORM });
  };

  const saveCreate = async () => {
    setSaving(true);
    const data: Record<string, unknown> = { name: templateForm.name, status: templateForm.status };
    if (templateForm.specialty) data.specialty = templateForm.specialty;
    await api.createArchTemplate(data as Partial<ArchTemplate>);
    await load();
    setShowCreate(false);
    setSaving(false);
  };

  const removeTemplate = async (id: number) => {
    if (!confirm('Delete this template and all its sections?')) return;
    await api.deleteArchTemplate(id);
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const startAddSection = (templateId: number, existingCount: number) => {
    setAddingSectionTo(templateId);
    setSectionForm({ ...EMPTY_SECTION_FORM, order: existingCount });
    setEditingSectionId(null);
  };

  const saveSection = async (templateId: number) => {
    setSaving(true);
    let parsedScale = [];
    try { parsedScale = JSON.parse(sectionForm.score_scale); } catch { parsedScale = []; }
    await api.createArchSection(templateId, {
      name: sectionForm.name,
      description: sectionForm.description || null,
      order: sectionForm.order,
      type: sectionForm.type,
      score_scale: parsedScale,
    } as Partial<ArchSection>);
    await load();
    setAddingSectionTo(null);
    setSaving(false);
  };

  const startEditSection = (s: ArchSection) => {
    setEditingSectionId(s.id);
    setAddingSectionTo(null);
    setEditingSectionForm({
      name: s.name,
      description: s.description || '',
      order: s.order,
      type: s.type,
      score_scale: JSON.stringify(s.score_scale, null, 2),
    });
  };

  const saveSectionEdit = async (id: number) => {
    setSaving(true);
    let parsedScale = [];
    try { parsedScale = JSON.parse(editingSectionForm.score_scale); } catch { parsedScale = []; }
    await api.updateArchSection(id, {
      name: editingSectionForm.name,
      description: editingSectionForm.description || null,
      order: editingSectionForm.order,
      type: editingSectionForm.type,
      score_scale: parsedScale,
    } as Partial<ArchSection>);
    await load();
    setEditingSectionId(null);
    setSaving(false);
  };

  const removeSection = async (id: number) => {
    if (!confirm('Delete this section?')) return;
    await api.deleteArchSection(id);
    await load();
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Arch Templates</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{templates.length} template{templates.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={startCreate}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-all"
        >
          <Plus className="w-4 h-4" />
          New Template
        </button>
      </div>

      {showCreate && (
        <div className="mb-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">New Template</h3>
          <TemplateForm form={templateForm} onChange={setTemplateForm} />
          <div className="flex gap-2 mt-4">
            <button onClick={saveCreate} disabled={saving || !templateForm.name.trim()} className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-gray-800 dark:hover:bg-gray-100 transition-all">
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

      <div className="space-y-3">
        {templates.length === 0 && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl py-16 text-center text-gray-400 dark:text-gray-600 text-sm">
            No templates yet
          </div>
        )}

        {templates.map((template) => (
          <div key={template.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
            {editingTemplateId === template.id ? (
              <div className="p-5">
                <TemplateForm form={templateForm} onChange={setTemplateForm} />
                <div className="flex gap-2 mt-3">
                  <button onClick={() => saveTemplate(template.id)} disabled={saving || !templateForm.name.trim()} className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-gray-800 dark:hover:bg-gray-100 transition-all">
                    <Check className="w-4 h-4" />
                    Save
                  </button>
                  <button onClick={cancelEditTemplate} className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center px-5 py-4">
                <button onClick={() => toggleExpand(template.id)} className="p-1 text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors mr-2">
                  {expanded.has(template.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{template.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-lg ${STATUS_COLORS[template.status] || ''}`}>
                      {template.status}
                    </span>
                    {template.specialty && (
                      <span className="text-xs text-gray-400 dark:text-gray-500">{template.specialty}</span>
                    )}
                    <span className="text-xs text-gray-400 dark:text-gray-500">{template.sections.length} section{template.sections.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => startEditTemplate(template)} className="p-1.5 text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => removeTemplate(template.id)} className="p-1.5 text-gray-400 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {expanded.has(template.id) && (
              <div className="border-t border-gray-100 dark:border-gray-800">
                {template.sections.length === 0 && addingSectionTo !== template.id && (
                  <p className="px-6 py-4 text-sm text-gray-400 dark:text-gray-600">No sections yet</p>
                )}

                {template.sections.map((section) =>
                  editingSectionId === section.id ? (
                    <div key={section.id} className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                      <SectionForm form={editingSectionForm} onChange={setEditingSectionForm} />
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => saveSectionEdit(section.id)} disabled={saving || !editingSectionForm.name.trim()} className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-gray-800 dark:hover:bg-gray-100 transition-all">
                          <Check className="w-4 h-4" />
                          Save
                        </button>
                        <button onClick={() => setEditingSectionId(null)} className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div key={section.id} className="flex items-center px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors border-b border-gray-50 dark:border-gray-800/50 group">
                      <GripVertical className="w-4 h-4 text-gray-300 dark:text-gray-700 mr-3" />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{section.name}</span>
                        <span className="ml-2 text-xs text-gray-400 dark:text-gray-600">{section.type}</span>
                        <span className="ml-2 text-xs text-gray-400 dark:text-gray-600">order: {section.order}</span>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => startEditSection(section)} className="p-1.5 text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => removeSection(section.id)} className="p-1.5 text-gray-400 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )
                )}

                {addingSectionTo === template.id ? (
                  <div className="px-6 py-4">
                    <SectionForm form={sectionForm} onChange={setSectionForm} />
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => saveSection(template.id)} disabled={saving || !sectionForm.name.trim()} className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-gray-800 dark:hover:bg-gray-100 transition-all">
                        <Check className="w-4 h-4" />
                        Add Section
                      </button>
                      <button onClick={() => setAddingSectionTo(null)} className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="px-6 py-3">
                    <button
                      onClick={() => startAddSection(template.id, template.sections.length)}
                      className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add section
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface TemplateFormProps {
  form: { name: string; specialty: Specialty | ''; status: TemplateStatus };
  onChange: (f: { name: string; specialty: Specialty | ''; status: TemplateStatus }) => void;
}

function TemplateForm({ form, onChange }: TemplateFormProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <input
        value={form.name}
        onChange={(e) => onChange({ ...form, name: e.target.value })}
        placeholder="Template name *"
        className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 dark:focus:ring-white/20"
      />
      <select
        value={form.specialty}
        onChange={(e) => onChange({ ...form, specialty: e.target.value as Specialty | '' })}
        className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900/20 dark:focus:ring-white/20"
      >
        <option value="">Specialty (any)</option>
        {Object.values(Specialty).map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      <select
        value={form.status}
        onChange={(e) => onChange({ ...form, status: e.target.value as TemplateStatus })}
        className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900/20 dark:focus:ring-white/20"
      >
        {Object.values(TemplateStatus).map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>
  );
}

interface SectionFormProps {
  form: { name: string; description: string; order: number; type: SectionType; score_scale: string };
  onChange: (f: { name: string; description: string; order: number; type: SectionType; score_scale: string }) => void;
}

function SectionForm({ form, onChange }: SectionFormProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <input
          value={form.name}
          onChange={(e) => onChange({ ...form, name: e.target.value })}
          placeholder="Section name *"
          className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 dark:focus:ring-white/20"
        />
        <select
          value={form.type}
          onChange={(e) => onChange({ ...form, type: e.target.value as SectionType })}
          className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900/20 dark:focus:ring-white/20"
        >
          {Object.values(SectionType).map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <input
          type="number"
          value={form.order}
          onChange={(e) => onChange({ ...form, order: parseInt(e.target.value) || 0 })}
          placeholder="Order"
          className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 dark:focus:ring-white/20"
        />
        <input
          value={form.description}
          onChange={(e) => onChange({ ...form, description: e.target.value })}
          placeholder="Description"
          className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 dark:focus:ring-white/20"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-400 dark:text-gray-600 mb-1">Score scale (JSON array)</label>
        <textarea
          value={form.score_scale}
          onChange={(e) => onChange({ ...form, score_scale: e.target.value })}
          rows={3}
          placeholder='[{"score": 1, "comment": "Poor"}, {"score": 5, "comment": "Excellent"}]'
          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 font-mono focus:outline-none focus:ring-2 focus:ring-gray-900/20 dark:focus:ring-white/20 resize-none"
        />
      </div>
    </div>
  );
}
