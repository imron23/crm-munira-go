-- COMPLETE DATABASE SETUP FOR MUNIRA CRM
-- Run this entire script in EasyPanel PostgreSQL database

-- =============================================
-- PART 1: Create Extensions
-- =============================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =============================================
-- PART 2: Base Tables
-- =============================================

-- Vendors
CREATE TABLE IF NOT EXISTS vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    api_url VARCHAR(255),
    api_key VARCHAR(255),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Packages
CREATE TABLE IF NOT EXISTS packages (
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

-- Forms
CREATE TABLE IF NOT EXISTS forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    schema_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Leads
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_id UUID REFERENCES forms(id) ON DELETE SET NULL,
    package_id UUID REFERENCES packages(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    jamaah_usia_detail JSONB,
    status VARCHAR(50) DEFAULT 'NEW',
    follow_up_notes TEXT,
    score INT DEFAULT 0,
    preferences JSONB DEFAULT '{}',
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Jamaah
CREATE TABLE IF NOT EXISTS jamaah (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID UNIQUE REFERENCES leads(id) ON DELETE RESTRICT,
    package_id UUID NOT NULL REFERENCES packages(id) ON DELETE RESTRICT,
    passport_number VARCHAR(100) UNIQUE,
    nik VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    birth_date DATE,
    address TEXT,
    payment_status VARCHAR(50) DEFAULT 'UNPAID',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- PART 3: Admin Users Table (IMPORTANT!)
-- =============================================

CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'sales',
    full_name VARCHAR(255) DEFAULT '',
    email VARCHAR(255) DEFAULT '',
    phone VARCHAR(50) DEFAULT '',
    avatar_initial VARCHAR(10) DEFAULT '',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    permissions JSONB NOT NULL DEFAULT '{"can_delete": false, "can_export": true, "can_manage_team": false, "can_view_revenue": true, "can_view_leads": true, "can_edit_leads": true, "can_view_pages": true, "can_edit_pages": false, "can_view_programs": true, "can_edit_programs": false, "can_view_marketing": true, "can_edit_marketing": false, "can_view_forms": true, "can_edit_forms": false}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- PART 4: Programs Table
-- =============================================

CREATE TABLE IF NOT EXISTS programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama_program VARCHAR(255) NOT NULL,
    poster_url VARCHAR(255) DEFAULT '',
    deskripsi TEXT DEFAULT '',
    landing_url VARCHAR(255) DEFAULT '',
    departure_dates JSONB DEFAULT '[]',
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    packages JSONB DEFAULT '[]',
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    is_restored BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- PART 5: Page Settings Table
-- =============================================

CREATE TABLE IF NOT EXISTS page_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    folder VARCHAR(100) UNIQUE NOT NULL,
    image_url VARCHAR(255) DEFAULT '',
    description TEXT DEFAULT '',
    linked_form_id UUID REFERENCES forms(id) ON DELETE SET NULL,
    linked_program_ids JSONB DEFAULT '[]',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- PART 6: Settings Table
-- =============================================

CREATE TABLE IF NOT EXISTS settings (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- PART 7: Create Indexes
-- =============================================

CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone_number);
CREATE INDEX IF NOT EXISTS idx_packages_vendor ON packages(vendor_id);

-- =============================================
-- PART 8: Insert Admin User (LOGIN FIX!)
-- =============================================

-- Delete if exists
DELETE FROM admin_users WHERE username = 'Imron23';

-- Insert admin user
-- Username: Imron23
-- Password: Imunira234..
INSERT INTO admin_users (
    username, 
    password_hash, 
    role, 
    full_name, 
    is_active, 
    permissions
) VALUES (
    'Imron23',
    '$2a$10$DQweUxcYnsTiXIbc7yEwTOS2TDnLeY4/EFWNQynrYpWjWadhXgToy',
    'super_admin',
    'Super Admin Imron',
    true,
    '{"can_delete": true, "can_export": true, "can_manage_team": true, "can_view_revenue": true, "can_view_leads": true, "can_edit_leads": true, "can_view_pages": true, "can_edit_pages": true, "can_view_programs": true, "can_edit_programs": true, "can_view_marketing": true, "can_edit_marketing": true, "can_view_forms": true, "can_edit_forms": true}'::jsonb
);

-- =============================================
-- PART 9: Verify
-- =============================================

SELECT 'Database setup complete!' AS status;
SELECT id, username, role, is_active FROM admin_users WHERE username = 'Imron23';