-- Migration: Upgrade leads table to full CRM schema
-- Adds all columns expected by the Go backend (from MongoDB-style schema)

-- Add CRM columns to leads (keep existing name/phone_number for compatibility)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS user_id VARCHAR(100) DEFAULT '';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS nama_lengkap VARCHAR(255) DEFAULT '';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS whatsapp_num VARCHAR(50) DEFAULT '';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS domisili VARCHAR(255) DEFAULT '';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS yang_berangkat VARCHAR(100) DEFAULT '';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS paket_pilihan VARCHAR(255) DEFAULT '';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS kesiapan_paspor VARCHAR(100) DEFAULT '';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS fasilitas_utama VARCHAR(255) DEFAULT '';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_source VARCHAR(255) DEFAULT '';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_medium VARCHAR(255) DEFAULT '';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_campaign VARCHAR(255) DEFAULT '';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS landing_page VARCHAR(255) DEFAULT '';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS form_source VARCHAR(255) DEFAULT '';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS status_followup VARCHAR(100) DEFAULT 'New Data';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS catatan TEXT DEFAULT '';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS revenue BIGINT DEFAULT 0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS program_id VARCHAR(100) DEFAULT '';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_contact TIMESTAMP WITH TIME ZONE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS rencana_umrah VARCHAR(255) DEFAULT '';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS assigned_to VARCHAR(100) DEFAULT '';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS assigned_to_name VARCHAR(255) DEFAULT '';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS status_history JSONB DEFAULT '[]'::jsonb;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS lost_reason VARCHAR(255) DEFAULT '';

-- Sync existing data: copy name -> nama_lengkap, phone_number -> whatsapp_num
UPDATE leads SET 
    nama_lengkap = COALESCE(NULLIF(nama_lengkap, ''), name),
    whatsapp_num = COALESCE(NULLIF(whatsapp_num, ''), phone_number),
    status_followup = CASE 
        WHEN status = 'NEW' THEN 'New Data'
        ELSE COALESCE(NULLIF(status_followup, ''), status)
    END
WHERE true;

-- Index for better query performance
CREATE INDEX IF NOT EXISTS idx_leads_status_followup ON leads(status_followup);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);

SELECT 'Migration completed!' AS status;
SELECT column_name FROM information_schema.columns WHERE table_name = 'leads' ORDER BY ordinal_position;
