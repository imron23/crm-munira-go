# Strategi Migrasi CRM Umrah: Node.js (Express & Next.js JS) ke Go & Next.js TS

## 1. Go Backend Architecture (Clean Architecture)
Struktur folder Backend menggunakan Clean Architecture yang memisahkan antara Logic Bisnis (Domain) dengan Delivery (HTTP) dan Resource (DB/API eksternal).

```text
backend/
├── cmd/
│   └── api/
│       └── main.go              # Entry point aplikasi Go
├── internal/
│   ├── config/                  # Konfigurasi env, database koneksi
│   ├── domain/                  # Entitas/Struct Utama & Interfaces (Tidak ada dependensi ke luar)
│   │   ├── vendor.go            # Struct Vendor, VendorRepository, VendorUsecase
│   │   ├── form.go
│   │   └── lead.go
│   ├── usecase/                 # Business logic, orkestrasi, dan concurrency
│   │   ├── vendor_usecase.go    # Memanggil goroutines untuk Multi-Vendor
│   │   └── form_usecase.go
│   ├── repository/              # Interaksi dengan Database (PostgreSQL)
│   │   ├── postgres/
│   │   │   ├── vendor_repo.go
│   │   │   └── lead_repo.go
│   └── delivery/                # Interaksi dengan dunia luar (HTTP/REST/gRPC)
│       └── http/
│           ├── middleware/      # Auth, Logging, CORS
│           ├── vendor_handler.go# API Handler untuk Vendor
│           └── form_handler.go
├── pkg/                         # Utility/Library yang bisa digunakan berulang
│   ├── logger/
│   └── response/
├── go.mod
└── go.sum
```

## 2. Strategi Memecah 6.000 Baris Kode JS (Frontend)
Untuk memecah Monolith menjadi komponen Next.js (TypeScript) yang modular:

- **Pisahkan Concerns (Pemisahan Tugas):**
  - **`types/`**: Buat file `.d.ts` atau `.ts` khusus untuk menyimpan definisi tipe data (Interfaces) agar seragam di seluruh aplikasi.
  - **`hooks/`**: Pindahkan logika manipulasi state (seperti logika drag-and-drop, validasi, fetch API) ke dalam custom hooks (contoh: `useFormBuilder.ts`).
  - **`components/`**: Pecah UI menjadi bagian-bagian sangat kecil (Atomic Design). Misal: `Button.tsx`, `FormInput.tsx`, `DragDropZone.tsx`.
  - **`services/`**: Bikin layer khusus untuk menembak API backend (misal: `api/vendorService.ts`). Jangan taruh _fetch_ langsung di dalam komponen UI.
  - **Zod & React Hook Form**: Gunakan Zod untuk validasi skema frontend yang bisa di-share type-nya dengan tipe backend.

## 3. Sinkronisasi Tipe Go dan TypeScript
Kunci dari konsistensi adalah menjaga kesamaan definisi antara Struct di Go dan Interface di TypeScript.

**Go Struct (Domain):**
```go
type FormField struct {
    ID       string `json:"id"`
    Type     string `json:"type"`
    Label    string `json:"label"`
    Required bool   `json:"required"`
}
```

**TypeScript Interface (`types/form.ts`):**
```typescript
export interface FormField {
    id: string;
    type: 'text' | 'number' | 'email' | 'select' | 'date';
    label: string;
    required: boolean;
}
```
**Tip Otomatisasi:** Kamu bisa menggunakan _codegen_ seperti `ts-generator` dari Go, atau menggunakan OpenAPI/Swagger untuk menghasilkan interface TypeScript secara otomatis dari API spec backend Go.

## 4. Migration Plan (Strangler Fig Pattern)
Migrasi sekaligus (big bang) sangat berisiko. Gunakan pendekatan Strangler Fig untuk transisi secara bertahap (Zero Downtime):

- **Fase 1: Setup Infrastructure & API Gateway/Reverse Proxy**
  - Siapkan Go Backend dan PostgreSQL di samping Node.js & MongoDB lama.
  - Pasang Nginx atau AWS API Gateway di depan keduanya. Semua _request_ secara default tetap masuk ke Node.js.
- **Fase 2: Sinkronisasi Data (Migration Database)**
  - Buat script migrasi satu arah (One-way Sync) atau CDC (Change Data Capture) dari MongoDB ke PostgreSQL.
  - Pindahkan entitas terkecil terlebih dahulu, seperti `Vendors` dan `Packages` ke Postgres.
- **Fase 3: Migrasikan Endpoint (Strangling)**
  - Tulis ulang API `/api/vendors` dan `/api/forms` di Go.
  - Ubah aturan Nginx/Gateway: Arahkan trafik `/api/vendors` ke service Go, sementara `/api/leads` tetap ke Node.js.
- **Fase 4: Migrasikan Frontend ke Next.js TS**
  - Sambil API dipindah ke Go per-modul, ubah UI dashboard dari React/Next.js JS lama ke Next.js TypeScript. Gunakan Micro-frontend atau proxy Next.js `rewrites()` agar halaman baru dan halaman lama bisa eksis bersama.
- **Fase 5: Cut-off & Decommission**
  - Setelah semua modul (Forms, Leads, Jamaah, Vendors) ter-handle oleh Go dan UI baru selesai, hapus total server Express dan MongoDB.
