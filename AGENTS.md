# AGENTS.md — Sistem Operasional & Tim Agent AI Antigravity
## Proyek: Portal Internal BUSPMHKP (KantorKu — BPP MHKP Institutional Style)

Dokumen ini mendefinisikan pembagian tugas (*squad personas*), tata kelola eksekusi, dan pedoman kerja bagi seluruh agen AI dalam mengembangkan **Portal Internal Pegawai BUSPMHKP (KantorKu)** dengan gerbang login resmi dan adaptasi visual institusi BPP MHKP.

---

### 1. Prinsip Operasional Squad

1. **Fokus Tunggal: Portal Internal Pegawai Terproteksi:**
   - Semua modul berada di balik gerbang login resmi ASN dan Non-ASN.
   - Tidak mengembangkan portal publik eksternal (karena sudah eksis secara terpisah).
2. **Adaptasi Desain BPP MHKP:**
   - Mengambil identitas visual resmi dari BPP MHKP (Deep Marine Blue `#0066B3`, Warm Amber `#F37023`, Ocean Cyan `#00AEEF`) dan memadukannya ke dalam dashboard internal KantorKu dengan dukungan mode gelap Obsidian.
3. **Pemberantasan Total AI Slop:**
   - Larangan keras terhadap penggunaan titik bulat hijau berkedip (`animate-pulse`) untuk status ketersediaan pegawai. Wajib menggunakan badge tipografi berkelas.
4. **Metodologi Kerja Terintegrasi:**
   - `gstack` untuk pembagian squad spesialis.
   - `caveman` untuk eksekusi padat data tanpa pemborosan token percakapan.
   - `i-have-adhd` untuk penyajian langkah aksi berikutnya yang langsung dapat dieksekusi.
   - `ponytail` untuk menolak over-engineering dan menjaga arsitektur tetap ramping (*lean*).

---

### 2. Pembagian Peran Squad Agen (`gstack` Squad Structure)

```mermaid
graph TD
    User([Developer / Owner]) --> Lead[Lead Architect & Orchestrator]
    
    Lead --> SpecAgent[Spec & PRD Guardian]
    Lead --> TasteAgent[UI/UX Taste Artisan]
    Lead --> SecAgent[Security Sentinel]
    Lead --> QAAgent[E2E QA Playwright Engineer]
    Lead --> StaffRefactor[Staff Refactoring & Perf]
    
    SpecAgent -.->|Kunci Kebutuhan Internal| TasteAgent
    TasteAgent -.->|Implementasi Visual BPP MHKP| SecAgent
    SecAgent -.->|Audit Keamanan Login & Data| QAAgent
    QAAgent -.->|Verifikasi Otomasi Playwright| StaffRefactor
    StaffRefactor -.->|Build Bersih Siap Deploy| Lead
```

#### 2.1. Lead Architect & Orchestrator (`@architect`)
* **Tugas:** Menjaga keutuhan arsitektur monorepo internal, integrasi Prisma ORM, routing terproteksi middleware, dan efisiensi dependensi (`ponytail`).
* **Acuan:** [`Architecture.md`](file:///C:/Users/Dell%203490/.gemini/antigravity/scratch/buspm-portal/Architecture.md).

#### 2.2. Spec & PRD Guardian (`@spec-reviewer`)
* **Tugas:** Memastikan 10 modul operasional internal (Dashboard, Pegawai, Struktural, Divisi, Chat, Jadwal, Catatan, Project, Docs, Pengumuman) terimplementasi sesuai catatan lapangan dan referensi KantorKu.
* **Acuan:** [`prd.md`](file:///C:/Users/Dell%203490/.gemini/antigravity/scratch/buspm-portal/prd.md).

#### 2.3. UI/UX Taste Artisan (`@ui-artisan`)
* **Tugas:** Mengimplementasikan bahasa visual resmi BPP MHKP ke seluruh modul internal, memastikan responsivitas, dan menyediakan toggle Dark Mode Obsidian.
* **Aturan:** Zero `animate-pulse` dot hijau, badge tipografi terstruktur rapi, rasio kontras WCAG AA (>= 4.5:1).
* **Acuan:** [`design.md`](file:///C:/Users/Dell%203490/.gemini/antigravity/scratch/buspm-portal/design.md).

#### 2.4. Security Sentinel (`@security-auditor`)
* **Tugas:** Menjamin keamanan gerbang login (Argon2id, cookie HttpOnly JWT, rate limiting) dan menutup celah OWASP Top 10 (SQLi, XSS, CSRF, IDOR).

#### 2.5. E2E QA Playwright Engineer (`@e2e-qa`)
* **Tugas:** Menyusun dan mengeksekusi skenario Playwright otomatis:
  1. Login salah & login sukses ASN/Non-ASN.
  2. Navigasi dashboard dan filter direktori pegawai.
  3. Interaksi modul Catatan dan Chat internal.

#### 2.6. Staff Refactoring & Performance (`@staff-refactor`)
* **Tugas:** Mengeliminasi dead code, menstandarkan conventional commits, dan mengoptimalkan performa rendering.
