-- Seed default admin user jika belum ada (untuk login)
-- Username: Imron23 | Password: Imunira234..
-- Password hash menggunakan bcrypt
INSERT INTO admin_users (username, password_hash, role, full_name, is_active, permissions)
SELECT 'Imron23', '$2a$10$DQweUxcYnsTiXIbc7yEwTOS2TDnLeY4/EFWNQynrYpWjWadhXgToy', 'super_admin', 'Super Admin Imron', true,
  '{"can_delete": true, "can_export": true, "can_manage_team": true, "can_view_revenue": true, "can_view_leads": true, "can_edit_leads": true, "can_view_pages": true, "can_edit_pages": true, "can_view_programs": true, "can_edit_programs": true, "can_view_marketing": true, "can_edit_marketing": true, "can_view_forms": true, "can_edit_forms": true}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM admin_users WHERE username = 'Imron23');

SELECT 'Seed admin user completed!' AS status;