-- Fix Login - Run this SQL in EasyPanel database
-- This will create/update admin user with correct password

-- Delete existing user if exists
DELETE FROM admin_users WHERE username = 'Imron23';

-- Insert new admin user with bcrypt hashed password
-- Password: Imunira234..
-- Hash generated with bcrypt cost 10
INSERT INTO admin_users (
    id, 
    username, 
    password_hash, 
    role, 
    full_name, 
    is_active, 
    permissions,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'Imron23',
    '$2a$10$DQweUxcYnsTiXIbc7yEwTOS2TDnLeY4/EFWNQynrYpWjWadhXgToy',
    'super_admin',
    'Super Admin Imron',
    true,
    '{"can_delete": true, "can_export": true, "can_manage_team": true, "can_view_revenue": true, "can_view_leads": true, "can_edit_leads": true, "can_view_pages": true, "can_edit_pages": true, "can_view_programs": true, "can_edit_programs": true, "can_view_marketing": true, "can_edit_marketing": true, "can_view_forms": true, "can_edit_forms": true}'::jsonb,
    NOW(),
    NOW()
);

-- Verify the user was created
SELECT id, username, role, is_active FROM admin_users WHERE username = 'Imron23';