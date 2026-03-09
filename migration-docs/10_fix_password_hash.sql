-- Migration: Fix password hash untuk user yang sudah ada
-- Jalankan query ini di database production jika user sudah dibuat dengan password plain text

-- Update password untuk user tertentu (ganti 'username_disini' dengan username yang ingin diupdate)
-- Password: Imunira234.. (bcrypt hash)
UPDATE admin_users 
SET password_hash = '$2a$10$DQweUxcYnsTiXIbc7yEwTOS2TDnLeY4/EFWNQynrYpWjWadhXgToy'
WHERE username = 'Imron23';

-- Atau jika ingin mengupdate semua user yang passwordnya belum di-hash (deteksi: tidak diawali $2a$)
-- PERINGATAN: Ini akan mengeset password yang sama untuk semua user!
-- UPDATE admin_users 
-- SET password_hash = '$2a$10$DQweUxcYnsTiXIbc7yEwTOS2TDnLeY4/EFWNQynrYpWjWadhXgToy'
-- WHERE password_hash NOT LIKE '$2a$%';

SELECT 'Password update completed!' AS status;