import React, { useState } from 'react';
import { Search, Mail, Phone, HelpCircle, Send, CheckCircle2, Filter, Plus, Edit2, Trash2, ShieldCheck } from 'lucide-react';
import { Employee, hasAdminAccess } from '../../types';

interface PegawaiViewProps {
  employees: Employee[];
  currentUser: Employee;
  onAddEmployee: (emp: Employee) => void;
  onEditEmployee: (emp: Employee) => void;
  onDeleteEmployee: (id: string) => void;
  searchFilter?: string;
}

export const PegawaiView: React.FC<PegawaiViewProps> = ({
  employees,
  currentUser,
  onAddEmployee,
  onEditEmployee,
  onDeleteEmployee,
  searchFilter = ''
}) => {
  const [selectedDivision, setSelectedDivision] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState(searchFilter);
  
  // Question / Helpdesk state
  const [questionText, setQuestionText] = useState('');
  const [questionSubmitted, setQuestionSubmitted] = useState(false);

  // CRUD Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formNip, setFormNip] = useState('');
  const [formCategory, setFormCategory] = useState<'ASN' | 'NON_ASN'>('ASN');
  const [formJobTitle, setFormJobTitle] = useState('');
  const [formDivisionName, setFormDivisionName] = useState('Lab Kimia & Residu Cemaran');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formStatus, setFormStatus] = useState<'AKTIF' | 'CUTI' | 'DINAS_LUAR'>('AKTIF');

  const isAdmin = hasAdminAccess(currentUser.role);

  const divisions = [
    { id: 'ALL', name: 'Semua Divisi' },
    { id: 'Pimpinan Balai', name: 'Pimpinan' },
    { id: 'Subbagian Tata Usaha', name: 'Tata Usaha' },
    { id: 'Lab Kimia & Residu Cemaran', name: 'Lab Kimia' },
    { id: 'Lab Mikrobiologi & Biomol', name: 'Lab Mikrobiologi' },
    { id: 'Lab Patologi & Kesehatan Ikan', name: 'Lab Patologi' },
    { id: 'Bidang Standardisasi & Mutu', name: 'Standardisasi' }
  ];

  const effectiveSearch = searchQuery || searchFilter;

  const filtered = employees.filter((emp) => {
    const matchesDiv = selectedDivision === 'ALL' || emp.divisionName.includes(selectedDivision);
    const matchesSearch =
      emp.name.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      emp.nipNik.includes(effectiveSearch) ||
      emp.jobTitle.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      emp.divisionName.toLowerCase().includes(effectiveSearch.toLowerCase());
    return matchesDiv && matchesSearch;
  });

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormName('');
    setFormNip('');
    setFormCategory('ASN');
    setFormJobTitle('Analis Laboratorium');
    setFormDivisionName('Lab Kimia & Residu Cemaran');
    setFormEmail('@kkp.go.id');
    setFormPhone('0812-');
    setFormStatus('AKTIF');
    setShowModal(true);
  };

  const handleOpenEditModal = (emp: Employee) => {
    setEditingId(emp.id);
    setFormName(emp.name);
    setFormNip(emp.nipNik);
    setFormCategory(emp.category);
    setFormJobTitle(emp.jobTitle);
    setFormDivisionName(emp.divisionName);
    setFormEmail(emp.email);
    setFormPhone(emp.phone);
    setFormStatus(emp.status as any);
    setShowModal(true);
  };

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formNip.trim()) return;

    if (editingId) {
      // Edit
      const updated: Employee = {
        ...employees.find((e) => e.id === editingId)!,
        name: formName,
        nipNik: formNip,
        category: formCategory,
        jobTitle: formJobTitle,
        divisionName: formDivisionName,
        email: formEmail,
        phone: formPhone,
        status: formStatus
      };
      onEditEmployee(updated);
    } else {
      // Add
      const newEmp: Employee = {
        id: `emp-${Date.now()}`,
        nipNik: formNip,
        name: formName,
        category: formCategory,
        role: formCategory === 'ASN' ? 'ANALIS' : 'STAFF',
        jobTitle: formJobTitle,
        divisionId: 'div-kimia',
        divisionName: formDivisionName,
        email: formEmail,
        phone: formPhone,
        status: formStatus,
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80'
      };
      onAddEmployee(newEmp);
    }

    setShowModal(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data pegawai: ${name}?`)) {
      onDeleteEmployee(id);
    }
  };

  const handleSendQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    setQuestionSubmitted(true);
    setQuestionText('');
    setTimeout(() => setQuestionSubmitted(false), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Title & Admin Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Direktori Pegawai BPP MHKP Jakarta</span>
            {isAdmin && (
              <span className="px-2 py-0.5 bg-blue-50 text-bpp-marine dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded text-[10px] font-bold">
                Mode Kelola Pimpinan / KTU
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Daftar resmi aparatur ASN dan Tenaga Non-ASN (PPNPN) Balai Uji Standar PPMHKP Cipayung Jakarta
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={handleOpenAddModal}
              className="px-3.5 py-2 bg-bpp-amber hover:bg-bpp-amber-hover text-white text-xs font-bold rounded-md shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Pegawai Baru</span>
            </button>
          )}
          <div className="text-xs font-semibold px-2.5 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-300">
            {filtered.length} dari {employees.length} Pegawai
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
          {divisions.map((div) => (
            <button
              key={div.id}
              onClick={() => setSelectedDivision(div.id)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors shrink-0 cursor-pointer ${
                selectedDivision === div.id
                  ? 'bg-bpp-marine text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
              }`}
            >
              {div.name}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, NIP, atau divisi..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-bpp-marine"
          />
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Pegawai</th>
                <th className="py-3 px-4">Kategori & Hirarki</th>
                <th className="py-3 px-4">Divisi & Jabatan</th>
                <th className="py-3 px-4">Kontak Kedinasan</th>
                <th className="py-3 px-4 text-center">Status</th>
                {isAdmin && <th className="py-3 px-4 text-right">Aksi KTU</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  
                  {/* Photo & Name */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={emp.avatarUrl}
                        alt={emp.name}
                        className="w-9 h-9 rounded object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {emp.name}
                        </div>
                        <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                          {emp.category === 'ASN' ? `NIP: ${emp.nipNik}` : `NIK: ${emp.nipNik}`}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category & Role */}
                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-1 items-start">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                          emp.category === 'ASN'
                            ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800'
                            : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
                        }`}
                      >
                        {emp.category === 'ASN' ? 'ASN (PNS)' : 'PPNPN'}
                      </span>
                      {hasAdminAccess(emp.role) && (
                        <span className="text-[10px] font-bold text-bpp-marine dark:text-blue-400 flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Super Admin</span>
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Division & Job */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {emp.jobTitle}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {emp.divisionName}
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-0.5 text-[11px] text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-slate-400" />
                        {emp.email}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {emp.phone}
                      </span>
                    </div>
                  </td>

                  {/* Status (Strict typography badge - ZERO GREEN DOTS!) */}
                  <td className="py-3 px-4 text-center">
                    {emp.status === 'AKTIF' ? (
                      <span className="inline-block px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/40 rounded">
                        Aktif
                      </span>
                    ) : (
                      <span className="inline-block px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/40 rounded">
                        Cuti
                      </span>
                    )}
                  </td>

                  {/* Admin Actions (Only for Kepala Balai / KTU) */}
                  {isAdmin && (
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(emp)}
                          title="Edit Data Pegawai"
                          className="p-1.5 text-slate-600 hover:text-bpp-marine dark:text-slate-400 dark:hover:text-white bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 rounded border border-slate-200 dark:border-slate-700 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(emp.id, emp.name)}
                          title="Hapus Pegawai"
                          className="p-1.5 text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 rounded border border-slate-200 dark:border-slate-700 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  )}

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit Employee (CRUD for Kepala Balai / KTU) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 max-w-lg w-full shadow-2xl">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              {editingId ? 'Edit Data Pegawai Balai' : 'Tambah Pegawai Baru'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Hak akses khusus Kepala Balai dan Kepala Subbagian Tata Usaha BUSPM
            </p>

            <form onSubmit={handleSaveEmployee} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Lengkap & Gelar
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Contoh: Rahmat Hidayat, S.Pi."
                    className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    NIP / NIK Kedinasan
                  </label>
                  <input
                    type="text"
                    value={formNip}
                    onChange={(e) => setFormNip(e.target.value)}
                    placeholder="19920815..."
                    className="w-full p-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kategori Pegawai
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                  >
                    <option value="ASN">Pegawai ASN (PNS/PPPK)</option>
                    <option value="NON_ASN">Tenaga Non-ASN (PPNPN)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Status Kehadiran
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                  >
                    <option value="AKTIF">Aktif Bertugas</option>
                    <option value="CUTI">Cuti Resmi</option>
                    <option value="DINAS_LUAR">Dinas Luar</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Jabatan Kedinasan
                </label>
                <input
                  type="text"
                  value={formJobTitle}
                  onChange={(e) => setFormJobTitle(e.target.value)}
                  placeholder="Contoh: Analis Kimia & Residu Cemaran"
                  className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Divisi / Laboratorium
                </label>
                <select
                  value={formDivisionName}
                  onChange={(e) => setFormDivisionName(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                >
                  <option value="Pimpinan Balai">Pimpinan Balai</option>
                  <option value="Subbagian Tata Usaha">Subbagian Tata Usaha</option>
                  <option value="Lab Kimia & Residu Cemaran">Lab Kimia & Residu Cemaran</option>
                  <option value="Lab Mikrobiologi & Biomol">Lab Mikrobiologi & Biomol</option>
                  <option value="Lab Patologi & Kesehatan Ikan">Lab Patologi & Kesehatan Ikan</option>
                  <option value="Bidang Standardisasi & Mutu">Bidang Standardisasi & Mutu</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Dinas
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nomor WhatsApp Dinas
                  </label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                  />
                </div>
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
                  {editingId ? 'Simpan Perubahan' : 'Tambah Pegawai'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Employee Question Desk */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="w-4 h-4 text-bpp-marine" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Kotak Pertanyaan & Layanan Administrasi Pegawai (Question Desk)
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Ajukan pertanyaan atau konsultasi administrasi kepegawaian langsung ke Subbagian Tata Usaha BUSPM Cipayung.
        </p>

        {questionSubmitted && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Pertanyaan Anda berhasil dikirim ke Subbag Tata Usaha. Jawaban resmi akan disampaikan melalui portal internal ini.</span>
          </div>
        )}

        <form onSubmit={handleSendQuestion} className="space-y-3">
          <textarea
            rows={2}
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Tuliskan pertanyaan kepegawaian atau kendala fasilitas lab di sini..."
            className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-bpp-marine"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-bpp-marine hover:bg-bpp-marine-dark text-white text-xs font-semibold rounded-md shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Kirim ke Subbag Tata Usaha</span>
          </button>
        </form>
      </div>

    </div>
  );
};
