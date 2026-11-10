import React from 'react';
import { Users, UserCheck, FlaskConical, Target, Calendar, Clock, ArrowRight, ShieldCheck, FileText, Activity, Video, ExternalLink } from 'lucide-react';
import { Employee, ScheduleItem, ProjectItem, hasAdminAccess } from '../../types';
import { ActiveTab } from '../Sidebar';

interface DashboardViewProps {
  currentUser: Employee;
  employees: Employee[];
  schedules: ScheduleItem[];
  projects: ProjectItem[];
  onNavigateTab: (tab: ActiveTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  employees,
  schedules,
  projects,
  onNavigateTab
}) => {
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status === 'AKTIF').length;
  const totalDivisions = 5;
  const runningProjects = projects.filter((p) => p.status === 'BERJALAN').length;
  const isAdmin = hasAdminAccess(currentUser.role);

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Institutional Identity BPP MHKP */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-bpp-marine text-white p-5 rounded-lg shadow-sm border border-blue-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-blue-950/60 border border-blue-400/30 rounded text-[11px] font-semibold tracking-wide text-blue-200 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-bpp-amber" />
            <span>Kementerian Kelautan dan Perikanan RI • BPP MHKP</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            SIM-BUSPM — Sistem Informasi Manajemen Operasional Balai
          </h1>
          <p className="text-xs text-blue-100 mt-1 max-w-2xl leading-relaxed">
            Selamat datang, <strong className="text-white underline">{currentUser.name}</strong> ({currentUser.jobTitle}). Anda login dengan hak akses {isAdmin ? 'Kepala Balai (Super Admin)' : 'Pegawai Balai'}.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            onClick={() => onNavigateTab('pegawai')}
            className="px-3 py-2 bg-bpp-amber hover:bg-bpp-amber-hover text-white text-xs font-bold rounded-md shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>{isAdmin ? 'Kelola Pegawai' : 'Data Pegawai'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigateTab('docs')}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 rounded-md transition-colors cursor-pointer"
          >
            Dokumen SOP
          </button>
        </div>
      </div>

      {/* 4 Metric Cards (Matching screenshot: Total pegawai 10, Pegawai aktif 9, Divisi 5, Project berjalan 2) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div
          onClick={() => onNavigateTab('pegawai')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-lg shadow-sm transition-colors hover:border-bpp-marine/50 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total pegawai</span>
            <div className="p-1.5 bg-blue-50 dark:bg-blue-950 text-bpp-marine dark:text-blue-400 rounded">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {totalEmployees}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Terdaftar di sistem balai
          </p>
        </div>

        {/* Metric 2 */}
        <div
          onClick={() => onNavigateTab('pegawai')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-lg shadow-sm transition-colors hover:border-bpp-marine/50 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pegawai aktif</span>
            <div className="p-1.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {activeEmployees}
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            {totalEmployees - activeEmployees} personil cuti resmi
          </p>
        </div>

        {/* Metric 3 */}
        <div
          onClick={() => onNavigateTab('divisi')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-lg shadow-sm transition-colors hover:border-bpp-marine/50 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Divisi</span>
            <div className="p-1.5 bg-amber-50 dark:bg-amber-950 text-bpp-amber rounded">
              <FlaskConical className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {totalDivisions}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Laboratorium & Tata Usaha
          </p>
        </div>

        {/* Metric 4 */}
        <div
          onClick={() => onNavigateTab('project')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-lg shadow-sm transition-colors hover:border-bpp-marine/50 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Project berjalan</span>
            <div className="p-1.5 bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 rounded">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {runningProjects}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Dalam tahap pengerjaan aktif
          </p>
        </div>

      </div>

      {/* Main Grid: Jadwal Terdekat & Progres Project (Matching screenshot) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Jadwal Terdekat */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-bpp-marine" />
              <span>Jadwal terdekat</span>
            </h2>
            <button
              onClick={() => onNavigateTab('jadwal')}
              className="text-xs text-bpp-marine dark:text-blue-400 hover:underline font-semibold cursor-pointer"
            >
              Lihat Semua
            </button>
          </div>

          <div className="space-y-3">
            {schedules.map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigateTab('jadwal')}
                className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 rounded-md hover:border-bpp-marine/50 transition-colors cursor-pointer"
              >
                {/* Geometrical Date Box */}
                <div className="shrink-0 w-12 py-1.5 bg-bpp-marine text-white rounded text-center font-bold">
                  <div className="text-base leading-none">{item.dateStr.split(' ')[0]}</div>
                  <div className="text-[10px] tracking-wider uppercase opacity-90">{item.dateStr.split(' ')[1]}</div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {item.timeStr}
                    </span>
                    <span>•</span>
                    <span className="truncate">{item.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progres Project */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-bpp-marine" />
              <span>Progres project</span>
            </h2>
            <button
              onClick={() => onNavigateTab('project')}
              className="text-xs text-bpp-marine dark:text-blue-400 hover:underline font-semibold cursor-pointer"
            >
              Kelola Project
            </button>
          </div>

          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => onNavigateTab('project')}
                className="space-y-1.5 cursor-pointer hover:opacity-90 transition-opacity"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {project.title}
                  </span>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                    {project.progressPercent}%
                  </span>
                </div>
                
                {/* Progress Bar (NO AI slop gradient) */}
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      project.progressPercent >= 70
                        ? 'bg-emerald-600'
                        : project.progressPercent >= 30
                        ? 'bg-bpp-marine'
                        : 'bg-slate-400'
                    }`}
                    style={{ width: `${project.progressPercent}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>PJ: {project.leader}</span>
                  <span>Tenggat: {project.deadline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Section: Video Dokumentasi Balai (Requested: link video latar taro dashboard saja sendiri kecil) & Akses Cepat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Compact YouTube Video Player Widget (1 col) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-bpp-amber" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">Video Profil Balai</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950 text-bpp-marine dark:text-blue-300 rounded font-semibold border border-blue-200 dark:border-blue-800">
                Dokumentasi KKP
              </span>
            </div>
            
            {/* Embedded 16:9 Compact Video Player with Privacy-Enhanced Mode (No-Cookie) */}
            <div className="relative w-full aspect-video rounded-md overflow-hidden bg-black shadow-inner border border-slate-200 dark:border-slate-800">
              <iframe
                src="https://www.youtube-nocookie.com/embed/D5gZ-uuENzU?rel=0"
                title="Profil Balai Uji Standar Karantina Ikan dan Mutu Hasil Perikanan (BUSPM KKP)"
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-2.5">
              Balai Uji Standar PPMHKP Jakarta
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
              Standardisasi mutu, pengujian laboratorium rujukan nasional, dan sertifikasi acuan ekspor perikanan KKP RI.
            </p>
          </div>
          
          <div className="pt-2 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
            <span>Kanal Resmi Balai</span>
            <a
              href="https://www.youtube.com/watch?v=D5gZ-uuENzU"
              target="_blank"
              rel="noreferrer"
              className="text-bpp-marine dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Buka di YouTube</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Quick Action Cards (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Akses Cepat Layanan Operasional SIM-BUSPM
              </h2>
              <span className="text-[11px] text-bpp-marine font-semibold">Integrasi Internal Balai</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => onNavigateTab('divisi')}
                className="p-3 text-left border border-slate-200 dark:border-slate-700 rounded-md hover:border-bpp-marine hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <FlaskConical className="w-4 h-4 text-bpp-marine mb-1.5" />
                <div className="text-xs font-bold text-slate-900 dark:text-white">Unit Lab Pengujian</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">5 Divisi pengujian & instrumen</div>
              </button>

              <button
                onClick={() => onNavigateTab('struktural')}
                className="p-3 text-left border border-slate-200 dark:border-slate-700 rounded-md hover:border-bpp-marine hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4 text-bpp-amber mb-1.5" />
                <div className="text-xs font-bold text-slate-900 dark:text-white">Bagan.Doc SK Balai</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Struktur & hierarki kedinasan</div>
              </button>

              <button
                onClick={() => onNavigateTab('chat')}
                className="p-3 text-left border border-slate-200 dark:border-slate-700 rounded-md hover:border-bpp-marine hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Users className="w-4 h-4 text-cyan-600 mb-1.5" />
                <div className="text-xs font-bold text-slate-900 dark:text-white">Chat & Pesan Pribadi</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Kanal tim & DM antar pegawai</div>
              </button>

              <button
                onClick={() => onNavigateTab('catatan')}
                className="p-3 text-left border border-slate-200 dark:border-slate-700 rounded-md hover:border-bpp-marine hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Activity className="w-4 h-4 text-purple-600 mb-1.5" />
                <div className="text-xs font-bold text-slate-900 dark:text-white">Catatan Teknis Lab</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Notulensi & log kegiatan uji</div>
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Standar Pelayanan Balai: <strong>24 Jam 30 Menit</strong></span>
            <button
              onClick={() => onNavigateTab('docs')}
              className="text-bpp-marine hover:underline font-semibold cursor-pointer flex items-center gap-1"
            >
              <span>Lihat Standar Acuan Uji</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
