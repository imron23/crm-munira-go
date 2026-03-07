# 🕌 Munira World — Marketing Engine & CRM Dashboard

> **Stack**: Node.js + Express + MongoDB (Mongoose) + Vanilla HTML/CSS/JS  
> **Versi**: 2.0.0 | Diperbarui: Maret 2026

---

## 🚀 Quick Start

### Development (Lokal)
```bash
# 1. Install dependencies
npm install

# 2. Salin dan isi environment variables
cp reff/env.example .env
# Edit .env sesuai kebutuhan

# 3. Pastikan MongoDB berjalan di localhost:27017

# 4. Jalankan server
npm run dev
```

Akses:
- **Dashboard CRM**: http://localhost:3000/dashboard
- **LP Default**: http://localhost:3000
- **API Health**: http://localhost:3000/api/health

### Production (Docker Compose)
```bash
# Build & jalankan semua service (app + MongoDB)
docker-compose up -d --build

# Cek logs
docker-compose logs -f munira-crm

# Akses (port 5500 → internal 3000)
# Dashboard: http://localhost:5500/dashboard
```

---

## 📂 Struktur Proyek

```
munira-crm/
├── 📁 reff/                    ← 📌 REFERENSI INTEGRASI (mulai di sini!)
│   ├── README_INTEGRASI.md     ← Panduan lengkap integrasi LP
│   ├── PROMPT_MIGRASI.md       ← Template prompt AI untuk migrasi
│   ├── SCHEMA_LEADS.md         ← Dokumentasi kolom database
│   ├── API_ENDPOINTS.md        ← Referensi semua endpoint API
│   ├── Lead.model.js           ← Schema model Lead
│   ├── AdminUser.model.js      ← Schema model User
│   ├── Form.model.js           ← Schema form builder
│   ├── Program.model.js        ← Schema program marketing
│   ├── leads.routes.js         ← API routes lead
│   ├── server.entry.js         ← Entry point server
│   ├── form-submit.script.js   ← Contoh submit form dari LP
│   ├── docker-compose.ref.yml  ← Referensi Docker Compose
│   ├── Dockerfile.ref          ← Referensi Dockerfile
│   └── env.example             ← Template environment variables
│
├── 📁 server/                  ← Backend Express.js
│   ├── index.js                ← Entry point server
│   ├── models/                 ← Mongoose models
│   ├── routes/                 ← API route handlers
│   ├── middleware/             ← JWT auth & sanitizer
│   └── db/                    ← Database connection
│
├── 📁 dashboard/               ← Admin CRM Dashboard
│   ├── index.html              ← UI Dashboard
│   ├── app.js                  ← Logika dashboard (vanilla JS)
│   └── style.css               ← Styling glassmorphic
│
├── 📁 shared/                  ← Komponen yang dipakai LP
│   ├── form/                   ← Form umrah (multi-step)
│   └── lp-cover.js             ← Cover/hero LP
│
├── 📁 lp-liburan/             ← Landing Page program Liburan
├── 📁 lp-bakti-anak/           ← Landing Page program Bakti Anak
├── 📁 lp-itikaf-premium/       ← Landing Page program Itikaf
│
├── index.html                  ← LP Default (homepage)
├── .env                        ← Environment variables (gitignored)
├── package.json                ← Dependencies
├── Dockerfile                  ← Docker config
├── docker-compose.yml          ← Docker Compose config
└── DOKUMENTASI.md              ← Panduan pengguna CRM
```

---

## 🔗 Integrasi LP Baru → CRM

**Punya LP sendiri dan ingin integrasikan ke CRM ini?**

1. Buka folder `reff/`
2. Baca `README_INTEGRASI.md` untuk panduan lengkap
3. Gunakan `PROMPT_MIGRASI.md` untuk minta bantuan AI

**Intinya cuma 2 hal yang wajib dari LP ke CRM:**
- `nama_lengkap` (nama calon jamaah)
- `whatsapp_num` (nomor WA, hanya angka)

---

## 🔐 Default Login

| Username | Password | Role |
|----------|----------|------|
| `Imron23` | `Imunira234..` | super_admin |

> ⚠️ Ganti password di `.env` sebelum production!

---

## 📊 Fitur CRM

| Fitur | Keterangan |
|-------|------------|
| **Lead Management** | CRUD lengkap + status pipeline |
| **Multi-Role** | super_admin, admin, sales, viewer |
| **Team Management** | Assign lead ke sales tertentu |
| **Status History** | Log setiap perubahan status |
| **Revenue Tracking** | Input + akumulasi revenue per lead |
| **Telegram Alert** | Notifikasi lead baru & status update |
| **Import CSV** | Bulk import data lead |
| **Export CSV** | Download data ke Excel |
| **Form Builder** | Buat form dinamis untuk LP |
| **WA Rotator** | Distribusi lead ke sales secara bergilir |
| **PWA Support** | Bisa di-install di HP |

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | Vanilla HTML, CSS, JavaScript |
| Backend | Node.js 20, Express.js 4 |
| Database | MongoDB 7, Mongoose 8 |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Container | Docker, Docker Compose |

---

## 📝 Seed Data (Testing)

```bash
# Seed 100 leads (MongoDB)
node seed_100_leads_mongo.js

# Seed dalam Rupiah
node seed_rp_leads.js
```

> Hapus data seed sebelum production!

---

## 📞 Bantuan

- Baca `DOKUMENTASI.md` untuk panduan pengguna
- Baca `reff/README_INTEGRASI.md` untuk panduan developer
- Gunakan `reff/PROMPT_MIGRASI.md` untuk bantuan AI
