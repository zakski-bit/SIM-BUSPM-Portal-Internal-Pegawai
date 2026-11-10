import React, { useState } from 'react';
import { Send, Hash, MessageCircle, Search, Shield } from 'lucide-react';
import { ChatMessage, Employee } from '../../types';
import { INITIAL_EMPLOYEES } from '../../data/mockData';

interface ChatViewProps {
  currentUser: Employee;
  employees?: Employee[];
  initialMessages: ChatMessage[];
}

export const ChatView: React.FC<ChatViewProps> = ({
  currentUser,
  employees = INITIAL_EMPLOYEES,
  initialMessages
}) => {
  // Mode: 'CHANNEL' or 'DIRECT'
  const [chatMode, setChatMode] = useState<'CHANNEL' | 'DIRECT'>('CHANNEL');
  const [activeChannelId, setActiveChannelId] = useState('umum');
  const [activeDirectUserId, setActiveDirectUserId] = useState<string>('emp-1'); // Default: Ahmad Jauhari (Kepala Balai)
  
  // Search query to find employees for Direct Message
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState('');

  // Channel Messages Store
  const [channelMessages, setChannelMessages] = useState<Record<string, ChatMessage[]>>({
    umum: initialMessages,
    kimia: [
      {
        id: 'msg-k-1',
        senderName: 'Dr. Dian Pratama, M.Si.',
        senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
        senderCategory: 'ASN',
        text: 'Kurva kalibrasi instrumen LC-MS/MS untuk residu antibiotik sudah selesai divalidasi rekan-rekan analis kimia.',
        timestamp: '09:10'
      },
      {
        id: 'msg-k-2',
        senderName: 'Eka Putri Rahayu, S.Si.',
        senderAvatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&h=200&q=80',
        senderCategory: 'ASN',
        text: 'Baik Pak Koordinator, saya sedang menyiapkan sampel udang ekspor untuk running kedua.',
        timestamp: '09:15'
      }
    ],
    mikro: [
      {
        id: 'msg-m-1',
        senderName: 'Siti Rahmawati, S.Si., M.Biotech.',
        senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80',
        senderCategory: 'ASN',
        text: 'Pengujian PCR deteksi Salmonella dan Vibrio pada bahan acuan batch 3 sedang tahap inkubasi.',
        timestamp: '08:45'
      }
    ],
    'project-web': [
      {
        id: 'msg-pw-1',
        senderName: 'Fajar Ramadhan, S.Kom.',
        senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&h=200&q=80',
        senderCategory: 'NON_ASN',
        text: 'Sistem SIM-BUSPM sudah menambahkan fitur Chat Pribadi (DM) dan pembaruan visual institusi.',
        timestamp: '10:00'
      }
    ]
  });

  // Direct Messages Store (Indexed by recipient user id)
  const [directMessages, setDirectMessages] = useState<Record<string, ChatMessage[]>>({
    'emp-1': [ // Ahmad Jauhari (Kepala Balai)
      {
        id: 'dm-1-1',
        senderName: 'Ahmad Jauhari, S.St.Pi., M.Sc.',
        senderAvatar: '/bagan/pejabat-ahmad-jauhari.jpg',
        senderCategory: 'ASN',
        text: 'Selamat bertugas. Mohon laporan berkala hasil uji surveilen komoditas perikanan disampaikan sebelum rapat pimpinan.',
        timestamp: 'Kemarin, 16:30'
      }
    ],
    'emp-2': [ // Zaenal Arifin (Kasubbag Umum)
      {
        id: 'dm-2-1',
        senderName: 'Zaenal Arifin, A.Md',
        senderAvatar: '/bagan/pejabat-zaenal-arifin.jpg',
        senderCategory: 'ASN',
        text: 'Halo, terkait urusan administrasi kepegawaian atau sarana pengujian lab, silakan koordinasikan lewat sini ya.',
        timestamp: '09:00'
      }
    ]
  });

  const [inputText, setInputText] = useState('');

  const channels = [
    { id: 'umum', name: 'Koordinasi Umum Balai', count: 10 },
    { id: 'kimia', name: 'Lab Kimia & Residu', count: 6 },
    { id: 'mikro', name: 'Lab Mikrobiologi & Biomol', count: 8 },
    { id: 'project-web', name: 'Tim Portal SIM-BUSPM', count: 4 }
  ];

  // Filter other employees for Direct Messages (exclude current logged in user)
  const otherEmployees = employees.filter((e) => e.id !== currentUser.id);
  const filteredEmployees = otherEmployees.filter((e) =>
    e.name.toLowerCase().includes(employeeSearchQuery.toLowerCase()) ||
    e.jobTitle.toLowerCase().includes(employeeSearchQuery.toLowerCase()) ||
    e.divisionName.toLowerCase().includes(employeeSearchQuery.toLowerCase())
  );

  const activeDirectUser = employees.find((e) => e.id === activeDirectUserId) || otherEmployees[0];

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
      setChannelMessages((prev) => ({
        ...prev,
        [activeChannelId]: [...(prev[activeChannelId] || []), newMsg]
      }));
    } else {
      setDirectMessages((prev) => ({
        ...prev,
        [activeDirectUserId]: [...(prev[activeDirectUserId] || []), newMsg]
      }));
    }

    setInputText('');
  };

  const currentMessages =
    chatMode === 'CHANNEL'
      ? channelMessages[activeChannelId] || []
      : directMessages[activeDirectUserId] || [];

  return (
    <div className="space-y-4">
      
      {/* Title */}
      <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Komunikasi Kedinasan: Chat Tim & Pesan Pribadi (DM)
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Koordinasi antar aparatur balai, diskusi divisi laboratorium, dan percakapan langsung 1-on-1 terenkripsi
        </p>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden flex flex-col md:flex-row h-[600px]">
        
        {/* Left Sidebar Pane: Channels & Direct Message Contacts */}
        <div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 p-3 flex flex-col justify-between shrink-0 overflow-hidden">
          
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 p-1 bg-slate-200/80 dark:bg-slate-800 rounded-md mb-3 text-xs font-semibold">
              <button
                type="button"
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
                    onClick={() => setActiveChannelId(ch.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-md text-xs font-semibold transition-colors cursor-pointer text-left ${
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
              /* DIRECT MESSAGES LIST WITH SEARCH (Instruction: "chat pribadi belum ada ya? coba munculin dan pake fitur search buat cari orang nya") */
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Search Bar for Direct Messages */}
                <div className="mb-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                      <Search className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      value={employeeSearchQuery}
                      onChange={(e) => setEmployeeSearchQuery(e.target.value)}
                      placeholder="Cari pegawai untuk chat pribadi..."
                      className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-bpp-marine"
                    />
                  </div>
                </div>

                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
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
                        onClick={() => setActiveDirectUserId(emp.id)}
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
          <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Login sebagai: <strong>{currentUser.name.split(' ')[0]}</strong></span>
            <span className="font-mono text-[10px] text-emerald-600 font-semibold">Terkoneksi</span>
          </div>

        </div>

        {/* Right Messages Conversation Pane */}
        <div className="flex-1 flex flex-col justify-between bg-white dark:bg-slate-900">
          
          {/* Header of Active Conversation */}
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
            {chatMode === 'CHANNEL' ? (
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-bpp-marine" />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {channels.find((c) => c.id === activeChannelId)?.name}
                  </span>
                  <p className="text-[10px] text-slate-400">
                    Kanal diskusi terbuka seluruh personil divisi BUSPM
                  </p>
                </div>
              </div>
            ) : (
              /* Direct Message Header */
              <div className="flex items-center gap-2.5">
                <img
                  src={activeDirectUser.avatarUrl}
                  alt={activeDirectUser.name}
                  className="w-8 h-8 rounded object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {activeDirectUser.name}
                    </span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${
                      activeDirectUser.category === 'ASN'
                        ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {activeDirectUser.category}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    {activeDirectUser.jobTitle} • {activeDirectUser.divisionName}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
              <Shield className="w-3.5 h-3.5 text-bpp-marine" />
              <span className="hidden sm:inline">Enkripsi Internal Kedinasan</span>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/40 dark:bg-slate-900/40">
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
              currentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 max-w-[85%] ${
                    msg.isSelf ? 'ml-auto flex-row-reverse' : ''
                  }`}
                >
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    className="w-7 h-7 rounded object-cover border border-slate-200 dark:border-slate-700 shrink-0 mt-0.5"
                  />
                  <div>
                    <div className={`flex items-center gap-2 mb-1 ${msg.isSelf ? 'justify-end' : ''}`}>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {msg.isSelf ? 'Anda' : msg.senderName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {msg.timestamp}
                      </span>
                    </div>
                    
                    {/* Message Bubble */}
                    <div
                      className={`p-3 rounded-md text-xs leading-relaxed ${
                        msg.isSelf
                          ? 'bg-bpp-marine text-white shadow-sm'
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 shadow-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
            <input
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
              className="px-4 py-2 bg-bpp-amber hover:bg-bpp-amber-hover text-white text-xs font-bold rounded-md shadow-sm transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
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
