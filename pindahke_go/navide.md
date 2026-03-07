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
-- Skema Database PostgreSQL (ERD) untuk CRM Umrah
-- Menghindari "Orphan Data" dan memastikan relasi yang kuat (Disiplin Data)

-- 1. Table Vendors (Master Vendor)
CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    api_url VARCHAR(255),
    api_key VARCHAR(255),
    status VARCHAR(50) DEFAULT 'ACTIVE', -- ACTIVE, INACTIVE
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table Packages (Paket Umrah dari Vendor terkait)
CREATE TABLE packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(12, 2) NOT NULL,
    departure_date DATE NOT NULL,
    quota INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Table Forms (Konfigurasi Form Builder & Landing Page)
CREATE TABLE forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    -- JSONB sangat berguna untuk menyimpan komponen drag-and-drop dinamis dari aplikasi Go ke UI
    schema_json JSONB NOT NULL DEFAULT '{}'::jsonb, 
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Table Leads (Calon Jamaah yang masuk lewat Form/Landing Page)
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_id UUID REFERENCES forms(id) ON DELETE SET NULL,
    package_id UUID REFERENCES packages(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    -- Menyimpan status lead dalam pipeline CRM
    status VARCHAR(50) DEFAULT 'NEW', -- NEW, FOLLOW_UP, BOOKED, CLOSED_LOST
    follow_up_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Table Jamaah (Customer yang sudah deal / Booked)
CREATE TABLE jamaah (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID UNIQUE REFERENCES leads(id) ON DELETE RESTRICT,
    package_id UUID NOT NULL REFERENCES packages(id) ON DELETE RESTRICT,
    passport_number VARCHAR(100) UNIQUE,
    nik VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    birth_date DATE,
    address TEXT,
    payment_status VARCHAR(50) DEFAULT 'UNPAID', -- UNPAID, PARTIAL, PAID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes untuk pencarian yang lebih cepat
CREATE INDEX idx_leads_phone ON leads(phone_number);
CREATE INDEX idx_packages_vendor ON packages(vendor_id);
package usecase

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
	"time"

	"munira_crm/internal/domain"
)

// VendorUsecase mengimplementasikan business logic terkait vendor
type vendorUsecase struct {
	vendorRepo domain.VendorRepository
	httpClient *http.Client
}

// NewVendorUsecase adalah constructor
func NewVendorUsecase(repo domain.VendorRepository) domain.VendorUsecase {
	return &vendorUsecase{
		vendorRepo: repo,
		httpClient: &http.Client{Timeout: 10 * time.Second}, // Selalu berikan timeout!
	}
}

// FetchAllVendorPackages mengambil ketersediaan paket umrah dari 3 vendor secara Concurrent
func (u *vendorUsecase) FetchAllVendorPackages(ctx context.Context) ([]domain.VendorPackageResponse, error) {
	// 1. Ambil list API Vendor yang aktif dari PostgreSQL 
	vendors, err := u.vendorRepo.GetActiveVendors(ctx)
	if err != nil {
		return nil, err
	}

	var wg sync.WaitGroup
	var mu sync.Mutex // Untuk menghindari race condition saat append ke slice
	var allPackages []domain.VendorPackageResponse

	// Channel untuk mengumpulkan error jika ada yang gagal, tapi ini opsional 
	// Di sini kita pilih "Fire and Collect", kumpulkan yang berhasil saja.

	// 2. Tembak API masing-masing Vendor menggunakan Goroutines
	for _, v := range vendors {
		wg.Add(1)
		go func(vendor domain.Vendor) {
			defer wg.Done()

			// Panggil API External
			packages, fetchErr := u.fetchFromExternalVendor(ctx, vendor)
			if fetchErr != nil {
				// Cukup log error-nya, jangan matikan goroutine lain
				fmt.Printf("[Error] Gagal konek ke vendor %s: %v\n", vendor.Name, fetchErr)
				return
			}

			// Aman untuk Append menggunakan Mutex
			mu.Lock()
			allPackages = append(allPackages, packages...)
			mu.Unlock()
		}(v)
	}

	// 3. Tunggu semua panggilan dari vendorA, vendorB, vendorC selesai
	wg.Wait()

	return allPackages, nil
}

// fungsi pembantu untuk menembak API vendor
func (u *vendorUsecase) fetchFromExternalVendor(ctx context.Context, v domain.Vendor) ([]domain.VendorPackageResponse, error) {
	req, err := http.NewRequestWithContext(ctx, "GET", v.APIURL+"/api/packages", nil)
	if err != nil {
		return nil, err
	}
	
	req.Header.Set("Authorization", "Bearer "+v.APIKey)

	resp, err := u.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("vendor API error: status %d", resp.StatusCode)
	}

	var data []domain.VendorPackageResponse
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return nil, err
	}

	return data, nil
}
import React from 'react';

// === TYPES ===
// Ini adalah TypeScript Interface yang tersinkronisasi dengan Go Struct dari tabel 'forms' JSONB schema
export interface FormField {
  id: string;
  type: 'text' | 'number' | 'email' | 'select' | 'date';
  label: string;
  required: boolean;
  options?: string[]; // Untuk tipe select
}

export interface FormConfig {
  id: string;
  title: string;
  slug: string;
  fields: FormField[];
}

// === CUSTOM HOOK ===
// Mengisolasi logika dari UI
function useFormBuilder(initialConfig: FormConfig) {
  const [fields, setFields] = React.useState<FormField[]>(initialConfig.fields);

  // Contoh fungsi drag-and-drop / add field (Logic)
  const addField = (newField: FormField) => {
    setFields((prev) => [...prev, newField]);
  };

  const removeField = (id: string) => {
    setFields((prev) => prev.filter((field) => field.id !== id));
  };

  // Logic untuk save ke API (Go Backend)
  const saveForm = async () => {
    try {
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...initialConfig,
          fields,
        }),
      });
      if (response.ok) alert('Form Saved Successfully!');
    } catch (error) {
      console.error('Failed to save form', error);
    }
  };

  return { fields, addField, removeField, saveForm };
}

// === UI COMPONENT (MODULAR) ===
// Komponen super modular, hanya bertugas menampilkan (Render)
export default function FormBuilder() {
  const { fields, addField, removeField, saveForm } = useFormBuilder({
    id: 'form-123',
    title: 'Pendaftaran Umrah Premium',
    slug: 'pendaftaran-umrah-premium',
    fields: [],
  });

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-slate-800">Form Builder 🛠️</h2>
        <button 
          onClick={saveForm}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition duration-200"
        >
          Simpan Skema
        </button>
      </div>

      <div className="flex gap-8">
        {/* Toolbox / Sidebar - Komponen Modular */}
        <div className="w-1/3 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h3 className="font-semibold text-slate-700 mb-4">Tambahkan Field</h3>
          <button
            onClick={() => addField({ id: Date.now().toString(), type: 'text', label: 'Nama Lengkap', required: true })}
            className="w-full mb-3 bg-white border border-slate-300 px-4 py-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-400 rounded-md transition duration-150 shadow-sm text-left"
          >
            + Text Input
          </button>
          <button
            onClick={() => addField({ id: Date.now().toString(), type: 'email', label: 'Email', required: false })}
            className="w-full bg-white border border-slate-300 px-4 py-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-400 rounded-md transition duration-150 shadow-sm text-left"
          >
            + Email Input
          </button>
        </div>

        {/* Drop Zone / Canvas - Tampilan Utama */}
        <div className="w-2/3 p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50 min-h-[400px]">
          {fields.length === 0 ? (
            <p className="text-gray-400 text-center mt-32">Area Drag and Drop (Kosong)</p>
          ) : (
            <div className="space-y-4">
              {fields.map((field) => (
                <div key={field.id} className="flex justify-between items-center bg-white p-4 shadow-sm border border-gray-100 rounded-lg group">
                  <div className="flex-1">
                    <span className="font-medium text-slate-700">{field.label}</span> 
                    <span className="ml-2 text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full">{field.type}</span>
                    <span className="ml-2 text-xs text-red-500">{field.required && '* Wajib'}</span>
                  </div>
                  <button 
                    onClick={() => removeField(field.id)}
                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition duration-150"
                    aria-label="Remove"
                  >
                     ✕ 
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
