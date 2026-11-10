# Architecture.md — Arsitektur Sistem Internal KantorKu
## Proyek: Portal Internal BUSPMHKP (Berbasis Desain Institusi BPP MHKP)

---

### 1. Topologi Arsitektur Sistem (Internal Single-Gateway Architecture)

Sistem dirancang sebagai **Enterprise Internal Workplace Portal** yang terisolasi dan terlindungi oleh gerbang otentikasi tunggal (*Gated Internal Portal*).

```mermaid
graph TB
    subgraph Klien["Lapisan Klien (Frontend Presentation Layer)"]
        LoginPage["Gerbang Login Pegawai<br/>(ASN & Non-ASN / Branding BPP MHKP)"]
        DashboardApp["Aplikasi Dashboard KantorKu<br/>(Dual Theme: BPP MHKP Light & Obsidian Dark)"]
    end

    subgraph SecurityGateway["Gerbang Keamanan & Middleware"]
        AuthMiddleware["Auth & RBAC Middleware<br/>(Validasi JWT Cookie, Rate Limiter)"]
        Sanitizer["Input Sanitizer & Zod Validator<br/>(Proteksi XSS & Payload Abuse)"]
    end

    subgraph ServiceLayer["Lapisan Layanan Aplikasi (Service Layer)"]
        AuthService["Auth Service (Argon2id, Session Manager)"]
        EmployeeService["Employee & Structural Service"]
        DivisionService["Division & Lab Service"]
        ChatService["Internal Chat & Event Bus"]
        ScheduleService["Calendar & Schedule Service"]
        ProjectService["Project & Issue Tracker Service"]
        DocService["Document & SOP Repository Service"]
    end

    subgraph DataLayer["Lapisan Penyimpanan Data (Persistence Layer)"]
        Prisma["Prisma ORM (Parameterized Queries)"]
        Database[(PostgreSQL / SQLite Storage)]
        FileStore["Dokumen SK & SOP Storage"]
    end

    LoginPage --> SecurityGateway
    DashboardApp --> SecurityGateway
    SecurityGateway --> AuthService
    SecurityGateway --> EmployeeService
    SecurityGateway --> DivisionService
    SecurityGateway --> ChatService
    SecurityGateway --> ScheduleService
    SecurityGateway --> ProjectService
    SecurityGateway --> DocService

    AuthService --> Prisma
    EmployeeService --> Prisma
    DivisionService --> Prisma
    ChatService --> Prisma
    ScheduleService --> Prisma
    ProjectService --> Prisma
    DocService --> FileStore
    Prisma --> Database
```

---

### 2. Struktur Routing Aplikasi (Gated Route Hierarchy)

Seluruh halaman berada di balik middleware otentikasi, kecuali route login:

```text
buspm-portal/
├── src/
│   ├── app/
│   │   ├── login/
│   │   │   └── page.tsx            # Gerbang Login Pegawai ASN & Non-ASN
│   │   │
│   │   ├── (protected)/            # Route Group terlindungi autentikasi sesi
│   │   │   ├── layout.tsx          # Shell Navigasi: Header BPP MHKP, Sidebar, Theme Toggle
│   │   │   ├── page.tsx            # Root redirect ke /dashboard
│   │   │   ├── dashboard/          # Modul 1: Overview Metrik, Jadwal & Progres Project
│   │   │   │   └── page.tsx
│   │   │   ├── pegawai/            # Modul 2: Direktori Pegawai & Question/FAQ Box
│   │   │   │   └── page.tsx
│   │   │   ├── struktural/         # Modul 3: Bagan Organisasi & Dokumen SK
│   │   │   │   └── page.tsx
│   │   │   ├── divisi/             # Modul 4: Unit Laboratorium Pengujian (LAB)
│   │   │   │   └── page.tsx
│   │   │   ├── chat/               # Modul 5: Chat Divisi, Project & Pesan Langsung
│   │   │   │   └── page.tsx
│   │   │   ├── jadwal/             # Modul 6: Kalender Operasional Uji & Rapat
│   │   │   │   └── page.tsx
│   │   │   ├── pengumuman/         # Modul 7: Papan Pengumuman Resmi Balai
│   │   │   │   └── page.tsx
│   │   │   ├── catatan/            # Modul 8: Notulensi Rapat & Memo Teknis Lab
│   │   │   │   └── page.tsx
│   │   │   ├── project/            # Modul 9: Pelacakan Milestone Project & Isu
│   │   │   │   └── page.tsx
│   │   │   └── docs/               # Modul 10: Repositori Dokumen SOP, ISO 17025 & PNBP
│   │   │       └── page.tsx
│   │   │
│   │   └── api/                    # Endpoint API Internal
│   │       ├── auth/
│   │       │   ├── login/route.ts
│   │       │   ├── logout/route.ts
│   │       │   └── me/route.ts
│   │       ├── pegawai/route.ts
│   │       ├── struktural/route.ts
│   │       ├── divisi/route.ts
│   │       ├── chat/route.ts
│   │       ├── jadwal/route.ts
│   │       ├── catatan/route.ts
│   │       ├── project/route.ts
│   │       └── docs/route.ts
```

---

### 3. Skema Data Terintegrasi (Entity-Relationship Model)

```mermaid
erDiagram
    PEGAWAI ||--o{ JADWAL : "membuat"
    PEGAWAI ||--o{ CATATAN : "menulis"
    PEGAWAI ||--o{ PESAN_CHAT : "mengirim"
    DIVISI ||--o{ PEGAWAI : "menaungi"
    DIVISI ||--o{ RUANG_CHAT : "memiliki"
    RUANG_CHAT ||--o{ PESAN_CHAT : "menampung"
    PEGAWAI ||--o{ PROJECT : "memimpin"
    PROJECT ||--o{ PROJECT_TASK : "berisi"
    DIVISI ||--o{ DOKUMEN : "terkait"

    PEGAWAI {
        uuid id PK
        string nip_nik UK "Nomor Induk Pegawai / NIK"
        string nama_lengkap
        string password_hash
        string kategori "ASN | NON_ASN"
        string jabatan "Jabatan Struktural / Fungsional"
        uuid divisi_id FK
        string status_kerja "AKTIF | CUTI | DINAS_LUAR"
        string role "ADMIN | PIMPINAN | KATIM | ANALIS | STAFF"
        string email_dinas
        string nomor_kontak
        string avatar_url
    }

    DIVISI {
        uuid id PK
        string kode UK "LAB-KIMIA | LAB-MIKRO | LAB-PATOLOGI | BID-MUTU | SUBBAG-TU"
        string nama_divisi
        string deskripsi
        string kepala_tim
        integer kapasitas_sampel_harian
    }

    JADWAL {
        uuid id PK
        string judul_kegiatan
        datetime waktu_mulai
        datetime waktu_selesai
        string lokasi_ruangan "Ruang Rapat 2 | Lab Kimia | Aula Utama"
        string kategori "RAPAT | UJI_LAB | AUDIT_ISO | TOWN_HALL"
        uuid penanggung_jawab FK
    }

    PROJECT {
        uuid id PK
        string nama_project "Website Internal | Migrasi Cloud | Akreditasi KAN"
        string deskripsi
        integer persentase_progres "0 sampai 100"
        string status "PERENCANAAN | BERJALAN | SELESAI"
        date batas_waktu
        uuid ketua_project FK
    }

    PROJECT_TASK {
        uuid id PK
        uuid project_id FK
        string judul_tugas
        boolean selesai
        string question_issue "Catatan kendala / isu tugas"
    }

    RUANG_CHAT {
        uuid id PK
        string nama_ruang
        string tipe_ruang "DIVISI | PROJECT | DIRECT"
        uuid divisi_id FK
    }

    PESAN_CHAT {
        uuid id PK
        uuid ruang_chat_id FK
        uuid pengirim_id FK
        text isi_pesan
        string lampiran_url
        datetime dikirim_pada
    }

    CATATAN {
        uuid id PK
        uuid pembuat_id FK
        string judul_catatan
        text isi_catatan
        string kategori_catatan "NOTULENSI | TEKNIS_LAB | MEMO"
        datetime dibuat_pada
    }

    DOKUMEN {
        uuid id PK
        string nomor_dokumen UK
        string judul_dokumen
        string kategori "SK_STRUKTURAL | SOP_LAB | ISO_17025 | REGULASI_PNBP"
        string format_file "PDF | DOCX | XLSX"
        string file_url
        string versi
        datetime tanggal_unggah
    }
```

---

### 4. Arsitektur Keamanan (Enterprise Defense Matrix)

1. **Gated Middleware Protection:**
   - Semua request ke modul internal diuji token JWT-nya via middleware. Sesi yang kedaluwarsa atau tidak valid langsung dialihkan ke `/login`.
2. **Proteksi Kredensial & Session:**
   - Hashing password menggunakan **Argon2id** dengan salt acak berukuran 16 byte.
   - Token disimpan di dalam cookie `HttpOnly`, `Secure`, `SameSite=Strict`.
3. **Anti-SQL Injection:**
   - Seluruh mutasi dan filter query dijalankan lewat layer ORM Prisma yang terparameterisasi.
4. **Anti-XSS & Content Security Policy:**
   - Form input pada modul Catatan, Chat, dan Pengumuman disanitisasi menggunakan Zod schema sebelum disimpan ke database dan di-escape saat proses render.
5. **Anti-IDOR (Insecure Direct Object Reference):**
   - Setiap mutasi catatan dan profil memvalidasi kepemilikan data (`pegawai.id === session.userId` atau role `ADMIN`).

---

### 5. Strategi Desain Visual & Dark Mode Engine

* **Default Mode (BPP MHKP Institutional Brand):**
  - Mengadaptasi elemen visual resmi: header navy/marine blue (`#0066B3`), aksen amber emas (`#F37023`), kartu putih bersih dengan bayangan lembut, dan banner resmi KKP.
* **Alternative Mode (High-Contrast Obsidian Dark Mode):**
  - Mengubah surface latar belakang menjadi Obsidian (`#0F1117`), card surface (`#181C27`), teks kontras tajam (`#F8FAFC`), dan aksen biru kobalt dinamis (`#2563EB`).
* **Anti-AI Slop Implementation:**
  - Status ketersediaan menggunakan badge tipografi terstruktur rapi. Tidak menggunakan `animate-pulse` dot hijau di seluruh modul.
