import React, { useState, useEffect } from 'react';
import type { Translations, Language } from './translations';

export interface CustomAvatarConfig {
  enabled: boolean;
  avatarType: 'icon' | 'letter' | 'photo';
  initial: string;
  bgColor: string;
  iconColor: string;
  photoURL?: string;
}

export const PRESET_AVATAR_COLORS = [
  { name: 'Google Blue', hex: '#1a73e8' },
  { name: 'Google Green', hex: '#137333' },
  { name: 'Google Red', hex: '#c5221f' },
  { name: 'Google Orange', hex: '#e37400' },
  { name: 'Google Purple', hex: '#8430ce' },
  { name: 'Google Teal', hex: '#007b83' },
  { name: 'Google Pink', hex: '#b80672' },
  { name: 'Forest Green', hex: '#0d652d' },
  { name: 'Dark Gray (Resmi)', hex: '#444746' },
  { name: 'Midnight Dark', hex: '#202124' },
];

const POPULAR_INITIALS = ['R', 'A', 'B', 'D', 'G', 'J', 'K', 'M', 'S', 'T'];

export const GoogleDefaultAvatar: React.FC<{
  size?: number;
  className?: string;
  color?: string;
}> = ({
  size = 20,
  className = '',
  color = '#444746',
}) => {
  return (
    <svg
      viewBox="0 0 48 48"
      className={`flex-shrink-0 select-none ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer ring */}
      <circle cx="24" cy="24" r="20" stroke={color} strokeWidth="3.5" fill="none" />
      {/* Head */}
      <circle cx="24" cy="17" r="6.8" fill={color} />
      {/* Shoulders curved along the inner circle */}
      <path
        d="M10 38.2C13 30 18 27.5 24 27.5s11 2.5 14 10.7A20 20 0 0 1 10 38.2Z"
        fill={color}
      />
    </svg>
  );
};

interface SecretAvatarPanelProps {
  config: CustomAvatarConfig;
  onChange: (config: CustomAvatarConfig) => void;
  email?: string;
  t: Translations;
  lang: Language;
}

export const SecretAvatarPanel: React.FC<SecretAvatarPanelProps> = ({
  config,
  onChange,
  email,
  t,
  lang,
}) => {
  const [localConfig, setLocalConfig] = useState<CustomAvatarConfig>({
    enabled: config.enabled ?? false,
    avatarType: config.avatarType ?? 'icon',
    initial: config.initial || 'R',
    bgColor: config.bgColor || '#1a73e8',
    iconColor: config.iconColor || '#444746',
    photoURL: config.photoURL || '',
  });

  const [showSavedToast, setShowSavedToast] = useState(false);

  useEffect(() => {
    setLocalConfig({
      enabled: config.enabled ?? false,
      avatarType: config.avatarType ?? 'icon',
      initial: config.initial || 'R',
      bgColor: config.bgColor || '#1a73e8',
      iconColor: config.iconColor || '#444746',
      photoURL: config.photoURL || '',
    });
  }, [config]);

  const updateField = <K extends keyof CustomAvatarConfig>(field: K, val: CustomAvatarConfig[K]) => {
    const updated = { ...localConfig, [field]: val };
    setLocalConfig(updated);
    onChange(updated);
  };

  const handleSave = () => {
    onChange(localConfig);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
    }, 2500);
  };

  const handleReset = () => {
    const resetConfig: CustomAvatarConfig = {
      enabled: false,
      avatarType: 'icon',
      initial: 'R',
      bgColor: '#1a73e8',
      iconColor: '#444746',
      photoURL: '',
    };
    setLocalConfig(resetConfig);
    onChange(resetConfig);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
    }, 2500);
  };

  const renderPreviewAvatar = (size: number) => {
    if (localConfig.avatarType === 'photo' && localConfig.photoURL) {
      return (
        <img
          src={localConfig.photoURL}
          alt="Preview"
          className="rounded-full object-cover select-none"
          style={{ width: `${size}px`, height: `${size}px` }}
        />
      );
    }

    if (localConfig.avatarType === 'letter') {
      const fontSize = Math.max(10, Math.round(size * 0.5));
      return (
        <div
          className="rounded-full flex items-center justify-center font-medium text-white shadow-sm select-none"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: localConfig.bgColor || '#1a73e8',
            fontSize: `${fontSize}px`,
          }}
        >
          {(localConfig.initial || 'R').toUpperCase().slice(0, 2)}
        </div>
      );
    }

    // Default icon
    return (
      <GoogleDefaultAvatar
        size={size}
        color={localConfig.iconColor || '#444746'}
      />
    );
  };

  return (
    <div className="w-full max-w-[480px] bg-white rounded-[24px] border border-gray-200/80 shadow-md p-6 sm:p-7 relative transition-all">
      {/* Secret Badge Header */}
      <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-amber-50 text-amber-800 border border-amber-200/70 uppercase">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
              <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
            </svg>
            {lang === 'id' ? 'Fitur Rahasia' : 'Secret Feature'}
          </span>
          <span className="text-[11px] text-gray-500 font-medium">
            {localConfig.enabled ? (
              <span className="text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {t.secretFeatureActive}
              </span>
            ) : (
              <span className="text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {lang === 'id' ? 'Ikon Resmi Google Aktif' : 'Official Google Icon Active'}
              </span>
            )}
          </span>
        </div>

        {/* Master Toggle */}
        <label className="relative inline-flex items-center cursor-pointer select-none">
          <input
            type="checkbox"
            checked={localConfig.enabled}
            onChange={(e) => updateField('enabled', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0b57d0]"></div>
        </label>
      </div>

      <div className="mb-4">
        <h3 className="text-[17px] font-semibold text-[#1f1f1f] tracking-tight">
          {lang === 'id' ? 'Pengaturan Avatar Foto Profil Akun' : 'Account Profile Avatar Settings'}
        </h3>
        <p className="text-[13px] text-[#444746] mt-0.5 leading-snug">
          {lang === 'id' 
            ? 'Pilih ikon akun Google resmi (seperti pada foto), inisial huruf berwarna, atau foto kustom.' 
            : 'Choose between the official Google account icon (from photo), colored letter initials, or custom photo.'}
        </p>
      </div>

      {/* Format Selector Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-100 rounded-xl mb-4">
        <button
          type="button"
          onClick={() => {
            updateField('avatarType', 'icon');
            if (!localConfig.enabled) updateField('enabled', true);
          }}
          className={`py-2 px-1 text-[12px] font-medium rounded-lg transition text-center ${
            localConfig.avatarType === 'icon'
              ? 'bg-white text-[#1f1f1f] shadow-xs'
              : 'text-[#444746] hover:text-[#1f1f1f]'
          }`}
        >
          {lang === 'id' ? 'Ikon Resmi Foto' : 'Official Photo Icon'}
        </button>
        <button
          type="button"
          onClick={() => {
            updateField('avatarType', 'letter');
            if (!localConfig.enabled) updateField('enabled', true);
          }}
          className={`py-2 px-1 text-[12px] font-medium rounded-lg transition text-center ${
            localConfig.avatarType === 'letter'
              ? 'bg-white text-[#1f1f1f] shadow-xs'
              : 'text-[#444746] hover:text-[#1f1f1f]'
          }`}
        >
          {lang === 'id' ? 'Inisial Huruf' : 'Letter Initial'}
        </button>
        <button
          type="button"
          onClick={() => {
            updateField('avatarType', 'photo');
            if (!localConfig.enabled) updateField('enabled', true);
          }}
          className={`py-2 px-1 text-[12px] font-medium rounded-lg transition text-center ${
            localConfig.avatarType === 'photo'
              ? 'bg-white text-[#1f1f1f] shadow-xs'
              : 'text-[#444746] hover:text-[#1f1f1f]'
          }`}
        >
          {lang === 'id' ? 'Foto Kustom' : 'Custom Photo'}
        </button>
      </div>

      {/* Live Preview Card */}
      <div className="bg-[#f8fafd] rounded-2xl p-4 border border-blue-50 mb-5">
        <div className="text-[12px] font-medium text-gray-500 mb-2 flex items-center justify-between">
          <span>{t.previewLabel}</span>
          <span className="text-[11px] text-[#0b57d0] font-medium">
            {localConfig.avatarType === 'icon' 
              ? (lang === 'id' ? 'Ikon Profil Resmi' : 'Official Profile Icon')
              : localConfig.avatarType === 'letter' 
                ? (lang === 'id' ? 'Inisial Berwarna' : 'Colored Initial') 
                : (lang === 'id' ? 'Foto URL' : 'Photo URL')}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-around gap-4 py-2">
          {/* Large 64px preview */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white shadow-2xs">
              {renderPreviewAvatar(64)}
            </div>
            <span className="text-[11px] text-gray-500 mt-1.5 font-normal">
              {lang === 'id' ? 'Profil (64px)' : 'Profile (64px)'}
            </span>
          </div>

          {/* Medium 36px preview */}
          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-white shadow-2xs">
              {renderPreviewAvatar(36)}
            </div>
            <span className="text-[11px] text-gray-500 mt-1.5 font-normal">
              {lang === 'id' ? 'Tabel (32px)' : 'Table (32px)'}
            </span>
          </div>

          {/* Pill / Chip preview (20px) - EXACT to Image 2! */}
          <div className="flex flex-col items-center">
            <div className="border border-[#747775] bg-white rounded-full h-[32px] pl-[6px] pr-[14px] inline-flex items-center select-none shadow-2xs">
              <div className="w-[20px] h-[20px] flex-shrink-0 flex items-center justify-center">
                {renderPreviewAvatar(20)}
              </div>
              <span className="ml-[10px] font-medium text-[14px] text-[#1f1f1f] leading-none tracking-normal truncate max-w-[130px]">
                {email || 'rukho977@gmail.com'}
              </span>
              <svg viewBox="0 0 10 5" className="w-[10px] h-[5px] text-[#1f1f1f] fill-current flex-shrink-0 ml-[14px]">
                <path d="M0 0l5 5 5-5z" />
              </svg>
            </div>
            <span className="text-[11px] text-gray-500 mt-1.5 font-normal">
              {lang === 'id' ? 'Pill Akun (Persis Foto 2)' : 'Account Pill (Photo 2)'}
            </span>
          </div>
        </div>
      </div>

      {/* Sub-controls based on Avatar Type */}
      {localConfig.avatarType === 'icon' && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[13px] font-medium text-[#1f1f1f]">
              {lang === 'id' ? 'Warna Ikon Profil' : 'Profile Icon Color'}
            </label>
            <span className="text-[12px] font-mono text-gray-500 uppercase">
              {localConfig.iconColor}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {PRESET_AVATAR_COLORS.map((c) => {
              const isSelected = localConfig.iconColor.toLowerCase() === c.hex.toLowerCase();
              return (
                <button
                  key={c.hex}
                  type="button"
                  title={c.name}
                  onClick={() => updateField('iconColor', c.hex)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform ${
                    isSelected ? 'ring-2 ring-offset-2 ring-[#0b57d0] scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                >
                  {isSelected && (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
            <span className="text-[12px] text-gray-600 font-medium">
              {t.customHexLabel}:
            </span>
            <div className="flex items-center gap-2 flex-1">
              <input
                type="color"
                value={localConfig.iconColor.startsWith('#') ? localConfig.iconColor : '#444746'}
                onChange={(e) => updateField('iconColor', e.target.value)}
                className="w-8 h-8 rounded border border-gray-300 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={localConfig.iconColor}
                onChange={(e) => updateField('iconColor', e.target.value)}
                placeholder="#444746"
                className="w-28 px-2.5 py-1 text-[13px] font-mono text-[#1f1f1f] border border-gray-300 rounded focus:outline-none focus:border-[#0b57d0]"
              />
            </div>
          </div>
        </div>
      )}

      {localConfig.avatarType === 'letter' && (
        <>
          <div className="mb-4">
            <label className="block text-[13px] font-medium text-[#1f1f1f] mb-1">
              {t.initialLetterLabel}
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                maxLength={3}
                value={localConfig.initial}
                onChange={(e) => updateField('initial', e.target.value)}
                placeholder="R"
                className="w-20 px-3 py-2 text-[16px] font-semibold text-center uppercase tracking-wider text-[#1f1f1f] border border-gray-300 rounded-lg focus:outline-none focus:border-[#0b57d0]"
              />
              <div className="flex flex-wrap gap-1 flex-1">
                {POPULAR_INITIALS.map((letter) => (
                  <button
                    key={letter}
                    type="button"
                    onClick={() => updateField('initial', letter)}
                    className={`w-7 h-7 text-[12px] font-medium rounded-md transition ${
                      localConfig.initial.toUpperCase() === letter
                        ? 'bg-[#0b57d0] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-5">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[13px] font-medium text-[#1f1f1f]">
                {t.avatarColorLabel}
              </label>
              <span className="text-[12px] font-mono text-gray-500 uppercase">
                {localConfig.bgColor}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {PRESET_AVATAR_COLORS.map((c) => {
                const isSelected = localConfig.bgColor.toLowerCase() === c.hex.toLowerCase();
                return (
                  <button
                    key={c.hex}
                    type="button"
                    title={c.name}
                    onClick={() => updateField('bgColor', c.hex)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform ${
                      isSelected ? 'ring-2 ring-offset-2 ring-[#0b57d0] scale-110' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  >
                    {isSelected && (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
              <span className="text-[12px] text-gray-600 font-medium">
                {t.customHexLabel}:
              </span>
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="color"
                  value={localConfig.bgColor.startsWith('#') ? localConfig.bgColor : '#1a73e8'}
                  onChange={(e) => updateField('bgColor', e.target.value)}
                  className="w-8 h-8 rounded border border-gray-300 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={localConfig.bgColor}
                  onChange={(e) => updateField('bgColor', e.target.value)}
                  placeholder="#1a73e8"
                  className="w-28 px-2.5 py-1 text-[13px] font-mono text-[#1f1f1f] border border-gray-300 rounded focus:outline-none focus:border-[#0b57d0]"
                />
              </div>
            </div>
          </div>
        </>
      )}

      {localConfig.avatarType === 'photo' && (
        <div className="mb-5">
          <label className="block text-[12px] font-medium text-gray-700 mb-1">
            {t.photoUrlOptionalLabel}
          </label>
          <input
            type="text"
            value={localConfig.photoURL || ''}
            onChange={(e) => updateField('photoURL', e.target.value)}
            placeholder={t.photoUrlPlaceholder}
            className="w-full px-3 py-2 text-[13px] text-[#1f1f1f] border border-gray-300 rounded-lg focus:outline-none focus:border-[#0b57d0]"
          />
        </div>
      )}

      {/* Action Buttons & Feedback */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={handleReset}
          className="text-gray-600 hover:text-gray-900 text-[13px] font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
        >
          {lang === 'id' ? 'Reset ke Ikon Resmi' : 'Reset to Official Icon'}
        </button>

        <button
          type="button"
          onClick={handleSave}
          className="bg-[#0b57d0] hover:bg-[#0842a0] text-white text-[13px] font-medium px-5 py-2 rounded-full shadow-sm hover:shadow transition flex items-center gap-1.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
          </svg>
          {t.saveChangesBtn}
        </button>
      </div>

      {/* Saved Toast Banner */}
      {showSavedToast && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#1f1f1f] text-white text-[12px] font-medium px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>{t.settingsSavedToast}</span>
        </div>
      )}
    </div>
  );
};
