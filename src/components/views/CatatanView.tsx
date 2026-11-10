import React, { useState } from 'react';
import { Plus, Clock, User, Filter, Edit2, Trash2 } from 'lucide-react';
import { NoteItem } from '../../types';

interface CatatanViewProps {
  notes: NoteItem[];
  onAddNote: (note: NoteItem) => void;
  onEditNote: (note: NoteItem) => void;
  onDeleteNote: (id: string) => void;
}

export const CatatanView: React.FC<CatatanViewProps> = ({
  notes,
  onAddNote,
  onEditNote,
  onDeleteNote
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'NOTULENSI' | 'TEKNIS_LAB' | 'MEMO'>('TEKNIS_LAB');

  const filtered = notes.filter(
    (n) => selectedCategory === 'ALL' || n.category === selectedCategory
  );

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setCategory('TEKNIS_LAB');
    setShowModal(true);
  };

  const handleOpenEdit = (n: NoteItem) => {
    setEditingId(n.id);
    setTitle(n.title);
    setContent(n.content);
    setCategory(n.category);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (editingId) {
      const existing = notes.find((n) => n.id === editingId);
      if (existing) {
        onEditNote({
          ...existing,
          title,
          content,
          category,
          updatedAt: 'Baru saja diperbarui'
        });
      }
    } else {
      const newNote: NoteItem = {
        id: `note-${Date.now()}`,
        title,
        content,
        category,
        author: 'Anda',
        updatedAt: 'Baru saja'
      };
      onAddNote(newNote);
    }

    setShowModal(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Hapus catatan: "${name}"?`)) {
      onDeleteNote(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Catatan Teknis Pengujian, Notulensi & Memo Balai
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Dokumentasi ringkasan rapat internal, deviasi teknis instrumen lab, dan memo kedinasan BUSPM
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-3.5 py-2 bg-bpp-amber hover:bg-bpp-amber-hover text-white text-xs font-bold rounded-md shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tulis Catatan Baru</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-1 sm:pb-0">
        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
        {[
          { id: 'ALL', label: 'Semua Kategori' },
          { id: 'TEKNIS_LAB', label: 'Teknis Pengujian Lab' },
          { id: 'NOTULENSI', label: 'Notulensi Rapat' },
          { id: 'MEMO', label: 'Memo Kedinasan' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors shrink-0 cursor-pointer ${
              selectedCategory === tab.id
                ? 'bg-bpp-marine text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((note) => (
          <div
            key={note.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm flex flex-col justify-between hover:border-bpp-marine/40 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded font-mono">
                  {note.category}
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {note.updatedAt}
                </span>
              </div>

              <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                {note.title}
              </h2>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-4">
                {note.content}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Penulis: {note.author}</span>
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(note)}
                  title="Edit Catatan"
                  className="p-1 text-slate-400 hover:text-bpp-marine cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(note.id, note.title)}
                  title="Hapus Catatan"
                  className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add/Edit Note */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 max-w-lg w-full shadow-2xl">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              {editingId ? 'Edit Catatan' : 'Tulis Catatan / Notulensi Baru'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Dokumentasikan ringkasan teknis atau kesepakatan rapat kerja kedinasan
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                >
                  <option value="TEKNIS_LAB">Teknis Pengujian Lab</option>
                  <option value="NOTULENSI">Notulensi Rapat</option>
                  <option value="MEMO">Memo Kedinasan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Catatan
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Evaluasi Hasil Uji Banding Antar-Analis"
                  className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Isi Catatan / Notulensi
                </label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tuliskan butir-butir ringkasan atau detail teknis..."
                  className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-bpp-marine hover:bg-bpp-marine-dark text-white text-xs font-bold rounded-md shadow-sm cursor-pointer"
                >
                  {editingId ? 'Simpan Perubahan' : 'Simpan Catatan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
