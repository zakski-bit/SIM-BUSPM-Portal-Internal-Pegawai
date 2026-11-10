export type EmployeeStatus = 'AKTIF' | 'CUTI' | 'DINAS_LUAR' | 'IZIN';
export type EmployeeCategory = 'ASN' | 'NON_ASN';
export type UserRole = 'KEPALA_BALAI' | 'KTU' | 'KATIM' | 'ANALIS' | 'STAFF';

export interface Employee {
  id: string;
  nipNik: string;
  name: string;
  category: EmployeeCategory;
  role: UserRole;
  jobTitle: string;
  divisionId: string;
  divisionName: string;
  email: string;
  phone: string;
  status: EmployeeStatus;
  avatarUrl: string;
}

export interface Division {
  id: string;
  code: string;
  name: string;
  description: string;
  headName: string;
  headNip: string;
  dailyCapacity: number;
  totalPersonnel: number;
  imageUrl: string;
  keyInstruments: string[];
}

export interface ScheduleItem {
  id: string;
  title: string;
  dateStr: string; // e.g. "11 NOV"
  timeStr: string; // e.g. "10:00"
  fullDateTime: string;
  location: string;
  category: 'RAPAT' | 'UJI_LAB' | 'AUDIT_ISO' | 'TOWN_HALL';
  organizer: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  progressPercent: number;
  status: 'PERENCANAAN' | 'BERJALAN' | 'SELESAI';
  leader: string;
  deadline: string;
  tasks: {
    id: string;
    text: string;
    completed: boolean;
    issue?: string;
  }[];
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  category: 'NOTULENSI' | 'TEKNIS_LAB' | 'MEMO';
  author: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  senderName: string;
  senderAvatar: string;
  senderCategory: EmployeeCategory;
  text: string;
  timestamp: string;
  isSelf?: boolean;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  summary: string;
  publishedAt: string;
  priority: 'SANGAT_PENTING' | 'UMUM' | 'INTERNAL';
  publisher: string;
}

export interface DocumentItem {
  id: string;
  code: string;
  title: string;
  category: 'SK_STRUKTURAL' | 'SOP_LAB' | 'ISO_17025' | 'REGULASI_PNBP';
  format: 'PDF' | 'DOCX' | 'XLSX';
  fileSize: string;
  uploadedAt: string;
  downloadUrl: string;
}

// Access Control Helpers
export const hasAdminAccess = (role: UserRole): boolean => {
  return role === 'KEPALA_BALAI' || role === 'KTU';
};

export const hasKatimAccess = (role: UserRole): boolean => {
  return role === 'KEPALA_BALAI' || role === 'KTU' || role === 'KATIM';
};
