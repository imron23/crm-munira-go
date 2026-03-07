# 📘 Dokumentasi Munira CRM — Panduan Pengguna

> **Munira World Marketing Engine & CRM Dashboard**  
> Versi: 1.0.0 | Terakhir diperbarui: Maret 2026

---

## 📋 Daftar Isi

1. [Apa itu Munira CRM?](#apa-itu-munira-crm)
2. [Cara Login](#cara-login)
3. [Navigasi Dashboard](#navigasi-dashboard)
4. [Halaman Overview](#halaman-overview)
5. [Halaman Leads](#halaman-leads)
6. [Cara Update Status Lead](#cara-update-status-lead)
7. [Cara Input Revenue](#cara-input-revenue)
8. [Cara Input Manual Order](#cara-input-manual-order)
9. [Halaman Landing Pages & Program](#halaman-landing-pages--program)
10. [Cara Tambah Program Baru](#cara-tambah-program-baru)
11. [Halaman Marketing Settings](#halaman-marketing-settings)
12. [Export Data ke CSV/Excel](#export-data-ke-csvexcel)
13. [WhatsApp Follow-Up Templates](#whatsapp-follow-up-templates)
14. [Dark Mode / Light Mode](#dark-mode--light-mode)
15. [Spesifikasi Teknis Aplikasi](#spesifikasi-teknis-aplikasi)
16. [FAQ & Troubleshooting](#faq--troubleshooting)

---

## Apa itu Munira CRM?

Munira CRM adalah **sistem Customer Relationship Management** khusus untuk bisnis travel umrah Munira World. Aplikasi ini mencakup:

- **Landing Page** — halaman marketing yang menangkap data calon jamaah
- **Dashboard CRM** — tempat admin mengelola lead, follow-up, dan closing
- **Notifikasi Telegram** — alert otomatis saat lead baru masuk
- **WhatsApp Integration** — template follow-up langsung ke WhatsApp

---

## Cara Login

1. Buka `http://localhost:5500/dashboard` (lokal) atau URL server Anda
2. Masukkan **Username** dan **Password** admin
3. Klik **Sign In**
4. Anda akan langsung masuk ke halaman **Overview**

> ⚠️ Jika lupa password, hubungi developer untuk reset via environment variable.

---

## Navigasi Dashboard

Sidebar kiri memiliki 4 menu utama:

| Menu | Ikon | Fungsi |
|------|------|--------|
| **Overview** | 📊 | Dashboard KPI, chart, dan ringkasan bisnis |
| **Leads** | 👥 | Tabel semua lead, filter, update status |
| **Landing Pages** | 📄 | Kelola program & lihat landing page aktif |
| **Marketing** | ⚙️ | Pengaturan Telegram notifikasi |

---

## Halaman Overview

Menampilkan **8 KPI Card** utama:

| KPI | Keterangan |
|-----|-----------|
| **Total Leads** | Jumlah seluruh lead yang masuk |
| **Today's Inquiries** | Lead yang masuk hari ini |
| **Order Complete** | Lead dengan status DP + Order Complete |
| **Lost** | Lead yang hilang / gagal closing |
| **CVR%** | Conversion Rate = (DP + Order Complete) / Total × 100% |
| **Total Revenue** | Akumulasi revenue dari semua lead DP & Order Complete |
| **Total Sales** | Jumlah transaksi (paket terjual) |
| **Repeat Customer** | Customer yang menghubungi lebih dari 1x |

### Chart yang tersedia:

1. **Leads Trend** — Grafik harian jumlah lead masuk (7 hari terakhir)
2. **Package Breakdown** — Distribusi pilihan paket
3. **Sales Funnel** — Distribusi status lead dalam pipeline
4. **Leads by City** — Distribusi lead berdasarkan kota/domisili

### Filter by Date:
- Gunakan **Start Date** dan **End Date** di bagian atas untuk memfilter data berdasarkan periode tertentu

---

## Halaman Leads

### Kolom Tabel:

| Kolom | Isi |
|-------|-----|
| **Lead ID** | ID unik + sumber landing page |
| **Kota / Domisili** | Kota asal calon jamaah |
| **Date** | Tanggal masuk + "x ago" |
| **Contact Info** | Nama + nomor WhatsApp (klik untuk chat) |
| **Travel Info** | Paket pilihan + jumlah pax |
| **Program** | Program marketing yang dipilih |
| **Status** | Status pipeline saat ini |
| **Actions** | Tombol Detail & WhatsApp |

### Daftar Status:

| Status | Warna | Keterangan |
|--------|-------|-----------|
| 🔵 **New Data** | Biru | Lead baru masuk, belum dihubungi |
| 🟢 **Contacted** | Hijau | Sudah dihubungi pertama kali |
| 🟡 **Nego Harga** | Kuning | Sedang negosiasi harga |
| 🔵 **Proses FU** | Biru | Dalam proses follow-up aktif |
| 🟣 **Negosiasi** | Ungu | Tahap negosiasi lanjut |
| 🟡 **DP** | Amber | Sudah bayar DP (revenue dihitung) |
| 🟢 **Order Complete** | Hijau | Deal selesai (revenue dihitung) |
| 🔴 **Lost** | Merah | Lead hilang / tidak berminat |
| 🌹 **Pembatalan** | Rose | Pesanan dibatalkan |
| 🟠 **Pengembalian** | Oranye | Proses pengembalian dana |

### Filter & Pencarian:
- **Dropdown Status** — filter tampilan berdasarkan status tertentu
- **Search Bar** — cari nama, WhatsApp, atau domisili
- **Per page** — atur jumlah baris per halaman (20, 50, 100, All)

---

## Cara Update Status Lead

### Cara 1: Inline (Cepat)
1. Klik **Detail** pada lead di tabel
2. Di bagian **Histori & Log Status**, pilih status baru dari dropdown
3. (Opsional) Ketik catatan di kolom teks
4. (Opsional) Pilih **Program** dari dropdown
5. Jika status = **DP** atau **Order Complete**, isi kolom **Revenue Rp**
6. Klik **Save**

### Cara 2: Full Edit Modal
1. Klik **Detail** → klik tombol **✏️ Edit**
2. Modal terbuka dengan semua field:
   - Status
   - Program
   - Catatan
   - Revenue (muncul otomatis jika status DP / Order Complete)
3. Klik **Save Changes**

> 💡 Revenue hanya bisa diinput saat status **DP** atau **Order Complete**

---

## Cara Input Revenue

Revenue adalah **nilai transaksi dalam Rupiah** untuk setiap lead.

- Revenue **hanya muncul** saat status diubah ke **DP** atau **Order Complete**
- Masukkan angka tanpa titik/koma (contoh: `35000000` untuk Rp 35 juta)
- Step input: Rp 100.000
- Revenue terakumulasi otomatis di KPI **Total Revenue** di Overview

### Contoh:
| Lead | Status | Revenue |
|------|--------|---------|
| Pak Ahmad | DP | Rp 15.000.000 |
| Bu Siti | Order Complete | Rp 45.000.000 |
| **Total Revenue** | | **Rp 60.000.000** |

---

## Cara Input Manual Order

Untuk **memasukkan order secara manual** (misalnya customer datang langsung atau repeat order untuk paket berbeda):

1. Buka halaman **Leads**
2. Klik tombol **+ Manual Order** (di samping Export)
3. Isi form:
   - **Nama Lengkap** *(wajib)*
   - **WhatsApp** *(wajib)*
   - **Domisili** — Kota asal
   - **Jumlah Berangkat** — Contoh: "2 Pax"
   - **Paket Pilihan** — Nama paket
   - **Kesiapan Paspor** — Sudah Ada / Belum Ada / Dalam Proses
   - **Program** — Pilih program marketing
   - **Status** — Set langsung ke DP / Order Complete jika sudah deal
   - **Revenue** — Muncul jika status DP / Order Complete
   - **Catatan** — Catatan internal admin
4. Klik **Simpan Order**

> 💡 **Skenario Repeat Order**: Jika customer yang sama ingin beli paket berbeda, cukup input manual baru dengan WhatsApp yang sama. Sistem akan membuat ID baru sehingga setiap order tercatat terpisah.

---

## Halaman Landing Pages & Program

### Bagian 1: Program Aktif
Menampilkan **poster program marketing** yang sedang aktif. Poster ini akan ditampilkan di landing page utama.

### Bagian 2: Landing Pages
Menampilkan daftar **landing page** yang tersedia beserta thumbnail dan jumlah lead.

---

## Cara Tambah Program Baru

1. Buka halaman **Landing Pages**
2. Klik **+ Tambah Program**
3. Isi form:
   - **Nama Program** *(wajib)* — Contoh: "Umrah Liburan Sekolah 2026"
   - **URL Poster** — Paste link gambar (hosting/Google Drive/Imgur)
   - **Deskripsi Singkat** — Penjelasan program
   - **Link Landing Page** — Path ke halaman terkait
   - **Urutan** — Angka untuk sorting (0 = teratas)
   - **Status** — Aktif / Nonaktif
4. Klik **Simpan**

### Mengelola Program:
- **✏️ Edit** — Ubah detail program
- **👁️ Toggle** — Aktifkan / Nonaktifkan tanpa menghapus
- **🗑️ Hapus** — Hapus permanen (dengan konfirmasi)

---

## Halaman Marketing Settings

Pengaturan untuk **notifikasi Telegram** otomatis:

1. **Bot Token** — Token dari BotFather Telegram
2. **Chat ID** — ID grup atau user untuk menerima notifikasi

Setiap lead baru masuk dari landing page, notifikasi otomatis terkirim ke Telegram.

---

## Export Data ke CSV/Excel

1. Buka halaman **Leads**
2. Klik tombol **Export**
3. File CSV akan terdownload otomatis
4. Buka file dengan **Excel** atau **Google Sheets**

Data yang diekspor: semua kolom lengkap termasuk status, revenue, catatan, dll.

---

## WhatsApp Follow-Up Templates

Di bagian **Detail** setiap lead, tersedia 4 template FU:

| Template | Keterangan |
|----------|-----------|
| **T1: Kirim Katalog** | Pesan pembuka + link katalog/brosur |
| **T2: Follow-Up** | Pesan follow-up lanjutan |
| **T3: Promo** | Penawaran promo terbatas |
| **T4: Reminder** | Pengingat untuk customer yang belum respon |

### Cara pakai:
1. (Opsional) Paste **link Drive / Brosur PDF** di kolom yang tersedia
2. Klik salah satu template
3. WhatsApp Web terbuka otomatis dengan pesan yang sudah ditulis
4. Tinggal klik **Send**

---

## Dark Mode / Light Mode

- Klik ikon **🌙 bulan** di header untuk toggle
- **Default**: Dark Mode (glassmorphic macOS Tahoe style)
- Preferensi tersimpan otomatis di browser

---

## Spesifikasi Teknis Aplikasi

### Arsitektur

```
munira-crm/
├── dashboard/           # Admin CRM Dashboard
│   ├── index.html       # UI Dashboard
│   ├── app.js           # Logic Dashboard
│   └── style.css        # Styling (Glassmorphic Tahoe)
├── server/              # Backend API
│   ├── index.js         # Express Server
│   ├── schema.sql       # Database Schema
│   ├── routes/
│   │   ├── leads.js     # CRUD Leads API
│   │   ├── programs.js  # CRUD Programs API
│   │   ├── auth.js      # Authentication API
│   │   ├── pages.js     # Landing Pages API
│   │   └── settings.js  # Settings API
│   ├── db/
│   │   ├── init.js      # DB Init + Migrations
│   │   └── index.js     # DB Connection
│   └── middleware/
│       └── auth.js      # JWT Auth Middleware
├── lp-*/                # Landing Pages (per program)
├── index.html           # Default Landing Page
├── Dockerfile           # Docker Config
└── docker-compose.yml   # Docker Compose
```

### Tech Stack

| Komponen | Teknologi |
|----------|----------|
| **Frontend** | Vanilla HTML/CSS/JS, Chart.js |
| **Backend** | Node.js, Express.js |
| **Database** | SQLite (better-sqlite3) |
| **Auth** | JWT (jsonwebtoken), bcryptjs |
| **Container** | Docker, Docker Compose |
| **Hosting** | Self-hosted / VPS |

### Database Tables

| Tabel | Fungsi |
|-------|--------|
| `leads` | Data semua lead/customer |
| `programs` | Program marketing (poster, nama, URL) |
| `admin_users` | Akun admin |
| `settings` | Pengaturan (Telegram bot, dll) |

### API Endpoints

| Method | Endpoint | Auth | Fungsi |
|--------|----------|------|--------|
| POST | `/api/leads` | 🔓 Public | Lead masuk dari landing page |
| POST | `/api/leads/manual` | 🔒 Admin | Manual order admin |
| GET | `/api/leads` | 🔒 Admin | List semua lead |
| PUT | `/api/leads/:id` | 🔒 Admin | Update status, revenue, program |
| DELETE | `/api/leads/:id` | 🔒 Admin | Hapus lead |
| POST | `/api/auth/login` | 🔓 Public | Login admin |
| GET | `/api/programs` | 🔒 Admin | List semua program |
| GET | `/api/programs/active` | 🔓 Public | Program aktif (landing page) |
| POST | `/api/programs` | 🔒 Admin | Tambah program |
| PUT | `/api/programs/:id` | 🔒 Admin | Update program |
| DELETE | `/api/programs/:id` | 🔒 Admin | Hapus program |
| GET | `/api/pages` | 🔒 Admin | List landing pages |
| GET/PUT | `/api/settings` | 🔒 Admin | Pengaturan |

### Environment Variables

| Variable | Default | Keterangan |
|----------|---------|-----------|
| `PORT` | 3000 | Port server |
| `DB_PATH` | `/app/data/munira.db` | Path database SQLite |
| `ADMIN_USER` | Imron23 | Username admin |
| `ADMIN_PASS` | *(secret)* | Password admin |

### Port Mapping

| Service | Internal | External |
|---------|----------|----------|
| Munira CRM | 3000 | 5500 |

---

## FAQ & Troubleshooting

### Q: Data tidak muncul setelah update?
**A:** Tekan `Cmd+Shift+R` (Hard Refresh) untuk clear cache browser.

### Q: Revenue tidak bisa diisi?
**A:** Revenue hanya dapat diisi jika status = **DP** atau **Order Complete**. Ubah status terlebih dahulu.

### Q: Bagaimana jika customer beli paket berbeda?
**A:** Gunakan fitur **Manual Order** untuk membuat entry baru. Nomor WA boleh sama, sistem akan memberikan ID baru terpisah.

### Q: Notifikasi Telegram tidak masuk?
**A:** Pastikan:
1. BOT TOKEN sudah benar di halaman Marketing
2. CHAT ID sudah benar (chat ID pribadi atau grup)
3. Bot sudah di-add ke grup (jika menggunakan grup)

### Q: Bagaimana deploy ke server?
**A:** 
```bash
# Di server, jalankan:
docker-compose up -d --build

# Untuk update:
git pull origin main
docker-compose stop && docker-compose build && docker-compose up -d
```

---

> 📞 **Support**: Hubungi developer jika membutuhkan bantuan teknis.
