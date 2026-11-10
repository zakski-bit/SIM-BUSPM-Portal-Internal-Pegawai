# KantorKu — Portal Internal Pegawai BUSPMHKP
## Balai Uji Standar Karantina Ikan, Pengendalian Mutu dan Keamanan Hasil Perikanan (BPP MHKP - KKP RI)

Aplikasi portal internal operasional pegawai (ASN dan Non-ASN) terpadu berbasis visual institusional resmi BPP MHKP.

---

### Fitur Utama

1. **Gerbang Login Resmi Berlatar Video:**
   - Latar belakang video YouTube resmi BUSPM KKP (`D5gZ-uuENzU`) dengan transparansi rendah (*low opacity* ~20%).
   - Kategori akun terpisah: **Pegawai ASN** dan **Pegawai Non-ASN (PPNPN)**.
   - Tombol Demo Quick Login untuk pengujian cepat 1-klik.

2. **Desain Anti-AI Slop Keras:**
   - **Latar Belakang Putih Bersih Utama:** Kanvas kerja terang, bersih, dan profesional.
   - **Dukungan Dark Mode:** Beralih ke mode gelap kontras tinggi (Slate & Navy) via tombol toggle pada navbar.
   - **Zero Green Dots:** Tidak menggunakan titik bulat hijau berkedip (`animate-pulse`). Semua status ketersediaan menggunakan badge tipografi berkelas.
   - **Tanpa Sudut Menggelembung:** Menggunakan radius sudut terukur `rounded-md` (6px) dan `rounded-lg` (8px).
   - **Simple SVG Icons:** Ikon vektor bersih (Lucide React), tanpa emoji.
   - **Foto Riil Laboratorium:** Menggunakan fotografi riil pengujian laboratorium dari internet.

3. **10 Modul Terpadu Lengkap:**
   - **Dashboard Overview:** 4 kartu metrik (Total Pegawai: 10, Pegawai Aktif: 9, Divisi: 5, Project Berjalan: 2), Jadwal Terdekat, dan Progres Project.
   - **Data Pegawai:** Direktori lengkap 10 personil ASN/Non-ASN, filter divisi, search, dan *Question / Helpdesk Desk*.
   - **Struktural:** Bagan hierarki kepemimpinan balai dan tombol unduh dokumen SK Struktural (`Bagan.Doc`).
   - **Divisi / LAB:** 5 unit laboratorium rujukan nasional (Lab Kimia, Lab Mikrobiologi, Lab Patologi, Standardisasi & Mutu, Subbag Tata Usaha) beserta instrumen dan kapasitas harian.
   - **Chat & Grup:** Ruang koordinasi komunikasi real-time per divisi, proyek, dan simulasi pengiriman pesan.
   - **Jadwal:** Kalender kegiatan pengujian dan modal tambah jadwal baru.
   - **Catatan:** Notulensi rapat, memo kedinasan, dan editor catatan teknis pengujian lab.
   - **Project : Question:** Pelacakan milestone proyek dengan checklist interaktif dan pelacak kendala teknis.
   - **Docs:** Repositori dokumen SOP ISO/IEC 17025, formulir MTA, CoA, dan regulasi PNBP.
   - **Pengumuman:** Papan siaran pengumuman resmi pimpinan balai.

---

### Cara Menjalankan Aplikasi

1. Masuk ke direktori proyek:
   ```bash
   cd "C:\Users\Dell 3490\.gemini\antigravity\scratch\buspm-portal"
   ```

2. Jalankan development server:
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:3000`.

3. Build untuk produksi:
   ```bash
   npm run build
   ```
