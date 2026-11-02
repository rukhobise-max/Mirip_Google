# Pembaruan Foto Profil Kolom Tabel Gmail

Memperbarui foto profil avatar khusus pada kolom daftar pesan/tabel Gmail menggunakan desain avatar profil gelap persis sesuai foto `IMG_3071.webp` yang diunggah pengguna, dengan tetap menjaga keaslian tata letak login Google dan chip akun.

> [!IMPORTANT]
> **Keputusan Pengguna yang Telah Dikonfirmasi (Fase 1 Clarifications):**
> 1. **Cakupan Penempatan**: Diterapkan **hanya pada kolom foto profil di dalam tabel Gmail** (halaman hasil login/step `success`). Chip akun di header tetap mempertahankan ikon profil resmi Google.
> 2. **Format Avatar**: Menggunakan representasi visual persis dari foto `IMG_3071.webp` yang diunggah (avatar melingkar dengan latar belakang gelap/hitam dan siluet figur abu-abu gelap presisi).

---

### 1. Ringkasan & Konsep Utama

- **Fungsi Utama**: Mengganti avatar pengirim email pada daftar tabel Gmail (3 pesan Gmail) dengan avatar berlatar gelap dan siluet presisi berukuran 32×32px yang diambil dari gambar `IMG_3071.webp`.
- **Target Tampilan**: Tampilan tabel Gmail di langkah sukses login (`step === 'success'`) menjadi elegan, serasi, dan presisi di samping nama pengirim (misal: *Google Community Team*, *Google Security*, *Gmail Team*).
- **Nilai Tambah**: Memenuhi preferensi kustomisasi pengguna tanpa mengorbankan konsistensi tata letak login Google resmi yang sudah presisi.

---

### 2. Pengalaman Pengguna & Desain Visual

- **Tampilan Tabel Gmail (`step === 'success'`)**:
  - Setiap baris pesan email di dalam kartu tabel menampilkan avatar profil berukuran 32×32px di sisi kiri nama pengirim dan subjek pesan.
  - Avatar menggunakan latar melingkar bertema gelap (`#16181b`), cincin tepi halus (`#2c3037`), serta siluet kepala (`#2f333a`) dan bahu melengkung yang proporsional.
  - Perataan vertikal tetap berada di posisi tengah (*align-items: center*) dengan jarak padding 14px horizontal dan 12px vertikal per baris pesan.
- **Konsistensi Chip Akun & Header**:
  - Kapsul akun (*account pill*) di bawah judul tetap menampilkan email pengguna (`rukho977@gmail.com`) dengan ikon profil akun standar resmi Google (`#444746`) dan panah dropdown, sesuai hasil konfirmasi bahwa perubahan foto ini hanya difokuskan pada tabel Gmail.
- **Integrasi Fitur Rahasia**:
  - Panel pengaturan rahasia di bagian bawah tetap mempertahankan kontrol kustomisasi avatar dan dapat disinkronkan secara fleksibel.

---

### 3. Keputusan Produk & Analisis Teknis

- **Keputusan 1: Format Vektor SVG Berpresisi Tinggi vs File Bitmap**:
  - *Pendekatan*: Membuat komponen vektor SVG `GmailDarkAvatar` yang menduplikasi setiap elemen gambar `IMG_3071.webp` secara presisi (lingkaran luar, proporsi kepala, dan kurva bahu) dengan dukungan skala responsif.
  - *Alasan*: Vektor SVG bebas buram/pecah (*pixel-perfect*) di semua resolusi layar (Retina/OLED ponsel maupun desktop), dimuat seketika tanpa jeda jaringan, dan tidak berisiko gagal muat.
- **Keputusan 2: Isolasi Komponen Avatar Tabel**:
  - *Pendekatan*: Menggunakan `GmailDarkAvatar` khusus pada mapping baris tabel Gmail di langkah `success`.
  - *Alasan*: Menjamin permintaan pengguna terpenuhi secara akurat (*"Hanya pada kolom foto profil di tabel Gmail"*) tanpa merusak tampilan chip akun login utama.

---

### 4. Arsitektur Teknis & Alur Data

```
┌─────────────────────────────────────────────────────────────┐
│                 App.tsx (Google Account UI)                 │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌──────────────────────────────┐    ┌──────────────────────────────┐
│ Header & Account Pill        │    │ Step: 'success' (Gmail Inbox)│
│ (UserAvatar - Google Official│    └──────────────┬───────────────┘
│  Profile Icon #444746)       │                   │
└──────────────────────────────┘                   ▼
                                    ┌──────────────────────────────┐
                                    │ Gmail Messages Table Rows    │
                                    │ ┌──────────────────────────┐ │
                                    │ │ [IMG_3071 Dark Avatar]   │ │
                                    │ │ Google Community Team    │ │
                                    │ └──────────────────────────┘ │
                                    │ ┌──────────────────────────┐ │
                                    │ │ [IMG_3071 Dark Avatar]   │ │
                                    │ │ Google Security          │ │
                                    │ └──────────────────────────┘ │
                                    │ ┌──────────────────────────┐ │
                                    │ │ [IMG_3071 Dark Avatar]   │ │
                                    │ │ Gmail Team               │ │
                                    │ └──────────────────────────┘ │
                                    └──────────────────────────────┘
```

- **Rencana File & Komponen**:
  1. `src/SecretAvatarPanel.tsx` atau `src/App.tsx`: Menambahkan komponen `GmailDarkAvatar` beresolusi tinggi dengan skema warna dan kurva dari `IMG_3071.webp`.
  2. `src/App.tsx`: Memperbarui baris render tabel Gmail pada `step === 'success'` agar memanggil avatar gelap ini secara langsung dan presisi di samping nama Gmail.
  3. Validasi dengan `compile_applet` dan `lint_applet` untuk menjamin tidak ada kesalahan sintaks maupun regresi build.
