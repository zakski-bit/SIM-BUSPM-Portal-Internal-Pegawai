import React, { useState, useEffect } from 'react';
import { Employee, ScheduleItem, NoteItem, ProjectItem, DocumentItem, AnnouncementItem, ChatMessage } from './types';
import {
  INITIAL_EMPLOYEES,
  INITIAL_DIVISIONS,
  INITIAL_SCHEDULES,
  INITIAL_PROJECTS,
  INITIAL_NOTES,
  INITIAL_CHANNEL_MESSAGES,
  INITIAL_DIRECT_MESSAGES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_DOCUMENTS
} from './data/mockData';
import { LoginGateway } from './components/LoginGateway';
import { Navbar } from './components/Navbar';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { DashboardView } from './components/views/DashboardView';
import { PegawaiView } from './components/views/PegawaiView';
import { StrukturalView } from './components/views/StrukturalView';
import { DivisiView } from './components/views/DivisiView';
import { ChatView } from './components/views/ChatView';
import { JadwalView } from './components/views/JadwalView';
import { CatatanView } from './components/views/CatatanView';
import { ProjectView } from './components/views/ProjectView';
import { DocsView } from './components/views/DocsView';
import { PengumumanView } from './components/views/PengumumanView';
import { MobileNav } from './components/MobileNav';
import { AuditLogModal } from './components/AuditLogModal';
import { recordAuditLog, validateArray, isValidEmployee, isValidSchedule, isValidProject, isValidNote, isValidDocument } from './utils/security';

// Safe localStorage loader with defensive schema guard fallback
function loadFromStorage<T>(key: string, fallback: T, validator?: (data: unknown) => data is T): T {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      const parsed = JSON.parse(item);
      if (validator) {
        if (validator(parsed)) return parsed;
        console.warn(`Data ${key} gagal lolos validasi skema integritas, memulihkan data aman.`);
        return fallback;
      }
      return parsed;
    }
  } catch (e) {
    console.warn(`Gagal memuat ${key} dari localStorage:`, e);
  }
  return fallback;
}

export const App: React.FC = () => {
  // Authentication State: Persisted so F5 refresh preserves active session
  const [currentUser, setCurrentUser] = useState<Employee | null>(() =>
    loadFromStorage<Employee | null>('buspm_session_user', null)
  );

  // Theme State: Default is Light Mode (Crisp White), with Dark Mode toggle
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('buspm_theme') === 'dark';
  });

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [globalSearch, setGlobalSearch] = useState('');
  const [showAuditModal, setShowAuditModal] = useState(false);

  // Application Data States (CRUD enabled & Persisted in localStorage with schema guards)
  const [employees, setEmployees] = useState<Employee[]>(() =>
    loadFromStorage('buspm_employees', INITIAL_EMPLOYEES, (d): d is Employee[] => validateArray(d, isValidEmployee))
  );
  const [divisions] = useState(INITIAL_DIVISIONS);
  const [schedules, setSchedules] = useState<ScheduleItem[]>(() =>
    loadFromStorage('buspm_schedules', INITIAL_SCHEDULES, (d): d is ScheduleItem[] => validateArray(d, isValidSchedule))
  );
  const [projects, setProjects] = useState<ProjectItem[]>(() =>
    loadFromStorage('buspm_projects', INITIAL_PROJECTS, (d): d is ProjectItem[] => validateArray(d, isValidProject))
  );
  const [notes, setNotes] = useState<NoteItem[]>(() =>
    loadFromStorage('buspm_notes', INITIAL_NOTES, (d): d is NoteItem[] => validateArray(d, isValidNote))
  );
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(() =>
    loadFromStorage('buspm_announcements', INITIAL_ANNOUNCEMENTS)
  );
  const [documents, setDocuments] = useState<DocumentItem[]>(() =>
    loadFromStorage('buspm_documents', INITIAL_DOCUMENTS, (d): d is DocumentItem[] => validateArray(d, isValidDocument))
  );

  // Chat Data States (Persisted so switching modules does not erase messages)
  const [channelMessages, setChannelMessages] = useState<Record<string, ChatMessage[]>>(() =>
    loadFromStorage('buspm_channel_messages', INITIAL_CHANNEL_MESSAGES)
  );
  const [directMessages, setDirectMessages] = useState<Record<string, ChatMessage[]>>(() =>
    loadFromStorage('buspm_direct_messages', INITIAL_DIRECT_MESSAGES)
  );

  // Sync Current User Session to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('buspm_session_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('buspm_session_user');
    }
  }, [currentUser]);

  // Sync Dark Mode class with <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('buspm_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('buspm_theme', 'light');
    }
  }, [isDarkMode]);

  // Sync Data States to localStorage
  useEffect(() => {
    localStorage.setItem('buspm_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('buspm_schedules', JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem('buspm_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('buspm_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('buspm_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('buspm_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('buspm_channel_messages', JSON.stringify(channelMessages));
  }, [channelMessages]);

  useEffect(() => {
    localStorage.setItem('buspm_direct_messages', JSON.stringify(directMessages));
  }, [directMessages]);

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleLoginSuccess = (user: Employee) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    if (currentUser) {
      recordAuditLog({
        eventType: 'LOGOUT',
        severity: 'INFO',
        actorNip: currentUser.nipNik,
        actorName: currentUser.name,
        details: `Pengguna ${currentUser.name} (${currentUser.jobTitle}) keluar dari sistem.`
      });
    }
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  // CRUD Handlers for Employees
  const handleAddEmployee = (emp: Employee) => {
    setEmployees((prev) => [emp, ...prev]);
    recordAuditLog({
      eventType: 'DATA_CREATE',
      severity: 'WARNING',
      actorNip: currentUser?.nipNik || 'SYSTEM',
      actorName: currentUser?.name || 'User',
      details: `Menambahkan pegawai baru: ${emp.name} (${emp.jobTitle}) NIP: ${emp.nipNik}`
    });
  };

  const handleEditEmployee = (emp: Employee) => {
    setEmployees((prev) => prev.map((e) => (e.id === emp.id ? emp : e)));
    recordAuditLog({
      eventType: 'DATA_UPDATE',
      severity: 'INFO',
      actorNip: currentUser?.nipNik || 'SYSTEM',
      actorName: currentUser?.name || 'User',
      details: `Memperbarui data pegawai: ${emp.name} (${emp.nipNik})`
    });
  };

  const handleDeleteEmployee = (id: string) => {
    const target = employees.find((e) => e.id === id);
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    recordAuditLog({
      eventType: 'DATA_DELETE',
      severity: 'WARNING',
      actorNip: currentUser?.nipNik || 'SYSTEM',
      actorName: currentUser?.name || 'User',
      details: `Menghapus pegawai: ${target?.name || id}`
    });
  };

  // CRUD Handlers for Schedules
  const handleAddSchedule = (item: ScheduleItem) => {
    setSchedules((prev) => [item, ...prev]);
    recordAuditLog({
      eventType: 'DATA_CREATE',
      severity: 'INFO',
      actorNip: currentUser?.nipNik || 'SYSTEM',
      actorName: currentUser?.name || 'User',
      details: `Menambahkan agenda baru: ${item.title}`
    });
  };

  const handleDeleteSchedule = (id: string) => {
    const target = schedules.find((s) => s.id === id);
    setSchedules((prev) => prev.filter((s) => s.id !== id));
    recordAuditLog({
      eventType: 'DATA_DELETE',
      severity: 'INFO',
      actorNip: currentUser?.nipNik || 'SYSTEM',
      actorName: currentUser?.name || 'User',
      details: `Menghapus agenda: ${target?.title || id}`
    });
  };

  // CRUD Handlers for Notes
  const handleAddNote = (item: NoteItem) => {
    setNotes((prev) => [item, ...prev]);
  };

  const handleEditNote = (item: NoteItem) => {
    setNotes((prev) => prev.map((n) => (n.id === item.id ? item : n)));
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  // CRUD Handlers for Projects
  const handleAddProject = (item: ProjectItem) => {
    setProjects((prev) => [item, ...prev]);
    recordAuditLog({
      eventType: 'DATA_CREATE',
      severity: 'INFO',
      actorNip: currentUser?.nipNik || 'SYSTEM',
      actorName: currentUser?.name || 'User',
      details: `Menambahkan proyek strategis: ${item.title}`
    });
  };

  const handleUpdateProjects = (updatedProjects: ProjectItem[]) => {
    setProjects(updatedProjects);
  };

  // CRUD Handlers for Documents
  const handleAddDocument = (item: DocumentItem) => {
    setDocuments((prev) => [item, ...prev]);
    recordAuditLog({
      eventType: 'DATA_CREATE',
      severity: 'INFO',
      actorNip: currentUser?.nipNik || 'SYSTEM',
      actorName: currentUser?.name || 'User',
      details: `Mengunggah repositori dokumen: ${item.title} (${item.category})`
    });
  };

  const handleDeleteDocument = (id: string) => {
    const target = documents.find((d) => d.id === id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    recordAuditLog({
      eventType: 'DATA_DELETE',
      severity: 'WARNING',
      actorNip: currentUser?.nipNik || 'SYSTEM',
      actorName: currentUser?.name || 'User',
      details: `Menghapus repositori dokumen: ${target?.title || id}`
    });
  };

  // CRUD Handlers for Announcements
  const handleAddAnnouncement = (item: AnnouncementItem) => {
    setAnnouncements((prev) => [item, ...prev]);
    recordAuditLog({
      eventType: 'DATA_CREATE',
      severity: 'INFO',
      actorNip: currentUser?.nipNik || 'SYSTEM',
      actorName: currentUser?.name || 'User',
      details: `Menerbitkan nota pengumuman: ${item.title}`
    });
  };

  const handleDeleteAnnouncement = (id: string) => {
    const target = announcements.find((a) => a.id !== id);
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    recordAuditLog({
      eventType: 'DATA_DELETE',
      severity: 'INFO',
      actorNip: currentUser?.nipNik || 'SYSTEM',
      actorName: currentUser?.name || 'User',
      details: `Menghapus nota pengumuman: ${target?.title || id}`
    });
  };

  // Chat Message Updates
  const handleUpdateChannelMessages = (channelId: string, newMsg: ChatMessage) => {
    setChannelMessages((prev) => ({
      ...prev,
      [channelId]: [...(prev[channelId] || []), newMsg]
    }));
  };

  const handleUpdateDirectMessages = (recipientId: string, newMsg: ChatMessage) => {
    setDirectMessages((prev) => ({
      ...prev,
      [recipientId]: [...(prev[recipientId] || []), newMsg]
    }));
  };

  // If not logged in, render Login Gateway with Video Background & Audio
  if (!currentUser) {
    return <LoginGateway onLoginSuccess={handleLoginSuccess} employees={employees} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onLogout={handleLogout}
        searchQuery={globalSearch}
        onSearchChange={setGlobalSearch}
        onNavigateTab={setActiveTab}
        onOpenAuditLog={() => setShowAuditModal(true)}
        employees={employees}
        documents={documents}
        schedules={schedules}
        notes={notes}
        projects={projects}
        divisions={divisions}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Left Sidebar Menu (Hidden on mobile, visible on tablet/desktop) */}
        <div className="hidden md:flex">
          <Sidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            currentUser={currentUser}
            unreadChatCount={3}
          />
        </div>

        {/* Right Dynamic Content Pane (Crisp White Canvas with bottom padding for mobile bar) */}
        <main className="flex-1 bg-white dark:bg-[#0B1120] p-4 sm:p-6 lg:p-8 pb-20 md:pb-8 overflow-y-auto transition-colors">
          
          {activeTab === 'dashboard' && (
            <DashboardView
              currentUser={currentUser}
              employees={employees}
              schedules={schedules}
              projects={projects}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'pegawai' && (
            <PegawaiView
              employees={employees}
              currentUser={currentUser}
              onAddEmployee={handleAddEmployee}
              onEditEmployee={handleEditEmployee}
              onDeleteEmployee={handleDeleteEmployee}
              searchFilter={globalSearch}
            />
          )}

          {activeTab === 'struktural' && <StrukturalView />}

          {activeTab === 'divisi' && <DivisiView divisions={divisions} />}

          {activeTab === 'chat' && (
            <ChatView
              currentUser={currentUser}
              employees={employees}
              channelMessages={channelMessages}
              directMessages={directMessages}
              onUpdateChannelMessages={handleUpdateChannelMessages}
              onUpdateDirectMessages={handleUpdateDirectMessages}
            />
          )}

          {activeTab === 'jadwal' && (
            <JadwalView
              schedules={schedules}
              onAddSchedule={handleAddSchedule}
              onDeleteSchedule={handleDeleteSchedule}
            />
          )}

          {activeTab === 'catatan' && (
            <CatatanView
              notes={notes}
              onAddNote={handleAddNote}
              onEditNote={handleEditNote}
              onDeleteNote={handleDeleteNote}
            />
          )}

          {activeTab === 'project' && (
            <ProjectView
              projects={projects}
              onAddProject={handleAddProject}
              onUpdateProjects={handleUpdateProjects}
            />
          )}

          {activeTab === 'docs' && (
            <DocsView
              documents={documents}
              currentUser={currentUser}
              onAddDocument={handleAddDocument}
              onDeleteDocument={handleDeleteDocument}
              searchFilter={globalSearch}
            />
          )}

          {activeTab === 'pengumuman' && (
            <PengumumanView
              announcements={announcements}
              currentUser={currentUser}
              onAddAnnouncement={handleAddAnnouncement}
              onDeleteAnnouncement={handleDeleteAnnouncement}
            />
          )}

        </main>

      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-xs py-4 px-6 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <img src="/logo-bppmhkp.png" alt="Logo" className="h-5 w-auto" />
            <span className="font-bold text-slate-700 dark:text-slate-300">SIM-BUSPM</span> • Balai Uji Standar Pengendalian dan Pengawasan Mutu Hasil Kelautan dan Perikanan
          </div>
          <div>
            Kementerian Kelautan dan Perikanan RI • Cipayung, Jakarta Timur
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar (< 768px) */}
      <MobileNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        unreadChatCount={3}
      />

      {/* Super Admin Audit Trail Console Modal */}
      <AuditLogModal
        isOpen={showAuditModal}
        onClose={() => setShowAuditModal(false)}
      />

    </div>
  );
};
