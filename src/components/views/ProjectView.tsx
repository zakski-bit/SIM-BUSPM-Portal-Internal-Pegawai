import React, { useState } from 'react';
import { Target, CheckSquare, Square, AlertCircle, Plus, Send, Calendar, Trash2 } from 'lucide-react';
import { ProjectItem } from '../../types';

interface ProjectViewProps {
  projects: ProjectItem[];
  onAddProject?: (proj: ProjectItem) => void;
  onUpdateProjects?: (projects: ProjectItem[]) => void;
}

export const ProjectView: React.FC<ProjectViewProps> = ({ projects: initialProjects, onAddProject, onUpdateProjects }) => {
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [activeProject, setActiveProject] = useState<ProjectItem>(initialProjects[0] || {
    id: 'proj-1',
    title: 'Portal Intranet SIM-BUSPM Terpadu',
    progressPercent: 55,
    status: 'BERJALAN',
    leader: 'Zaenal Arifin, A.Md',
    deadline: '30 November 2026',
    tasks: []
  });
  const [newQuestionText, setNewQuestionText] = useState('');
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjLeader, setNewProjLeader] = useState('Zaenal Arifin, A.Md');
  const [newProjDeadline, setNewProjDeadline] = useState('31 Desember 2026');

  // Keep state in sync if parent initialProjects change
  React.useEffect(() => {
    setProjects(initialProjects);
    if (!initialProjects.find((p) => p.id === activeProject.id) && initialProjects.length > 0) {
      setActiveProject(initialProjects[0]);
    }
  }, [initialProjects]);

  const handleToggleTask = (projectId: string, taskId: string) => {
    const updated = projects.map((p) => {
      if (p.id !== projectId) return p;
      const updatedTasks = p.tasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      );
      const completedCount = updatedTasks.filter((t) => t.completed).length;
      const newPercent = Math.round((completedCount / updatedTasks.length) * 100);
      return {
        ...p,
        tasks: updatedTasks,
        progressPercent: newPercent
      };
    });

    setProjects(updated);
    if (onUpdateProjects) onUpdateProjects(updated);

    setActiveProject((prev) => {
      if (prev.id !== projectId) return prev;
      const updatedTasks = prev.tasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      );
      const completedCount = updatedTasks.filter((t) => t.completed).length;
      return {
        ...prev,
        tasks: updatedTasks,
        progressPercent: Math.round((completedCount / updatedTasks.length) * 100)
      };
    });
  };

  const handleDeleteTask = (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
    const updatedTasks = activeProject.tasks.filter((t) => t.id !== taskId);
    const completedCount = updatedTasks.filter((t) => t.completed).length;
    const newPercent = updatedTasks.length > 0 ? Math.round((completedCount / updatedTasks.length) * 100) : 0;

    const updatedProject = {
      ...activeProject,
      tasks: updatedTasks,
      progressPercent: newPercent
    };

    setActiveProject(updatedProject);
    const updatedList = projects.map((p) => (p.id === activeProject.id ? updatedProject : p));
    setProjects(updatedList);
    if (onUpdateProjects) onUpdateProjects(updatedList);
  };

  const handleAddQuestionIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const newTask = {
      id: `t-${Date.now()}`,
      text: newQuestionText,
      completed: false,
      issue: 'Perlu verifikasi teknis'
    };

    const updatedTasks = [...activeProject.tasks, newTask];
    const completedCount = updatedTasks.filter((t) => t.completed).length;
    const newPercent = Math.round((completedCount / updatedTasks.length) * 100);

    const updatedProject = {
      ...activeProject,
      tasks: updatedTasks,
      progressPercent: newPercent
    };

    setActiveProject(updatedProject);
    const updatedList = projects.map((p) => (p.id === activeProject.id ? updatedProject : p));
    setProjects(updatedList);
    if (onUpdateProjects) onUpdateProjects(updatedList);
    setNewQuestionText('');
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle.trim()) return;

    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: newProjTitle,
      progressPercent: 0,
      status: 'BERJALAN',
      leader: newProjLeader,
      deadline: newProjDeadline,
      tasks: [
        { id: `t-${Date.now()}-1`, text: 'Penyusunan Rencana Kerja & RAB', completed: false },
        { id: `t-${Date.now()}-2`, text: 'Pelaksanaan Teknis Tahap 1', completed: false }
      ]
    };

    const updatedList = [newProj, ...projects];
    setProjects(updatedList);
    setActiveProject(newProj);
    if (onAddProject) onAddProject(newProj);
    if (onUpdateProjects) onUpdateProjects(updatedList);
    setShowAddProjectModal(false);
    setNewProjTitle('');
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Manajemen Project Balai & Pelacak Isu (Project : Question)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pelacakan capaian milestone proyek strategis balai, checklist tugas, dan pencatatan kendala (question tracker)
          </p>
        </div>

        <button
          onClick={() => setShowAddProjectModal(true)}
          className="px-3.5 py-2 bg-bpp-amber hover:bg-bpp-amber-hover text-white text-xs font-bold rounded-md shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Proyek Baru</span>
        </button>
      </div>

      {/* Project Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {projects.map((proj) => (
          <button
            key={proj.id}
            onClick={() => setActiveProject(proj)}
            className={`p-4 rounded-lg border text-left transition-all cursor-pointer ${
              activeProject.id === proj.id
                ? 'bg-blue-50/60 dark:bg-blue-950/40 border-bpp-marine shadow-sm'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                proj.status === 'BERJALAN'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400'
              }`}>
                {proj.status}
              </span>
              <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                {proj.progressPercent}%
              </span>
            </div>

            <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {proj.title}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              PJ: {proj.leader}
            </p>

            {/* Mini Progress */}
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-bpp-marine"
                style={{ width: `${proj.progressPercent}%` }}
              />
            </div>
          </button>
        ))}
      </div>

      {/* Active Project Detail & Checklist (Project : Question) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-bpp-marine" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {activeProject.title}
              </h2>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span>Penanggung Jawab: {activeProject.leader}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Target Selesai: {activeProject.deadline}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Capaian:</span>
            <span className="text-lg font-bold font-mono text-bpp-marine">
              {activeProject.progressPercent}%
            </span>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-2 mb-6">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Milestone Checklist & Pelacak Tugas ({activeProject.tasks.length} item):
          </div>

          {activeProject.tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => handleToggleTask(activeProject.id, task.id)}
              className={`flex items-start justify-between p-3 rounded-md border text-xs cursor-pointer transition-colors ${
                task.completed
                  ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 line-through'
                  : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-bpp-marine/50'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {task.completed ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                )}
                <span className="leading-snug">{task.text}</span>
              </div>

              <div className="flex items-center gap-2">
                {task.issue && (
                  <span className="ml-2 px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800 rounded text-[10px] shrink-0 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-amber-500" />
                    <span>{task.issue}</span>
                  </span>
                )}
                <button
                  onClick={(e) => handleDeleteTask(e, task.id)}
                  title="Hapus Tugas"
                  className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Question / Issue Input (Project : Question) */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Tambah Isu / Kendala Baru pada Project Ini:
          </div>
          <form onSubmit={handleAddQuestionIssue} className="flex flex-col sm:flex-row gap-2 w-full max-w-full">
            <input
              type="text"
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder="Contoh: Menunggu pengadaan reagen kimia dari pihak ketiga..."
              className="flex-1 p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white min-w-0"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 bg-bpp-marine hover:bg-bpp-marine-dark text-white text-xs font-semibold rounded-md shadow-sm flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Send className="w-3 h-3" />
              <span>Tambah Task/Issue</span>
            </button>
          </form>
        </div>

      </div>

      {/* Modal Add Project */}
      {showAddProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Buat Proyek Baru Balai
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Daftarkan program kerja strategis BUSPM ke pelacak milestone
            </p>

            <form onSubmit={handleCreateProject} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Proyek
                </label>
                <input
                  type="text"
                  value={newProjTitle}
                  onChange={(e) => setNewProjTitle(e.target.value)}
                  placeholder="Contoh: Digitalisasi Arsip Sertifikat Mutu"
                  className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Penanggung Jawab (PJ)
                </label>
                <input
                  type="text"
                  value={newProjLeader}
                  onChange={(e) => setNewProjLeader(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Penyelesaian
                </label>
                <input
                  type="text"
                  value={newProjDeadline}
                  onChange={(e) => setNewProjDeadline(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-bpp-marine hover:bg-bpp-marine-dark text-white text-xs font-bold rounded-md shadow-sm"
                >
                  Simpan Proyek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
