import React, { useState } from 'react';
import { Download, Search, ShieldCheck, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { DocumentItem, Employee, hasAdminAccess } from '../../types';

interface DocsViewProps {
  documents: DocumentItem[];
  currentUser?: Employee;
  onAddDocument?: (doc: DocumentItem) => void;
  onDeleteDocument?: (id: string) => void;
  searchFilter?: string;
}

export const DocsView: React.FC<DocsViewProps> = ({
  documents,
  currentUser,
  onAddDocument,
  onDeleteDocument,
  searchFilter = ''
}) => {
  const isAdmin = currentUser ? hasAdminAccess(currentUser.role) : false;
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState(searchFilter);
  const [showAddModal, setShowAddModal] = useState(false);
  const [downloadNotification, setDownloadNotification] = useState<string | null>(null);

  // Form states
  const [formCode, setFormCode] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<'SK_STRUKTURAL' | 'SOP_LAB' | 'ISO_17025' | 'REGULASI_PNBP'>('SOP_LAB');
  const [formFormat, setFormFormat] = useState<'PDF' | 'DOCX' | 'XLSX'>('PDF');

  const effectiveSearch = searchQuery || searchFilter;

  const filtered = documents.filter((doc) => {
    const matchesCat = selectedCategory === 'ALL' || doc.category === selectedCategory;
    const matchesSearch =
      doc.title.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      doc.code.toLowerCase().includes(effectiveSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleDownload = (doc: DocumentItem) => {
    let blob: Blob;
    let fileName = `${doc.code}.${doc.format.toLowerCase()}`;

    if (doc.format === 'DOCX') {
      const docHtml = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset='utf-8'>
          <title>${doc.title}</title>
          <style>
            body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; line-height: 1.5; margin: 2.5cm; color: #111; }
            .header { text-align: center; border-bottom: 3px double #003366; padding-bottom: 12px; margin-bottom: 24px; }
            .header h2 { font-size: 13pt; margin: 0; color: #003366; text-transform: uppercase; }
            .header h3 { font-size: 12pt; margin: 4px 0; color: #1a365d; text-transform: uppercase; }
            .header p { font-size: 9pt; margin: 0; color: #555; }
            .meta-box { border: 1px solid #cbd5e1; background: #f8fafc; padding: 12px 16px; margin: 20px 0; border-radius: 4px; }
            .content-section { margin-top: 24px; font-size: 11pt; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>Kementerian Kelautan dan Perikanan Republik Indonesia</h2>
            <h3>Badan Pengendalian dan Pengawasan Mutu Hasil Kelautan dan Perikanan</h3>
            <p>Balai Uji Standar PPMHKP Jakarta • Jl. Raya Setu No. 1, Cipayung, Jakarta Timur 13880</p>
          </div>
          <div class="meta-box">
            <h3 style="margin-top:0;">DOKUMEN RESMI: ${doc.title}</h3>
            <p><strong>Kode Dokumen:</strong> ${doc.code}</p>
            <p><strong>Kategori Mutu:</strong> ${doc.category}</p>
            <p><strong>Format & Ukuran:</strong> ${doc.format} (${doc.fileSize})</p>
            <p><strong>Tanggal Pengesahan:</strong> ${doc.uploadedAt}</p>
          </div>
          <div class="content-section">
            <p>Dokumen ini merupakan salinan sah digital standar operasional dan acuan mutu kerja Balai Uji Standar PPMHKP Jakarta.</p>
            <p>Seluruh personil laboratorium dan pemangku kepentingan wajib berpedoman pada ketentuan standar yang tertuang dalam dokumen ini.</p>
          </div>
        </body>
        </html>
      `;
      blob = new Blob(['\ufeff', docHtml], { type: 'application/msword;charset=utf-8' });
      fileName = `${doc.code}.doc`;
    } else {
      const printableHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${doc.title} - SIM-BUSPM</title>
          <style>
            @media print { body { margin: 1.5cm; } }
            body { font-family: 'Segoe UI', Arial, sans-serif; margin: 40px auto; max-width: 800px; line-height: 1.6; color: #1e293b; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #0284c7; padding-bottom: 15px; margin-bottom: 25px; }
            .header h1 { font-size: 16px; color: #0369a1; margin: 0; text-transform: uppercase; }
            .header h2 { font-size: 14px; margin: 5px 0; color: #0f172a; }
            .header p { font-size: 12px; color: #64748b; margin: 0; }
            .doc-card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; background: #f8fafc; margin-bottom: 20px; }
            .doc-code { display: inline-block; background: #0284c7; color: #fff; padding: 3px 8px; border-radius: 4px; font-family: monospace; font-size: 12px; margin-bottom: 10px; }
            .footer { margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 11px; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Kementerian Kelautan dan Perikanan Republik Indonesia</h1>
            <h2>Badan Pengendalian dan Pengawasan Mutu Hasil Kelautan dan Perikanan</h2>
            <p>Balai Uji Standar PPMHKP Jakarta • Dokumen Mutu Terakreditasi</p>
          </div>
          <div class="doc-card">
            <span class="doc-code">${doc.code}</span>
            <h3 style="margin: 0 0 10px 0; color: #0f172a;">${doc.title}</h3>
            <p style="margin: 4px 0; font-size: 13px;"><strong>Kategori Dokumen:</strong> ${doc.category}</p>
            <p style="margin: 4px 0; font-size: 13px;"><strong>Format Dokumen:</strong> ${doc.format} (${doc.fileSize})</p>
            <p style="margin: 4px 0; font-size: 13px;"><strong>Tanggal Rilis:</strong> ${doc.uploadedAt}</p>
          </div>
          <div>
            <h4>Deskripsi & Ruang Lingkup Standar</h4>
            <p>Dokumen ini mengatur tata laksana standar pengujian laboratorium dan administrasi operasional di lingkungan Balai Uji Standar Pengendalian dan Pengawasan Mutu Hasil Kelautan dan Perikanan (BUSPPMHKP) Jakarta.</p>
          </div>
          <div class="footer">
            Dokumen Sah Digital • SIM-BUSPM Kementerian Kelautan dan Perikanan RI
          </div>
        </body>
        </html>
      `;
      blob = new Blob([printableHtml], { type: 'text/html;charset=utf-8' });
      fileName = `${doc.code}.html`;
    }

    const element = document.createElement('a');
    element.href = URL.createObjectURL(blob);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setDownloadNotification(`Dokumen "${doc.title}" berhasil diunduh (${fileName}).`);
    setTimeout(() => setDownloadNotification(null), 3500);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCode.trim() || !formTitle.trim()) return;

    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      code: formCode.toUpperCase(),
      title: formTitle,
      category: formCategory,
      format: formFormat,
      fileSize: '1.2 MB',
      uploadedAt: 'Hari ini',
      downloadUrl: '#'
    };

    if (onAddDocument) onAddDocument(newDoc);
    setFormCode('');
    setFormTitle('');
    setShowAddModal(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Hapus dokumen: "${title}"?`)) {
      if (onDeleteDocument) onDeleteDocument(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Repositori Dokumen SOP, ISO 17025 & Regulasi Mutu
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pusat arsip standar mutu, format MTA, CoA, dan regulasi PNBP Balai Uji Standar PPMHKP Jakarta
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-bpp-amber hover:bg-bpp-amber-hover text-white text-xs font-bold rounded-md shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Unggah Dokumen Baru</span>
          </button>
          
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-2 bg-blue-50 dark:bg-blue-950 text-bpp-marine dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>ISO/IEC 17025:2017</span>
          </div>
        </div>
      </div>

      {/* Download Alert Notification */}
      {downloadNotification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{downloadNotification}</span>
        </div>
      )}

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: 'Semua Dokumen' },
            { id: 'SOP_LAB', label: 'SOP Pengujian Lab' },
            { id: 'ISO_17025', label: 'Manual Mutu ISO' },
            { id: 'SK_STRUKTURAL', label: 'SK Struktural' },
            { id: 'REGULASI_PNBP', label: 'Regulasi PNBP / MTA' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors shrink-0 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-bpp-marine text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kode atau judul dokumen..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Kode Dokumen</th>
                <th className="py-3 px-4">Nama Dokumen Resmi</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Format & Ukuran</th>
                <th className="py-3 px-4 text-right">Aksi Unduh / Kelola</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                    {doc.code}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {doc.title}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Diperbarui: {doc.uploadedAt}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded">
                      {doc.category.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {doc.format} • {doc.fileSize}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleDownload(doc)}
                        className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-bpp-amber hover:text-white text-slate-700 dark:text-slate-200 text-xs font-semibold rounded border border-slate-200 dark:border-slate-700 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>Unduh</span>
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(doc.id, doc.title)}
                          title="Hapus Dokumen (Super Admin)"
                          className="p-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Document */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Unggah Dokumen Mutu / Regulasi Baru
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Simpan dokumen acuan kerja resmi ke repositori SIM-BUSPM
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kode Dokumen
                </label>
                <input
                  type="text"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value)}
                  placeholder="Contoh: SOP-BUSPM-MIK-002"
                  className="w-full p-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama / Judul Dokumen
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Contoh: SOP Verifikasi Metode Uji Salmonella dengan PCR"
                  className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kategori
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                  >
                    <option value="SOP_LAB">SOP Pengujian Lab</option>
                    <option value="ISO_17025">Manual Mutu ISO</option>
                    <option value="SK_STRUKTURAL">SK Struktural</option>
                    <option value="REGULASI_PNBP">Regulasi PNBP / MTA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Format File
                  </label>
                  <select
                    value={formFormat}
                    onChange={(e) => setFormFormat(e.target.value as any)}
                    className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="DOCX">Microsoft Word (DOCX)</option>
                    <option value="XLSX">Spreadsheet (XLSX)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-bpp-marine hover:bg-bpp-marine-dark text-white text-xs font-bold rounded-md shadow-sm"
                >
                  Unggah Dokumen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
