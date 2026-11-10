import React, { useState, useEffect } from 'react';
import { ArrowRight, Lock, User, AlertCircle, HelpCircle, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { Employee, EmployeeCategory } from '../types';
import { INITIAL_EMPLOYEES } from '../data/mockData';
import { verifyCredentials, recordAuditLog } from '../utils/security';

interface LoginGatewayProps {
  onLoginSuccess: (user: Employee) => void;
  employees?: Employee[];
}

export const LoginGateway: React.FC<LoginGatewayProps> = ({
  onLoginSuccess,
  employees = INITIAL_EMPLOYEES
}) => {
  const [category, setCategory] = useState<EmployeeCategory>('ASN');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  
  // Rate limiting / Brute force prevention (persisted across F5 reload)
  const [failedAttempts, setFailedAttempts] = useState<number>(() => {
    return parseInt(localStorage.getItem('buspm_failed_attempts') || '0', 10);
  });
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(() => {
    const until = parseInt(localStorage.getItem('buspm_lockout_until') || '0', 10);
    return Math.max(0, Math.ceil((until - Date.now()) / 1000));
  });

  useEffect(() => {
    if (lockoutSeconds > 0) {
      const timer = setTimeout(() => {
        const newSecs = lockoutSeconds - 1;
        setLockoutSeconds(newSecs);
        if (newSecs <= 0) {
          localStorage.removeItem('buspm_lockout_until');
          localStorage.removeItem('buspm_failed_attempts');
          setFailedAttempts(0);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [lockoutSeconds]);

  const handleCategoryChange = (newCat: EmployeeCategory) => {
    setCategory(newCat);
    setError(null);
  };

  const registerFailure = (msg: string, attemptedUser: string) => {
    const newAttempts = failedAttempts + 1;
    setFailedAttempts(newAttempts);
    localStorage.setItem('buspm_failed_attempts', newAttempts.toString());
    
    if (newAttempts >= 5) {
      const lockUntil = Date.now() + 30000;
      localStorage.setItem('buspm_lockout_until', lockUntil.toString());
      setLockoutSeconds(30);
      setError('Terlalu banyak percobaan gagal. Akses dibatasi selama 30 detik untuk keamanan sistem.');

      recordAuditLog({
        eventType: 'RATE_LIMITED',
        actorName: attemptedUser || 'ANONYMOUS',
        actorRole: 'ANONYMOUS',
        actorNip: attemptedUser || '-',
        description: `Brute-force lockout aktif selama 30 detik setelah 5 kegagalan autentikasi berturut-turut.`,
        severity: 'CRITICAL'
      });
    } else {
      setError(msg);
      recordAuditLog({
        eventType: 'LOGIN_FAILED',
        actorName: attemptedUser || 'ANONYMOUS',
        actorRole: 'ANONYMOUS',
        actorNip: attemptedUser || '-',
        description: `Percobaan login gagal (${newAttempts}/5): ${msg}`,
        severity: 'WARNING'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;

    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    if (!trimmedUser || !trimmedPass) {
      setError('Mohon masukkan NIP/NIK dan password kedinasan Anda.');
      return;
    }

    // 1. Check if user exists in the system
    const found = employees.find(
      (emp) => emp.nipNik.toLowerCase() === trimmedUser.toLowerCase()
    );

    if (!found) {
      registerFailure(`NIP atau NIK "${trimmedUser}" tidak terdaftar di sistem balai.`, trimmedUser);
      return;
    }

    // 2. Validate password using salted SHA-256 cryptographic hash (Zero Plaintext Passwords)
    const isPasswordValid = await verifyCredentials(trimmedUser, trimmedPass);
    if (!isPasswordValid) {
      registerFailure('Password kedinasan yang Anda masukkan salah. Silakan periksa kembali.', trimmedUser);
      return;
    }

    // Authentication successful
    recordAuditLog({
      eventType: 'LOGIN_SUCCESS',
      actorName: found.name,
      actorRole: found.role,
      actorNip: found.nipNik,
      description: `Autentikasi akun berhasil: ${found.name} (${found.jobTitle})`,
      severity: 'INFO'
    });

    setError(null);
    setFailedAttempts(0);
    localStorage.removeItem('buspm_failed_attempts');
    localStorage.removeItem('buspm_lockout_until');
    onLoginSuccess(found);
  };

  // Secure Quick Select: sets credentials and runs full cryptographic verification (No Auth Bypass!)
  const handleQuickLogin = async (employeeId: string, demoPassword: string = 'password123') => {
    if (lockoutSeconds > 0) return;
    const target = employees.find((emp) => emp.id === employeeId) || employees[0];
    setUsername(target.nipNik);
    setPassword(demoPassword);
    
    // Cryptographic verification check
    const isValid = await verifyCredentials(target.nipNik, demoPassword);
    if (!isValid) {
      registerFailure('Verifikasi kredensial akun uji coba gagal.', target.nipNik);
      return;
    }

    recordAuditLog({
      eventType: 'LOGIN_SUCCESS',
      actorName: target.name,
      actorRole: target.role,
      actorNip: target.nipNik,
      description: `Login akun resmi terverifikasi: ${target.name} (${target.jobTitle})`,
      severity: 'INFO'
    });

    setError(null);
    setFailedAttempts(0);
    localStorage.removeItem('buspm_failed_attempts');
    localStorage.removeItem('buspm_lockout_until');
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
            <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Fields with accessibility id and htmlFor */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="login-username"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                {category === 'ASN' ? 'NIP (Nomor Induk Pegawai)' : 'NIK / ID PPNPN Kedinasan'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="login-username"
                  name="username"
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
                <label
                  htmlFor="login-password"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Password Akun Kedinasan
                </label>
                <button
                  type="button"
                  className="text-[11px] text-bpp-marine hover:underline font-medium cursor-pointer"
                  onClick={() => setShowHelpModal(true)}
                >
                  Bantuan password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-bpp-marine focus:border-bpp-marine"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Amber Button styled like BPP MHKP portal button */}
            <button
              type="submit"
              disabled={lockoutSeconds > 0}
              className={`w-full mt-2 py-2.5 px-4 text-white text-xs font-bold rounded-md shadow-sm transition-all duration-150 flex items-center justify-center gap-2 ${
                lockoutSeconds > 0
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-bpp-amber hover:bg-bpp-amber-hover cursor-pointer'
              }`}
            >
              <span>
                {lockoutSeconds > 0
                  ? `Terkunci (${lockoutSeconds} detik)`
                  : 'Masuk Portal SIM-BUSPM'}
              </span>
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
                id="quick-login-jauhari"
                onClick={() => handleQuickLogin('emp-1')}
                className="w-full py-1.5 px-3 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 text-bpp-marine dark:text-blue-300 text-[11px] font-bold border border-blue-200 dark:border-blue-800 rounded transition-colors text-left flex items-center justify-between cursor-pointer"
              >
                <span>Ahmad Jauhari, S.St.Pi., M.Sc. (Kepala Balai)</span>
                <span className="text-[10px] bg-bpp-marine text-white px-1.5 py-0.2 rounded font-mono">Super Admin</span>
              </button>
              
              <button
                type="button"
                id="quick-login-zaenal"
                onClick={() => handleQuickLogin('emp-2')}
                className="w-full py-1.5 px-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold border border-slate-200 dark:border-slate-700 rounded transition-colors text-left flex items-center justify-between cursor-pointer"
              >
                <span>Zaenal Arifin, A.Md (Kasubbag Umum)</span>
                <span className="text-[10px] bg-slate-600 text-white px-1.5 py-0.2 rounded font-mono">Pegawai</span>
              </button>

              <button
                type="button"
                id="quick-login-fajar"
                onClick={() => handleQuickLogin('emp-7')}
                className="w-full py-1.5 px-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold border border-slate-200 dark:border-slate-700 rounded transition-colors text-left flex items-center justify-between cursor-pointer"
              >
                <span>Fajar Ramadhan, S.Kom. (IT / PPNPN)</span>
                <span className="text-[10px] bg-slate-600 text-white px-1.5 py-0.2 rounded font-mono">Pegawai</span>
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
            <span>Subbagian Umum Balai Uji Standar PPMHKP Cipayung Jakarta</span>
          </p>
        </div>
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 max-w-sm w-full shadow-2xl text-slate-800 dark:text-slate-200">
            <div className="flex items-center gap-2 mb-3 text-bpp-marine font-bold text-sm">
              <HelpCircle className="w-4 h-4 text-bpp-amber" />
              <span>Bantuan Akun & Sandi Kedinasan</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
              Bagi aparatur balai yang lupa kata sandi atau mengalami kendala login, silakan hubungi <strong>Subbagian Umum / Pengelola IT Balai</strong> melalui email: <code>tu.buspm@kkp.go.id</code> atau ekstensi telepon internal <strong>(021) 8499-1234</strong>.
            </p>
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 mb-4">
              *Untuk verifikasi simulasi, gunakan kata sandi kedinasan standar Anda.
            </div>
            <button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2 bg-bpp-marine hover:bg-bpp-marine-dark text-white text-xs font-semibold rounded-md shadow-sm transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
