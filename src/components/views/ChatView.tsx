import React, { useState, useRef, useEffect } from 'react';
import { Send, Hash, MessageCircle, Search, Shield, ArrowLeft, ArrowRight } from 'lucide-react';
import { ChatMessage, Employee } from '../../types';
import { INITIAL_EMPLOYEES } from '../../data/mockData';

interface ChatViewProps {
  currentUser: Employee;
  employees?: Employee[];
  channelMessages: Record<string, ChatMessage[]>;
  directMessages: Record<string, ChatMessage[]>;
  onUpdateChannelMessages: (channelId: string, msg: ChatMessage) => void;
  onUpdateDirectMessages: (recipientId: string, msg: ChatMessage) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  currentUser,
  employees = INITIAL_EMPLOYEES,
  channelMessages,
  directMessages,
  onUpdateChannelMessages,
  onUpdateDirectMessages
}) => {
  // Mode: 'CHANNEL' or 'DIRECT'
  const [chatMode, setChatMode] = useState<'CHANNEL' | 'DIRECT'>('CHANNEL');
  const [activeChannelId, setActiveChannelId] = useState('umum');

  // Filter other employees for Direct Messages (exclude current logged in user)
  const otherEmployees = employees.filter((e) => e.id !== currentUser.id);

  // Default to the first employee who is NOT the current logged-in user
  const [activeDirectUserId, setActiveDirectUserId] = useState<string>(() => {
    return otherEmployees.length > 0 ? otherEmployees[0].id : 'emp-2';
  });

  // Mobile Master-Detail view state: 'LIST' or 'CHAT'
  // On mobile, this switches between channel/contact selection and the active conversation
  const [mobileView, setMobileView] = useState<'LIST' | 'CHAT'>('CHAT');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Search query to find employees for Direct Message
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');

  const channels = [
    { id: 'umum', name: 'Koordinasi Umum Balai', count: 10 },
    { id: 'kimia', name: 'Lab Kimia & Residu', count: 6 },
    { id: 'mikro', name: 'Lab Mikrobiologi & Biomol', count: 8 },
    { id: 'project-web', name: 'Tim Portal SIM-BUSPM', count: 4 }
  ];

  const filteredEmployees = otherEmployees.filter((e) =>
    e.name.toLowerCase().includes(employeeSearchQuery.toLowerCase()) ||
    e.jobTitle.toLowerCase().includes(employeeSearchQuery.toLowerCase()) ||
    e.divisionName.toLowerCase().includes(employeeSearchQuery.toLowerCase())
  );

  const activeDirectUser =
    employees.find((e) => e.id === activeDirectUserId) ||
    otherEmployees[0] ||
    currentUser;

  const currentMessages =
    chatMode === 'CHANNEL'
      ? channelMessages[activeChannelId] || []
      : directMessages[activeDirectUserId] || [];

  // Auto-scroll to the latest message whenever messages change or user opens chat
  useEffect(() => {
    if (mobileView === 'CHAT') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeChannelId, activeDirectUserId, chatMode, mobileView, currentMessages.length]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatarUrl,
      senderCategory: currentUser.category,
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true
    };

    if (chatMode === 'CHANNEL') {
      onUpdateChannelMessages(activeChannelId, newMsg);
    } else {
      onUpdateDirectMessages(activeDirectUserId, newMsg);
    }

    setInputText('');
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      
      {/* Title - Compact on mobile */}
      <div className="pb-2 sm:pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <h1 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Komunikasi Kedinasan: Chat & DM
          </h1>
          <span className="text-[10px] font-mono font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
            Terkoneksi
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 hidden sm:block">
          Koordinasi antar aparatur balai, diskusi divisi laboratorium, dan percakapan langsung 1-on-1 terenkripsi
        </p>
      </div>

      {/* Main Chat Interface: Responsive Master-Detail layout for Mobile & Desktop */}
      <div id="chat-main-container" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden flex flex-col md:flex-row h-[560px] sm:h-[600px] md:h-[650px]">
        
        {/* Left Sidebar Pane: Channels & Direct Message Contacts */}
        {/* On Mobile: visible when mobileView === 'LIST', hidden when 'CHAT'. On Desktop: always visible (md:flex) */}
        <div id="chat-sidebar-pane" className={`w-full md:w-72 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 p-3 flex-col justify-between shrink-0 overflow-hidden h-full ${
          mobileView === 'LIST' ? 'flex' : 'hidden md:flex'
        }`}>
          
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Mobile Header for List View */}
            <div className="md:hidden flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-700 shrink-0">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Pilih Kanal / Kontak
              </span>
              <button
                type="button"
                id="btn-close-list-view"
                onClick={() => setMobileView('CHAT')}
                className="py-1 px-2.5 bg-bpp-marine text-white rounded text-[11px] font-bold shadow-xs cursor-pointer flex items-center gap-1"
              >
                <span>Buka Chat</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 p-1 bg-slate-200/80 dark:bg-slate-800 rounded-md mb-3 text-xs font-semibold shrink-0">
              <button
                type="button"
                id="tab-mode-channel"
                onClick={() => setChatMode('CHANNEL')}
                className={`py-1.5 px-2 rounded transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 ${
                  chatMode === 'CHANNEL'
                    ? 'bg-white dark:bg-slate-700 text-bpp-marine dark:text-white shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Hash className="w-3.5 h-3.5" />
                <span>Kanal Tim</span>
              </button>

              <button
                type="button"
                id="tab-mode-direct"
                onClick={() => setChatMode('DIRECT')}
                className={`py-1.5 px-2 rounded transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 ${
                  chatMode === 'DIRECT'
                    ? 'bg-white dark:bg-slate-700 text-bpp-marine dark:text-white shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat Pribadi</span>
              </button>
            </div>

            {/* CHANNEL LIST */}
            {chatMode === 'CHANNEL' ? (
              <div className="space-y-1 overflow-y-auto flex-1 pr-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                  Daftar Kanal Diskusi Balai
                </div>
                {channels.map((ch) => (
                  <button
                    key={ch.id}
                    id={`btn-chat-channel-${ch.id}`}
                    onClick={() => {
                      setActiveChannelId(ch.id);
                      setMobileView('CHAT');
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-md text-xs font-semibold transition-colors cursor-pointer text-left ${
                      activeChannelId === ch.id
                        ? 'bg-bpp-marine text-white shadow-sm'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Hash className={`w-3.5 h-3.5 shrink-0 ${activeChannelId === ch.id ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{ch.name}</span>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      activeChannelId === ch.id ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}>
                      {ch.count}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              /* DIRECT MESSAGES LIST WITH SEARCH */
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Search Bar for Direct Messages */}
                <div className="mb-2 shrink-0">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                      <Search className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      id="search-dm-employees"
                      value={employeeSearchQuery}
                      onChange={(e) => setEmployeeSearchQuery(e.target.value)}
                      placeholder="Cari pegawai untuk chat..."
                      className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-bpp-marine"
                    />
                  </div>
                </div>

                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 shrink-0">
                  Kontak Pegawai ({filteredEmployees.length})
                </div>

                {/* Employees Scroll List */}
                <div className="space-y-1 overflow-y-auto flex-1 pr-1">
                  {filteredEmployees.map((emp) => {
                    const isSelected = activeDirectUserId === emp.id;
                    const hasMsgs = !!directMessages[emp.id];
                    return (
                      <button
                        key={emp.id}
                        id={`btn-chat-emp-${emp.id}`}
                        onClick={() => {
                          setActiveDirectUserId(emp.id);
                          setMobileView('CHAT');
                        }}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-md text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-bpp-marine text-white shadow-sm'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                        }`}
                      >
                        <img
                          src={emp.avatarUrl}
                          alt={emp.name}
                          className="w-8 h-8 rounded object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold truncate">
                              {emp.name.split(',')[0]}
                            </span>
                            {hasMsgs && (
                              <span className={`text-[9px] px-1 rounded font-semibold ${
                                isSelected ? 'bg-white/20 text-white' : 'text-bpp-marine font-mono'
                              }`}>
                                Aktif
                              </span>
                            )}
                          </div>
                          <p className={`text-[10px] truncate ${
                            isSelected ? 'text-blue-100' : 'text-slate-400'
                          }`}>
                            {emp.jobTitle}
                          </p>
                        </div>
                      </button>
                    );
                  })}

                  {filteredEmployees.length === 0 && (
                    <div className="p-4 text-center text-xs text-slate-400 italic">
                      Pegawai tidak ditemukan.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Badge Info Bottom */}
          <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between shrink-0">
            <span>Login: <strong>{currentUser.name.split(' ')[0]}</strong></span>
            <span className="font-mono text-[10px] text-emerald-600 font-semibold">Terkoneksi</span>
          </div>

        </div>

        {/* Right Messages Conversation Pane */}
        {/* On Mobile: visible when mobileView === 'CHAT', hidden when 'LIST'. On Desktop: always visible (md:flex) */}
        <div id="chat-conversation-pane" className={`flex-1 flex-col justify-between bg-white dark:bg-slate-900 h-full overflow-hidden ${
          mobileView === 'CHAT' ? 'flex' : 'hidden md:flex'
        }`}>
          
          {/* Header of Active Conversation */}
          <div className="px-3 sm:px-4 py-2 sm:py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              {/* Mobile Back to Channel/Contact List Button */}
              <button
                type="button"
                id="btn-chat-back-to-list"
                onClick={() => setMobileView('LIST')}
                className="md:hidden py-1 px-2 text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded flex items-center gap-1 shrink-0 cursor-pointer text-xs font-bold"
                title="Buka daftar kanal dan kontak"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-bpp-marine dark:text-blue-400" />
                <span>Pilih Chat</span>
              </button>

              {chatMode === 'CHANNEL' ? (
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1 bg-blue-50 dark:bg-blue-950 text-bpp-marine dark:text-blue-300 rounded shrink-0">
                    <Hash className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
                      {channels.find((c) => c.id === activeChannelId)?.name}
                    </span>
                    <p className="text-[10px] text-slate-400 truncate hidden xs:block">
                      Kanal koordinasi resmi BUSPM
                    </p>
                  </div>
                </div>
              ) : (
                /* Direct Message Header */
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={activeDirectUser.avatarUrl}
                    alt={activeDirectUser.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {activeDirectUser.name}
                      </span>
                      <span className={`text-[9px] font-semibold px-1 py-0.2 rounded border shrink-0 ${
                        activeDirectUser.category === 'ASN'
                          ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {activeDirectUser.category}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {activeDirectUser.jobTitle}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium shrink-0">
              <Shield className="w-3.5 h-3.5 text-bpp-marine dark:text-blue-400" />
              <span className="hidden sm:inline">Enkripsi Internal</span>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 bg-slate-50/40 dark:bg-slate-900/40">
            {currentMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <MessageCircle className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
                <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  Belum ada pesan dengan {chatMode === 'DIRECT' ? activeDirectUser.name : 'kanal ini'}.
                </p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                  Mulai percakapan dinas mengenai koordinasi sampel, agenda laboratorium, atau tugas kerja.
                </p>
              </div>
            ) : (
              currentMessages.map((msg) => {
                const isSelf = msg.isSelf || (currentUser && (msg.senderName === currentUser.name || msg.senderName === currentUser.name.split(',')[0]));
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 max-w-[88%] sm:max-w-[80%] ${
                      isSelf ? 'ml-auto flex-row-reverse' : ''
                    }`}
                  >
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className="w-7 h-7 rounded object-cover border border-slate-200 dark:border-slate-700 shrink-0 mt-0.5"
                    />
                    <div className="min-w-0">
                      <div className={`flex items-center gap-2 mb-1 ${isSelf ? 'justify-end' : ''}`}>
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {isSelf ? 'Anda' : msg.senderName.split(',')[0]}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          {msg.timestamp}
                        </span>
                      </div>
                      
                      {/* Message Bubble */}
                      <div
                        className={`p-2.5 sm:p-3 rounded-md text-xs leading-relaxed break-words ${
                          isSelf
                            ? 'bg-bpp-marine text-white shadow-sm'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 shadow-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box Form */}
          <form onSubmit={handleSendMessage} className="p-2.5 sm:p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2 shrink-0">
            <input
              id="chat-message-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                chatMode === 'CHANNEL'
                  ? 'Tulis pesan koordinasi di kanal ini...'
                  : `Kirim pesan pribadi ke ${activeDirectUser.name.split(',')[0]}...`
              }
              className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-bpp-marine"
            />
            <button
              type="submit"
              className="px-3.5 sm:px-4 py-2 bg-bpp-amber hover:bg-bpp-amber-hover text-white text-xs font-bold rounded-md shadow-sm transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim</span>
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};
