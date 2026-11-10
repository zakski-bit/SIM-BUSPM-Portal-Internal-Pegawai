import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  GitFork,
  FlaskConical,
  MessageSquare,
  MoreHorizontal,
  Calendar,
  FileText,
  Target,
  FolderOpen,
  Megaphone,
  X,
  ChevronRight
} from 'lucide-react';
import { ActiveTab } from './Sidebar';

interface MobileNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  unreadChatCount?: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onTabChange,
  unreadChatCount = 3
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const primaryTabs: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Beranda', icon: LayoutDashboard },
    { id: 'pegawai', label: 'Pegawai', icon: Users },
    { id: 'struktural', label: 'Bagan', icon: GitFork },
    { id: 'divisi', label: 'LAB', icon: FlaskConical },
    { id: 'chat', label: 'Chat', icon: MessageSquare }
  ];

  const secondaryTabs: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }>; desc: string }[] = [
    { id: 'jadwal', label: 'Jadwal & Agenda', icon: Calendar, desc: 'Kalender kegiatan dan pengujian balai' },
    { id: 'catatan', label: 'Catatan & Notulensi', icon: FileText, desc: 'Memo teknis dan catatan evaluasi mutu' },
    { id: 'project', label: 'Project & Question', icon: Target, desc: 'Pelacak milestone capaian proyek' },
    { id: 'docs', label: 'Dokumen SOP & Regulasi', icon: FolderOpen, desc: 'Repositori standar ISO 17025 & SK' },
    { id: 'pengumuman', label: 'Pengumuman Resmi', icon: Megaphone, desc: 'Siaran kedinasan dan surat edaran' }
  ];

  const handleSelectTab = (tab: ActiveTab) => {
    onTabChange(tab);
    setShowMoreMenu(false);
  };

  const isMoreActive = secondaryTabs.some((t) => t.id === activeTab);

  return (
    <>
      {/* Mobile Drawer Popup for Secondary Menus */}
      {showMoreMenu && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-t-xl p-4 shadow-2xl max-h-[75vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Menu Layanan Lainnya
              </span>
              <button
                type="button"
                onClick={() => setShowMoreMenu(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5 overflow-y-auto flex-1 py-1">
              {secondaryTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleSelectTab(tab.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-bpp-marine text-white shadow-sm'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-md ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-bpp-marine dark:text-blue-400'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold leading-tight">{tab.label}</div>
                        <div className={`text-[10px] ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                          {tab.desc}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Bar on Mobile Screens */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 backdrop-blur-md px-2 py-1.5 flex items-center justify-around shadow-lg">
        {primaryTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-md transition-all relative ${
                isActive
                  ? 'text-bpp-marine dark:text-blue-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <div className="relative">
                <Icon className="w-4 h-4" />
                {tab.id === 'chat' && unreadChatCount > 0 && (
                  <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-bpp-amber text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadChatCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 leading-none">{tab.label}</span>
            </button>
          );
        })}

        {/* More Button */}
        <button
          onClick={() => setShowMoreMenu(true)}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-md transition-all ${
            isMoreActive
              ? 'text-bpp-marine dark:text-blue-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <MoreHorizontal className="w-4 h-4" />
          <span className="text-[10px] mt-0.5 leading-none">Lainnya</span>
        </button>
      </nav>
    </>
  );
};
