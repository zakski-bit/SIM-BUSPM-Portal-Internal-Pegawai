# design.md — Panduan Sistem Desain UI & UX KantorKu (Revisi Final)
## Identitas Visual BPP MHKP: Latar Putih Institusional & Anti-AI Slop Keras

---

### 1. Prinsip Desain Mutlak (Non-Negotiable Design Rules)

1. **Latar Belakang Primer: PUTIH BERSIH INSTITUSIONAL (`#FFFFFF` & `#F8FAFC`)**
   - **TIDAK MENGGUNAKAN OBSIDIAN SEBAGAI TEMA UTAMA.**
   - Kanvas utama aplikasi berlatar putih bersih terang dengan batas garis struktural yang tegas (*hairline borders* `#E2E8F0`).
   - Menyediakan fitur beralih ke **Mode Gelap (Dark Mode)** yang bersih dan berkelas berbasis Slate/Navy (`#0B1120` & `#1E293B`), bukan gradien ungu atau obsidian kusam.

2. **BENTUK & SUDUT STRUKTURAL (Anti-AI Slop Box Radius):**
   - **DIHARAMKAN:** Kotak dengan sudut membulat berlebihan (*excessive rounded bubbles* seperti `rounded-2xl` atau `rounded-3xl` yang sering dicirikan sebagai AI-slop template).
   - **DIWAJIBKAN:** Sudut geometris tegas, minimalis, dan berwibawa: **`rounded-md` (6px)** atau maksimal **`rounded-lg` (8px)** dengan border tipis `border border-slate-200/80`.

3. **IKONOGRAFI: SVG SIMPLE MURNI (NO EMOJIS):**
   - **DIHARAMKAN:** Penggunaan karakter emoji (seperti 🌐, 📥, 🔬, 📋, 📦, 🏢, dll.).
   - **DIWAJIBKAN:** Menggunakan **Simple Vector SVG Icons (Lucide React)** yang seragam dengan stroke width 1.5px hingga 1.75px.

4. **STATUS INDIKATOR: BEBAS TITIK HIJAU (ZERO GREEN DOTS):**
   - **DIHARAMKAN KERAS:** Titik bulat hijau, baik statis apalagi berkedip (`animate-pulse` / `bg-emerald-500 rounded-full`).
   - **DIWAJIBKAN:** Menggunakan **Badge Tipografi Rapi (Typography Badges)** dengan teks jelas dan border subtle:
     - Aktif: `px-2 py-0.5 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded`
     - Cuti: `px-2 py-0.5 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded`
     - Dinas Luar: `px-2 py-0.5 text-xs font-medium text-blue-800 bg-blue-50 border border-blue-200 rounded`

5. **GERBANG LOGIN DENGAN LATAR BELAKANG VIDEO:**
   - Menggunakan video latar belakang YouTube: [`https://www.youtube.com/watch?v=D5gZ-uuENzU`](https://www.youtube.com/watch?v=D5gZ-uuENzU) (Video profil & operasional KKP/BPP MHKP).
   - Dipasang dengan transparansi rendah (*low opacity* ~ 20%-25%) dengan lapisan overlay gelap/navy dinamis (`bg-slate-900/75` atau `bg-blue-950/70`) dan *backdrop-blur* halus.
   - Video berjalan otomatis secara senyap (*muted, autoplay, loop, no controls*).

6. **FOTOGRAFI RIIL DARI INTERNET:**
   - Menggunakan foto riil bertema laboratorium kimia, mikrobiologi, pengujian karantina ikan, dan perikanan maritim beresolusi tinggi (Unsplash CDN).

---

### 2. Palet Warna (Color System)

#### 2.1. Light Theme Default (Latar Putih Institusional BPP MHKP)

| Token | Hex | Tailwind Class | Penggunaan |
|---|---|---|---|
| `canvas-main` | `#FFFFFF` | `bg-white` | Latar kanvas kerja utama |
| `canvas-subtle` | `#F8FAFC` | `bg-slate-50` | Latar sidebar, container selang-seling, input form |
| `card-surface` | `#FFFFFF` | `bg-white` | Kartu metrik, kartu jadwal, modal dialog |
| `bpp-marine` | `#0066B3` | `bg-[#0066B3] text-[#0066B3]` | Warna primer identitas BPP MHKP, tombol aksi |
| `bpp-amber` | `#F37023` | `bg-[#F37023] text-[#F37023]` | Aksen tombol sorotan login, badge prioritas |
| `bpp-cyan` | `#00AEEF` | `text-[#00AEEF]` | Aksen interaktif, hover border |
| `text-primary` | `#0F172A` | `text-slate-900` | Judul teks, angka metrik utama |
| `text-secondary` | `#475569` | `text-slate-600` | Teks keterangan, paragraf, label form |
| `border-divider`| `#E2E8F0` | `border-slate-200` | Garis batas tabel, kartu, dan pembatas seksi |

---

#### 2.2. Dark Theme (Clean Slate & Navy Mode)

| Token | Hex | Tailwind Class | Penggunaan |
|---|---|---|---|
| `dark-canvas` | `#0B1120` | `dark:bg-[#0B1120]` | Latar belakang kanvas mode gelap |
| `dark-surface` | `#111827` | `dark:bg-gray-900` | Kartu metrik, panel sidebar, popover |
| `dark-surface-elevated`| `#1E293B` | `dark:bg-slate-800` | Hover state, dropdown |
| `dark-border` | `#1E293B` | `dark:border-slate-800`| Batas kartu dan pembatas tabel |
| `dark-text-primary` | `#F8FAFC` | `dark:text-slate-50` | Judul dan angka metrik |
| `dark-text-secondary` | `#94A3B8` | `dark:text-slate-400`| Keterangan dan label |

---

### 3. Komponen Antarmuka Spesifik

#### 3.1. Gerbang Login (Video Background Gateway)
* Video container dengan rasio layar penuh (`fixed inset-0 overflow-hidden pointer-events-none`).
* Video YouTube di-embed via iframe:
  ```html
  <iframe
    src="https://www.youtube-nocookie.com/embed/D5gZ-uuENzU?autoplay=1&mute=1&loop=1&playlist=D5gZ-uuENzU&controls=0&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1"
    class="w-[120vw] h-[120vh] -ml-[10vw] -mt-[10vh] object-cover opacity-20 filter contrast-125"
  />
  ```
* Overlay: `bg-slate-900/80 backdrop-blur-sm`.
* Kartu Login: Berlatar putih bersih `bg-white/95 dark:bg-slate-900/95 shadow-2xl border border-slate-200 dark:border-slate-800 rounded-lg p-8 max-w-md w-full`.
* Tab ASN & Non-ASN dengan indikator garis bawah tegas.
* Tombol Masuk oranye BPP MHKP (`bg-[#F37023] hover:bg-[#E45D10] text-white font-semibold py-2.5 rounded-md`).

#### 3.2. Kartu Metrik Ringkasan (Dashboard Metrics)
* Sudut: `rounded-lg` (8px).
* Garis: `border border-slate-200 dark:border-slate-800`.
* Ikon: SVG simple dari Lucide (`<Users className="w-5 h-5 text-blue-600" />`, `<FlaskConical />`, dll.).
* Nilai angka besar `text-3xl font-bold text-slate-900 dark:text-white`.

#### 3.3. Status Kepegawaian (Tanpa Titik Hijau)
* Contoh Badge Aktif:
  ```html
  <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/40">
    Aktif
  </span>
  ```

#### 3.4. Tabel Data Pegawai & Modul Kerja
* Baris berjarak lega, border tipis, warna latar putih bersih selang-seling `slate-50`.
* Tidak ada elemen gelembung membulat (*bubble-shaped slop*).
