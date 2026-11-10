# skill.md — Katalog & Panduan Operasional 12 AI Agent Skills
## Proyek: Portal Terpadu Balai Uji Standar KIPM (BUSPMHKP / BPP MHKP) & KantorKu

Dokumen ini mendokumentasikan secara mendalam 12 keahlian agen (*Agent Skills*) paling berpengaruh di ekosistem open-source AI coding (Cursor, Claude Code, Antigravity, Codex), filosofi di baliknya, perintah instalasi/penggunaan, serta integrasinya ke dalam 10 langkah pengembangan aplikasi BUSPMHKP.

---

### 1. Katalog Lengkap 12 Agent Skills

#### 1. `caveman` (Extreme Token Efficiency & Zero-Fluff Protocol)
* **Kreator / Sumber:** Julius Brussee & Komunitas Open-Source (`juliusbrussee/caveman`).
* **Filosofi Inti:** *"Why use many token when few token do trick."* Model LLM bawaan seringkali terlalu cerewet dengan basa-basi pengantar ("*Tentu, saya dengan senang hati akan membantu Anda...*") dan penutup sopan yang membakar output token, meningkatkan latensi, dan mengotori context window.
* **Mekanisme Kerja:**
  - Mengeliminasi kata sambung berlebih, sapaan basa-basi, dan pengulangan pertanyaan.
  - Mempertahankan akurasi teknis 100%: path file absolut, blok kode, signature fungsi, error trace tidak boleh dipersingkat.
  - Tingkatan mode: *Lite* (kalimat utuh tanpa basa-basi), *Full* (frasa pendek berbobot informasi tinggi dengan panah kausalitas `A -> B`), *Ultra* (ledakan data murni untuk debugging intensif).
* **Penerapan pada Proyek BUSPM:** Digunakan saat eksekusi kode backend, query database, dan perbaikan bug agar token context window tetap bersih dan respons secepat kilat.

---

#### 2. `TDD` (Test-Driven Development)
* **Kreator / Sumber:** Matt Pocock (`mattpocock/skills`), Jesse Vincent (`obra/superpowers`), Chanwit (`chanwit/tdg`).
* **Filosofi Inti:** *"No production code without a failing test first."*
* **Mekanisme Kerja:**
  - Siklus ketat **Red -> Green -> Refactor**:
    1. *The Seam Agreement:* Menentukan batas pengujian (seam) sebelum menulis baris logika produksi apapun.
    2. *Red Phase:* Menulis unit/integration test minimal yang gagal dan memverifikasi kegagalannya terjadi karena alasan yang tepat.
    3. *Green Phase:* Menulis implementasi produksi seminimal mungkin sampai test berstatus lulus (hijau).
    4. *Refactor Phase:* Membersihkan struktur kode dan menghapus duplikasi tanpa mengubah perilaku test.
* **Penerapan pada Proyek BUSPM:** Digunakan untuk menguji modul perhitungan tarif PNBP, otentikasi role ASN/Non-ASN, dan logika filter pegawai.

---

#### 3. `ui-ux-pro-max` (Design Intelligence Knowledge Base)
* **Kreator / Sumber:** Komunitas UI/UX Pro Max (`uupm.cc` / `npm i -g ui-ux-pro-max-cli`).
* **Filosofi Inti:** Mencegah AI menghasilkan desain template generik dengan menyuntikkan basis data 50+ gaya UI, 97 palet warna industri, 57 pasangan tipografi, dan 99 panduan UX serta aksesibilitas.
* **Mekanisme Kerja:**
  - Memandu pemilihan hierarki visual, micro-interactions, mobile-first layouts, dan standar WCAG AA (kontras minimal 4.5:1, touch target minimal 44x44px).
  - Melarang anti-pattern desain antarmuka.
* **Penerapan pada Proyek BUSPM:** Menjadi panduan utama dalam menyusun layout portal publik BPP MHKP yang presisi dan membangun estetika dashboard KantorKu yang profesional.

---

#### 4. `impeccable` (Design Craft & Anti-Slop System)
* **Kreator / Sumber:** Paul Bakaus (`impeccable.style` / `npx impeccable install`).
* **Filosofi Inti:** Menghapus "AI Slop" — kecenderungan coding assistant memilih gaya generik seperti gradien ungu kabur, kartu dengan bobot visual seragam, dan tata letak teks yang membosankan.
* **Mekanisme Kerja:**
  - Memberikan perintah kerja berbasis desain: `/impeccable craft`, `/impeccable critique`, `/impeccable audit`, `/impeccable polish`, dan `/impeccable harden`.
  - Menginisialisasi token desain spesifik proyek (`DESIGN.md` / `PRODUCT.md`) agar AI tidak menebak-nebak warna atau padding.
  - Memiliki detektor deterministik code-side untuk memindai pelanggaran desain.
* **Penerapan pada Proyek BUSPM:** Menjaga kekayaan visual portal, kebersihan border, dan keseimbangan white-space di halaman publik dan panel admin.

---

#### 5. `grill-with-docs` (Stateful Architecture & Spec Interrogator)
* **Kreator / Sumber:** Matt Pocock (`mattpocock/skills/grill-with-docs`).
* **Filosofi Inti:** Mencegah agen membangun software di atas rencana yang kabur (*vague plans*). Menjalankan wawancara terstruktur (*frontier rounds*) untuk menguji keputusan teknis sebelum kode ditulis.
* **Mekanisme Kerja:**
  - Bertanya secara bertahap pada cabang keputusan spesifik dengan menyediakan rekomendasi jawaban opsi.
  - Menyimpan keputusan permanen ke dalam repositori dalam bentuk dokumen glosarium domain (`CONTEXT.md`) dan *Architecture Decision Records* (`docs/adr/`).
* **Penerapan pada Proyek BUSPM:** Menyelaraskan istilah khusus KKP (SIMLAB, PNBP Volatil, MTA, CoA, Uji Profisiensi, Bahan Acuan) ke dalam dokumen arsitektur sebelum coding dimulai.

---

#### 6. `superpowers` (Disciplined Software Engineering Toolkit)
* **Kreator / Sumber:** Jesse Vincent (`obra/superpowers`).
* **Filosofi Inti:** Mengubah AI coding assistant biasa menjadi insinyur perangkat lunak senior yang disiplin, mematuhi prinsip rekayasa software teruji, dan tidak pernah berasumsi tanpa verifikasi.
* **Mekanisme Kerja:**
  - Mengharuskan invokasi skill secara otomatis bila relevansi tugas terdeteksi.
  - Menolak spekulasi perbaikan bug (*no speculative fixes*), mewajibkan pembuktian hipotesis dengan pengujian sistematis.
* **Penerapan pada Proyek BUSPM:** Mengawal siklus pengembangan end-to-end agar tetap patuh pada standar kualitas tinggi.

---

#### 7. `gstack` (Y Combinator CEO Garry Tan Engineering Suite)
* **Kreator / Sumber:** Garry Tan (`garrytan/gstack`).
* **Filosofi Inti:** Menstrukturkan seluruh daur hidup pengembangan aplikasi dengan membagi AI ke dalam persona spesialis tim engineering lengkap (seperti satu startup yang bekerja harmonis).
* **Mekanisme Kerja:**
  - Persona perintah: `/office-hours` (framing produk), `/spec` (penyusunan spesifikasi teknis), `/plan-ceo-review` (evaluasi nilai bisnis), Staff Engineer Code Reviewer, dan Headless Browser QA.
* **Penerapan pada Proyek BUSPM:** Menjadi fondasi pembagian peran subagent pada file `AGENTS.md`.

---

#### 8. `ponytail` (Pragmatic Anti-Overengineering Heuristic)
* **Kreator / Sumber:** Dietrich Gebert (`DietrichGebert/ponytail`).
* **Filosofi Inti:** *"Think like the laziest senior developer in the room."* AI cenderung menambahkan ratusan baris kode abstraksi rumit atau dependensi eksternal yang tidak diperlukan.
* **Mekanisme Kerja:**
  - Menjalankan *decision ladder*: Dahulukan fitur bawaan browser (HTML5 inputs, CSS Grid/Flexbox) dan standard library sebelum memutuskan mengimpor library baru.
  - Memilih solusi paling ringkas, mudah dibaca, dan mudah dirawat.
* **Penerapan pada Proyek BUSPM:** Menjaga dependensi tetap ramping, menghindari bloating library, dan mengoptimalkan build size.

---

#### 9. `i-have-adhd` (High-Focus & Actionable Formatting Discipline)
* **Kreator / Sumber:** ayghri (`ayghri/i-have-adhd`).
* **Filosofi Inti:** Menyajikan output yang bebas dinding teks (*walls of text*), langsung to-the-point, dan ramah kognitif.
* **Mekanisme Kerja:**
  - Menempatkan **langkah aksi berikutnya** di posisi paling atas.
  - Membatasi daftar maksimal 3-5 poin bernomor terstruktur.
  - Menandai pencapaian tugas secara visual dan eksplisit.
* **Penerapan pada Proyek BUSPM:** Memastikan komunikasi dengan developer dan dokumentasi progress selalu terstruktur rapi dan mudah dieksekusi.

---

#### 10. `taste-skill` (Art Direction & Editorial Frontend Aesthetic)
* **Kreator / Sumber:** Leonxlnx (`Leonxlnx/taste-skill` / `design-taste-frontend`).
* **Filosofi Inti:** Memberikan agen pemahaman seni visual, komposisi spasial, hirarki kontras, dan ketenangan desain (*editorial restraint*).
* **Mekanisme Kerja:**
  - Mengatur white space proporsional, border mikro-halus, dan kontras warna yang tidak menyilaukan.
  - Menolak visual klise AI (seperti shadow berlebihan dan tombol neon murahan).
* **Penerapan pada Proyek BUSPM:** Memastikan antarmuka Dark Mode "KantorKu" memiliki estetika obsidian slate yang mewah dan berwibawa layaknya software modern sekelas Linear, Supabase, atau Vercel.

---

#### 11. `agent-browser` (High-Performance Browser Automation)
* **Kreator / Sumber:** Vercel Labs (`vercel-labs/agent-browser`).
* **Filosofi Inti:** Otomasi penjelajahan browser berbasis Chrome DevTools Protocol (CDP) dengan pohon aksesibilitas (*accessibility tree*) dan referensi elemen cepat `@eN`.
* **Mekanisme Kerja:**
  - Memungkinkan agen mengeksekusi navigasi web, pengisian form, penekanan tombol, tangkapan layar visual, dan inspeksi DOM tanpa beban berat browser overhead.
* **Penerapan pada Proyek BUSPM:** Digunakan sebagai dasar pengujian integrasi tampilan dan verifikasi navigasi halaman secara visual.

---

#### 12. `find-skills` (Meta-Skill Package Discovery & Manager)
* **Kreator / Sumber:** Vercel Labs & Skills.sh Ecosystem (`skills.sh`).
* **Filosofi Inti:** Membekali agen dengan kemampuan mencari, menilai, dan memasang skill komunitas baru secara dinamis menggunakan CLI `npx skills find [query]`.
* **Mekanisme Kerja:**
  - Agen memeriksa kebutuhan yang belum terpenuhi, mencari repositori yang relevan berdasarkan reputasi/bintang GitHub, dan menginstalnya ke dalam konfigurasi lokal.
* **Penerapan pada Proyek BUSPM:** Memperluas kapabilitas agen saat proyek memerlukan keahlian spesifik tambahan (misal: sanitasi file upload, parsing sertifikat PDF).

---

### 2. Matriks Integrasi Skill ke 10 Langkah Pengembangan Aplikasi

| Langkah Pengembangan | Skill Utama yang Digunakan | Peran & Dampak Eksekusi |
|---|---|---|
| **1. Tulis PRD Lengkap** | `grill-with-docs`, `gstack`, `i-have-adhd` | Menghilangkan ambiguitas alur layanan, memetakan fitur, menulis `prd.md` yang tuntas dan terstruktur. |
| **2. Full UI & UX Design Brief** | `ui-ux-pro-max`, `taste-skill`, `impeccable` | Menyusun token warna, tipografi, anti-slop rules (banned green pulse), panduan dark mode di `design.md`. |
| **3. Temukan Celah Keamanan** | `superpowers`, `ponytail`, `caveman` | Audit kerentanan OWASP (SQLi, XSS, CSRF, IDOR), parameterisasi kueri, sanitasi Zod. |
| **4. Debug Error dengan Cepat** | `superpowers` (systematic debugging), `caveman` | Analisis pesan error tanpa tebak-tebakan spekulatif, pembuktian hipotesis via log minimalis. |
| **5. E2E Test (Playwright)** | `TDD`, `agent-browser` | Menulis skenario uji otomatis: alur publik, login ASN/Non-ASN, interaksi modul KantorKu. |
| **6. Bersihkan & Refactor Code** | `ponytail`, `gstack` (staff engineer) | Menghapus dead code, unregister dependensi tak terpakai, memastikan arsitektur bersih (*lean*). |
| **7. Tulis Git Commit yang Rapi** | `i-have-adhd`, `gstack` | Format commit konvensional yang atomik (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`). |
| **8. Ubah Task Jadi Skill** | `find-skills`, `superpowers` | Mengkristalisasi solusi masalah rumit menjadi reusable skill file untuk pemakaian berulang. |
| **9. Optimalkan Performa** | `ponytail`, `ui-ux-pro-max` | Lazy loading komponen, caching data TanStack Query, optimasi Core Web Vitals (LCP < 2s). |
| **10. Dokumentasi & Deploy** | `impeccable`, `caveman` | Panduan deployment, environment variables, verifikasi live build di target host. |
