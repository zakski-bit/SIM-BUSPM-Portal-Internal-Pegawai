import React, { useState } from 'react';
import { Plus, Clock, MapPin, User, CheckCircle2, Trash2, Filter } from 'lucide-react';
import { ScheduleItem } from '../../types';

interface JadwalViewProps {
  schedules: ScheduleItem[];
  onAddSchedule: (item: ScheduleItem) => void;
  onDeleteSchedule: (id: string) => void;
}

export const JadwalView: React.FC<JadwalViewProps> = ({
  schedules,
  onAddSchedule,
  onDeleteSchedule
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [dateStr, setDateStr] = useState('25 NOV');
  const [timeStr, setTimeStr] = useState('09:00');
  const [location, setLocation] = useState('Ruang Rapat 2 (Lt. 2)');
  const [category, setCategory] = useState<'RAPAT' | 'UJI_LAB' | 'AUDIT_ISO' | 'TOWN_HALL'>('RAPAT');

  const filtered = schedules.filter(
    (s) => selectedCategory === 'ALL' || s.category === selectedCategory
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const hasYear = /\b\d{4}\b/.test(dateStr);
    const fullDateTime = hasYear ? `${dateStr}, ${timeStr} WIB` : `${dateStr} 2026, ${timeStr} WIB`;

    const newItem: ScheduleItem = {
      id: `sch-${Date.now()}`,
      title,
      dateStr,
      timeStr,
      fullDateTime,
      location,
      category,
      organizer: 'Anda'
    };

    onAddSchedule(newItem);
    setTitle('');
    setShowModal(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Hapus jadwal kegiatan: "${name}"?`)) {
      onDeleteSchedule(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Jadwal Kegiatan & Kalender Operasional Balai
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Agenda pengujian laboratorium, jadwal sprint tim IT, rapat koordinasi pimpinan, dan audit akreditasi
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-3.5 py-2 bg-bpp-amber hover:bg-bpp-amber-hover text-white text-xs font-bold rounded-md shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Jadwal Baru</span>
        </button>
      </div>

      {/* Filter Category */}
      <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-1 sm:pb-0">
        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
        {[
          { id: 'ALL', label: 'Semua Agenda' },
          { id: 'RAPAT', label: 'Rapat Koordinasi' },
          { id: 'UJI_LAB', label: 'Pengujian Lab' },
          { id: 'AUDIT_ISO', label: 'Audit Akreditasi ISO' },
          { id: 'TOWN_HALL', label: 'Town Hall' }
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

      {/* Schedule Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm flex flex-col justify-between hover:border-bpp-marine/50 transition-colors"
          >
            <div>
              {/* Category Pill & Date */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-bpp-marine border border-blue-200 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300 rounded">
                  {item.category.replace('_', ' ')}
                </span>
                <span className="font-mono text-xs font-bold text-bpp-amber">
                  {item.dateStr}
                </span>
              </div>

              <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                {item.title}
              </h2>

              <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.timeStr} WIB</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{item.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">PJ: {item.organizer}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Terjadwal Resmi</span>
              </span>
              
              <button
                onClick={() => handleDelete(item.id, item.title)}
                title="Hapus Agenda"
                className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Schedule */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Tambah Jadwal Kegiatan Balai
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Masukkan agenda resmi ke kalender operasional Balai Uji Standar PPMHKP
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Kegiatan / Agenda
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Kalibrasi Spektrofotometer AAS Lab Kimia"
                  className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-bpp-marine"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tanggal (misal: 25 NOV)
                  </label>
                  <input
                    type="text"
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                    className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Waktu (WIB)
                  </label>
                  <input
                    type="text"
                    value={timeStr}
                    onChange={(e) => setTimeStr(e.target.value)}
                    className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Lokasi / Ruangan
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kategori Agenda
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                >
                  <option value="RAPAT">Rapat Koordinasi</option>
                  <option value="UJI_LAB">Pengujian Laboratorium</option>
                  <option value="AUDIT_ISO">Audit Akreditasi ISO</option>
                  <option value="TOWN_HALL">Town Hall & Seminar</option>
                </select>
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
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
