-- Extension for UUID Generation if not already there
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 6. Table AdminUsers (Role-Based Access Control)
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'sales', -- super_admin, admin, sales, viewer, owner
    full_name VARCHAR(255) DEFAULT '',
    email VARCHAR(255) DEFAULT '',
    phone VARCHAR(50) DEFAULT '',
    avatar_initial VARCHAR(10) DEFAULT '',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,

    -- Permissions (flattened for simplicity, or use JSONB)
    permissions JSONB NOT NULL DEFAULT '{"can_delete": false, "can_export": true, "can_manage_team": false, "can_view_revenue": true, "can_view_leads": true, "can_edit_leads": true, "can_view_pages": true, "can_edit_pages": false, "can_view_programs": true, "can_edit_programs": false, "can_view_marketing": true, "can_edit_marketing": false, "can_view_forms": true, "can_edit_forms": false}',

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Table Programs (Umrah Packages display)
CREATE TABLE programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama_program VARCHAR(255) NOT NULL,
    poster_url VARCHAR(255) DEFAULT '',
    deskripsi TEXT DEFAULT '',
    landing_url VARCHAR(255) DEFAULT '',
    departure_dates JSONB DEFAULT '[]', -- Array of {label, start, end}
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    packages JSONB DEFAULT '[]', -- Array of {tier, room_type, price}
    
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    is_restored BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Table PageSettings (Landing Pages mapping)
CREATE TABLE page_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    folder VARCHAR(100) UNIQUE NOT NULL,
    image_url VARCHAR(255) DEFAULT '',
    description TEXT DEFAULT '',
    linked_form_id UUID REFERENCES forms(id) ON DELETE SET NULL,
    linked_program_ids JSONB DEFAULT '[]', -- Array of program UUIDs (JSON or another mapping table)
    is_default BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Table Settings (App-Wide configuration like Whatsapp keys, etc.)
CREATE TABLE settings (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
