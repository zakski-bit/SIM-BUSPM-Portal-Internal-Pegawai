import React, { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, Download, Trash2, X, AlertTriangle, Info, Clock, User, Filter } from 'lucide-react';
import { AuditLogEntry, getAuditLogs } from '../utils/security';

interface AuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  useEffect(() => {
    if (isOpen) {
      setLogs(getAuditLogs());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredLogs = logs.filter((log) => {
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'AUTH') return log.eventType.startsWith('LOGIN');
    if (selectedFilter === 'SECURITY') return log.eventType === 'RATE_LIMITED' || log.eventType === 'ACCESS_DENIED';
    if (selectedFilter === 'DATA') return log.eventType.startsWith('DATA');
    return true;
  });

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Audit-Log-SIM-BUSPM-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleClearLogs = () => {
    if (confirm('Hapus seluruh riwayat audit log lokal? Tindakan ini tidak dapat dibatalkan.')) {
      localStorage.removeItem('buspm_audit_logs');
      setLogs([]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden text-slate-800 dark:text-slate-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 dark:bg-blue-950 text-bpp-marine dark:text-blue-300 rounded-md">
              <ShieldAlert className="w-5 h-5 text-bpp-amber" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Konsol Audit Trail & Log Keamanan Sistem</span>
                <span className="text-[10px] font-mono bg-bpp-marine text-white px-2 py-0.5 rounded">
                  Super Admin
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Pencatatan aktivitas login, penolakan brute-force, dan mutasi data kedinasan (Standar ISO/IEC 27001)
              </p>
            </div>
          </div>

          <button
            type="button"
            id="audit-log-modal-close"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Filters */}
        <div className="p-3 sm:px-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <button
              type="button"
              onClick={() => setSelectedFilter('ALL')}
              className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                selectedFilter === 'ALL'
                  ? 'bg-bpp-marine text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Semua ({logs.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('AUTH')}
              className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                selectedFilter === 'AUTH'
                  ? 'bg-bpp-marine text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Autentikasi
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('SECURITY')}
              className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                selectedFilter === 'SECURITY'
                  ? 'bg-bpp-marine text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Peringatan Keamanan
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('DATA')}
              className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                selectedFilter === 'DATA'
                  ? 'bg-bpp-marine text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Mutasi Data
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportJson}
              disabled={logs.length === 0}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor JSON</span>
            </button>
            <button
              type="button"
              onClick={handleClearLogs}
              disabled={logs.length === 0}
              className="px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Bersihkan</span>
            </button>
          </div>
        </div>

        {/* Logs Table */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredLogs.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 italic">
              Belum ada catatan aktivitas keamanan yang tercatat.
            </div>
          ) : (
            <div className="space-y-2">
              {filteredLogs.map((log) => {
                let badgeClass = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300';
                let Icon = Info;

                if (log.severity === 'WARNING') {
                  badgeClass = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300';
                  Icon = AlertTriangle;
                } else if (log.severity === 'CRITICAL') {
                  badgeClass = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300';
                  Icon = ShieldAlert;
                }

                return (
                  <div
                    key={log.id}
                    className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs transition-colors"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="mt-0.5 shrink-0">
                        <Icon className={`w-4 h-4 ${
                          log.severity === 'CRITICAL' ? 'text-rose-500' : log.severity === 'WARNING' ? 'text-amber-500' : 'text-bpp-marine'
                        }`} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold font-mono border ${badgeClass}`}>
                            {log.eventType}
                          </span>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {log.description}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <strong>{log.actorName}</strong> ({log.actorNip})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 text-[10px] font-mono text-slate-400 flex items-center gap-1 sm:self-center">
                      <Clock className="w-3 h-3" />
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 px-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[10px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Audit Trail Terenkripsi & Terverifikasi Integritas</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded text-xs font-semibold cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
