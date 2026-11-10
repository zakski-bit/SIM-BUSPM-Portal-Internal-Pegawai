import React from 'react';
import {
  LayoutDashboard,
  Users,
  GitFork,
  FlaskConical,
  MessageSquare,
  Calendar,
  FileText,
  Target,
  FolderOpen,
  Megaphone,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { Employee, hasAdminAccess } from '../types';

export type ActiveTab =
  | 'dashboard'
  | 'pegawai'
  | 'struktural'
  | 'divisi'
  | 'chat'
  | 'jadwal'
  | 'catatan'
  | 'project'
  | 'docs'
  | 'pengumuman';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  currentUser: Employee;
  unreadChatCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  currentUser,
  unreadChatCount = 3
}) => {
  const isAdmin = hasAdminAccess(currentUser.role);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pegawai', label: 'Pegawai', icon: Users, adminOnlyBadge: isAdmin ? 'Kelola' : undefined },
    { id: 'struktural', label: 'Struktural', icon: GitFork },
    { id: 'divisi', label: 'Divisi / LAB', icon: FlaskConical },
    { id: 'chat', label: 'Chat & Grup', icon: MessageSquare, badge: unreadChatCount },
    { id: 'jadwal', label: 'Jadwal', icon: Calendar },
    { id: 'catatan', label: 'Catatan', icon: FileText },
    { id: 'project', label: 'Project', icon: Target },
    { id: 'docs', label: 'Docs', icon: FolderOpen },
    { id: 'pengumuman', label: 'Pengumuman', icon: Megaphone }
  ];

  return (
    <aside className="w-60 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between py-4 select-none transition-colors">
      
      {/* Menu List */}
      <div className="px-3 space-y-1">
        <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Modul SIM-BUSPM</span>
          {isAdmin && (
            <span className="text-[10px] text-bpp-amber font-bold flex items-center gap-0.5">
              <ShieldAlert className="w-3 h-3" />
              <span>KTU</span>
            </span>
          )}
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as ActiveTab)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                isActive
                  ? 'bg-bpp-marine text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              
              <div className="flex items-center gap-1">
                {item.adminOnlyBadge && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-blue-50 text-bpp-marine dark:bg-blue-950 dark:text-blue-300'
                  }`}>
                    {item.adminOnlyBadge}
                  </span>
                )}
                {item.badge && item.badge > 0 && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-white text-bpp-marine'
                        : 'bg-bpp-amber text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Institutional Info */}
      <div className="px-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-md">
          <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 mb-0.5">
            Balai Uji Standar PPMHKP
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
            Jl. Raya Setu No. 1, Cipayung, Jakarta Timur 13880
          </p>
          <a
            href="https://kkp.go.id"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-bpp-marine dark:text-blue-400 hover:underline"
          >
            <span>Portal Resmi KKP RI</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

    </aside>
  );
};
