UPDATE leads SET 
    domisili = (ARRAY['Jakarta','Bandung','Surabaya','Medan','Makassar','Balikpapan','Yogyakarta'])[floor(random()*7)+1],
    paket_pilihan = (ARRAY['Umroh Plus Turki','Umroh Reguler','Haji Furoda','Umroh Plus Dubai','Umroh VIP'])[floor(random()*5)+1],
    yang_berangkat = (ARRAY['1 Orang','2 Orang','3 Orang','Keluarga (4+ Orang)'])[floor(random()*4)+1],
    kesiapan_paspor = (ARRAY['Sudah Ada','Belum Ada','Dalam Proses'])[floor(random()*3)+1],
    utm_source = (ARRAY['facebook','instagram','google','tiktok','organic'])[floor(random()*5)+1],
    revenue = (floor(random()*50) + 10) * 1000000,
    status_followup = (ARRAY['New Data','Contacted','Proses FU','DP','Order Complete','Lost'])[floor(random()*6)+1],
    created_at = NOW() - (floor(random()*30) || ' days')::interval;

UPDATE leads SET status_history = 
    json_build_array(
        json_build_object('status', 'New Data', 'changed_at', created_at),
        json_build_object('status', status_followup, 'changed_at', created_at + (floor(random()*24) || ' hours')::interval)
    )
WHERE status_followup != 'New Data';

UPDATE leads SET status_history = 
    json_build_array(json_build_object('status', 'New Data', 'changed_at', created_at))
WHERE status_followup = 'New Data';

-- Set specific programs and assignments
UPDATE leads SET program_id = (SELECT id FROM programs ORDER BY random() LIMIT 1),
                 assigned_to = (SELECT id FROM admin_users ORDER BY random() LIMIT 1);
