import React, { useState, useRef, useEffect } from 'react';
import {
  Sun,
  Moon,
  LogOut,
  Search,
  ShieldCheck,
  ChevronDown,
  UserCheck,
  X,
  FileText,
  Calendar,
  BookOpen,
  Target,
  FlaskConical,
  ArrowRight
} from 'lucide-react';
import {
  Employee,
  hasAdminAccess,
  DocumentItem,
  ScheduleItem,
  NoteItem,
  ProjectItem,
  Division
} from '../types';
import { INITIAL_EMPLOYEES } from '../data/mockData';
import { ActiveTab } from './Sidebar';

interface NavbarProps {
  currentUser: Employee;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSwitchUser: (emp: Employee) => void;
  onNavigateTab: (tab: ActiveTab) => void;
  employees?: Employee[];
  documents?: DocumentItem[];
  schedules?: ScheduleItem[];
  notes?: NoteItem[];
  projects?: ProjectItem[];
  divisions?: Division[];
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  isDarkMode,
  onToggleDarkMode,
  onLogout,
  searchQuery,
  onSearchChange,
  onSwitchUser,
  onNavigateTab,
  employees = INITIAL_EMPLOYEES,
  documents = [],
  schedules = [],
  notes = [],
  projects = [],
  divisions = []
}) => {
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const isAdmin = hasAdminAccess(currentUser.role);

  const query = searchQuery.trim().toLowerCase();

  // Handle click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter items across all categories
  const matchedEmployees = query
    ? employees.filter(
        (e) =>
          e.name.toLowerCase().includes(query) ||
          e.jobTitle.toLowerCase().includes(query) ||
          e.nipNik.includes(query) ||
          e.divisionName.toLowerCase().includes(query)
      )
    : [];

  const matchedDocs = query
    ? documents.filter(
        (d) =>
          d.title.toLowerCase().includes(query) ||
          d.code.toLowerCase().includes(query) ||
          d.category.toLowerCase().includes(query)
      )
    : [];

  const matchedSchedules = query
    ? schedules.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.location.toLowerCase().includes(query) ||
          s.organizer.toLowerCase().includes(query) ||
          s.category.toLowerCase().includes(query)
      )
    : [];

  const matchedNotes = query
    ? notes.filter(
        (n) =>
          n.title.toLowerCase().includes(query) ||
          n.content.toLowerCase().includes(query) ||
          n.author.toLowerCase().includes(query)
      )
    : [];

  const matchedProjects = query
    ? projects.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.leader.toLowerCase().includes(query) ||
          p.tasks.some((t) => t.text.toLowerCase().includes(query))
      )
    : [];

  const matchedDivisions = query
    ? divisions.filter(
        (d) =>
          d.name.toLowerCase().includes(query) ||
          d.description.toLowerCase().includes(query) ||
          d.keyInstruments.some((k) => k.toLowerCase().includes(query))
      )
    : [];

  const totalMatches =
    matchedEmployees.length +
    matchedDocs.length +
    matchedSchedules.length +
    matchedNotes.length +
    matchedProjects.length +
    matchedDivisions.length;

  const handleSelectResult = (tab: ActiveTab) => {
    onNavigateTab(tab);
    setIsSearchFocused(false);
    setShowMobileSearch(false);
  };

  const handleClearSearch = () => {
    onSearchChange('');
    setIsSearchFocused(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Agency Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <img
              src="/logo-bppmhkp.png"
              alt="Logo Resmi BPP MHKP"
              className="h-10 w-auto object-contain cursor-pointer"
              onClick={() => onNavigateTab('dashboard')}
            />
            <div className="hidden sm:block h-6 w-px bg-slate-200 dark:bg-slate-700" />
            <div className="hidden sm:flex flex-col">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                <span className="text-bpp-marine dark:text-blue-400 font-extrabold">SIM-BUSPM</span>
                <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-blue-50 dark:bg-blue-950 text-bpp-marine dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded">
                  BPP MHKP
                </span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Balai Uji Standar PPMHKP Jakarta
              </span>
            </div>
          </div>

          {/* Global Search Bar with Live Results Dropdown */}
          <div ref={searchContainerRef} className="flex-1 max-w-md hidden md:block relative">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setIsSearchFocused(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setIsSearchFocused(false);
                  }
                }}
                placeholder="Cari pegawai, jadwal, dokumen SOP, catatan, atau lab..."
                className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-bpp-marine focus:border-bpp-marine"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Floating Live Results Dropdown */}
            {isSearchFocused && query.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xl z-50 max-h-[440px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                
                {/* Header info */}
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 text-[11px] flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span>
                    Hasil pencarian untuk <strong>"{searchQuery}"</strong> ({totalMatches} item ditemukan)
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Esc untuk tutup</span>
                </div>

                {totalMatches === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    <p className="font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Tidak ada hasil yang cocok dengan "{searchQuery}"
                    </p>
                    <p className="text-[11px]">
                      Coba cari nama pegawai (cth: <em>Ahmad, Zaenal, Dini</em>), jenis lab (cth: <em>Kimia, Mikro, Patologi</em>), atau dokumen (cth: <em>SOP, SK</em>).
                    </p>
                  </div>
                ) : (
                  <div className="p-2 space-y-3">
                    
                    {/* Section: Pegawai */}
                    {matchedEmployees.length > 0 && (
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
                          <span>Pegawai & Pejabat ({matchedEmployees.length})</span>
                          <span className="text-bpp-marine text-[10px]">Modul Pegawai</span>
                        </div>
                        <div className="space-y-1">
                          {matchedEmployees.slice(0, 4).map((emp) => (
                            <div
                              key={emp.id}
                              onClick={() => handleSelectResult('pegawai')}
                              className="p-2 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-md flex items-center justify-between cursor-pointer transition-colors"
                            >
                              <div className="flex items-center gap-2.5 truncate">
                                <img
                                  src={emp.avatarUrl}
                                  alt={emp.name}
                                  className="w-7 h-7 rounded object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                                />
                                <div className="truncate">
                                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                    {emp.name}
                                  </div>
                                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                    {emp.jobTitle} • {emp.divisionName}
                                  </div>
                                </div>
                              </div>
                              <span className="text-[10px] px-1.5 py-0.2 bg-blue-50 dark:bg-blue-950 text-bpp-marine dark:text-blue-300 font-mono rounded shrink-0">
                                {emp.category}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Section: Dokumen & SOP */}
                    {matchedDocs.length > 0 && (
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
                          <span>Dokumen & SOP ({matchedDocs.length})</span>
                          <span className="text-bpp-marine text-[10px]">Modul Docs</span>
                        </div>
                        <div className="space-y-1">
                          {matchedDocs.slice(0, 3).map((doc) => (
                            <div
                              key={doc.id}
                              onClick={() => handleSelectResult('docs')}
                              className="p-2 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-md flex items-center justify-between cursor-pointer transition-colors"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <FileText className="w-4 h-4 text-bpp-amber shrink-0" />
                                <div className="truncate">
                                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                    {doc.title}
                                  </div>
                                  <div className="text-[10px] font-mono text-slate-400">
                                    {doc.code} • {doc.fileSize}
                                  </div>
                                </div>
                              </div>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-300">
                                {doc.format}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Section: Jadwal */}
                    {matchedSchedules.length > 0 && (
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
                          <span>Jadwal Agenda ({matchedSchedules.length})</span>
                          <span className="text-bpp-marine text-[10px]">Modul Jadwal</span>
                        </div>
                        <div className="space-y-1">
                          {matchedSchedules.map((sch) => (
                            <div
                              key={sch.id}
                              onClick={() => handleSelectResult('jadwal')}
                              className="p-2 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-md flex items-center justify-between cursor-pointer transition-colors"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <Calendar className="w-4 h-4 text-bpp-marine shrink-0" />
                                <div className="truncate">
                                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                    {sch.title}
                                  </div>
                                  <div className="text-[10px] text-slate-400 truncate">
                                    {sch.fullDateTime} • {sch.location}
                                  </div>
                                </div>
                              </div>
                              <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 font-mono rounded text-slate-600">
                                {sch.dateStr}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Section: Catatan Teknis */}
                    {matchedNotes.length > 0 && (
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
                          <span>Catatan & Memo ({matchedNotes.length})</span>
                          <span className="text-bpp-marine text-[10px]">Modul Catatan</span>
                        </div>
                        <div className="space-y-1">
                          {matchedNotes.map((note) => (
                            <div
                              key={note.id}
                              onClick={() => handleSelectResult('catatan')}
                              className="p-2 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-md flex items-center justify-between cursor-pointer transition-colors"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <BookOpen className="w-4 h-4 text-purple-600 shrink-0" />
                                <div className="truncate">
                                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                    {note.title}
                                  </div>
                                  <div className="text-[10px] text-slate-400 truncate">
                                    PJ: {note.author}
                                  </div>
                                </div>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Section: Project */}
                    {matchedProjects.length > 0 && (
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
                          <span>Project Balai ({matchedProjects.length})</span>
                          <span className="text-bpp-marine text-[10px]">Modul Project</span>
                        </div>
                        <div className="space-y-1">
                          {matchedProjects.map((proj) => (
                            <div
                              key={proj.id}
                              onClick={() => handleSelectResult('project')}
                              className="p-2 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-md flex items-center justify-between cursor-pointer transition-colors"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <Target className="w-4 h-4 text-cyan-600 shrink-0" />
                                <div className="truncate">
                                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                    {proj.title}
                                  </div>
                                  <div className="text-[10px] text-slate-400 truncate">
                                    PJ: {proj.leader}
                                  </div>
                                </div>
                              </div>
                              <span className="text-[10px] font-mono font-bold text-bpp-marine">
                                {proj.progressPercent}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Section: Divisi / Lab */}
                    {matchedDivisions.length > 0 && (
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
                          <span>Unit Laboratorium ({matchedDivisions.length})</span>
                          <span className="text-bpp-marine text-[10px]">Modul Divisi / LAB</span>
                        </div>
                        <div className="space-y-1">
                          {matchedDivisions.map((div) => (
                            <div
                              key={div.id}
                              onClick={() => handleSelectResult('divisi')}
                              className="p-2 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-md flex items-center justify-between cursor-pointer transition-colors"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <FlaskConical className="w-4 h-4 text-emerald-600 shrink-0" />
                                <div className="truncate">
                                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                    {div.name}
                                  </div>
                                  <div className="text-[10px] text-slate-400 truncate">
                                    Koordinator: {div.headName}
                                  </div>
                                </div>
                              </div>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 rounded">
                                {div.code}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action: User Info, Role Switcher, Dark Mode, Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Mobile Search Toggle Button */}
            <button
              type="button"
              onClick={() => setShowMobileSearch((prev) => !prev)}
              className="md:hidden p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-50 dark:bg-slate-800 rounded-md cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Hierarchy Badge */}
            {isAdmin ? (
              <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-bpp-marine dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-bpp-amber" />
                <span>Super Akses: Pimpinan / KTU</span>
              </span>
            ) : (
              <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded text-[11px] font-medium">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Akses: Personil Lab</span>
              </span>
            )}

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={onToggleDarkMode}
              title={isDarkMode ? 'Beralih ke Mode Terang (Default Putih)' : 'Beralih ke Mode Gelap'}
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-md transition-colors cursor-pointer"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* User Profile Pill & Role Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowRoleSwitcher((prev) => !prev)}
                className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700 hover:opacity-90 transition-opacity cursor-pointer text-left"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded object-cover border border-slate-200 dark:border-slate-700"
                />
                <div className="hidden sm:flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[130px]">
                      {currentUser.name.split(',')[0]}
                    </span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[140px]">
                    {currentUser.jobTitle}
                  </span>
                </div>
              </button>

              {/* Role Switcher Menu */}
              {showRoleSwitcher && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-xl py-2 z-50 text-xs">
                  <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Simulasi Akses Hirarki Jabatan:
                  </div>
                  
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                    {employees.map((emp) => (
                      <button
                        key={emp.id}
                        onClick={() => {
                          onSwitchUser(emp);
                          setShowRoleSwitcher(false);
                        }}
                        className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer ${
                          currentUser.id === emp.id ? 'bg-blue-50/70 dark:bg-blue-950/50 font-bold text-bpp-marine dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="truncate mr-2">
                          <div className="text-xs truncate">{emp.name}</div>
                          <div className="text-[10px] text-slate-400 truncate">{emp.jobTitle}</div>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono shrink-0 ${
                          hasAdminAccess(emp.role) ? 'bg-bpp-marine text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}>
                          {hasAdminAccess(emp.role) ? 'Admin' : 'Pegawai'}
                        </span>
                      </button>
                    ))}
                  </div>
                  
                  <div className="px-3 pt-2 mt-1 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400">
                    *Pimpinan Balai & Subbag Umum dapat melihat serta mengelola seluruh data pegawai.
                  </div>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={onLogout}
              title="Keluar dari Portal"
              className="p-2 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700 rounded-md transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>

        </div>

        {/* Mobile Search Expandable Bar */}
        {showMobileSearch && (
          <div className="md:hidden pb-3 pt-1">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Cari pegawai, jadwal, dokumen, atau lab..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                autoFocus
              />
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
