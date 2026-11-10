import React, { useState, useEffect } from 'react';
import { Employee, ScheduleItem, NoteItem, ProjectItem, DocumentItem, AnnouncementItem } from './types';
import {
  INITIAL_EMPLOYEES,
  INITIAL_DIVISIONS,
  INITIAL_SCHEDULES,
  INITIAL_PROJECTS,
  INITIAL_NOTES,
  INITIAL_CHAT_MESSAGES,
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

export const App: React.FC = () => {
  // Authentication State: Defaults to null (Login Gateway), demo defaults to Ahmad Jauhari (Kepala Balai)
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);

  // Theme State: Default is Light Mode (Crisp White), with Dark Mode toggle
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('buspm_theme') === 'dark';
  });

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [globalSearch, setGlobalSearch] = useState('');

  // Application Data States (CRUD enabled)
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [divisions] = useState(INITIAL_DIVISIONS);
  const [schedules, setSchedules] = useState<ScheduleItem[]>(INITIAL_SCHEDULES);
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [notes, setNotes] = useState<NoteItem[]>(INITIAL_NOTES);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(INITIAL_ANNOUNCEMENTS);
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);

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

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleLoginSuccess = (user: Employee) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  const handleSwitchUser = (user: Employee) => {
    setCurrentUser(user);
  };

  // CRUD Handlers for Employees
  const handleAddEmployee = (emp: Employee) => {
    setEmployees((prev) => [emp, ...prev]);
  };

  const handleEditEmployee = (emp: Employee) => {
    setEmployees((prev) => prev.map((e) => (e.id === emp.id ? emp : e)));
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  };

  // CRUD Handlers for Schedules
  const handleAddSchedule = (item: ScheduleItem) => {
    setSchedules((prev) => [item, ...prev]);
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
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
  };

  // CRUD Handlers for Documents
  const handleAddDocument = (item: DocumentItem) => {
    setDocuments((prev) => [item, ...prev]);
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  // CRUD Handlers for Announcements
  const handleAddAnnouncement = (item: AnnouncementItem) => {
    setAnnouncements((prev) => [item, ...prev]);
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  // If not logged in, render Login Gateway with Video Background & Audio
  if (!currentUser) {
    return <LoginGateway onLoginSuccess={handleLoginSuccess} />;
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
        onSwitchUser={handleSwitchUser}
        onNavigateTab={setActiveTab}
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
              initialMessages={INITIAL_CHAT_MESSAGES}
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
            />
          )}

          {activeTab === 'docs' && (
            <DocsView
              documents={documents}
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

    </div>
  );
};
