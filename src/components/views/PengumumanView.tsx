import React, { useState } from 'react';
import { Clock, Plus, Trash2 } from 'lucide-react';
import { AnnouncementItem, Employee, hasAdminAccess } from '../../types';

interface PengumumanViewProps {
  announcements: AnnouncementItem[];
  currentUser: Employee;
  onAddAnnouncement?: (item: AnnouncementItem) => void;
  onDeleteAnnouncement?: (id: string) => void;
}

export const PengumumanView: React.FC<PengumumanViewProps> = ({
  announcements,
  currentUser,
  onAddAnnouncement,
  onDeleteAnnouncement
}) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [priority, setPriority] = useState<'SANGAT_PENTING' | 'UMUM' | 'INTERNAL'>('SANGAT_PENTING');

  const isAdmin = hasAdminAccess(currentUser.role);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) return;

    const newItem: AnnouncementItem = {
      id: `ann-${Date.now()}`,
      title,
      summary,
      publishedAt: 'Hari ini',
      priority,
      publisher: `${currentUser.name} (${currentUser.jobTitle})`
    };

    if (onAddAnnouncement) onAddAnnouncement(newItem);
    setTitle('');
    setSummary('');
    setShowModal(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Hapus pengumuman resmi: "${title}"?`)) {
      if (onDeleteAnnouncement) onDeleteAnnouncement(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Papan Pengumuman Resmi Balai Uji Standar
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Siaran instruksi pimpinan balai, surat edaran KKP, dan informasi kedinasan internal BUSPM
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="px-3.5 py-2 bg-bpp-amber hover:bg-bpp-amber-hover text-white text-xs font-bold rounded-md shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Siaran Pengumuman</span>
          </button>
        )}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm hover:border-bpp-marine/40 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${
                    item.priority === 'SANGAT_PENTING'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800'
                      : 'bg-blue-50 text-bpp-marine border border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800'
                  }`}
                >
                  {item.priority.replace('_', ' ')}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                  <Clock className="w-3 h-3" />
                  {item.publishedAt}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Penerbit: {item.publisher}
                </span>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    title="Hapus Pengumuman"
                    className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-2 leading-snug">
              {item.title}
            </h2>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {item.summary}
            </p>
          </div>
        ))}
      </div>

      {/* Modal Broadcast Announcement */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 max-w-lg w-full shadow-2xl">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Rilis Pengumuman Resmi Balai
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Siaran kedinasan akan tampil pada dashboard dan halaman pengumuman seluruh pegawai
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Prioritas Siaran
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                >
                  <option value="SANGAT_PENTING">Sangat Penting / Urgent</option>
                  <option value="UMUM">Umum / Sosialisasi</option>
                  <option value="INTERNAL">Internal Terbatas</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Pengumuman
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Jadwal Pelaksanaan Kalibrasi Alat Lab Q1"
                  className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Isi Pengumuman / Instruksi
                </label>
                <textarea
                  rows={4}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Tuliskan isi instruksi atau informasi surat edaran secara ringkas dan jelas..."
                  className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-bpp-amber hover:bg-bpp-amber-hover text-white text-xs font-bold rounded-md shadow-sm"
                >
                  Rilis Siaran Resmi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
