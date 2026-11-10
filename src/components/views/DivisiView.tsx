import React, { useState } from 'react';
import { Users, Activity, CheckSquare, Eye, X, Send } from 'lucide-react';
import { Division } from '../../types';

interface DivisiViewProps {
  divisions: Division[];
}

export const DivisiView: React.FC<DivisiViewProps> = ({ divisions }) => {
  const [activeModalDiv, setActiveModalDiv] = useState<Division | null>(null);
  const [showConsultModal, setShowConsultModal] = useState<Division | null>(null);
  const [consultText, setConsultText] = useState('');
  const [consultSuccess, setConsultSuccess] = useState(false);

  const handleSendConsult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultText.trim()) return;
    setConsultSuccess(true);
    setConsultText('');
    setTimeout(() => {
      setConsultSuccess(false);
      setShowConsultModal(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Divisi & Unit Laboratorium Pengujian (LAB)
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          5 Unit Teknis Pengujian Rujukan Nasional Berstandar ISO/IEC 17025:2017 di Lingkungan Balai Uji Standar PPMHKP
        </p>
      </div>

      {/* Division Cards with Real Laboratory Photos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {divisions.map((div) => (
          <div
            key={div.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-sm flex flex-col justify-between transition-colors hover:border-bpp-marine/50"
          >
            <div>
              {/* Real Laboratory Photo from Unsplash */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                <img
                  src={div.imageUrl}
                  alt={div.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 px-2 py-0.5 bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-bold rounded font-mono">
                  {div.code}
                </div>
                <div className="absolute top-3 right-3 px-2 py-0.5 bg-bpp-amber text-white text-[11px] font-bold rounded">
                  ISO/IEC 17025
                </div>
              </div>

              {/* Content Details */}
              <div className="p-5">
                <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                  {div.name}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {div.description}
                </p>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200/80 dark:border-slate-700/60 text-xs mb-4">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-bpp-marine" />
                    <div>
                      <div className="text-[10px] text-slate-400">Kapasitas Uji</div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">{div.dailyCapacity} sampel/hari</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-bpp-amber" />
                    <div>
                      <div className="text-[10px] text-slate-400">Personel Lab</div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">{div.totalPersonnel} Analis</div>
                    </div>
                  </div>
                </div>

                {/* Key Instruments */}
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Instrumen & Metode Uji Utama:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {div.keyInstruments.map((inst, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700"
                      >
                        <CheckSquare className="w-3 h-3 text-bpp-marine" />
                        <span>{inst}</span>
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Footer Coordinator & Interactive Actions */}
            <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Koordinator Teknis:</span>
                <span className="font-bold text-slate-900 dark:text-white">{div.headName}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveModalDiv(div)}
                  className="px-2.5 py-1.5 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 border border-slate-200 dark:border-slate-600 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Detail</span>
                </button>
                <button
                  onClick={() => setShowConsultModal(div)}
                  className="px-2.5 py-1.5 bg-bpp-marine hover:bg-bpp-marine-dark text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>Konsultasi</span>
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Modal Detail Divisi */}
      {activeModalDiv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Informasi Teknis: {activeModalDiv.name}
              </h3>
              <button
                onClick={() => setActiveModalDiv(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <p className="leading-relaxed">{activeModalDiv.description}</p>
              
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div><strong>Kode Divisi:</strong> {activeModalDiv.code}</div>
                <div><strong>Koordinator:</strong> {activeModalDiv.headName} (NIP. {activeModalDiv.headNip})</div>
                <div><strong>Kapasitas Pengujian:</strong> {activeModalDiv.dailyCapacity} sampel per hari</div>
                <div><strong>Jumlah Analis:</strong> {activeModalDiv.totalPersonnel} personil tersertifikasi ISO 17025</div>
              </div>

              <div>
                <strong>Daftar Peralatan & Fasilitas Utama:</strong>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  {activeModalDiv.keyInstruments.map((inst, i) => (
                    <li key={i}>{inst}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveModalDiv(null)}
                className="px-4 py-1.5 bg-bpp-marine text-white font-bold rounded text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konsultasi Divisi */}
      {showConsultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Kirim Disposisi / Konsultasi: {showConsultModal.name}
              </h3>
              <button
                onClick={() => setShowConsultModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {consultSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded text-xs text-center font-semibold">
                Pesan konsultasi telah diteruskan ke {showConsultModal.headName}.
              </div>
            ) : (
              <form onSubmit={handleSendConsult} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Topik / Permintaan Pengujian Sampel
                  </label>
                  <textarea
                    rows={3}
                    value={consultText}
                    onChange={(e) => setConsultText(e.target.value)}
                    placeholder="Tuliskan catatan teknis atau permintaan pengujian sampel komoditas..."
                    className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowConsultModal(null)}
                    className="px-3 py-1.5 text-xs text-slate-500"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-bpp-amber text-white font-bold rounded text-xs flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim ke Koordinator</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
