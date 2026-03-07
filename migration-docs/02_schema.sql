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
