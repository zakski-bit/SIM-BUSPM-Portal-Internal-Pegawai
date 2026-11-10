import { Employee, Division, ScheduleItem, ProjectItem, NoteItem, ChatMessage, AnnouncementItem, DocumentItem } from '../types';

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    nipNik: '198212312006041003',
    name: 'Ahmad Jauhari, S.St.Pi., M.Sc.',
    category: 'ASN',
    role: 'KEPALA_BALAI',
    jobTitle: 'Pejabat Administrator / Kepala BUSPPMHKP Jakarta',
    divisionId: 'div-tu',
    divisionName: 'Pimpinan Balai',
    email: 'ahmad.jauhari@kkp.go.id',
    phone: '0812-8822-1982',
    status: 'AKTIF',
    avatarUrl: '/bagan/pejabat-ahmad-jauhari.jpg'
  },
  {
    id: 'emp-2',
    nipNik: '197905182003121002',
    name: 'Zaenal Arifin, A.Md',
    category: 'ASN',
    role: 'KTU',
    jobTitle: 'Pejabat Pengawas / Kepala Subbagian Umum',
    divisionId: 'div-tu',
    divisionName: 'Subbagian Umum',
    email: 'zaenal.arifin@kkp.go.id',
    phone: '0813-7744-1979',
    status: 'AKTIF',
    avatarUrl: '/bagan/pejabat-zaenal-arifin.jpg'
  },
  {
    id: 'emp-3',
    nipNik: '198704122011012001',
    name: 'Dini Fajriyani, S.Pi., M.Pi',
    category: 'ASN',
    role: 'KATIM',
    jobTitle: 'Ketua Tim Kerja Pengembangan Teknik & Metode Uji Kesehatan Ikan MKHP',
    divisionId: 'div-patologi',
    divisionName: 'Pengembangan Teknik & Metode Uji',
    email: 'dini.fajriyani@kkp.go.id',
    phone: '0812-9988-1234',
    status: 'AKTIF',
    avatarUrl: '/bagan/pejabat-dini-fajriyani.jpg'
  },
  {
    id: 'emp-4',
    nipNik: '198302192009011002',
    name: 'Iswadi Idris, S.Si',
    category: 'ASN',
    role: 'KATIM',
    jobTitle: 'Koordinator Fungsional',
    divisionId: 'div-standar',
    divisionName: 'Kelompok Jabatan Fungsional',
    email: 'iswadi.idris@kkp.go.id',
    phone: '0813-7762-5100',
    status: 'AKTIF',
    avatarUrl: '/bagan/pejabat-iswadi-idris.jpg'
  },
  {
    id: 'emp-5',
    nipNik: '198506142010121003',
    name: 'Sigit Hendra Irawan P., S.Pi',
    category: 'ASN',
    role: 'KATIM',
    jobTitle: 'Ketua Tim Kerja Penerapan Standar Metode Uji Kesehatan Ikan MKHP',
    divisionId: 'div-kimia',
    divisionName: 'Penerapan Standar Metode Uji',
    email: 'sigit.hendra@kkp.go.id',
    phone: '0813-8877-6655',
    status: 'AKTIF',
    avatarUrl: '/bagan/pejabat-sigit-hendra.jpg'
  },
  {
    id: 'emp-6',
    nipNik: '198412152008012005',
    name: 'Desri Yanti, S.St.Pi., M.Sc.',
    category: 'ASN',
    role: 'ANALIS',
    jobTitle: 'Analis Penguji Patologi & Kesehatan Ikan',
    divisionId: 'div-patologi',
    divisionName: 'Lab Patologi & Kesehatan Ikan',
    email: 'desri.yanti@kkp.go.id',
    phone: '0812-6655-4433',
    status: 'AKTIF',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80'
  },
  {
    id: 'emp-7',
    nipNik: '3174091102960002',
    name: 'Fajar Ramadhan, S.Kom.',
    category: 'NON_ASN',
    role: 'STAFF',
    jobTitle: 'Pranata Komputer & IT Support (PPNPN)',
    divisionId: 'div-tu',
    divisionName: 'Subbagian Tata Usaha',
    email: 'fajar.it@kkp.go.id',
    phone: '0878-9012-3456',
    status: 'AKTIF',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&h=200&q=80'
  },
  {
    id: 'emp-8',
    nipNik: '199502102022032009',
    name: 'Eka Putri Rahayu, S.Si.',
    category: 'ASN',
    role: 'ANALIS',
    jobTitle: 'Analis Residu Logam Berat & GC-MS',
    divisionId: 'div-kimia',
    divisionName: 'Lab Kimia & Residu Cemaran',
    email: 'eka.putri@kkp.go.id',
    phone: '0812-1133-5577',
    status: 'AKTIF',
    avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&h=200&q=80'
  },
  {
    id: 'emp-9',
    nipNik: '199307192019022008',
    name: 'Maya Safitri, S.Tr.Pi.',
    category: 'ASN',
    role: 'ANALIS',
    jobTitle: 'Pengawas Mutu Hasil Perikanan',
    divisionId: 'div-standar',
    divisionName: 'Bidang Standardisasi & Mutu',
    email: 'maya.safitri@kkp.go.id',
    phone: '0821-3456-7890',
    status: 'AKTIF',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&h=200&q=80'
  },
  {
    id: 'emp-10',
    nipNik: '3175089201980004',
    name: 'Rizky Kurniawan, A.Md.',
    category: 'NON_ASN',
    role: 'STAFF',
    jobTitle: 'Pengelola Kearsipan & BMN (PPNPN)',
    divisionId: 'div-tu',
    divisionName: 'Subbagian Tata Usaha',
    email: 'rizky.ppnpn@kkp.go.id',
    phone: '0857-1122-3344',
    status: 'CUTI',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&h=200&q=80'
  }
];

export const INITIAL_DIVISIONS: Division[] = [
  {
    id: 'div-kimia',
    code: 'LAB-KIMIA',
    name: 'Lab Kimia & Residu Cemaran',
    description: 'Pengujian residu antibiotik (Chloramphenicol, Nitrofurans, Tetracyclines), residu logam berat (Pb, Cd, Hg, As), serta histamin pada komoditas perikanan ekspor.',
    headName: 'Sigit Hendra Irawan P., S.Pi',
    headNip: '198506142010121003',
    dailyCapacity: 45,
    totalPersonnel: 6,
    imageUrl: '/lab/lab-kimia-asli.jpg',
    keyInstruments: ['GC-MS/MS Triple Quadrupole', 'LC-MS/MS Orbitrap', 'Atomic Absorption Spectrometer (AAS)', 'HPLC-FLD']
  },
  {
    id: 'div-mikro',
    code: 'LAB-MIKRO',
    name: 'Lab Mikrobiologi & Biologi Molekuler',
    description: 'Pemeriksaan bakteri patogen (Salmonella spp., Vibrio parahaemolyticus/cholerae, Listeria monocytogenes) dan identifikasi spesies dengan Real-Time PCR.',
    headName: 'Siti Rahmawati, S.Si., M.Biotech.',
    headNip: '198809182012122002',
    dailyCapacity: 60,
    totalPersonnel: 8,
    imageUrl: '/lab/lab-mikro-asli.jpg',
    keyInstruments: ['Real-Time PCR System (Bio-Rad CFX96)', 'Biosafety Cabinet Class II Type A2', 'Incubator Shaker Multitron', 'Autoclave Digital Presisi']
  },
  {
    id: 'div-patologi',
    code: 'LAB-PATOLOGI',
    name: 'Lab Patologi & Kesehatan Ikan',
    description: 'Diagnosis Hama dan Penyakit Ikan Karantina (HPIK), pemeriksaan parasit, jamur, serta histopatologi jaringan udang dan ikan.',
    headName: 'Dini Fajriyani, S.Pi., M.Pi',
    headNip: '198704122011012001',
    dailyCapacity: 30,
    totalPersonnel: 4,
    imageUrl: '/lab/lab-patologi-asli.jpg',
    keyInstruments: ['Fluorescence Microscope Olympus BX53', 'Rotary Microtome Leica RM2235', 'Automated Tissue Processor', 'Stereomicroscope Zoom']
  },
  {
    id: 'div-standar',
    code: 'BID-STANDAR',
    name: 'Bidang Standardisasi & Bahan Acuan',
    description: 'Penyelenggara Uji Profisiensi (PUP) terakreditasi ISO/IEC 17043 dan produsen Bahan Acuan Bersertifikat (PBA) terakreditasi ISO 17034.',
    headName: 'Iswadi Idris, S.Si',
    headNip: '198302192009011002',
    dailyCapacity: 25,
    totalPersonnel: 5,
    imageUrl: '/lab/lab-standar-bahan-acuan.jpg',
    keyInstruments: ['Ultra Low Temperature Freezer -86°C', 'Homogenizer Ultra-Turrax T25', 'Freeze Dryer Lyophilizer', 'Analytical Microbalance Sartorius']
  },
  {
    id: 'div-tu',
    code: 'SUBBAG-UMUM',
    name: 'Subbagian Umum (Tata Usaha & Adm)',
    description: 'Pelayanan administrasi kepegawaian ASN/Non-ASN, tata persuratan dinas Srikandi, pengelolaan keuangan PNBP, BMN, dan infrastruktur IT Balai.',
    headName: 'Zaenal Arifin, A.Md',
    headNip: '197905182003121002',
    dailyCapacity: 100,
    totalPersonnel: 7,
    imageUrl: '/lab/subbag-umum-asli.jpg',
    keyInstruments: ['Mini Data Center Server', 'Sistem Absensi Biometrik Cloud', 'Sistem Kearsipan Digital Srikandi', 'UPS Central BUSPM']
  }
];

export const INITIAL_SCHEDULES: ScheduleItem[] = [
  {
    id: 'sch-1',
    title: 'Rapat Sprint Tim IT & Portal SIM-BUSPM',
    dateStr: '11 NOV',
    timeStr: '10:00',
    fullDateTime: '11 November 2026, 10:00 WIB',
    location: 'Ruang Rapat 2 (Lt. 2)',
    category: 'RAPAT',
    organizer: 'Fajar Ramadhan, S.Kom.'
  },
  {
    id: 'sch-2',
    title: 'Deadline Pengujian Sampel Surveillance Residu',
    dateStr: '20 NOV',
    timeStr: '17:00',
    fullDateTime: '20 November 2026, 17:00 WIB',
    location: 'Lab Kimia & Residu',
    category: 'UJI_LAB',
    organizer: 'Sigit Hendra Irawan P., S.Pi'
  },
  {
    id: 'sch-3',
    title: 'Town Hall Akhir Tahun & Evaluasi Kinerja Balai',
    dateStr: '15 DES',
    timeStr: '13:00',
    fullDateTime: '15 Desember 2026, 13:00 WIB',
    location: 'Aula Utama BUSPM Cipayung',
    category: 'TOWN_HALL',
    organizer: 'Ahmad Jauhari, S.St.Pi., M.Sc.'
  }
];

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-1',
    title: 'Portal Intranet SIM-BUSPM Terpadu',
    progressPercent: 55,
    status: 'BERJALAN',
    leader: 'Zaenal Arifin, A.Md (Kasubbag Umum)',
    deadline: '30 November 2026',
    tasks: [
      { id: 't-1', text: 'Scaffolding & Visual Identity BPP MHKP', completed: true },
      { id: 't-2', text: 'Gerbang Login Latar Dual-Image Resmi & Widget Video Dashboard', completed: true },
      { id: 't-3', text: 'Hirarki Akses Kepala Balai & Kasubbag Umum', completed: true },
      { id: 't-4', text: 'Fitur CRUD Pegawai, Jadwal, Catatan & Docs', completed: false, issue: 'Validasi form role level' },
      { id: 't-5', text: 'Uji Penetrasi Keamanan & Deployment Final', completed: false }
    ]
  },
  {
    id: 'proj-2',
    title: 'Migrasi Server Cloud KKP & Backup Data',
    progressPercent: 20,
    status: 'BERJALAN',
    leader: 'Fajar Ramadhan, S.Kom.',
    deadline: '20 Desember 2026',
    tasks: [
      { id: 't-6', text: 'Audit Keamanan Data Kepegawaian', completed: true },
      { id: 't-7', text: 'Setup Dedicated Cloud VPS & SSL TLS', completed: false, issue: 'Menunggu alokasi anggaran DIPA revisi' },
      { id: 't-8', text: 'Migrasi Database SIMLAB & Backup', completed: false }
    ]
  },
  {
    id: 'proj-3',
    title: 'Kampanye Promosi Uji Profisiensi Q1',
    progressPercent: 0,
    status: 'PERENCANAAN',
    leader: 'Sigit Hendra Irawan P., S.Pi (Katim Penerapan Standar)',
    deadline: '15 Januari 2027',
    tasks: [
      { id: 't-9', text: 'Penyusunan Materi Flyer Bahan Acuan Bersertifikat', completed: false },
      { id: 't-10', text: 'Sosialisasi Penyesuaian Tarif PNBP Baru', completed: false }
    ]
  }
];

export const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    title: 'Notulensi Evaluasi Kalibrasi Instrumen Lab Kimia GC-MS',
    category: 'TEKNIS_LAB',
    content: 'Dilakukan verifikasi linearitas kurva kalibrasi residu kloramfenikol pada matriks udang vaname. Nilai r > 0.998 memenuhi persyaratan metode pengujian terakreditasi KAN.',
    author: 'Sigit Hendra Irawan P., S.Pi',
    updatedAt: '10 Nov 2026, 09:30 WIB'
  },
  {
    id: 'note-2',
    title: 'Catatan Rapat Koordinasi Penyusunan Bahan Acuan Mikroba',
    category: 'NOTULENSI',
    content: 'Disepakati target produksi 50 vial bahan acuan matriks ikan tongkol untuk parameter Vibrio parahaemolyticus siap didistribusikan pada kuartal 1.',
    author: 'Iswadi Idris, S.Si',
    updatedAt: '08 Nov 2026, 14:15 WIB'
  },
  {
    id: 'note-3',
    title: 'Memo Internal: Penertiban Pengarsipan Dokumen Mutu',
    category: 'MEMO',
    content: 'Seluruh dokumen hasil pengujian laboratorium wajib diunggah ke repositori digital paling lambat 24 jam setelah pengesahan oleh penyelia lab.',
    author: 'Zaenal Arifin, A.Md',
    updatedAt: '05 Nov 2026, 11:00 WIB'
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    senderName: 'Ahmad Jauhari, S.St.Pi., M.Sc.',
    senderAvatar: '/bagan/pejabat-ahmad-jauhari.jpg',
    senderCategory: 'ASN',
    text: 'Selamat pagi rekan-rekan seluruh divisi. Mohon pastikan seluruh data pengujian sampel minggu ini sudah tercatat rapi sebelum rapat koordinasi pimpinan.',
    timestamp: '08:15'
  },
  {
    id: 'msg-2',
    senderName: 'Zaenal Arifin, A.Md',
    senderAvatar: '/bagan/pejabat-zaenal-arifin.jpg',
    senderCategory: 'ASN',
    text: 'Siap Pak Kepala. Subbagian Umum sudah merekap kehadiran pegawai dan berkas administrasi siap ditinjau.',
    timestamp: '08:18'
  },
  {
    id: 'msg-3',
    senderName: 'Siti Rahmawati, S.Si., M.Biotech.',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80',
    senderCategory: 'ASN',
    text: 'Lab Mikrobiologi sedang merampungkan running Real-Time PCR untuk deteksi patogen pada sampel surveillance ikan hias ekspor.',
    timestamp: '08:22'
  }
];

export const INITIAL_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ann-1',
    title: 'Surat Edaran Kepala Balai: Pelaksanaan Audit Surveillance ISO/IEC 17025:2017 oleh KAN',
    summary: 'Diberitahukan kepada seluruh personil laboratorium bahwa audit surveilen akreditasi KAN akan diselenggarakan pada tanggal 2-4 Desember 2026 di BUSPM Cipayung.',
    publishedAt: '09 November 2026',
    priority: 'SANGAT_PENTING',
    publisher: 'Ahmad Jauhari, S.St.Pi., M.Sc. (Kepala Balai)'
  },
  {
    id: 'ann-2',
    title: 'Sosialisasi Penyesuaian Tarif PNBP Terbaru Pelayanan Uji Mutu & Bahan Acuan',
    summary: 'Pemberlakuan tarif resmi Penerimaan Negara Bukan Pajak (PNBP) baru berdasarkan Peraturan Pemerintah lingkup KKP per 1 Desember 2026.',
    publishedAt: '06 November 2026',
    priority: 'UMUM',
    publisher: 'Zaenal Arifin, A.Md (Kasubbag Umum)'
  }
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-1',
    code: 'SK-BUSPM-2026',
    title: 'SK Penetapan Struktur Organisasi & Uraian Tugas Pejabat BUSPMHKP',
    category: 'SK_STRUKTURAL',
    format: 'PDF',
    fileSize: '2.4 MB',
    uploadedAt: '15 Januari 2026',
    downloadUrl: '#'
  },
  {
    id: 'doc-2',
    code: 'SOP-BUSPM-KIM-001',
    title: 'SOP Pengujian Residu Antibiotik Golongan Kuinolon dengan LC-MS/MS',
    category: 'SOP_LAB',
    format: 'PDF',
    fileSize: '1.8 MB',
    uploadedAt: '12 Maret 2026',
    downloadUrl: '#'
  },
  {
    id: 'doc-3',
    code: 'ISO-17025-MANUAL-REV4',
    title: 'Panduan Mutu Laboratorium Pengujian Berdasarkan SNI ISO/IEC 17025:2017',
    category: 'ISO_17025',
    format: 'PDF',
    fileSize: '4.1 MB',
    uploadedAt: '20 Mei 2026',
    downloadUrl: '#'
  },
  {
    id: 'doc-4',
    code: 'MTA-TEMPLATE-KKP',
    title: 'Formulir Standar Material Transfer Agreement (MTA) Bahan Acuan BUSPM',
    category: 'REGULASI_PNBP',
    format: 'DOCX',
    fileSize: '480 KB',
    uploadedAt: '10 Juli 2026',
    downloadUrl: '#'
  }
];

export const INITIAL_CHANNEL_MESSAGES: Record<string, ChatMessage[]> = {
  umum: INITIAL_CHAT_MESSAGES,
  kimia: [
    {
      id: 'msg-k-1',
      senderName: 'Sigit Hendra Irawan P., S.Pi',
      senderAvatar: '/bagan/pejabat-sigit-hendra.jpg',
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
};

export const INITIAL_DIRECT_MESSAGES: Record<string, ChatMessage[]> = {
  'emp-1': [
    {
      id: 'dm-1-1',
      senderName: 'Ahmad Jauhari, S.St.Pi., M.Sc.',
      senderAvatar: '/bagan/pejabat-ahmad-jauhari.jpg',
      senderCategory: 'ASN',
      text: 'Selamat bertugas. Mohon laporan berkala hasil uji surveilen komoditas perikanan disampaikan sebelum rapat pimpinan.',
      timestamp: 'Kemarin, 16:30'
    }
  ],
  'emp-2': [
    {
      id: 'dm-2-1',
      senderName: 'Zaenal Arifin, A.Md',
      senderAvatar: '/bagan/pejabat-zaenal-arifin.jpg',
      senderCategory: 'ASN',
      text: 'Halo, terkait urusan administrasi kepegawaian atau sarana pengujian lab, silakan koordinasikan lewat sini ya.',
      timestamp: '09:00'
    }
  ]
};

