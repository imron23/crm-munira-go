-- Migration: Upgrade forms table to match Form Builder FE + Go backend
-- Frontend mengirim: name, is_active, success_message, success_redirect_url, rotator_mode, fields, wa_rotator
-- Schema 02 punya: title, slug, schema_json - perlu diselaraskan

-- Tambah kolom yang dibutuhkan (jika tabel forms punya schema lama: title, slug, schema_json)
DO $$
BEGIN
    -- Jika kolom 'name' belum ada, tambahkan
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'forms' AND column_name = 'name') THEN
        ALTER TABLE forms ADD COLUMN name VARCHAR(255) DEFAULT '';
        UPDATE forms SET name = COALESCE(title, '') WHERE name = '' OR name IS NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'forms' AND column_name = 'fields') THEN
        ALTER TABLE forms ADD COLUMN fields JSONB DEFAULT '[]'::jsonb;
        UPDATE forms SET fields = COALESCE(schema_json, '[]'::jsonb) WHERE fields = '[]'::jsonb OR fields IS NULL;
    END IF;
END $$;

-- Kolom tambahan dari Form Builder
ALTER TABLE forms ADD COLUMN IF NOT EXISTS success_message TEXT DEFAULT '';
ALTER TABLE forms ADD COLUMN IF NOT EXISTS success_redirect_url VARCHAR(500) DEFAULT '';
ALTER TABLE forms ADD COLUMN IF NOT EXISTS rotator_mode VARCHAR(50) DEFAULT 'round_robin';
ALTER TABLE forms ADD COLUMN IF NOT EXISTS wa_rotator JSONB DEFAULT '[]'::jsonb;

-- Pastikan is_active ada (sudah ada di schema 02)
ALTER TABLE forms ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Untuk fresh install: jika tabel forms belum punya name/fields (hanya title/slug/schema_json),
-- buat kolom fields sebagai JSONB (bukan TEXT) agar konsisten
-- Note: form_repo Go saat ini pakai fields sebagai string - kita akan simpan JSON string di Go, 
-- atau ubah repo untuk terima JSONB. Lebih mudah: simpan sebagai JSONB di PG, baca sebagai json.RawMessage/string di Go.

SELECT 'Migration 08_forms_crm_upgrade completed!' AS status;
