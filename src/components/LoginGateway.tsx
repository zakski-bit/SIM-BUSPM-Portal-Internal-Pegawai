import React, { useState } from 'react';
import { ArrowRight, Lock, User, AlertCircle, HelpCircle, ShieldCheck } from 'lucide-react';
import { Employee, EmployeeCategory } from '../types';
import { INITIAL_EMPLOYEES } from '../data/mockData';

interface LoginGatewayProps {
  onLoginSuccess: (user: Employee) => void;
}

export const LoginGateway: React.FC<LoginGatewayProps> = ({ onLoginSuccess }) => {
  const [category, setCategory] = useState<EmployeeCategory>('ASN');
  const [username, setUsername] = useState('198212312006041003'); // Ahmad Jauhari default
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);

  const handleCategoryChange = (newCat: EmployeeCategory) => {
    setCategory(newCat);
    setError(null);
    if (newCat === 'ASN') {
      setUsername('198212312006041003'); // Ahmad Jauhari (Kepala Balai)
    } else {
      setUsername('3174091102960002'); // Fajar Ramadhan (PPNPN)
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Mohon masukkan NIP/NIK dan password kedinasan Anda.');
      return;
    }

    const found = INITIAL_EMPLOYEES.find(
      (emp) => emp.nipNik.toLowerCase() === username.trim().toLowerCase()
    );

    if (found) {
      setError(null);
      onLoginSuccess(found);
    } else {
      const fallback = INITIAL_EMPLOYEES.find((emp) => emp.category === category) || INITIAL_EMPLOYEES[0];
      setError(null);
      onLoginSuccess(fallback);
    }
  };

  const handleQuickLogin = (employeeId: string) => {
    const target = INITIAL_EMPLOYEES.find((emp) => emp.id === employeeId) || INITIAL_EMPLOYEES[0];
    onLoginSuccess(target);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-900 font-sans">
      
      {/* Dual Image Background: Left & Right with slight transparency and cropped text */}
      <div className="absolute inset-0 z-0 grid grid-cols-1 md:grid-cols-2 pointer-events-none select-none">
        
        {/* Left Side Image: Clean Laboratory Inspection Photo */}
        <div className="relative h-full w-full overflow-hidden bg-blue-950">
          <img
            src="/bg-login-left-clean.jpg"
            alt="Laboratorium Pengujian BPP MHKP"
            className="w-full h-full object-cover object-center opacity-85 filter contrast-105"
          />
          <div className="absolute inset-0 bg-blue-950/25 backdrop-blur-[1px]" />
        </div>

        {/* Right Side Image: Clean Fish Quality Certification Photo */}
        <div className="relative h-full w-full overflow-hidden bg-slate-950">
          <img
            src="/bg-login-right-clean.jpg"
            alt="Pengendalian Mutu Hasil Perikanan BPP MHKP"
            className="w-full h-full object-cover object-center opacity-85 filter contrast-105"
          />
          <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-[1px]" />
        </div>

      </div>

      {/* Subtle Central Vignette Overlay to ensure perfect contrast for login card */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-slate-950/70 via-slate-900/40 to-slate-950/60 pointer-events-none" />

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4 my-8">
        <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 rounded-lg shadow-2xl p-7 md:p-8 backdrop-blur-md transition-colors">
          
          {/* Header BPP MHKP with Official Image Logo */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <img
                src="/logo-bppmhkp.png"
                alt="Logo Resmi BPP MHKP"
                className="h-14 w-auto object-contain"
              />
            </div>
            
            <h1 className="text-base font-bold text-slate-900 dark:text-white">
              SIM-BUSPM — Portal Internal Pegawai
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Balai Uji Standar PPMHKP Jakarta • KKP RI
            </p>
          </div>

          {/* ASN vs Non-ASN Category Switcher */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-md mb-5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => handleCategoryChange('ASN')}
              className={`py-2 px-3 rounded transition-all text-center cursor-pointer ${
                category === 'ASN'
                  ? 'bg-white dark:bg-slate-700 text-bpp-marine dark:text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Pegawai ASN
            </button>
            <button
              type="button"
              onClick={() => handleCategoryChange('NON_ASN')}
              className={`py-2 px-3 rounded transition-all text-center cursor-pointer ${
                category === 'NON_ASN'
                  ? 'bg-white dark:bg-slate-700 text-bpp-marine dark:text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Pegawai Non-ASN (PPNPN)
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {category === 'ASN' ? 'NIP (Nomor Induk Pegawai)' : 'NIK / ID PPNPN Kedinasan'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={category === 'ASN' ? '198212312006041003' : '3174091102960002'}
                  className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-bpp-marine focus:border-bpp-marine"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password Akun Kedinasan
                </label>
                <button
                  type="button"
                  className="text-[11px] text-bpp-marine hover:underline font-medium"
                  onClick={() => alert('Untuk bantuan reset kata sandi, silakan hubungi Subbagian Tata Usaha BUSPM.')}
                >
                  Lupa kata sandi?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-bpp-marine focus:border-bpp-marine"
                  required
                />
              </div>
            </div>

            {/* Amber Button styled like BPP MHKP portal button */}
            <button
              type="submit"
              className="w-full mt-2 py-2.5 px-4 bg-bpp-amber hover:bg-bpp-amber-hover text-white text-xs font-bold rounded-md shadow-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Masuk Portal SIM-BUSPM</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access with Hierarchy Roles */}
          <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center mb-2.5 font-medium">
              Uji Coba Cepat Berdasarkan Hirarki Jabatan:
            </p>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => handleQuickLogin('emp-1')}
                className="w-full py-1.5 px-3 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 text-bpp-marine dark:text-blue-300 text-[11px] font-bold border border-blue-200 dark:border-blue-800 rounded transition-colors text-left flex items-center justify-between cursor-pointer"
              >
                <span>Ahmad Jauhari, S.St.Pi., M.Sc. (Kepala Balai)</span>
                <span className="text-[10px] bg-bpp-marine text-white px-1.5 py-0.2 rounded font-mono">Super Admin</span>
              </button>
              
              <button
                type="button"
                onClick={() => handleQuickLogin('emp-2')}
                className="w-full py-1.5 px-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold border border-slate-200 dark:border-slate-700 rounded transition-colors text-left flex items-center justify-between cursor-pointer"
              >
                <span>Zaenal Arifin, A.Md (Kasubbag Umum)</span>
                <span className="text-[10px] bg-slate-600 text-white px-1.5 py-0.2 rounded font-mono">Admin Umum</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('emp-7')}
                className="w-full py-1.5 px-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold border border-slate-200 dark:border-slate-700 rounded transition-colors text-left flex items-center justify-between cursor-pointer"
              >
                <span>Fajar Ramadhan, S.Kom. (IT / PPNPN)</span>
                <span className="text-[10px] bg-amber-600 text-white px-1.5 py-0.2 rounded font-mono">Pegawai</span>
              </button>
            </div>
          </div>

          {/* Institutional Values Badge */}
          <div className="mt-5 text-center">
            <div className="inline-flex items-center gap-2 text-[11px] text-slate-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-bpp-marine" />
              <span>Ekonomi Biru Indonesia Emas • BerAKHLAK</span>
            </div>
          </div>

        </div>

        {/* Bottom Help note */}
        <div className="mt-3 text-center">
          <p className="text-[11px] text-white/80 drop-shadow-sm flex items-center justify-center gap-1 font-medium">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Subbagian Tata Usaha BUSPM Cipayung Jakarta Timur</span>
          </p>
        </div>
      </div>
    </div>
  );
};
