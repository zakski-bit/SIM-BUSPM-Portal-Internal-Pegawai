import React, { useState } from 'react';
import {
  Download,
  FileText,
  ShieldCheck,
  X,
  Eye,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Image as ImageIcon,
  Network,
  Mail,
  User,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface OfficialDetail {
  id: string;
  name: string;
  nip: string;
  positionTitle: string;
  category: string;
  roleType: string;
  photoUrl: string;
  email: string;
  phone: string;
  tupoksi: string[];
  skNumber: string;
}

const OFFICIALS_DATA: Record<string, OfficialDetail> = {
  jauhari: {
    id: 'jauhari',
    name: 'Ahmad Jauhari, S.St.Pi., M.Sc.',
    nip: '198212312006041003',
    positionTitle: 'Pejabat Administrator / Kepala Balai Uji Standar PPMHKP Jakarta',
    category: 'Eselon III.a / Administrator',
    roleType: 'Pimpinan Tertinggi Balai',
    photoUrl: '/bagan/pejabat-ahmad-jauhari.jpg',
    email: 'ahmad.jauhari@kkp.go.id',
    phone: '0812-8822-1982',
    skNumber: 'SK.084/KEP-BPPMHKP/2026',
    tupoksi: [
      'Memimpin dan mengoordinasikan seluruh pelaksanaan tugas pengujian standar mutu hasil kelautan dan perikanan.',
      'Menetapkan kebijakan teknis operasional standardisasi metode uji rujukan nasional.',
      'Melaksanakan pembinaan tata kelola kelembagaan, personil, dan akreditasi ISO/IEC 17025.',
      'Bertanggung jawab langsung kepada Kepala Badan Pengendalian dan Pengawasan Mutu Hasil Kelautan dan Perikanan (BPPMHKP).'
    ]
  },
  zaenal: {
    id: 'zaenal',
    name: 'Zaenal Arifin, A.Md',
    nip: '197905182003121002',
    positionTitle: 'Pejabat Pengawas / Kepala Subbagian Umum',
    category: 'Eselon IV.a / Pengawas',
    roleType: 'Kepala Subbagian Umum (Tata Usaha)',
    photoUrl: '/bagan/pejabat-zaenal-arifin.jpg',
    email: 'zaenal.arifin@kkp.go.id',
    phone: '0813-7744-1979',
    skNumber: 'SK.085/KEP-BPPMHKP/2026',
    tupoksi: [
      'Mengelola administrasi kepegawaian aparatur sipil negara dan tenaga pendukung dinas.',
      'Melaksanakan urusan persuratan, tata kearsipan kedinasan, dan rumah tangga kantor.',
      'Mengelola penerimaan negara bukan pajak (PNBP) pengujian serta penyusunan anggaran balai.',
      'Mengkoordinasikan pengelolaan Barang Milik Negara (BMN) dan sarana prasarana pengujian.'
    ]
  },
  dini: {
    id: 'dini',
    name: 'Dini Fajriyani, S.Pi., M.Pi',
    nip: '198704122011012001',
    positionTitle: 'Ketua Tim Kerja Pengembangan Teknik dan Metode Uji Kesehatan Ikan MKHP',
    category: 'Jabatan Fungsional Tertentu (JFT)',
    roleType: 'Ketua Tim Kerja Pengembangan Teknik & Metode Uji',
    photoUrl: '/bagan/pejabat-dini-fajriyani.jpg',
    email: 'dini.fajriyani@kkp.go.id',
    phone: '0812-9988-1234',
    skNumber: 'SK.086/KEP-BPPMHKP/2026',
    tupoksi: [
      'Mengembangkan metode analisis dan teknik diagnostik mutakhir kesehatan ikan dan mutu hasil perikanan.',
      'Melakukan validasi dan verifikasi metode pengujian biologi molekuler, patologi, dan residu kimia.',
      'Menginisiasi inovasi alat uji cepat (rapid test kit) untuk pengendalian mutu hasil tangkapan dan budidaya.',
      'Menyusun pedoman teknis operasional (SOP) laboratorium pengujian rujukan nasional.'
    ]
  },
  iswadi: {
    id: 'iswadi',
    name: 'Iswadi Idris, S.Si',
    nip: '198302192009011002',
    positionTitle: 'Koordinator Fungsional',
    category: 'Jabatan Fungsional Tertentu (JFT)',
    roleType: 'Koordinator Fungsional Balai',
    photoUrl: '/bagan/pejabat-iswadi-idris.jpg',
    email: 'iswadi.idris@kkp.go.id',
    phone: '0813-7762-5100',
    skNumber: 'SK.087/KEP-BPPMHKP/2026',
    tupoksi: [
      'Mengoordinasikan seluruh pejabat fungsional pengendali hama penyakit ikan dan pengawas mutu perikanan.',
      'Memastikan keselarasan sasaran kinerja pegawai (SKP) jabatan fungsional dengan target kinerja balai.',
      'Mengawasi kepatuhan sistem jaminan mutu pengujian sesuai klausul standar ISO/IEC 17025:2017.',
      'Memimpin forum evaluasi teknis pengujian antar laboratorium balai.'
    ]
  },
  sigit: {
    id: 'sigit',
    name: 'Sigit Hendra Irawan P., S.Pi',
    nip: '198506142010121003',
    positionTitle: 'Ketua Tim Kerja Penerapan Standar Metode Uji Kesehatan Ikan MKHP',
    category: 'Jabatan Fungsional Tertentu (JFT)',
    roleType: 'Ketua Tim Kerja Penerapan Standar Metode Uji',
    photoUrl: '/bagan/pejabat-sigit-hendra.jpg',
    email: 'sigit.hendra@kkp.go.id',
    phone: '0813-8877-6655',
    skNumber: 'SK.088/KEP-BPPMHKP/2026',
    tupoksi: [
      'Menerapkan standar acuan metode uji kesehatan ikan dan keamanan pangan hasil perikanan ekspor.',
      'Menyelenggarakan uji profisiensi antar laboratorium penguji mutu perikanan seluruh Indonesia (ISO 17043).',
      'Memproduksi dan mendistribusikan bahan acuan bersertifikat (Certified Reference Materials - ISO 17034).',
      'Memantau kepatuhan sertifikasi hasil pengujian sampel surveilen komoditas perikanan.'
    ]
  }
};

export const StrukturalView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'diagram' | 'scan'>('diagram');
  const [showSKModal, setShowSKModal] = useState(false);
  const [selectedOfficial, setSelectedOfficial] = useState<OfficialDetail | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleDownloadDoc = () => {
    const docHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Surat Keputusan Struktur Organisasi BUSPM 2026</title>
        <style>
          body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; line-height: 1.5; margin: 2.5cm; color: #111; }
          .header { text-align: center; border-bottom: 3px double #003366; padding-bottom: 12px; margin-bottom: 24px; }
          .header h2 { font-size: 13pt; margin: 0; color: #003366; text-transform: uppercase; letter-spacing: 0.5px; }
          .header h3 { font-size: 12pt; margin: 4px 0; color: #1a365d; text-transform: uppercase; }
          .header p { font-size: 9pt; margin: 0; color: #555; }
          .title-area { text-align: center; margin: 25px 0 20px 0; }
          .title-area h4 { font-size: 12pt; margin: 0; text-decoration: underline; text-transform: uppercase; }
          .title-area .nomor { font-size: 10pt; margin: 4px 0; font-family: 'Courier New', monospace; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 20px; }
          th, td { border: 1px solid #999; padding: 8px 12px; font-size: 10pt; text-align: left; vertical-align: top; }
          th { background-color: #f1f5f9; color: #0f172a; font-weight: bold; }
          .legal-box { border-left: 3px solid #003366; padding-left: 10px; margin: 15px 0; background-color: #f8fafc; }
          .sign-area { margin-top: 40px; float: right; width: 280px; text-align: center; font-size: 10pt; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>Kementerian Kelautan dan Perikanan Republik Indonesia</h2>
          <h3>Badan Pengendalian dan Pengawasan Mutu Hasil Kelautan dan Perikanan</h3>
          <p>Balai Uji Standar PPMHKP Jakarta • Jl. Raya Setu No. 1, Cipayung, Jakarta Timur 13880</p>
        </div>

        <div class="title-area">
          <h4>Keputusan Kepala Badan Pengendalian dan Pengawasan Mutu Hasil Kelautan dan Perikanan</h4>
          <div class="nomor">NOMOR: SK.084/KEP-BPPMHKP/2026</div>
          <p><strong>TENTANG: PENETAPAN STRUKTUR ORGANISASI DAN PEJABAT STRUKTURAL / FUNGSIONAL TAHUN 2026</strong></p>
        </div>

        <p>Menimbang dan mengingat ketentuan perundang-undangan di bidang kelautan dan perikanan serta standardisasi pengujian laboratorium nasional, dengan ini menetapkan:</p>

        <table>
          <thead>
            <tr>
              <th style="width: 5%;">No</th>
              <th style="width: 30%;">Jabatan Kedinasan</th>
              <th style="width: 35%;">Nama Pejabat</th>
              <th style="width: 30%;">NIP Kedinasan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td><strong>Pejabat Administrator / Kepala Balai</strong></td>
              <td>Ahmad Jauhari, S.St.Pi., M.Sc.</td>
              <td>198212312006041003</td>
            </tr>
            <tr>
              <td>2</td>
              <td><strong>Pejabat Pengawas / Kepala Subbagian Umum</strong></td>
              <td>Zaenal Arifin, A.Md</td>
              <td>197905182003121002</td>
            </tr>
            <tr>
              <td>3</td>
              <td><strong>Ketua Tim Kerja Pengembangan Teknik & Metode Uji Kesehatan Ikan</strong></td>
              <td>Dini Fajriyani, S.Pi., M.Pi</td>
              <td>198704122011012001</td>
            </tr>
            <tr>
              <td>4</td>
              <td><strong>Koordinator Fungsional</strong></td>
              <td>Iswadi Idris, S.Si</td>
              <td>198302192009011002</td>
            </tr>
            <tr>
              <td>5</td>
              <td><strong>Ketua Tim Kerja Penerapan Standar Metode Uji Kesehatan Ikan</strong></td>
              <td>Sigit Hendra Irawan P., S.Pi</td>
              <td>198506142010121003</td>
            </tr>
          </tbody>
        </table>

        <div class="legal-box">
          <p style="margin: 4px 0;"><strong>Diktum Ketetapan:</strong></p>
          <p style="margin: 4px 0; font-size: 10pt;">Keputusan ini berlaku sejak tanggal 15 Januari 2026 dan menjadi acuan operasional bagi seluruh unit kerja di lingkungan Balai Uji Standar PPMHKP Jakarta.</p>
        </div>

        <div class="sign-area">
          <p>Ditetapkan di: Jakarta<br>Pada tanggal: 15 Januari 2026</p>
          <br><br><br>
          <p><strong>Ahmad Jauhari, S.St.Pi., M.Sc.</strong><br>NIP. 198212312006041003</p>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', docHtml], { type: 'application/msword;charset=utf-8' });
    const element = document.createElement('a');
    element.href = URL.createObjectURL(blob);
    element.download = 'Bagan-Struktural-BUSPM-2026.doc';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadScan = () => {
    const link = document.createElement('a');
    link.href = '/bagan/struktur-organisasi-2026.jpg';
    link.download = 'Struktur-Organisasi-BUSPPMHKP-Jakarta-2026.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 dark:bg-blue-950 text-bpp-marine dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded text-[11px] font-semibold mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-bpp-amber" />
            <span>Kementerian Kelautan dan Perikanan RI • BPP MHKP</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Struktur Organisasi Balai Uji Standar PPMHKP Jakarta (Tahun 2026)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Hierarki kepemimpinan, subbagian umum, dan tim kerja fungsional pengujian standar mutu perikanan
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
          <button
            onClick={() => setShowSKModal(true)}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-md border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Pratinjau SK</span>
          </button>

          <button
            onClick={handleDownloadDoc}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-md border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Unduh Bagan.Doc</span>
          </button>
          
          <button
            onClick={handleDownloadScan}
            className="px-3.5 py-2 bg-bpp-amber hover:bg-bpp-amber-hover text-white text-xs font-bold rounded-md shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Scan Bagan Asli</span>
          </button>
        </div>
      </div>

      {/* View Switcher: Interactive Digital Hierarchy vs Scan of Official 2026 Chart */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-md text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('diagram')}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'diagram'
                ? 'bg-white dark:bg-slate-700 text-bpp-marine dark:text-white shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Bagan Digital Interaktif (Foto Resmi)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('scan')}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'scan'
                ? 'bg-white dark:bg-slate-700 text-bpp-marine dark:text-white shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Dokumen Bagan Gambar Asli 2026</span>
          </button>
        </div>

        <span className="text-[11px] text-slate-400 hidden sm:inline">
          {activeTab === 'diagram' ? 'Klik kartu pejabat untuk melihat profil & tupoksi' : 'Berkas scan bagan asli penetapan tahun 2026'}
        </span>
      </div>

      {/* TAB 1: INTERACTIVE DIGITAL DIAGRAM */}
      {activeTab === 'diagram' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm overflow-x-auto">
          
          {/* Institutional Title on the Diagram Canvas */}
          <div className="text-center max-w-2xl mx-auto mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-xs font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">
              STRUKTUR ORGANISASI
            </h2>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase mt-0.5 tracking-tight">
              BADAN PENGENDALIAN DAN PENGAWASAN MUTU HASIL KELAUTAN DAN PERIKANAN
            </h3>
            <h4 className="text-xs font-bold text-bpp-marine dark:text-blue-400 uppercase mt-0.5">
              BALAI UJI STANDAR PENGENDALIAN DAN PENGAWASAN MUTU HASIL KELAUTAN DAN PERIKANAN JAKARTA
            </h4>
            <div className="inline-block mt-1 px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-mono font-bold rounded">
              TAHUN 2026
            </div>
          </div>

          <div className="min-w-[760px] max-w-4xl mx-auto">
            
            {/* LEVEL 1: PEJABAT ADMINISTRATOR / KEPALA BALAI */}
            <div className="flex justify-center relative">
              <div
                onClick={() => setSelectedOfficial(OFFICIALS_DATA.jauhari)}
                className="w-80 border-2 border-slate-900 dark:border-slate-400 bg-white dark:bg-slate-800 rounded-md shadow-md overflow-hidden flex cursor-pointer hover:ring-2 hover:ring-bpp-marine transition-all duration-200 group"
              >
                {/* Photo Left */}
                <div className="w-24 shrink-0 bg-slate-900 relative">
                  <img
                    src="/bagan/pejabat-ahmad-jauhari.jpg"
                    alt="Ahmad Jauhari, S.St.Pi., M.Sc."
                    className="w-full h-full object-cover object-top filter contrast-105 group-hover:scale-105 transition-transform"
                  />
                </div>
                {/* Text Right */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="bg-[#0B2564] text-white p-2 text-center border-b border-slate-900">
                    <div className="text-[10px] font-bold tracking-wider uppercase leading-tight">
                      PEJABAT ADMINISTRATOR
                    </div>
                    <div className="text-[9px] font-semibold text-blue-200 leading-tight">
                      KEPALA BUSPPMHKP JAKARTA
                    </div>
                  </div>
                  <div className="p-2 text-center bg-white dark:bg-slate-800">
                    <div className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight">
                      Ahmad Jauhari, S.St.Pi., M.Sc.
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                      NIP. 198212312006041003
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* LEVEL 2: CONNECTOR LINE TO SUBBAGIAN UMUM & FUNGSIONAL */}
            <div className="relative h-28 my-1">
              {/* Central vertical stem down */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-slate-900 dark:bg-slate-400" />
              
              {/* Horizontal branch to the right for Subbagian Umum */}
              <div className="absolute left-1/2 top-10 w-32 h-0.5 bg-slate-900 dark:bg-slate-400" />

              {/* Subbagian Umum Card (Positioned to the right of central line) */}
              <div className="absolute left-[calc(50%+8rem)] top-0">
                <div
                  onClick={() => setSelectedOfficial(OFFICIALS_DATA.zaenal)}
                  className="w-72 border-2 border-slate-900 dark:border-slate-400 bg-white dark:bg-slate-800 rounded-md shadow-md overflow-hidden flex cursor-pointer hover:ring-2 hover:ring-bpp-marine transition-all duration-200 group"
                >
                  {/* Photo Left */}
                  <div className="w-20 shrink-0 bg-slate-900 relative">
                    <img
                      src="/bagan/pejabat-zaenal-arifin.jpg"
                      alt="Zaenal Arifin, A.Md"
                      className="w-full h-full object-cover object-top filter contrast-105 group-hover:scale-105 transition-transform"
                    />
                  </div>
                  {/* Text Right */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="bg-[#0B2564] text-white p-2 text-center border-b border-slate-900">
                      <div className="text-[10px] font-bold tracking-wider uppercase leading-tight">
                        PEJABAT PENGAWAS
                      </div>
                      <div className="text-[9px] font-semibold text-blue-200 leading-tight">
                        KEPALA SUBBAGIAN UMUM
                      </div>
                    </div>
                    <div className="p-2 text-center bg-white dark:bg-slate-800">
                      <div className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight">
                        Zaenal Arifin, A.Md
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                        NIP. 197905182003121002
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* LEVEL 3: CENTRAL HORIZONTAL BAR - KELOMPOK JABATAN FUNGSIONAL DAN PELAKSANA */}
            <div className="relative mb-6">
              <div className="w-3/4 mx-auto border-2 border-slate-900 dark:border-slate-400 bg-white dark:bg-slate-800 p-2 text-center shadow-xs">
                <span className="text-xs font-black tracking-wider text-slate-900 dark:text-white uppercase">
                  KELOMPOK JABATAN FUNGSIONAL DAN PELAKSANA
                </span>
              </div>
            </div>

            {/* THREE BRANCH CONNECTORS DOWN TO 3 FUNCTIONAL TEAMS */}
            <div className="relative h-6 mb-2">
              {/* Horizontal line spanning the three columns */}
              <div className="absolute left-[16%] right-[16%] top-0 h-0.5 bg-slate-900 dark:bg-slate-400" />
              {/* 3 Vertical Drops */}
              <div className="absolute left-[16%] top-0 bottom-0 w-0.5 bg-slate-900 dark:bg-slate-400" />
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-slate-900 dark:bg-slate-400" />
              <div className="absolute right-[16%] top-0 bottom-0 w-0.5 bg-slate-900 dark:bg-slate-400" />
            </div>

            {/* LEVEL 4: THE 3 FUNCTIONAL TEAMS (Left, Center, Right) */}
            <div className="grid grid-cols-3 gap-4">
              
              {/* Left Team: Dini Fajriyani */}
              <div className="flex justify-center">
                <div
                  onClick={() => setSelectedOfficial(OFFICIALS_DATA.dini)}
                  className="w-full border-2 border-slate-900 dark:border-slate-400 bg-white dark:bg-slate-800 rounded-md shadow-md overflow-hidden flex flex-col cursor-pointer hover:ring-2 hover:ring-bpp-marine transition-all duration-200 group"
                >
                  <div className="flex flex-1">
                    <div className="w-20 shrink-0 bg-slate-900 relative">
                      <img
                        src="/bagan/pejabat-dini-fajriyani.jpg"
                        alt="Dini Fajriyani, S.Pi., M.Pi"
                        className="w-full h-full object-cover object-top filter contrast-105 group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="bg-[#0B2564] text-white p-2 text-center border-b border-slate-900 min-h-[58px] flex flex-col justify-center">
                        <div className="text-[10px] font-bold tracking-wider uppercase leading-tight">
                          KETUA
                        </div>
                        <div className="text-[8px] font-semibold text-blue-200 leading-tight mt-0.5">
                          TIM KERJA PENGEMBANGAN TEKNIK DAN METODE UJI KESEHATAN IKAN MKHP
                        </div>
                      </div>
                      <div className="p-2 text-center bg-white dark:bg-slate-800">
                        <div className="text-[11px] font-extrabold text-slate-900 dark:text-white leading-tight">
                          Dini Fajriyani, S.Pi., M.Pi
                        </div>
                        <div className="text-[9px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                          NIP. 198704122011012001
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center Team: Iswadi Idris */}
              <div className="flex justify-center">
                <div
                  onClick={() => setSelectedOfficial(OFFICIALS_DATA.iswadi)}
                  className="w-full border-2 border-slate-900 dark:border-slate-400 bg-white dark:bg-slate-800 rounded-md shadow-md overflow-hidden flex flex-col cursor-pointer hover:ring-2 hover:ring-bpp-marine transition-all duration-200 group"
                >
                  <div className="flex flex-1">
                    <div className="w-20 shrink-0 bg-slate-900 relative">
                      <img
                        src="/bagan/pejabat-iswadi-idris.jpg"
                        alt="Iswadi Idris, S.Si"
                        className="w-full h-full object-cover object-top filter contrast-105 group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="bg-[#0B2564] text-white p-2 text-center border-b border-slate-900 min-h-[58px] flex flex-col justify-center">
                        <div className="text-[10px] font-bold tracking-wider uppercase leading-tight">
                          KOORDINATOR FUNGSIONAL
                        </div>
                        <div className="text-[8px] font-semibold text-blue-200 leading-tight mt-0.5">
                          JABATAN FUNGSIONAL TERTENTU
                        </div>
                      </div>
                      <div className="p-2 text-center bg-white dark:bg-slate-800">
                        <div className="text-[11px] font-extrabold text-slate-900 dark:text-white leading-tight">
                          Iswadi Idris, S.Si
                        </div>
                        <div className="text-[9px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                          NIP. 198302192009011002
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Team: Sigit Hendra Irawan */}
              <div className="flex justify-center">
                <div
                  onClick={() => setSelectedOfficial(OFFICIALS_DATA.sigit)}
                  className="w-full border-2 border-slate-900 dark:border-slate-400 bg-white dark:bg-slate-800 rounded-md shadow-md overflow-hidden flex flex-col cursor-pointer hover:ring-2 hover:ring-bpp-marine transition-all duration-200 group"
                >
                  <div className="flex flex-1">
                    <div className="w-20 shrink-0 bg-slate-900 relative">
                      <img
                        src="/bagan/pejabat-sigit-hendra.jpg"
                        alt="Sigit Hendra Irawan P., S.Pi"
                        className="w-full h-full object-cover object-top filter contrast-105 group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="bg-[#0B2564] text-white p-2 text-center border-b border-slate-900 min-h-[58px] flex flex-col justify-center">
                        <div className="text-[10px] font-bold tracking-wider uppercase leading-tight">
                          KETUA
                        </div>
                        <div className="text-[8px] font-semibold text-blue-200 leading-tight mt-0.5">
                          TIM KERJA PENERAPAN STANDAR METODE UJI KESEHATAN IKAN MKHP
                        </div>
                      </div>
                      <div className="p-2 text-center bg-white dark:bg-slate-800">
                        <div className="text-[11px] font-extrabold text-slate-900 dark:text-white leading-tight">
                          Sigit Hendra Irawan P., S.Pi
                        </div>
                        <div className="text-[9px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                          NIP. 198506142010121003
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

          <div className="mt-8 text-center text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
            💡 <em>Petunjuk: Seluruh foto dipotong dan disesuaikan langsung dari bagan struktur resmi tahun 2026. Klik salah satu kartu pejabat untuk melihat uraian tupoksi dan SK.</em>
          </div>

        </div>
      )}

      {/* TAB 2: ORIGINAL SCAN IMAGE VIEWER */}
      {activeTab === 'scan' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-4">
          
          {/* Viewer Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Pratinjau Scan Asli Bagan Organisasi:
              </span>
              <span className="text-[11px] font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">
                1024 × 576 px
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.15))}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-300 cursor-pointer"
                title="Perkecil"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono font-bold w-12 text-center text-slate-600 dark:text-slate-400">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(2.0, z + 0.15))}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-300 cursor-pointer"
                title="Perbesar"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(1)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-300 cursor-pointer ml-1"
                title="Reset Zoom"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleDownloadScan}
                className="ml-2 px-3 py-1.5 bg-bpp-amber hover:bg-bpp-amber-hover text-white text-xs font-bold rounded flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Gambar</span>
              </button>
            </div>
          </div>

          {/* Interactive Image Frame */}
          <div className="relative overflow-auto border border-slate-200 dark:border-slate-800 rounded-md bg-slate-100 dark:bg-slate-950 p-4 flex items-center justify-center min-h-[460px]">
            <img
              src="/bagan/struktur-organisasi-2026.jpg"
              alt="Scan Bagan Struktur Organisasi BUSPPMHKP Jakarta 2026"
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
              className="transition-transform duration-200 max-w-full h-auto rounded shadow-lg border border-slate-300 dark:border-slate-700"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2">
            <span>Sumber Berkas: Keputusan Organisasi BUSPPMHKP Jakarta Tahun 2026</span>
            <a
              href="/bagan/struktur-organisasi-2026.jpg"
              target="_blank"
              rel="noreferrer"
              className="text-bpp-marine dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
            >
              <span>Buka Resolusi Penuh di Tab Baru</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>
      )}

      {/* Official Details Modal (Triggered on Card Click) */}
      {selectedOfficial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 max-w-xl w-full shadow-2xl flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-bpp-marine" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Profil Pejabat Kedinasan BUSPM
                </h3>
              </div>
              <button
                onClick={() => setSelectedOfficial(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto my-4 space-y-4">
              
              {/* Header Card with Official Cropped Photo */}
              <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-md border border-slate-200 dark:border-slate-700">
                <img
                  src={selectedOfficial.photoUrl}
                  alt={selectedOfficial.name}
                  className="w-20 h-24 rounded object-cover border-2 border-slate-900 dark:border-slate-400 shadow-sm shrink-0"
                />
                <div className="space-y-1">
                  <span className="inline-block px-2 py-0.5 bg-bpp-marine text-white text-[10px] font-bold rounded">
                    {selectedOfficial.category}
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {selectedOfficial.name}
                  </h4>
                  <p className="text-xs text-bpp-amber font-semibold">
                    {selectedOfficial.positionTitle}
                  </p>
                  <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    NIP. {selectedOfficial.nip}
                  </p>
                </div>
              </div>

              {/* Legal Basis SK */}
              <div className="p-3 bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded text-xs space-y-1">
                <span className="font-bold text-slate-700 dark:text-slate-300">Dasar Keputusan:</span>
                <p className="font-mono text-bpp-marine dark:text-blue-300">
                  {selectedOfficial.skNumber}
                </p>
              </div>

              {/* Tupoksi */}
              <div>
                <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                  Tugas Pokok & Fungsi (Tupoksi):
                </h5>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {selectedOfficial.tupoksi.map((task, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <ChevronRight className="w-3.5 h-3.5 text-bpp-marine shrink-0 mt-0.5" />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200 dark:border-slate-700">
                <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded">
                  <span className="text-[10px] text-slate-400 block">Email Kedinasan:</span>
                  <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{selectedOfficial.email}</span>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded">
                  <span className="text-[10px] text-slate-400 block">Kontak Dinas:</span>
                  <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{selectedOfficial.phone}</span>
                </div>
              </div>

            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setSelectedOfficial(null)}
                className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 cursor-pointer"
              >
                Tutup
              </button>
              <a
                href={`mailto:${selectedOfficial.email}`}
                className="px-3.5 py-1.5 bg-bpp-marine hover:bg-blue-700 text-white text-xs font-semibold rounded flex items-center gap-1.5 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Kirim Email</span>
              </a>
            </div>

          </div>
        </div>
      )}

      {/* Modal Preview SK */}
      {showSKModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 max-w-2xl w-full shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-bpp-marine" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Pratinjau Lembar Keputusan Resmi (Bagan.Doc)
                </h3>
              </div>
              <button
                onClick={() => setShowSKModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto my-4 p-4 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-xs font-serif leading-relaxed text-slate-800 dark:text-slate-200 space-y-3">
              <div className="text-center font-bold font-sans">
                <p className="text-sm">KEMENTERIAN KELAUTAN DAN PERIKANAN REPUBLIK INDONESIA</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">BADAN PENGENDALIAN DAN PENGAWASAN MUTU HASIL KELAUTAN DAN PERIKANAN</p>
                <p className="text-xs text-bpp-marine font-mono mt-1">KEPUTUSAN KEPALA BADAN NOMOR 84/KEP-BPPMHKP/2026</p>
              </div>
              <hr className="border-slate-300 dark:border-slate-700" />
              <p>
                <strong>MENIMBANG:</strong> Bahwa dalam rangka mewujudkan tata kelola pengujian standar mutu hasil kelautan dan perikanan yang efektif, kredibel, dan berintegritas tinggi di lingkungan Balai Uji Standar PPMHKP Jakarta tahun 2026...
              </p>
              <p>
                <strong>MENETAPKAN:</strong><br />
                <strong>KESATU:</strong> Mengangkat Saudara <strong>Ahmad Jauhari, S.St.Pi., M.Sc.</strong> (NIP. 198212312006041003) sebagai Pejabat Administrator / Kepala Balai Uji Standar PPMHKP Jakarta.<br />
                <strong>KEDUA:</strong> Mengangkat Saudara <strong>Zaenal Arifin, A.Md</strong> (NIP. 197905182003121002) sebagai Pejabat Pengawas / Kepala Subbagian Umum.<br />
                <strong>KETIGA:</strong> Mengangkat Ketua dan Koordinator Kelompok Jabatan Fungsional dan Pelaksana:<br />
                - Saudari <strong>Dini Fajriyani, S.Pi., M.Pi</strong> sebagai Ketua Tim Kerja Pengembangan Teknik dan Metode Uji Kesehatan Ikan MKHP.<br />
                - Saudara <strong>Iswadi Idris, S.Si</strong> sebagai Koordinator Fungsional.<br />
                - Saudara <strong>Sigit Hendra Irawan P., S.Pi</strong> sebagai Ketua Tim Kerja Penerapan Standar Metode Uji Kesehatan Ikan MKHP.
              </p>
              <p className="text-right italic">
                Ditetapkan di Jakarta, tanggal 15 Januari 2026.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setShowSKModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={handleDownloadDoc}
                className="px-4 py-1.5 bg-bpp-amber hover:bg-bpp-amber-hover text-white text-xs font-bold rounded flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh File Bagan.Doc</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
