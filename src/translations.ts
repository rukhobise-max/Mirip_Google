export type Language = 'id' | 'en';

export interface Translations {
  // Footer
  languageName: string;
  help: string;
  privacy: string;
  terms: string;

  // Header / Top
  google: string;
  manageGoogleAccount: string;
  signOutReset: string;
  googleUserDefault: string;
  manageAccountAlert: string;

  // Step 1: Email / Login
  loginTitle: string;
  loginSubtitle: string;
  emailOrPhoneLabel: string;
  forgotEmail: string;
  guestModeText: string;
  learnMoreGuestMode: string;
  createAccount: string;
  next: string;
  enterEmailOrPhoneError: string;
  loginFailedError: string;

  // Step 2: Password / Welcome Back
  welcomeBackTitle: string;
  forgotPasswordNotice: string;
  updatePasswordBtn: string;
  continueBtn: string;
  enterPasswordError: string;
  passwordMin8Error: string;
  passwordMismatchError: string;
  wrongPasswordError: string;

  // Step 3: Change Password
  changePasswordTitle: string;
  createStrongPasswordHeading: string;
  createStrongPasswordDesc: string;
  createPasswordLabel: string;
  confirmPasswordLabel: string;
  atLeast8Chars: string;
  showPassword: string;
  skipBtn: string;
  savePasswordBtn: string;

  // Step 4: Success (Signed In)
  successTitle: string;
  successSubtitle: string;
  loadingGmail: string;
  recentEmails: string;
  noEmailsFound: string;
  noSubject: string;
  unknownSender: string;
  successNewPasswordNotice: string;
  doneBtn: string;

  // Step 5: Payment
  paymentTitle: string;
  paymentSubtitle: string;
  qrCodeActive: string;
  apiKeyNotConfigured: string;
  qrInstructions: string;
  backToStartBtn: string;

  // Step 6: Security Checkup / Error
  cantSignInTitle: string;
  unrecognizedDeviceMsg1: string;
  unrecognizedDeviceMsg2: string;
  learnMore: string;

  // Security Checkup Dashboard
  securityCheckupTitle: string;
  securityCheckupTips: string;
  continueToGoogleAccount: string;

  // Security items
  devicesTitle: string;
  devicesSubDone: string;
  devicesSubWarning: string;
  devicesContentDone: string;
  thisAndroidPhone: string;
  activeDeviceNow: string;
  unrecognizedWindowsDevice: string;
  jakartaActiveAgo: string;
  someoneMayHaveAccessed: string;
  yesItWasMe: string;
  signOutDevice: string;

  recoveryTitle: string;
  recoverySubDone: string;
  recoverySubWarning: string;
  recoveryContentDone: string;
  recoveryDescription: string;
  recoveryInputPlaceholder: string;
  addBtn: string;

  passwordsTitle: string;
  passwordsSubDone: string;
  passwordsSubWarning: string;
  passwordsContentDone: string;
  passwordsWarningDesc: string;
  checkUpdatePasswordsBtn: string;

  safeBrowsingTitle: string;
  safeBrowsingSubDone: string;
  safeBrowsingSubWarning: string;
  safeBrowsingContentDone: string;
  safeBrowsingWarningDesc: string;
  turnOnNowBtn: string;

  recentActivityTitle: string;
  recentActivitySub: string;
  newSignInOnChrome: string;
  todayCountry: string;
  noOtherSuspiciousActivity: string;

  connectedAppsTitle: string;
  connectedAppsSub: string;
  connectedAppsDesc: string;
  appDriveAccess: string;
  appPublicProfile: string;
  appBasicProfile: string;
  allAppsVerified: string;

  gmailSettingsTitle: string;
  gmailSettingsSub: string;
  emailForwardingDisabled: string;
  emailForwardingDisabledDesc: (email: string) => string;

  // Secret Avatar Customizer
  secretFeatureTitle: string;
  secretFeatureDesc: string;
  secretFeatureToggle: string;
  secretFeatureActive: string;
  secretFeatureInactive: string;
  initialLetterLabel: string;
  initialLetterHint: string;
  avatarColorLabel: string;
  customHexLabel: string;
  previewLabel: string;
  resetDefaultBtn: string;
  saveChangesBtn: string;
  settingsSavedToast: string;
  quickPresetsLabel: string;
  photoUrlOptionalLabel: string;
  photoUrlPlaceholder: string;
}

export const translations: Record<Language, Translations> = {
  id: {
    // Footer
    languageName: 'Indonesia',
    help: 'Bantuan',
    privacy: 'Privasi',
    terms: 'Persyaratan',

    // Header / Top
    google: 'Google',
    manageGoogleAccount: 'Kelola Akun Google Anda',
    signOutReset: 'Keluar / Reset Alur',
    googleUserDefault: 'Pengguna Google',
    manageAccountAlert: 'Fitur kelola akun Google Anda',

    // Step 1: Email / Login
    loginTitle: 'Login',
    loginSubtitle: 'Gunakan Akun Google Anda',
    emailOrPhoneLabel: 'Email atau nomor telepon',
    forgotEmail: 'Lupa email?',
    guestModeText: 'Bukan komputer Anda? Gunakan mode Tamu untuk login secara pribadi. ',
    learnMoreGuestMode: 'Pelajari lebih lanjut cara menggunakan Mode tamu',
    createAccount: 'Buat akun',
    next: 'Berikutnya',
    enterEmailOrPhoneError: 'Masukkan alamat email atau nomor telepon',
    loginFailedError: 'Gagal masuk menggunakan Google.',

    // Step 2: Password / Welcome Back
    welcomeBackTitle: 'Selamat datang kembali',
    forgotPasswordNotice: 'Anda dapat memperbarui sandi Anda sekarang jika Anda lupa.',
    updatePasswordBtn: 'Perbarui sandi',
    continueBtn: 'Lanjutkan',
    enterPasswordError: 'Masukkan sandi',
    passwordMin8Error: 'Sandi harus minimal 8 karakter',
    passwordMismatchError: 'Sandi tidak cocok. Harap coba lagi.',
    wrongPasswordError: 'Sandi salah. Coba lagi atau klik Lupa sandi untuk meresetnya.',

    // Step 3: Change Password
    changePasswordTitle: 'Ubah sandi',
    createStrongPasswordHeading: 'Buat sandi yang kuat',
    createStrongPasswordDesc: 'Buat sandi baru yang kuat dan tidak Anda gunakan untuk situs lain',
    createPasswordLabel: 'Buat sandi',
    confirmPasswordLabel: 'Konfirmasi',
    atLeast8Chars: 'Minimal 8 karakter',
    showPassword: 'Tampilkan sandi',
    skipBtn: 'Lewati',
    savePasswordBtn: 'Simpan sandi',

    // Step 4: Success
    successTitle: 'Berhasil Login',
    successSubtitle: 'Anda telah login dengan data akun Google yang valid.',
    loadingGmail: 'Memuat data Gmail...',
    recentEmails: 'Email Terbaru Anda',
    noEmailsFound: 'Tidak ada email ditemukan.',
    noSubject: '(Tanpa Subjek)',
    unknownSender: 'Tidak diketahui',
    successNewPasswordNotice: 'Anda sekarang dapat menggunakan sandi baru Anda untuk login.',
    doneBtn: 'Selesai',

    // Step 5: Payment
    paymentTitle: 'Verifikasi Pembayaran',
    paymentSubtitle: 'Selesaikan pembayaran melalui QRIS ShopeePay Merchant.',
    qrCodeActive: 'QR Code Aktif',
    apiKeyNotConfigured: 'API Key Belum Dikonfigurasi',
    qrInstructions: 'Pindai QR code ini menggunakan aplikasi Shopee atau aplikasi e-wallet lainnya yang mendukung QRIS untuk menyelesaikan verifikasi pembayaran merchant.',
    backToStartBtn: 'Kembali ke Awal',

    // Step 6: Security Checkup / Error
    cantSignInTitle: 'Tidak dapat memproses login Anda',
    unrecognizedDeviceMsg1: 'Anda mencoba login di perangkat yang tidak dikenali oleh Google, dan kami tidak memiliki cukup informasi untuk memverifikasi ini benar-benar Anda. Untuk perlindungan Anda, Anda tidak dapat login di sini saat ini.',
    unrecognizedDeviceMsg2: 'Coba lagi dari perangkat atau lokasi tempat Anda login sebelumnya.',
    learnMore: 'Pelajari lebih lanjut',

    // Security Checkup Dashboard
    securityCheckupTitle: 'Pemeriksaan Keamanan',
    securityCheckupTips: 'Berikut tips untuk Anda',
    continueToGoogleAccount: 'Lanjutkan ke Akun Google Anda',

    // Security items
    devicesTitle: 'Perangkat Anda',
    devicesSubDone: 'Selesai didiagnosis',
    devicesSubWarning: 'Selesaikan 2 tindakan yang disarankan',
    devicesContentDone: 'Semua perangkat Anda aman. Anda telah keluar dari sesi tidak dikenal.',
    thisAndroidPhone: 'HP Android ini (Xiaomi Redmi Note 10)',
    activeDeviceNow: 'Perangkat aktif saat ini • Indonesia',
    unrecognizedWindowsDevice: 'Perangkat Windows tidak dikenal',
    jakartaActiveAgo: 'Jakarta, Indonesia • Aktif 3 jam yang lalu',
    someoneMayHaveAccessed: 'Seseorang mungkin telah mengakses akun Anda.',
    yesItWasMe: 'Ya, itu saya',
    signOutDevice: 'Keluar dari perangkat',

    recoveryTitle: 'Login & pemulihan',
    recoverySubDone: 'Email pemulihan ditambahkan',
    recoverySubWarning: 'Tambahkan email pemulihan',
    recoveryContentDone: 'Email pemulihan berhasil ditambahkan dan diamankan.',
    recoveryDescription: 'Email pemulihan membantu Anda masuk kembali ke akun jika ada aktivitas mencurigakan atau jika Anda lupa sandi.',
    recoveryInputPlaceholder: 'Masukkan email pemulihan',
    addBtn: 'Tambahkan',

    passwordsTitle: 'Sandi Anda yang tersimpan',
    passwordsSubDone: 'Sandi diperiksa dan aman',
    passwordsSubWarning: 'Periksa sandi Anda',
    passwordsContentDone: 'Semua sandi Anda yang tersimpan telah diperbarui dan aman.',
    passwordsWarningDesc: 'Terdapat 3 sandi yang lemah atau disusupi pada Pengelola Sandi Google Anda.',
    checkUpdatePasswordsBtn: 'Periksa & Perbarui Sandi',

    safeBrowsingTitle: 'Safe Browsing',
    safeBrowsingSubDone: 'Safe Browsing yang Disempurnakan aktif',
    safeBrowsingSubWarning: 'Aktifkan Safe Browsing yang Disempurnakan',
    safeBrowsingContentDone: 'Safe Browsing yang Disempurnakan telah diaktifkan untuk perlindungan ekstra.',
    safeBrowsingWarningDesc: 'Dapatkan perlindungan yang lebih cepat dan proaktif terhadap situs web, unduhan, dan ekstensi yang berbahaya.',
    turnOnNowBtn: 'Aktifkan sekarang',

    recentActivityTitle: 'Aktivitas keamanan terbaru',
    recentActivitySub: 'Aktivitas dari 28 hari terakhir',
    newSignInOnChrome: 'Masuk baru di perangkat Chrome pada Windows',
    todayCountry: 'Hari ini • Indonesia',
    noOtherSuspiciousActivity: 'Tidak ada aktivitas mencurigakan lainnya dalam 28 hari terakhir.',

    connectedAppsTitle: 'Aplikasi tertaut Anda',
    connectedAppsSub: '3 aplikasi tertaut memiliki akses ke beberapa data Akun Google Anda',
    connectedAppsDesc: 'Aplikasi berikut memiliki akses sebagian ke info Akun Google Anda:',
    appDriveAccess: 'WhatsApp Messenger (Akses Google Drive)',
    appPublicProfile: 'Spotify (Info profil publik)',
    appBasicProfile: 'Netflix (Info profil dasar)',
    allAppsVerified: 'Semua aplikasi telah diverifikasi dan aman.',

    gmailSettingsTitle: 'Setelan Gmail',
    gmailSettingsSub: '1 setelan sensitif',
    emailForwardingDisabled: 'Penerusan email dinonaktifkan',
    emailForwardingDisabledDesc: (email: string) =>
      `Penerusan otomatis email masuk dinonaktifkan untuk email ${email || 'user@gmail.com'}.`,

    // Secret Avatar Customizer
    secretFeatureTitle: 'Fitur Rahasia: Pengaturan Avatar Akun',
    secretFeatureDesc: 'Atur inisial huruf dan warna latar belakang foto profil akun Google sesuai keinginan Anda.',
    secretFeatureToggle: 'Aktifkan Avatar Kustom',
    secretFeatureActive: 'Aktif',
    secretFeatureInactive: 'Tidak Aktif (Gunakan Default)',
    initialLetterLabel: 'Inisial Huruf Avatar',
    initialLetterHint: 'Masukkan 1 atau 2 huruf (misal: R, A, G, dll)',
    avatarColorLabel: 'Pilihan Warna Avatar',
    customHexLabel: 'Kode Warna Bebas / Hex',
    previewLabel: 'Pratinjau Avatar',
    resetDefaultBtn: 'Kembalikan ke Default',
    saveChangesBtn: 'Simpan Pengaturan',
    settingsSavedToast: 'Pengaturan avatar kustom berhasil disimpan!',
    quickPresetsLabel: 'Preset Warna Cepat',
    photoUrlOptionalLabel: 'URL Foto Profil (Opsional)',
    photoUrlPlaceholder: 'https://contoh.com/foto-anda.jpg',
  },

  en: {
    // Footer
    languageName: 'English (United States)',
    help: 'Help',
    privacy: 'Privacy',
    terms: 'Terms',

    // Header / Top
    google: 'Google',
    manageGoogleAccount: 'Manage your Google Account',
    signOutReset: 'Sign out / Reset Flow',
    googleUserDefault: 'Google User',
    manageAccountAlert: 'Manage your Google Account feature',

    // Step 1: Email / Login
    loginTitle: 'Sign in',
    loginSubtitle: 'Use your Google Account',
    emailOrPhoneLabel: 'Email or phone',
    forgotEmail: 'Forgot email?',
    guestModeText: 'Not your computer? Use Guest mode to sign in privately. ',
    learnMoreGuestMode: 'Learn more about using Guest mode',
    createAccount: 'Create account',
    next: 'Next',
    enterEmailOrPhoneError: 'Enter an email or phone number',
    loginFailedError: 'Failed to sign in with Google.',

    // Step 2: Password / Welcome Back
    welcomeBackTitle: 'Welcome back',
    forgotPasswordNotice: 'You can update your password now if you forgot it.',
    updatePasswordBtn: 'Update password',
    continueBtn: 'Continue',
    enterPasswordError: 'Enter a password',
    passwordMin8Error: 'Password must be at least 8 characters',
    passwordMismatchError: 'Passwords do not match. Please try again.',
    wrongPasswordError: 'Wrong password. Try again or click Forgot password to reset it.',

    // Step 3: Change Password
    changePasswordTitle: 'Change password',
    createStrongPasswordHeading: 'Create a strong password',
    createStrongPasswordDesc: "Create a new, strong password that you don't use for other websites",
    createPasswordLabel: 'Create password',
    confirmPasswordLabel: 'Confirm',
    atLeast8Chars: 'At least 8 characters',
    showPassword: 'Show password',
    skipBtn: 'Skip',
    savePasswordBtn: 'Save password',

    // Step 4: Success
    successTitle: 'Signed In Successfully',
    successSubtitle: 'You have signed in with valid Google account data.',
    loadingGmail: 'Loading Gmail data...',
    recentEmails: 'Your Recent Emails',
    noEmailsFound: 'No emails found.',
    noSubject: '(No Subject)',
    unknownSender: 'Unknown',
    successNewPasswordNotice: 'You can now use your new password to sign in.',
    doneBtn: 'Done',

    // Step 5: Payment
    paymentTitle: 'Payment Verification',
    paymentSubtitle: 'Complete the payment via QRIS ShopeePay Merchant.',
    qrCodeActive: 'QR Code Active',
    apiKeyNotConfigured: 'API Key Not Configured',
    qrInstructions: 'Scan this QR code using the Shopee app or other e-wallet apps that support QRIS to complete merchant payment verification.',
    backToStartBtn: 'Back to Start',

    // Step 6: Security Checkup / Error
    cantSignInTitle: "Couldn't sign you in",
    unrecognizedDeviceMsg1: "You're trying to sign in on a device Google doesn't recognize, and we don't have enough information to verify that it's really you. For your protection, you can't sign in here right now.",
    unrecognizedDeviceMsg2: "Try again from a device or location where you've signed in before.",
    learnMore: 'Learn more',

    // Security Checkup Dashboard
    securityCheckupTitle: 'Security Checkup',
    securityCheckupTips: 'Here are tips for you',
    continueToGoogleAccount: 'Continue to your Google Account',

    // Security items
    devicesTitle: 'Your devices',
    devicesSubDone: 'Diagnosis complete',
    devicesSubWarning: 'Complete 2 recommended actions',
    devicesContentDone: 'All your devices are secure. You have signed out of unrecognized sessions.',
    thisAndroidPhone: 'This Android phone (Xiaomi Redmi Note 10)',
    activeDeviceNow: 'Current active device • United States',
    unrecognizedWindowsDevice: 'Unrecognized Windows device',
    jakartaActiveAgo: 'Jakarta, Indonesia • Active 3 hours ago',
    someoneMayHaveAccessed: 'Someone may have accessed your account.',
    yesItWasMe: 'Yes, it was me',
    signOutDevice: 'Sign out of device',

    recoveryTitle: 'Sign-in & recovery',
    recoverySubDone: 'Recovery email added',
    recoverySubWarning: 'Add recovery email',
    recoveryContentDone: 'Recovery email successfully added and secured.',
    recoveryDescription: 'A recovery email helps you get back into your account if there is suspicious activity or if you forget your password.',
    recoveryInputPlaceholder: 'Enter recovery email',
    addBtn: 'Add',

    passwordsTitle: 'Your saved passwords',
    passwordsSubDone: 'Passwords checked and secure',
    passwordsSubWarning: 'Check your passwords',
    passwordsContentDone: 'All your saved passwords have been updated and are secure.',
    passwordsWarningDesc: 'There are 3 weak or compromised passwords in your Google Password Manager.',
    checkUpdatePasswordsBtn: 'Check & Update Passwords',

    safeBrowsingTitle: 'Safe Browsing',
    safeBrowsingSubDone: 'Enhanced Safe Browsing is on',
    safeBrowsingSubWarning: 'Turn on Enhanced Safe Browsing',
    safeBrowsingContentDone: 'Enhanced Safe Browsing has been enabled for extra protection.',
    safeBrowsingWarningDesc: 'Get faster, proactive protection against dangerous websites, downloads, and extensions.',
    turnOnNowBtn: 'Turn on now',

    recentActivityTitle: 'Recent security activity',
    recentActivitySub: 'Activity from the last 28 days',
    newSignInOnChrome: 'New sign-in on Chrome on Windows',
    todayCountry: 'Today • Indonesia',
    noOtherSuspiciousActivity: 'No other suspicious activity in the last 28 days.',

    connectedAppsTitle: 'Your connected apps',
    connectedAppsSub: '3 connected apps have access to some of your Google Account data',
    connectedAppsDesc: 'The following apps have partial access to your Google Account info:',
    appDriveAccess: 'WhatsApp Messenger (Google Drive access)',
    appPublicProfile: 'Spotify (Public profile info)',
    appBasicProfile: 'Netflix (Basic profile info)',
    allAppsVerified: 'All apps are verified and secure.',

    gmailSettingsTitle: 'Gmail settings',
    gmailSettingsSub: '1 sensitive setting',
    emailForwardingDisabled: 'Email forwarding is off',
    emailForwardingDisabledDesc: (email: string) =>
      `Automatic forwarding of incoming emails is disabled for ${email || 'user@gmail.com'}.`,

    // Secret Avatar Customizer
    secretFeatureTitle: 'Secret Feature: Account Avatar Customizer',
    secretFeatureDesc: 'Freely customize the initial letter and background color for your Google profile photo.',
    secretFeatureToggle: 'Enable Custom Avatar',
    secretFeatureActive: 'Active',
    secretFeatureInactive: 'Inactive (Use Default)',
    initialLetterLabel: 'Avatar Initial Letter',
    initialLetterHint: 'Enter 1 or 2 letters (e.g. R, A, G, etc.)',
    avatarColorLabel: 'Avatar Color Choice',
    customHexLabel: 'Custom Color / Hex Code',
    previewLabel: 'Avatar Live Preview',
    resetDefaultBtn: 'Reset to Default',
    saveChangesBtn: 'Save Settings',
    settingsSavedToast: 'Custom avatar settings saved successfully!',
    quickPresetsLabel: 'Quick Color Presets',
    photoUrlOptionalLabel: 'Custom Photo URL (Optional)',
    photoUrlPlaceholder: 'https://example.com/your-photo.jpg',
  },
};
