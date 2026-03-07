-- ============================================================
-- MUNIRA WORLD CRM — DATABASE SCHEMA
-- ============================================================

CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    user_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    nama_lengkap VARCHAR(255) NOT NULL,
    whatsapp_num VARCHAR(20) NOT NULL,
    domisili VARCHAR(100),
    yang_berangkat VARCHAR(50),
    paket_pilihan VARCHAR(100),
    kesiapan_paspor VARCHAR(50),
    fasilitas_utama TEXT,
    status_followup VARCHAR(50) DEFAULT 'New',
    catatan TEXT,
    utm_source VARCHAR(50),
    utm_medium VARCHAR(50),
    utm_campaign VARCHAR(100),
    landing_page VARCHAR(100),
    revenue INTEGER DEFAULT 0,
    program_id TEXT,
    rencana_umrah VARCHAR(100),
    last_contact TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_users (
    id TEXT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS programs (
    id TEXT PRIMARY KEY,
    nama_program VARCHAR(255) NOT NULL,
    poster_url TEXT,
    deskripsi TEXT,
    landing_url VARCHAR(255),
    departure_dates TEXT,
    is_active INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS program_packages (
    id TEXT PRIMARY KEY,
    program_id TEXT NOT NULL,
    tier VARCHAR(20) NOT NULL,
    room_type VARCHAR(20) NOT NULL,
    price INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(program_id, tier, room_type)
);

CREATE TABLE IF NOT EXISTS page_settings (
    folder TEXT PRIMARY KEY,
    image_url TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
