
WITH CTE_0 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 0 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-24T04:52:16.960Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-02-25T08:08:56.960Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Lagi saya bantu hitungkan rincian budget untuk 4 orang rombongan keluarga. Menunggu konfirmasi dari suami.","changed_at":"2026-02-27T05:25:36.960Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-02-28T06:42:16.960Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Budget jauh dari yang diharapkan (minta diskon ekstrem). Lost.","changed_at":"2026-03-01T14:58:56.960Z"}]'::jsonb,
    catatan = 'Budget jauh dari yang diharapkan (minta diskon ekstrem). Lost.',
    updated_at = '2026-03-01T14:58:56.960Z'
FROM CTE_0
WHERE leads.id = CTE_0.id;

WITH CTE_1 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 1 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'DP',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-20T04:52:16.961Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-02-20T21:08:56.961Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-02-21T04:25:36.961Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Alhamdulillah, DP Rp 5.000.000 sudah ditransfer atas nama ibu tersebut. Kuitansi sudah diterbitkan.","changed_at":"2026-02-21T09:42:16.961Z"}]'::jsonb,
    catatan = 'Alhamdulillah, DP Rp 5.000.000 sudah ditransfer atas nama ibu tersebut. Kuitansi sudah diterbitkan.',
    updated_at = '2026-02-21T09:42:16.961Z'
FROM CTE_1
WHERE leads.id = CTE_1.id;

WITH CTE_2 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 2 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Proses FU',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-03-04T04:52:16.961Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Ditelepon dan tersambung. Bapaknya sedang sibuk, minta dihubungi lagi besok jam 10 pagi.","changed_at":"2026-03-05T01:08:56.961Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-03-06T14:25:36.961Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-03-06T22:42:16.961Z"}]'::jsonb,
    catatan = 'Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.',
    updated_at = '2026-03-06T22:42:16.961Z'
FROM CTE_2
WHERE leads.id = CTE_2.id;

WITH CTE_3 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 3 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Proses FU',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-03-01T04:52:16.961Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan.","changed_at":"2026-03-01T07:08:56.961Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-03-02T15:25:36.961Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-03-04T00:42:16.961Z"}]'::jsonb,
    catatan = 'Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.',
    updated_at = '2026-03-04T00:42:16.961Z'
FROM CTE_3
WHERE leads.id = CTE_3.id;

WITH CTE_4 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 4 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-03-01T04:52:16.961Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Dihubungi via WA, merespon ''siap'' namun belum membaca detail paket yang dikirim.","changed_at":"2026-03-01T07:08:56.961Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-03-02T21:25:36.961Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-03-04T20:42:16.961Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"DP sudah masuk via Virtual Account. Sisa pelunasan dijanjikan akhir bulan depan setelah panen.","changed_at":"2026-03-06T12:58:56.961Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Pelunasan komplit! Rp 32.500.000 sudah masuk. Proses cetak ID Card jamaah sedang berjalan.","changed_at":"2026-03-07T22:15:36.961Z"}]'::jsonb,
    catatan = 'Pelunasan komplit! Rp 32.500.000 sudah masuk. Proses cetak ID Card jamaah sedang berjalan.',
    updated_at = '2026-03-07T22:15:36.961Z'
FROM CTE_4
WHERE leads.id = CTE_4.id;

WITH CTE_5 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 5 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Proses FU',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-02-08T04:52:16.961Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.","changed_at":"2026-02-09T01:08:56.961Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-02-10T22:25:36.961Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-02-11T23:42:16.961Z"}]'::jsonb,
    catatan = 'Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.',
    updated_at = '2026-02-11T23:42:16.961Z'
FROM CTE_5
WHERE leads.id = CTE_5.id;

WITH CTE_6 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 6 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'DP',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-02-09T04:52:16.961Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Ditelepon dan tersambung. Bapaknya sedang sibuk, minta dihubungi lagi besok jam 10 pagi.","changed_at":"2026-02-10T11:08:56.961Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-02-12T03:25:36.961Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Lagi saya bantu hitungkan rincian budget untuk 4 orang rombongan keluarga. Menunggu konfirmasi dari suami.","changed_at":"2026-02-13T18:42:16.961Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Alhamdulillah, DP Rp 5.000.000 sudah ditransfer atas nama ibu tersebut. Kuitansi sudah diterbitkan.","changed_at":"2026-02-15T09:58:56.961Z"}]'::jsonb,
    catatan = 'Alhamdulillah, DP Rp 5.000.000 sudah ditransfer atas nama ibu tersebut. Kuitansi sudah diterbitkan.',
    updated_at = '2026-02-15T09:58:56.961Z'
FROM CTE_6
WHERE leads.id = CTE_6.id;

WITH CTE_7 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 7 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-02-20T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.","changed_at":"2026-02-21T12:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-02-21T13:25:36.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-02-21T20:42:16.962Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"DP sudah masuk via Virtual Account. Sisa pelunasan dijanjikan akhir bulan depan setelah panen.","changed_at":"2026-02-23T09:58:56.962Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Pelunasan komplit! Rp 32.500.000 sudah masuk. Proses cetak ID Card jamaah sedang berjalan.","changed_at":"2026-02-23T17:15:36.962Z"}]'::jsonb,
    catatan = 'Pelunasan komplit! Rp 32.500.000 sudah masuk. Proses cetak ID Card jamaah sedang berjalan.',
    updated_at = '2026-02-23T17:15:36.962Z'
FROM CTE_7
WHERE leads.id = CTE_7.id;

WITH CTE_8 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 8 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'DP',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-08T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-02-09T12:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-02-11T00:25:36.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-02-12T00:42:16.962Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Dokumen beres. Tinggal menunggu bukti transfer untuk diinput ke dalam sistem manifest.","changed_at":"2026-02-12T15:58:56.962Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"DP sudah masuk via Virtual Account. Sisa pelunasan dijanjikan akhir bulan depan setelah panen.","changed_at":"2026-02-12T16:15:36.962Z"}]'::jsonb,
    catatan = 'DP sudah masuk via Virtual Account. Sisa pelunasan dijanjikan akhir bulan depan setelah panen.',
    updated_at = '2026-02-12T16:15:36.962Z'
FROM CTE_8
WHERE leads.id = CTE_8.id;

WITH CTE_9 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 9 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-03-07T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.","changed_at":"2026-03-08T07:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-03-08T08:25:36.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-03-08T21:42:16.962Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Gagal berangkat karena sakit keras/alasan keluarga mendadak.","changed_at":"2026-03-10T13:58:56.962Z"}]'::jsonb,
    catatan = 'Gagal berangkat karena sakit keras/alasan keluarga mendadak.',
    updated_at = '2026-03-10T13:58:56.962Z'
FROM CTE_9
WHERE leads.id = CTE_9.id;

WITH CTE_10 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 10 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'DP',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-02-19T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Ditelepon dan tersambung. Bapaknya sedang sibuk, minta dihubungi lagi besok jam 10 pagi.","changed_at":"2026-02-19T06:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-02-20T04:25:36.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-02-20T19:42:16.962Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Alhamdulillah, DP Rp 5.000.000 sudah ditransfer atas nama ibu tersebut. Kuitansi sudah diterbitkan.","changed_at":"2026-02-20T19:58:56.962Z"}]'::jsonb,
    catatan = 'Alhamdulillah, DP Rp 5.000.000 sudah ditransfer atas nama ibu tersebut. Kuitansi sudah diterbitkan.',
    updated_at = '2026-02-20T19:58:56.962Z'
FROM CTE_10
WHERE leads.id = CTE_10.id;

WITH CTE_11 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 11 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-23T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Ditelepon dan tersambung. Bapaknya sedang sibuk, minta dihubungi lagi besok jam 10 pagi.","changed_at":"2026-02-24T15:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-02-25T08:25:36.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-02-26T18:42:16.962Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Telah menyerahkan uang tunai ke kantor sebagai DP, kuitansi fisik sudah diberikan. Seat sudah diamankan.","changed_at":"2026-02-27T15:58:56.962Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Tanda terima pelunasan sudah keluar. Tinggal tunggu jadwal pengiriman koper dan perlengkapan dari gudang.","changed_at":"2026-02-28T05:15:36.962Z"}]'::jsonb,
    catatan = 'Tanda terima pelunasan sudah keluar. Tinggal tunggu jadwal pengiriman koper dan perlengkapan dari gudang.',
    updated_at = '2026-02-28T05:15:36.962Z'
FROM CTE_11
WHERE leads.id = CTE_11.id;

WITH CTE_12 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 12 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Proses FU',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-02-10T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan.","changed_at":"2026-02-11T00:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-02-11T19:25:36.962Z"}]'::jsonb,
    catatan = 'CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.',
    updated_at = '2026-02-11T19:25:36.962Z'
FROM CTE_12
WHERE leads.id = CTE_12.id;

WITH CTE_13 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 13 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Proses FU',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-02-25T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Dihubungi via WA, merespon ''siap'' namun belum membaca detail paket yang dikirim.","changed_at":"2026-02-26T04:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-02-26T16:25:36.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-02-26T20:42:16.962Z"}]'::jsonb,
    catatan = 'CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.',
    updated_at = '2026-02-26T20:42:16.962Z'
FROM CTE_13
WHERE leads.id = CTE_13.id;

WITH CTE_14 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 14 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Contacted',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-09T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-02-10T09:08:56.962Z"}]'::jsonb,
    catatan = 'Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.',
    updated_at = '2026-02-10T09:08:56.962Z'
FROM CTE_14
WHERE leads.id = CTE_14.id;

WITH CTE_15 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 15 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Contacted',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-12T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan.","changed_at":"2026-02-13T06:08:56.962Z"}]'::jsonb,
    catatan = 'Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan.',
    updated_at = '2026-02-13T06:08:56.962Z'
FROM CTE_15
WHERE leads.id = CTE_15.id;

WITH CTE_16 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 16 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Contacted',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-03-04T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-03-05T23:08:56.962Z"}]'::jsonb,
    catatan = 'Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.',
    updated_at = '2026-03-05T23:08:56.962Z'
FROM CTE_16
WHERE leads.id = CTE_16.id;

WITH CTE_17 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 17 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-17T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan.","changed_at":"2026-02-18T10:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-02-19T03:25:36.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-02-20T16:42:16.962Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Ghosting total, di-WA tidak dibalas, ditelepon direject. Setelah ditelaah, mungkin cuma nomor fiktif/ingin iseng.","changed_at":"2026-02-20T19:58:56.962Z"}]'::jsonb,
    catatan = 'Ghosting total, di-WA tidak dibalas, ditelepon direject. Setelah ditelaah, mungkin cuma nomor fiktif/ingin iseng.',
    updated_at = '2026-02-20T19:58:56.962Z'
FROM CTE_17
WHERE leads.id = CTE_17.id;

WITH CTE_18 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 18 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-19T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan.","changed_at":"2026-02-20T23:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-02-21T01:25:36.962Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"DP sudah masuk via Virtual Account. Sisa pelunasan dijanjikan akhir bulan depan setelah panen.","changed_at":"2026-02-22T19:42:16.962Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Semua persiapan selesai. Jamaah fix berangkat di rombongan 15 Oktober. Terus menjaga silaturahmi untuk info manasik.","changed_at":"2026-02-24T12:58:56.962Z"}]'::jsonb,
    catatan = 'Semua persiapan selesai. Jamaah fix berangkat di rombongan 15 Oktober. Terus menjaga silaturahmi untuk info manasik.',
    updated_at = '2026-02-24T12:58:56.962Z'
FROM CTE_18
WHERE leads.id = CTE_18.id;

WITH CTE_19 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 19 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-10T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Ditelepon dan tersambung. Bapaknya sedang sibuk, minta dihubungi lagi besok jam 10 pagi.","changed_at":"2026-02-12T02:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-02-13T20:25:36.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-02-15T08:42:16.962Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Dokumen beres. Tinggal menunggu bukti transfer untuk diinput ke dalam sistem manifest.","changed_at":"2026-02-15T11:58:56.962Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Alhamdulillah, DP Rp 5.000.000 sudah ditransfer atas nama ibu tersebut. Kuitansi sudah diterbitkan.","changed_at":"2026-02-16T04:15:36.962Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Tanda terima pelunasan sudah keluar. Tinggal tunggu jadwal pengiriman koper dan perlengkapan dari gudang.","changed_at":"2026-02-17T03:32:16.962Z"}]'::jsonb,
    catatan = 'Tanda terima pelunasan sudah keluar. Tinggal tunggu jadwal pengiriman koper dan perlengkapan dari gudang.',
    updated_at = '2026-02-17T03:32:16.962Z'
FROM CTE_19
WHERE leads.id = CTE_19.id;

WITH CTE_20 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 20 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Proses FU',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-02-12T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Dihubungi via WA, merespon ''siap'' namun belum membaca detail paket yang dikirim.","changed_at":"2026-02-12T09:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-02-14T03:25:36.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-02-14T09:42:16.962Z"}]'::jsonb,
    catatan = 'Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.',
    updated_at = '2026-02-14T09:42:16.962Z'
FROM CTE_20
WHERE leads.id = CTE_20.id;

WITH CTE_21 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 21 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-15T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-02-17T04:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-02-17T19:25:36.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-02-18T01:42:16.962Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Ghosting total, di-WA tidak dibalas, ditelepon direject. Setelah ditelaah, mungkin cuma nomor fiktif/ingin iseng.","changed_at":"2026-02-18T05:58:56.962Z"}]'::jsonb,
    catatan = 'Ghosting total, di-WA tidak dibalas, ditelepon direject. Setelah ditelaah, mungkin cuma nomor fiktif/ingin iseng.',
    updated_at = '2026-02-18T05:58:56.962Z'
FROM CTE_21
WHERE leads.id = CTE_21.id;

WITH CTE_22 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 22 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'DP',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-03-01T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan.","changed_at":"2026-03-02T20:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-03-02T21:25:36.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-03-03T10:42:16.962Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Semua kelengkapan dokumen telah diterima, saya minta jamaah untuk segera melunasi uang muka pendaftaran.","changed_at":"2026-03-03T20:58:56.962Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Telah menyerahkan uang tunai ke kantor sebagai DP, kuitansi fisik sudah diberikan. Seat sudah diamankan.","changed_at":"2026-03-04T06:15:36.962Z"}]'::jsonb,
    catatan = 'Telah menyerahkan uang tunai ke kantor sebagai DP, kuitansi fisik sudah diberikan. Seat sudah diamankan.',
    updated_at = '2026-03-04T06:15:36.962Z'
FROM CTE_22
WHERE leads.id = CTE_22.id;

WITH CTE_23 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 23 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Proses FU',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-11T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Ditelepon dan tersambung. Bapaknya sedang sibuk, minta dihubungi lagi besok jam 10 pagi.","changed_at":"2026-02-12T09:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-02-12T20:25:36.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-02-13T06:42:16.962Z"}]'::jsonb,
    catatan = 'Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.',
    updated_at = '2026-02-13T06:42:16.962Z'
FROM CTE_23
WHERE leads.id = CTE_23.id;

WITH CTE_24 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 24 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Proses FU',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-21T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.","changed_at":"2026-02-22T07:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-02-23T16:25:36.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-02-24T23:42:16.962Z"}]'::jsonb,
    catatan = 'CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.',
    updated_at = '2026-02-24T23:42:16.962Z'
FROM CTE_24
WHERE leads.id = CTE_24.id;

WITH CTE_25 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 25 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'DP',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-03-07T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan.","changed_at":"2026-03-08T19:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-03-09T13:25:36.962Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Scan paspor dan buku vaksin sudah masuk ke kotak masuk email. Sedang divalidasi.","changed_at":"2026-03-11T10:42:16.962Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Telah menyerahkan uang tunai ke kantor sebagai DP, kuitansi fisik sudah diberikan. Seat sudah diamankan.","changed_at":"2026-03-11T21:58:56.962Z"}]'::jsonb,
    catatan = 'Telah menyerahkan uang tunai ke kantor sebagai DP, kuitansi fisik sudah diberikan. Seat sudah diamankan.',
    updated_at = '2026-03-11T21:58:56.962Z'
FROM CTE_25
WHERE leads.id = CTE_25.id;

WITH CTE_26 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 26 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-23T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Ditelepon dan tersambung. Bapaknya sedang sibuk, minta dihubungi lagi besok jam 10 pagi.","changed_at":"2026-02-25T03:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-02-26T16:25:36.962Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Gagal berangkat karena sakit keras/alasan keluarga mendadak.","changed_at":"2026-02-26T21:42:16.962Z"}]'::jsonb,
    catatan = 'Gagal berangkat karena sakit keras/alasan keluarga mendadak.',
    updated_at = '2026-02-26T21:42:16.962Z'
FROM CTE_26
WHERE leads.id = CTE_26.id;

WITH CTE_27 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 27 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Proses FU',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-08T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Dihubungi via WA, merespon ''siap'' namun belum membaca detail paket yang dikirim.","changed_at":"2026-02-08T08:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-02-09T05:25:36.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Lagi saya bantu hitungkan rincian budget untuk 4 orang rombongan keluarga. Menunggu konfirmasi dari suami.","changed_at":"2026-02-09T15:42:16.962Z"}]'::jsonb,
    catatan = 'Lagi saya bantu hitungkan rincian budget untuk 4 orang rombongan keluarga. Menunggu konfirmasi dari suami.',
    updated_at = '2026-02-09T15:42:16.962Z'
FROM CTE_27
WHERE leads.id = CTE_27.id;

WITH CTE_28 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 28 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'DP',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-03-06T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan.","changed_at":"2026-03-07T15:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-03-08T10:25:36.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-03-09T16:42:16.962Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Alhamdulillah, DP Rp 5.000.000 sudah ditransfer atas nama ibu tersebut. Kuitansi sudah diterbitkan.","changed_at":"2026-03-10T11:58:56.962Z"}]'::jsonb,
    catatan = 'Alhamdulillah, DP Rp 5.000.000 sudah ditransfer atas nama ibu tersebut. Kuitansi sudah diterbitkan.',
    updated_at = '2026-03-10T11:58:56.962Z'
FROM CTE_28
WHERE leads.id = CTE_28.id;

WITH CTE_29 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 29 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Contacted',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-13T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.","changed_at":"2026-02-14T06:08:56.962Z"}]'::jsonb,
    catatan = 'Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.',
    updated_at = '2026-02-14T06:08:56.962Z'
FROM CTE_29
WHERE leads.id = CTE_29.id;

WITH CTE_30 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 30 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-02-12T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.","changed_at":"2026-02-13T21:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-02-14T14:25:36.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Lagi saya bantu hitungkan rincian budget untuk 4 orang rombongan keluarga. Menunggu konfirmasi dari suami.","changed_at":"2026-02-15T12:42:16.962Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Budget jauh dari yang diharapkan (minta diskon ekstrem). Lost.","changed_at":"2026-02-17T11:58:56.962Z"}]'::jsonb,
    catatan = 'Budget jauh dari yang diharapkan (minta diskon ekstrem). Lost.',
    updated_at = '2026-02-17T11:58:56.962Z'
FROM CTE_30
WHERE leads.id = CTE_30.id;

WITH CTE_31 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 31 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-09T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.","changed_at":"2026-02-10T14:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-02-10T22:25:36.962Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Form aplikasi pendaftaran sudah diisi lengkap. Sedang menunggu KTP dan KK jamaah.","changed_at":"2026-02-12T04:42:16.962Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Telah menyerahkan uang tunai ke kantor sebagai DP, kuitansi fisik sudah diberikan. Seat sudah diamankan.","changed_at":"2026-02-12T04:58:56.962Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Pelunasan komplit! Rp 32.500.000 sudah masuk. Proses cetak ID Card jamaah sedang berjalan.","changed_at":"2026-02-12T10:15:36.962Z"}]'::jsonb,
    catatan = 'Pelunasan komplit! Rp 32.500.000 sudah masuk. Proses cetak ID Card jamaah sedang berjalan.',
    updated_at = '2026-02-12T10:15:36.962Z'
FROM CTE_31
WHERE leads.id = CTE_31.id;

WITH CTE_32 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 32 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Proses FU',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-10T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Ditelepon dan tersambung. Bapaknya sedang sibuk, minta dihubungi lagi besok jam 10 pagi.","changed_at":"2026-02-10T23:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-02-12T06:25:36.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-02-12T22:42:16.962Z"}]'::jsonb,
    catatan = 'Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.',
    updated_at = '2026-02-12T22:42:16.962Z'
FROM CTE_32
WHERE leads.id = CTE_32.id;

WITH CTE_33 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 33 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-08T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.","changed_at":"2026-02-09T11:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-02-10T23:25:36.962Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Semua kelengkapan dokumen telah diterima, saya minta jamaah untuk segera melunasi uang muka pendaftaran.","changed_at":"2026-02-12T13:42:16.962Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Alhamdulillah, DP Rp 5.000.000 sudah ditransfer atas nama ibu tersebut. Kuitansi sudah diterbitkan.","changed_at":"2026-02-14T01:58:56.962Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Semua persiapan selesai. Jamaah fix berangkat di rombongan 15 Oktober. Terus menjaga silaturahmi untuk info manasik.","changed_at":"2026-02-14T18:15:36.962Z"}]'::jsonb,
    catatan = 'Semua persiapan selesai. Jamaah fix berangkat di rombongan 15 Oktober. Terus menjaga silaturahmi untuk info manasik.',
    updated_at = '2026-02-14T18:15:36.962Z'
FROM CTE_33
WHERE leads.id = CTE_33.id;

WITH CTE_34 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 34 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-03-04T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan.","changed_at":"2026-03-04T20:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-03-06T01:25:36.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-03-06T07:42:16.962Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Ternyata sudah membayar DP di travel kompetitor karena CS kompetitor lebih cepat merespon.","changed_at":"2026-03-07T03:58:56.962Z"}]'::jsonb,
    catatan = 'Ternyata sudah membayar DP di travel kompetitor karena CS kompetitor lebih cepat merespon.',
    updated_at = '2026-03-07T03:58:56.962Z'
FROM CTE_34
WHERE leads.id = CTE_34.id;

WITH CTE_35 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 35 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-26T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-02-27T01:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-02-28T21:25:36.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-03-01T03:42:16.962Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Budget jauh dari yang diharapkan (minta diskon ekstrem). Lost.","changed_at":"2026-03-02T11:58:56.962Z"}]'::jsonb,
    catatan = 'Budget jauh dari yang diharapkan (minta diskon ekstrem). Lost.',
    updated_at = '2026-03-02T11:58:56.962Z'
FROM CTE_35
WHERE leads.id = CTE_35.id;

WITH CTE_36 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 36 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-16T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-02-17T08:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-02-19T06:25:36.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-02-20T03:42:16.962Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Gagal berangkat karena sakit keras/alasan keluarga mendadak.","changed_at":"2026-02-20T22:58:56.962Z"}]'::jsonb,
    catatan = 'Gagal berangkat karena sakit keras/alasan keluarga mendadak.',
    updated_at = '2026-02-20T22:58:56.962Z'
FROM CTE_36
WHERE leads.id = CTE_36.id;

WITH CTE_37 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 37 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Proses FU',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-03-04T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-03-04T22:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Lagi saya bantu hitungkan rincian budget untuk 4 orang rombongan keluarga. Menunggu konfirmasi dari suami.","changed_at":"2026-03-05T01:25:36.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-03-05T01:42:16.962Z"}]'::jsonb,
    catatan = 'Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.',
    updated_at = '2026-03-05T01:42:16.962Z'
FROM CTE_37
WHERE leads.id = CTE_37.id;

WITH CTE_38 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 38 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Proses FU',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-27T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.","changed_at":"2026-02-27T18:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-02-28T22:25:36.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-03-01T14:42:16.962Z"}]'::jsonb,
    catatan = 'Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.',
    updated_at = '2026-03-01T14:42:16.962Z'
FROM CTE_38
WHERE leads.id = CTE_38.id;

WITH CTE_39 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 39 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Proses FU',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-18T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Ditelepon dan tersambung. Bapaknya sedang sibuk, minta dihubungi lagi besok jam 10 pagi.","changed_at":"2026-02-19T06:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-02-20T09:25:36.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-02-21T19:42:16.962Z"}]'::jsonb,
    catatan = 'Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.',
    updated_at = '2026-02-21T19:42:16.962Z'
FROM CTE_39
WHERE leads.id = CTE_39.id;

WITH CTE_40 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 40 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Contacted',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-03-04T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan.","changed_at":"2026-03-05T21:08:56.962Z"}]'::jsonb,
    catatan = 'Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan.',
    updated_at = '2026-03-05T21:08:56.962Z'
FROM CTE_40
WHERE leads.id = CTE_40.id;

WITH CTE_41 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 41 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Contacted',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-02-24T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Dihubungi via WA, merespon ''siap'' namun belum membaca detail paket yang dikirim.","changed_at":"2026-02-25T07:08:56.962Z"}]'::jsonb,
    catatan = 'Dihubungi via WA, merespon ''siap'' namun belum membaca detail paket yang dikirim.',
    updated_at = '2026-02-25T07:08:56.962Z'
FROM CTE_41
WHERE leads.id = CTE_41.id;

WITH CTE_42 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 42 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'DP',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-19T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan.","changed_at":"2026-02-20T03:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-02-20T12:25:36.962Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"DP sudah masuk via Virtual Account. Sisa pelunasan dijanjikan akhir bulan depan setelah panen.","changed_at":"2026-02-21T16:42:16.962Z"}]'::jsonb,
    catatan = 'DP sudah masuk via Virtual Account. Sisa pelunasan dijanjikan akhir bulan depan setelah panen.',
    updated_at = '2026-02-21T16:42:16.962Z'
FROM CTE_42
WHERE leads.id = CTE_42.id;

WITH CTE_43 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 43 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Contacted',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-02-23T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-02-24T19:08:56.962Z"}]'::jsonb,
    catatan = 'Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.',
    updated_at = '2026-02-24T19:08:56.962Z'
FROM CTE_43
WHERE leads.id = CTE_43.id;

WITH CTE_44 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 44 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Proses FU',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-03-06T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.","changed_at":"2026-03-07T01:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-03-08T11:25:36.962Z"}]'::jsonb,
    catatan = 'CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.',
    updated_at = '2026-03-08T11:25:36.962Z'
FROM CTE_44
WHERE leads.id = CTE_44.id;

WITH CTE_45 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 45 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'DP',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-27T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Ditelepon dan tersambung. Bapaknya sedang sibuk, minta dihubungi lagi besok jam 10 pagi.","changed_at":"2026-03-01T02:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Lagi saya bantu hitungkan rincian budget untuk 4 orang rombongan keluarga. Menunggu konfirmasi dari suami.","changed_at":"2026-03-02T13:25:36.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-03-02T15:42:16.962Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Alhamdulillah, DP Rp 5.000.000 sudah ditransfer atas nama ibu tersebut. Kuitansi sudah diterbitkan.","changed_at":"2026-03-03T06:58:56.962Z"}]'::jsonb,
    catatan = 'Alhamdulillah, DP Rp 5.000.000 sudah ditransfer atas nama ibu tersebut. Kuitansi sudah diterbitkan.',
    updated_at = '2026-03-03T06:58:56.962Z'
FROM CTE_45
WHERE leads.id = CTE_45.id;

WITH CTE_46 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 46 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Proses FU',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-08T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Ditelepon dan tersambung. Bapaknya sedang sibuk, minta dihubungi lagi besok jam 10 pagi.","changed_at":"2026-02-08T10:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-02-09T23:25:36.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-02-11T15:42:16.962Z"}]'::jsonb,
    catatan = 'Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.',
    updated_at = '2026-02-11T15:42:16.962Z'
FROM CTE_46
WHERE leads.id = CTE_46.id;

WITH CTE_47 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 47 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-02-10T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Ditelepon dan tersambung. Bapaknya sedang sibuk, minta dihubungi lagi besok jam 10 pagi.","changed_at":"2026-02-12T02:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-02-12T04:25:36.962Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"DP sudah masuk via Virtual Account. Sisa pelunasan dijanjikan akhir bulan depan setelah panen.","changed_at":"2026-02-12T22:42:16.962Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Tanda terima pelunasan sudah keluar. Tinggal tunggu jadwal pengiriman koper dan perlengkapan dari gudang.","changed_at":"2026-02-14T08:58:56.962Z"}]'::jsonb,
    catatan = 'Tanda terima pelunasan sudah keluar. Tinggal tunggu jadwal pengiriman koper dan perlengkapan dari gudang.',
    updated_at = '2026-02-14T08:58:56.962Z'
FROM CTE_47
WHERE leads.id = CTE_47.id;

WITH CTE_48 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 48 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-09T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-02-09T19:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-02-10T15:25:36.962Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Scan paspor dan buku vaksin sudah masuk ke kotak masuk email. Sedang divalidasi.","changed_at":"2026-02-11T20:42:16.962Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Alhamdulillah, DP Rp 5.000.000 sudah ditransfer atas nama ibu tersebut. Kuitansi sudah diterbitkan.","changed_at":"2026-02-12T03:58:56.962Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Semua persiapan selesai. Jamaah fix berangkat di rombongan 15 Oktober. Terus menjaga silaturahmi untuk info manasik.","changed_at":"2026-02-13T10:15:36.962Z"}]'::jsonb,
    catatan = 'Semua persiapan selesai. Jamaah fix berangkat di rombongan 15 Oktober. Terus menjaga silaturahmi untuk info manasik.',
    updated_at = '2026-02-13T10:15:36.962Z'
FROM CTE_48
WHERE leads.id = CTE_48.id;

WITH CTE_49 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 49 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-18T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Ditelepon dan tersambung. Bapaknya sedang sibuk, minta dihubungi lagi besok jam 10 pagi.","changed_at":"2026-02-18T15:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-02-19T10:25:36.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-02-19T15:42:16.962Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Gagal berangkat karena sakit keras/alasan keluarga mendadak.","changed_at":"2026-02-20T16:58:56.962Z"}]'::jsonb,
    catatan = 'Gagal berangkat karena sakit keras/alasan keluarga mendadak.',
    updated_at = '2026-02-20T16:58:56.962Z'
FROM CTE_49
WHERE leads.id = CTE_49.id;

WITH CTE_50 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 50 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-22T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.","changed_at":"2026-02-22T19:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Lagi saya bantu hitungkan rincian budget untuk 4 orang rombongan keluarga. Menunggu konfirmasi dari suami.","changed_at":"2026-02-23T06:25:36.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Lagi saya bantu hitungkan rincian budget untuk 4 orang rombongan keluarga. Menunggu konfirmasi dari suami.","changed_at":"2026-02-23T19:42:16.962Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Ternyata sudah membayar DP di travel kompetitor karena CS kompetitor lebih cepat merespon.","changed_at":"2026-02-24T02:58:56.962Z"}]'::jsonb,
    catatan = 'Ternyata sudah membayar DP di travel kompetitor karena CS kompetitor lebih cepat merespon.',
    updated_at = '2026-02-24T02:58:56.962Z'
FROM CTE_50
WHERE leads.id = CTE_50.id;

WITH CTE_51 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 51 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-10T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-02-10T17:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-02-11T16:25:36.962Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Ghosting total, di-WA tidak dibalas, ditelepon direject. Setelah ditelaah, mungkin cuma nomor fiktif/ingin iseng.","changed_at":"2026-02-12T14:42:16.962Z"}]'::jsonb,
    catatan = 'Ghosting total, di-WA tidak dibalas, ditelepon direject. Setelah ditelaah, mungkin cuma nomor fiktif/ingin iseng.',
    updated_at = '2026-02-12T14:42:16.962Z'
FROM CTE_51
WHERE leads.id = CTE_51.id;

WITH CTE_52 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 52 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-13T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-02-15T03:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-02-16T03:25:36.962Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Ghosting total, di-WA tidak dibalas, ditelepon direject. Setelah ditelaah, mungkin cuma nomor fiktif/ingin iseng.","changed_at":"2026-02-17T19:42:16.962Z"}]'::jsonb,
    catatan = 'Ghosting total, di-WA tidak dibalas, ditelepon direject. Setelah ditelaah, mungkin cuma nomor fiktif/ingin iseng.',
    updated_at = '2026-02-17T19:42:16.962Z'
FROM CTE_52
WHERE leads.id = CTE_52.id;

WITH CTE_53 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 53 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-03-03T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.","changed_at":"2026-03-03T21:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-03-04T23:25:36.962Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Budget jauh dari yang diharapkan (minta diskon ekstrem). Lost.","changed_at":"2026-03-06T04:42:16.962Z"}]'::jsonb,
    catatan = 'Budget jauh dari yang diharapkan (minta diskon ekstrem). Lost.',
    updated_at = '2026-03-06T04:42:16.962Z'
FROM CTE_53
WHERE leads.id = CTE_53.id;

WITH CTE_54 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 54 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-03-03T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-03-04T22:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-03-05T07:25:36.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-03-05T16:42:16.962Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Form aplikasi pendaftaran sudah diisi lengkap. Sedang menunggu KTP dan KK jamaah.","changed_at":"2026-03-06T09:58:56.962Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"DP sudah masuk via Virtual Account. Sisa pelunasan dijanjikan akhir bulan depan setelah panen.","changed_at":"2026-03-08T06:15:36.962Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Tanda terima pelunasan sudah keluar. Tinggal tunggu jadwal pengiriman koper dan perlengkapan dari gudang.","changed_at":"2026-03-10T00:32:16.962Z"}]'::jsonb,
    catatan = 'Tanda terima pelunasan sudah keluar. Tinggal tunggu jadwal pengiriman koper dan perlengkapan dari gudang.',
    updated_at = '2026-03-10T00:32:16.962Z'
FROM CTE_54
WHERE leads.id = CTE_54.id;

WITH CTE_55 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 55 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-02-24T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan.","changed_at":"2026-02-25T19:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-02-25T23:25:36.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-02-27T22:42:16.962Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Ternyata sudah membayar DP di travel kompetitor karena CS kompetitor lebih cepat merespon.","changed_at":"2026-03-01T18:58:56.962Z"}]'::jsonb,
    catatan = 'Ternyata sudah membayar DP di travel kompetitor karena CS kompetitor lebih cepat merespon.',
    updated_at = '2026-03-01T18:58:56.962Z'
FROM CTE_55
WHERE leads.id = CTE_55.id;

WITH CTE_56 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 56 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'DP',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-16T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Dihubungi via WA, merespon ''siap'' namun belum membaca detail paket yang dikirim.","changed_at":"2026-02-17T00:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-02-17T18:25:36.962Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Alhamdulillah, DP Rp 5.000.000 sudah ditransfer atas nama ibu tersebut. Kuitansi sudah diterbitkan.","changed_at":"2026-02-18T23:42:16.962Z"}]'::jsonb,
    catatan = 'Alhamdulillah, DP Rp 5.000.000 sudah ditransfer atas nama ibu tersebut. Kuitansi sudah diterbitkan.',
    updated_at = '2026-02-18T23:42:16.962Z'
FROM CTE_56
WHERE leads.id = CTE_56.id;

WITH CTE_57 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 57 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-24T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.","changed_at":"2026-02-24T10:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-02-24T17:25:36.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Lagi saya bantu hitungkan rincian budget untuk 4 orang rombongan keluarga. Menunggu konfirmasi dari suami.","changed_at":"2026-02-24T19:42:16.962Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Semua kelengkapan dokumen telah diterima, saya minta jamaah untuk segera melunasi uang muka pendaftaran.","changed_at":"2026-02-26T17:58:56.962Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"DP sudah masuk via Virtual Account. Sisa pelunasan dijanjikan akhir bulan depan setelah panen.","changed_at":"2026-02-28T05:15:36.962Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Tanda terima pelunasan sudah keluar. Tinggal tunggu jadwal pengiriman koper dan perlengkapan dari gudang.","changed_at":"2026-02-28T08:32:16.962Z"}]'::jsonb,
    catatan = 'Tanda terima pelunasan sudah keluar. Tinggal tunggu jadwal pengiriman koper dan perlengkapan dari gudang.',
    updated_at = '2026-02-28T08:32:16.962Z'
FROM CTE_57
WHERE leads.id = CTE_57.id;

WITH CTE_58 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 58 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Proses FU',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-03-08T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-03-08T14:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-03-09T00:25:36.962Z"}]'::jsonb,
    catatan = 'Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.',
    updated_at = '2026-03-09T00:25:36.962Z'
FROM CTE_58
WHERE leads.id = CTE_58.id;

WITH CTE_59 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 59 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-26T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-02-27T09:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Lagi saya bantu hitungkan rincian budget untuk 4 orang rombongan keluarga. Menunggu konfirmasi dari suami.","changed_at":"2026-02-27T10:25:36.962Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Ternyata sudah membayar DP di travel kompetitor karena CS kompetitor lebih cepat merespon.","changed_at":"2026-02-28T12:42:16.962Z"}]'::jsonb,
    catatan = 'Ternyata sudah membayar DP di travel kompetitor karena CS kompetitor lebih cepat merespon.',
    updated_at = '2026-02-28T12:42:16.962Z'
FROM CTE_59
WHERE leads.id = CTE_59.id;

WITH CTE_60 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 60 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-21T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-02-21T19:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-02-23T02:25:36.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-02-23T06:42:16.962Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Scan paspor dan buku vaksin sudah masuk ke kotak masuk email. Sedang divalidasi.","changed_at":"2026-02-23T19:58:56.962Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Alhamdulillah, DP Rp 5.000.000 sudah ditransfer atas nama ibu tersebut. Kuitansi sudah diterbitkan.","changed_at":"2026-02-25T00:15:36.962Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Semua persiapan selesai. Jamaah fix berangkat di rombongan 15 Oktober. Terus menjaga silaturahmi untuk info manasik.","changed_at":"2026-02-26T10:32:16.962Z"}]'::jsonb,
    catatan = 'Semua persiapan selesai. Jamaah fix berangkat di rombongan 15 Oktober. Terus menjaga silaturahmi untuk info manasik.',
    updated_at = '2026-02-26T10:32:16.962Z'
FROM CTE_60
WHERE leads.id = CTE_60.id;

WITH CTE_61 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 61 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Proses FU',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-12T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Ditelepon dan tersambung. Bapaknya sedang sibuk, minta dihubungi lagi besok jam 10 pagi.","changed_at":"2026-02-13T10:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Lagi saya bantu hitungkan rincian budget untuk 4 orang rombongan keluarga. Menunggu konfirmasi dari suami.","changed_at":"2026-02-13T23:25:36.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-02-14T05:42:16.962Z"}]'::jsonb,
    catatan = 'Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.',
    updated_at = '2026-02-14T05:42:16.962Z'
FROM CTE_61
WHERE leads.id = CTE_61.id;

WITH CTE_62 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 62 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Proses FU',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-15T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan.","changed_at":"2026-02-15T18:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-02-16T22:25:36.962Z"}]'::jsonb,
    catatan = 'Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.',
    updated_at = '2026-02-16T22:25:36.962Z'
FROM CTE_62
WHERE leads.id = CTE_62.id;

WITH CTE_63 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 63 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Proses FU',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-03-07T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Dihubungi via WA, merespon ''siap'' namun belum membaca detail paket yang dikirim.","changed_at":"2026-03-07T05:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-03-07T09:25:36.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-03-07T15:42:16.962Z"}]'::jsonb,
    catatan = 'Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.',
    updated_at = '2026-03-07T15:42:16.962Z'
FROM CTE_63
WHERE leads.id = CTE_63.id;

WITH CTE_64 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 64 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-08T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Dihubungi via WA, merespon ''siap'' namun belum membaca detail paket yang dikirim.","changed_at":"2026-02-08T17:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-02-10T06:25:36.962Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Ghosting total, di-WA tidak dibalas, ditelepon direject. Setelah ditelaah, mungkin cuma nomor fiktif/ingin iseng.","changed_at":"2026-02-11T23:42:16.962Z"}]'::jsonb,
    catatan = 'Ghosting total, di-WA tidak dibalas, ditelepon direject. Setelah ditelaah, mungkin cuma nomor fiktif/ingin iseng.',
    updated_at = '2026-02-11T23:42:16.962Z'
FROM CTE_64
WHERE leads.id = CTE_64.id;

WITH CTE_65 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 65 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-09T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-02-10T06:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-02-10T14:25:36.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-02-12T03:42:16.962Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Ghosting total, di-WA tidak dibalas, ditelepon direject. Setelah ditelaah, mungkin cuma nomor fiktif/ingin iseng.","changed_at":"2026-02-13T15:58:56.962Z"}]'::jsonb,
    catatan = 'Ghosting total, di-WA tidak dibalas, ditelepon direject. Setelah ditelaah, mungkin cuma nomor fiktif/ingin iseng.',
    updated_at = '2026-02-13T15:58:56.962Z'
FROM CTE_65
WHERE leads.id = CTE_65.id;

WITH CTE_66 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 66 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Contacted',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-02-22T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.","changed_at":"2026-02-23T04:08:56.962Z"}]'::jsonb,
    catatan = 'Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.',
    updated_at = '2026-02-23T04:08:56.962Z'
FROM CTE_66
WHERE leads.id = CTE_66.id;

WITH CTE_67 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 67 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Proses FU',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-17T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Ditelepon dan tersambung. Bapaknya sedang sibuk, minta dihubungi lagi besok jam 10 pagi.","changed_at":"2026-02-18T05:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-02-18T19:25:36.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-02-19T02:42:16.962Z"}]'::jsonb,
    catatan = 'Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.',
    updated_at = '2026-02-19T02:42:16.962Z'
FROM CTE_67
WHERE leads.id = CTE_67.id;

WITH CTE_68 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 68 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-22T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-02-23T00:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-02-24T04:25:36.962Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Form aplikasi pendaftaran sudah diisi lengkap. Sedang menunggu KTP dan KK jamaah.","changed_at":"2026-02-24T20:42:16.962Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Alhamdulillah, DP Rp 5.000.000 sudah ditransfer atas nama ibu tersebut. Kuitansi sudah diterbitkan.","changed_at":"2026-02-26T03:58:56.962Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Pelunasan komplit! Rp 32.500.000 sudah masuk. Proses cetak ID Card jamaah sedang berjalan.","changed_at":"2026-02-27T07:15:36.962Z"}]'::jsonb,
    catatan = 'Pelunasan komplit! Rp 32.500.000 sudah masuk. Proses cetak ID Card jamaah sedang berjalan.',
    updated_at = '2026-02-27T07:15:36.962Z'
FROM CTE_68
WHERE leads.id = CTE_68.id;

WITH CTE_69 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 69 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-02-19T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-02-20T02:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-02-21T20:25:36.962Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Form aplikasi pendaftaran sudah diisi lengkap. Sedang menunggu KTP dan KK jamaah.","changed_at":"2026-02-23T14:42:16.962Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Telah menyerahkan uang tunai ke kantor sebagai DP, kuitansi fisik sudah diberikan. Seat sudah diamankan.","changed_at":"2026-02-24T01:58:56.962Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Pelunasan komplit! Rp 32.500.000 sudah masuk. Proses cetak ID Card jamaah sedang berjalan.","changed_at":"2026-02-24T06:15:36.962Z"}]'::jsonb,
    catatan = 'Pelunasan komplit! Rp 32.500.000 sudah masuk. Proses cetak ID Card jamaah sedang berjalan.',
    updated_at = '2026-02-24T06:15:36.962Z'
FROM CTE_69
WHERE leads.id = CTE_69.id;

WITH CTE_70 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 70 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Contacted',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-02-23T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-02-25T04:08:56.962Z"}]'::jsonb,
    catatan = 'Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.',
    updated_at = '2026-02-25T04:08:56.962Z'
FROM CTE_70
WHERE leads.id = CTE_70.id;

WITH CTE_71 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 71 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-19T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-02-20T19:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-02-20T23:25:36.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-02-22T14:42:16.962Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Telah menyerahkan uang tunai ke kantor sebagai DP, kuitansi fisik sudah diberikan. Seat sudah diamankan.","changed_at":"2026-02-23T23:58:56.962Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Semua persiapan selesai. Jamaah fix berangkat di rombongan 15 Oktober. Terus menjaga silaturahmi untuk info manasik.","changed_at":"2026-02-25T06:15:36.962Z"}]'::jsonb,
    catatan = 'Semua persiapan selesai. Jamaah fix berangkat di rombongan 15 Oktober. Terus menjaga silaturahmi untuk info manasik.',
    updated_at = '2026-02-25T06:15:36.962Z'
FROM CTE_71
WHERE leads.id = CTE_71.id;

WITH CTE_72 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 72 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Proses FU',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-15T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Ditelepon dan tersambung. Bapaknya sedang sibuk, minta dihubungi lagi besok jam 10 pagi.","changed_at":"2026-02-16T23:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-02-18T06:25:36.962Z"}]'::jsonb,
    catatan = 'Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.',
    updated_at = '2026-02-18T06:25:36.962Z'
FROM CTE_72
WHERE leads.id = CTE_72.id;

WITH CTE_73 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 73 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Proses FU',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-03-01T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.","changed_at":"2026-03-01T10:08:56.962Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-03-02T05:25:36.962Z"}]'::jsonb,
    catatan = 'CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.',
    updated_at = '2026-03-02T05:25:36.962Z'
FROM CTE_73
WHERE leads.id = CTE_73.id;

WITH CTE_74 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 74 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Contacted',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-02-20T04:52:16.962Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Dihubungi via WA, merespon ''siap'' namun belum membaca detail paket yang dikirim.","changed_at":"2026-02-20T15:08:56.962Z"}]'::jsonb,
    catatan = 'Dihubungi via WA, merespon ''siap'' namun belum membaca detail paket yang dikirim.',
    updated_at = '2026-02-20T15:08:56.962Z'
FROM CTE_74
WHERE leads.id = CTE_74.id;

WITH CTE_75 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 75 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Proses FU',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-09T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.","changed_at":"2026-02-10T12:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-02-10T13:25:36.963Z"}]'::jsonb,
    catatan = 'Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.',
    updated_at = '2026-02-10T13:25:36.963Z'
FROM CTE_75
WHERE leads.id = CTE_75.id;

WITH CTE_76 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 76 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-03-03T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.","changed_at":"2026-03-03T13:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-03-05T00:25:36.963Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Budget jauh dari yang diharapkan (minta diskon ekstrem). Lost.","changed_at":"2026-03-05T18:42:16.963Z"}]'::jsonb,
    catatan = 'Budget jauh dari yang diharapkan (minta diskon ekstrem). Lost.',
    updated_at = '2026-03-05T18:42:16.963Z'
FROM CTE_76
WHERE leads.id = CTE_76.id;

WITH CTE_77 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 77 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-24T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-02-25T11:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Lagi saya bantu hitungkan rincian budget untuk 4 orang rombongan keluarga. Menunggu konfirmasi dari suami.","changed_at":"2026-02-25T22:25:36.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-02-27T01:42:16.963Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Budget jauh dari yang diharapkan (minta diskon ekstrem). Lost.","changed_at":"2026-02-27T20:58:56.963Z"}]'::jsonb,
    catatan = 'Budget jauh dari yang diharapkan (minta diskon ekstrem). Lost.',
    updated_at = '2026-02-27T20:58:56.963Z'
FROM CTE_77
WHERE leads.id = CTE_77.id;

WITH CTE_78 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 78 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'DP',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-19T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan.","changed_at":"2026-02-19T18:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-02-20T09:25:36.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-02-20T21:42:16.963Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Form aplikasi pendaftaran sudah diisi lengkap. Sedang menunggu KTP dan KK jamaah.","changed_at":"2026-02-21T09:58:56.963Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"DP sudah masuk via Virtual Account. Sisa pelunasan dijanjikan akhir bulan depan setelah panen.","changed_at":"2026-02-22T07:15:36.963Z"}]'::jsonb,
    catatan = 'DP sudah masuk via Virtual Account. Sisa pelunasan dijanjikan akhir bulan depan setelah panen.',
    updated_at = '2026-02-22T07:15:36.963Z'
FROM CTE_78
WHERE leads.id = CTE_78.id;

WITH CTE_79 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 79 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-07T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.","changed_at":"2026-02-09T01:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Lagi saya bantu hitungkan rincian budget untuk 4 orang rombongan keluarga. Menunggu konfirmasi dari suami.","changed_at":"2026-02-10T21:25:36.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-02-11T15:42:16.963Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Ghosting total, di-WA tidak dibalas, ditelepon direject. Setelah ditelaah, mungkin cuma nomor fiktif/ingin iseng.","changed_at":"2026-02-12T02:58:56.963Z"}]'::jsonb,
    catatan = 'Ghosting total, di-WA tidak dibalas, ditelepon direject. Setelah ditelaah, mungkin cuma nomor fiktif/ingin iseng.',
    updated_at = '2026-02-12T02:58:56.963Z'
FROM CTE_79
WHERE leads.id = CTE_79.id;

WITH CTE_80 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 80 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-21T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-02-22T16:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Lagi saya bantu hitungkan rincian budget untuk 4 orang rombongan keluarga. Menunggu konfirmasi dari suami.","changed_at":"2026-02-23T23:25:36.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-02-25T09:42:16.963Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Ternyata sudah membayar DP di travel kompetitor karena CS kompetitor lebih cepat merespon.","changed_at":"2026-02-26T22:58:56.963Z"}]'::jsonb,
    catatan = 'Ternyata sudah membayar DP di travel kompetitor karena CS kompetitor lebih cepat merespon.',
    updated_at = '2026-02-26T22:58:56.963Z'
FROM CTE_80
WHERE leads.id = CTE_80.id;

WITH CTE_81 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 81 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-24T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-02-24T14:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-02-24T16:25:36.963Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Telah menyerahkan uang tunai ke kantor sebagai DP, kuitansi fisik sudah diberikan. Seat sudah diamankan.","changed_at":"2026-02-26T13:42:16.963Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Pelunasan komplit! Rp 32.500.000 sudah masuk. Proses cetak ID Card jamaah sedang berjalan.","changed_at":"2026-02-28T03:58:56.963Z"}]'::jsonb,
    catatan = 'Pelunasan komplit! Rp 32.500.000 sudah masuk. Proses cetak ID Card jamaah sedang berjalan.',
    updated_at = '2026-02-28T03:58:56.963Z'
FROM CTE_81
WHERE leads.id = CTE_81.id;

WITH CTE_82 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 82 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-16T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.","changed_at":"2026-02-17T23:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-02-19T09:25:36.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-02-19T22:42:16.963Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Ternyata sudah membayar DP di travel kompetitor karena CS kompetitor lebih cepat merespon.","changed_at":"2026-02-21T15:58:56.963Z"}]'::jsonb,
    catatan = 'Ternyata sudah membayar DP di travel kompetitor karena CS kompetitor lebih cepat merespon.',
    updated_at = '2026-02-21T15:58:56.963Z'
FROM CTE_82
WHERE leads.id = CTE_82.id;

WITH CTE_83 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 83 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-02-16T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-02-16T08:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-02-17T10:25:36.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-02-18T09:42:16.963Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Semua kelengkapan dokumen telah diterima, saya minta jamaah untuk segera melunasi uang muka pendaftaran.","changed_at":"2026-02-18T12:58:56.963Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Telah menyerahkan uang tunai ke kantor sebagai DP, kuitansi fisik sudah diberikan. Seat sudah diamankan.","changed_at":"2026-02-18T18:15:36.963Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Tanda terima pelunasan sudah keluar. Tinggal tunggu jadwal pengiriman koper dan perlengkapan dari gudang.","changed_at":"2026-02-20T09:32:16.963Z"}]'::jsonb,
    catatan = 'Tanda terima pelunasan sudah keluar. Tinggal tunggu jadwal pengiriman koper dan perlengkapan dari gudang.',
    updated_at = '2026-02-20T09:32:16.963Z'
FROM CTE_83
WHERE leads.id = CTE_83.id;

WITH CTE_84 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 84 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Proses FU',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-03-03T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Dihubungi via WA, merespon ''siap'' namun belum membaca detail paket yang dikirim.","changed_at":"2026-03-04T22:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-03-05T11:25:36.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-03-06T19:42:16.963Z"}]'::jsonb,
    catatan = 'Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.',
    updated_at = '2026-03-06T19:42:16.963Z'
FROM CTE_84
WHERE leads.id = CTE_84.id;

WITH CTE_85 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 85 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'DP',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-19T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.","changed_at":"2026-02-20T12:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-02-20T16:25:36.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-02-22T10:42:16.963Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Alhamdulillah, DP Rp 5.000.000 sudah ditransfer atas nama ibu tersebut. Kuitansi sudah diterbitkan.","changed_at":"2026-02-23T15:58:56.963Z"}]'::jsonb,
    catatan = 'Alhamdulillah, DP Rp 5.000.000 sudah ditransfer atas nama ibu tersebut. Kuitansi sudah diterbitkan.',
    updated_at = '2026-02-23T15:58:56.963Z'
FROM CTE_85
WHERE leads.id = CTE_85.id;

WITH CTE_86 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 86 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Contacted',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-03-01T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-03-01T08:08:56.963Z"}]'::jsonb,
    catatan = 'Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.',
    updated_at = '2026-03-01T08:08:56.963Z'
FROM CTE_86
WHERE leads.id = CTE_86.id;

WITH CTE_87 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 87 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-08T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Dihubungi via WA, merespon ''siap'' namun belum membaca detail paket yang dikirim.","changed_at":"2026-02-08T08:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-02-09T14:25:36.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-02-09T20:42:16.963Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Gagal berangkat karena sakit keras/alasan keluarga mendadak.","changed_at":"2026-02-10T06:58:56.963Z"}]'::jsonb,
    catatan = 'Gagal berangkat karena sakit keras/alasan keluarga mendadak.',
    updated_at = '2026-02-10T06:58:56.963Z'
FROM CTE_87
WHERE leads.id = CTE_87.id;

WITH CTE_88 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 88 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-03-01T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-03-03T02:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-03-03T15:25:36.963Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"DP sudah masuk via Virtual Account. Sisa pelunasan dijanjikan akhir bulan depan setelah panen.","changed_at":"2026-03-04T23:42:16.963Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Tanda terima pelunasan sudah keluar. Tinggal tunggu jadwal pengiriman koper dan perlengkapan dari gudang.","changed_at":"2026-03-06T16:58:56.963Z"}]'::jsonb,
    catatan = 'Tanda terima pelunasan sudah keluar. Tinggal tunggu jadwal pengiriman koper dan perlengkapan dari gudang.',
    updated_at = '2026-03-06T16:58:56.963Z'
FROM CTE_88
WHERE leads.id = CTE_88.id;

WITH CTE_89 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 89 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Proses FU',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-13T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan.","changed_at":"2026-02-14T11:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-02-15T05:25:36.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-02-16T14:42:16.963Z"}]'::jsonb,
    catatan = 'CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.',
    updated_at = '2026-02-16T14:42:16.963Z'
FROM CTE_89
WHERE leads.id = CTE_89.id;

WITH CTE_90 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 90 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-03-01T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Dihubungi via WA, merespon ''siap'' namun belum membaca detail paket yang dikirim.","changed_at":"2026-03-01T12:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-03-02T07:25:36.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-03-03T07:42:16.963Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Ternyata sudah membayar DP di travel kompetitor karena CS kompetitor lebih cepat merespon.","changed_at":"2026-03-03T14:58:56.963Z"}]'::jsonb,
    catatan = 'Ternyata sudah membayar DP di travel kompetitor karena CS kompetitor lebih cepat merespon.',
    updated_at = '2026-03-03T14:58:56.963Z'
FROM CTE_90
WHERE leads.id = CTE_90.id;

WITH CTE_91 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 91 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Contacted',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-02-07T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Ditelepon dan tersambung. Bapaknya sedang sibuk, minta dihubungi lagi besok jam 10 pagi.","changed_at":"2026-02-07T23:08:56.963Z"}]'::jsonb,
    catatan = 'Ditelepon dan tersambung. Bapaknya sedang sibuk, minta dihubungi lagi besok jam 10 pagi.',
    updated_at = '2026-02-07T23:08:56.963Z'
FROM CTE_91
WHERE leads.id = CTE_91.id;

WITH CTE_92 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 92 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Proses FU',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-03-08T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Dihubungi via WA, merespon ''siap'' namun belum membaca detail paket yang dikirim.","changed_at":"2026-03-08T17:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-03-10T08:25:36.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-03-11T11:42:16.963Z"}]'::jsonb,
    catatan = 'Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.',
    updated_at = '2026-03-11T11:42:16.963Z'
FROM CTE_92
WHERE leads.id = CTE_92.id;

WITH CTE_93 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 93 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Contacted',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-03-02T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Dihubungi via WA, merespon ''siap'' namun belum membaca detail paket yang dikirim.","changed_at":"2026-03-03T08:08:56.963Z"}]'::jsonb,
    catatan = 'Dihubungi via WA, merespon ''siap'' namun belum membaca detail paket yang dikirim.',
    updated_at = '2026-03-03T08:08:56.963Z'
FROM CTE_93
WHERE leads.id = CTE_93.id;

WITH CTE_94 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 94 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-19T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Ditelepon dan tersambung. Bapaknya sedang sibuk, minta dihubungi lagi besok jam 10 pagi.","changed_at":"2026-02-21T03:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-02-21T05:25:36.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-02-22T22:42:16.963Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Telah menyerahkan uang tunai ke kantor sebagai DP, kuitansi fisik sudah diberikan. Seat sudah diamankan.","changed_at":"2026-02-24T11:58:56.963Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Semua persiapan selesai. Jamaah fix berangkat di rombongan 15 Oktober. Terus menjaga silaturahmi untuk info manasik.","changed_at":"2026-02-26T09:15:36.963Z"}]'::jsonb,
    catatan = 'Semua persiapan selesai. Jamaah fix berangkat di rombongan 15 Oktober. Terus menjaga silaturahmi untuk info manasik.',
    updated_at = '2026-02-26T09:15:36.963Z'
FROM CTE_94
WHERE leads.id = CTE_94.id;

WITH CTE_95 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 95 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'DP',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-12T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Dihubungi via WA, merespon ''siap'' namun belum membaca detail paket yang dikirim.","changed_at":"2026-02-13T10:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-02-15T08:25:36.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-02-16T05:42:16.963Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Dokumen beres. Tinggal menunggu bukti transfer untuk diinput ke dalam sistem manifest.","changed_at":"2026-02-18T03:58:56.963Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"DP sudah masuk via Virtual Account. Sisa pelunasan dijanjikan akhir bulan depan setelah panen.","changed_at":"2026-02-19T05:15:36.963Z"}]'::jsonb,
    catatan = 'DP sudah masuk via Virtual Account. Sisa pelunasan dijanjikan akhir bulan depan setelah panen.',
    updated_at = '2026-02-19T05:15:36.963Z'
FROM CTE_95
WHERE leads.id = CTE_95.id;

WITH CTE_96 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 96 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Proses FU',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-28T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-02-28T18:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Lagi saya bantu hitungkan rincian budget untuk 4 orang rombongan keluarga. Menunggu konfirmasi dari suami.","changed_at":"2026-03-02T05:25:36.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-03-04T01:42:16.963Z"}]'::jsonb,
    catatan = 'Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.',
    updated_at = '2026-03-04T01:42:16.963Z'
FROM CTE_96
WHERE leads.id = CTE_96.id;

WITH CTE_97 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 97 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-20T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Dihubungi via WA, merespon ''siap'' namun belum membaca detail paket yang dikirim.","changed_at":"2026-02-20T20:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-02-22T17:25:36.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-02-23T22:42:16.963Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Gagal berangkat karena sakit keras/alasan keluarga mendadak.","changed_at":"2026-02-25T09:58:56.963Z"}]'::jsonb,
    catatan = 'Gagal berangkat karena sakit keras/alasan keluarga mendadak.',
    updated_at = '2026-02-25T09:58:56.963Z'
FROM CTE_97
WHERE leads.id = CTE_97.id;

WITH CTE_98 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 98 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-02-09T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.","changed_at":"2026-02-10T06:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-02-12T04:25:36.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-02-13T18:42:16.963Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Form aplikasi pendaftaran sudah diisi lengkap. Sedang menunggu KTP dan KK jamaah.","changed_at":"2026-02-15T09:58:56.963Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Telah menyerahkan uang tunai ke kantor sebagai DP, kuitansi fisik sudah diberikan. Seat sudah diamankan.","changed_at":"2026-02-17T03:15:36.963Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Pelunasan komplit! Rp 32.500.000 sudah masuk. Proses cetak ID Card jamaah sedang berjalan.","changed_at":"2026-02-17T23:32:16.963Z"}]'::jsonb,
    catatan = 'Pelunasan komplit! Rp 32.500.000 sudah masuk. Proses cetak ID Card jamaah sedang berjalan.',
    updated_at = '2026-02-17T23:32:16.963Z'
FROM CTE_98
WHERE leads.id = CTE_98.id;

WITH CTE_99 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 99 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Contacted',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-19T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-02-21T00:08:56.963Z"}]'::jsonb,
    catatan = 'Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.',
    updated_at = '2026-02-21T00:08:56.963Z'
FROM CTE_99
WHERE leads.id = CTE_99.id;

WITH CTE_100 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 100 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Contacted',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-03-06T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.","changed_at":"2026-03-07T07:08:56.963Z"}]'::jsonb,
    catatan = 'Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.',
    updated_at = '2026-03-07T07:08:56.963Z'
FROM CTE_100
WHERE leads.id = CTE_100.id;

WITH CTE_101 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 101 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Contacted',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-03-08T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Dihubungi via WA, merespon ''siap'' namun belum membaca detail paket yang dikirim.","changed_at":"2026-03-09T13:08:56.963Z"}]'::jsonb,
    catatan = 'Dihubungi via WA, merespon ''siap'' namun belum membaca detail paket yang dikirim.',
    updated_at = '2026-03-09T13:08:56.963Z'
FROM CTE_101
WHERE leads.id = CTE_101.id;

WITH CTE_102 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 102 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Contacted',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-07T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-02-08T04:08:56.963Z"}]'::jsonb,
    catatan = 'Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.',
    updated_at = '2026-02-08T04:08:56.963Z'
FROM CTE_102
WHERE leads.id = CTE_102.id;

WITH CTE_103 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 103 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Proses FU',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-03-07T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Dihubungi via WA, merespon ''siap'' namun belum membaca detail paket yang dikirim.","changed_at":"2026-03-08T09:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-03-09T00:25:36.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-03-10T14:42:16.963Z"}]'::jsonb,
    catatan = 'Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.',
    updated_at = '2026-03-10T14:42:16.963Z'
FROM CTE_103
WHERE leads.id = CTE_103.id;

WITH CTE_104 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 104 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Proses FU',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-03-06T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-03-07T09:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-03-08T19:25:36.963Z"}]'::jsonb,
    catatan = 'Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.',
    updated_at = '2026-03-08T19:25:36.963Z'
FROM CTE_104
WHERE leads.id = CTE_104.id;

WITH CTE_105 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 105 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-02-23T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Dihubungi via WA, merespon ''siap'' namun belum membaca detail paket yang dikirim.","changed_at":"2026-02-24T05:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Lagi saya bantu hitungkan rincian budget untuk 4 orang rombongan keluarga. Menunggu konfirmasi dari suami.","changed_at":"2026-02-25T02:25:36.963Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Alhamdulillah, DP Rp 5.000.000 sudah ditransfer atas nama ibu tersebut. Kuitansi sudah diterbitkan.","changed_at":"2026-02-25T19:42:16.963Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Tanda terima pelunasan sudah keluar. Tinggal tunggu jadwal pengiriman koper dan perlengkapan dari gudang.","changed_at":"2026-02-26T18:58:56.963Z"}]'::jsonb,
    catatan = 'Tanda terima pelunasan sudah keluar. Tinggal tunggu jadwal pengiriman koper dan perlengkapan dari gudang.',
    updated_at = '2026-02-26T18:58:56.963Z'
FROM CTE_105
WHERE leads.id = CTE_105.id;

WITH CTE_106 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 106 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-16T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan.","changed_at":"2026-02-18T03:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-02-18T16:25:36.963Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"DP sudah masuk via Virtual Account. Sisa pelunasan dijanjikan akhir bulan depan setelah panen.","changed_at":"2026-02-18T22:42:16.963Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Semua persiapan selesai. Jamaah fix berangkat di rombongan 15 Oktober. Terus menjaga silaturahmi untuk info manasik.","changed_at":"2026-02-20T08:58:56.963Z"}]'::jsonb,
    catatan = 'Semua persiapan selesai. Jamaah fix berangkat di rombongan 15 Oktober. Terus menjaga silaturahmi untuk info manasik.',
    updated_at = '2026-02-20T08:58:56.963Z'
FROM CTE_106
WHERE leads.id = CTE_106.id;

WITH CTE_107 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 107 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-03-02T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.","changed_at":"2026-03-03T00:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-03-03T23:25:36.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-03-05T20:42:16.963Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Budget jauh dari yang diharapkan (minta diskon ekstrem). Lost.","changed_at":"2026-03-07T14:58:56.963Z"}]'::jsonb,
    catatan = 'Budget jauh dari yang diharapkan (minta diskon ekstrem). Lost.',
    updated_at = '2026-03-07T14:58:56.963Z'
FROM CTE_107
WHERE leads.id = CTE_107.id;

WITH CTE_108 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 108 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-02-09T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan.","changed_at":"2026-02-10T19:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-02-12T18:25:36.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-02-13T13:42:16.963Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Ghosting total, di-WA tidak dibalas, ditelepon direject. Setelah ditelaah, mungkin cuma nomor fiktif/ingin iseng.","changed_at":"2026-02-13T17:58:56.963Z"}]'::jsonb,
    catatan = 'Ghosting total, di-WA tidak dibalas, ditelepon direject. Setelah ditelaah, mungkin cuma nomor fiktif/ingin iseng.',
    updated_at = '2026-02-13T17:58:56.963Z'
FROM CTE_108
WHERE leads.id = CTE_108.id;

WITH CTE_109 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 109 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-03-01T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Dihubungi via WA, merespon ''siap'' namun belum membaca detail paket yang dikirim.","changed_at":"2026-03-01T13:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-03-02T08:25:36.963Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Dokumen beres. Tinggal menunggu bukti transfer untuk diinput ke dalam sistem manifest.","changed_at":"2026-03-02T12:42:16.963Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Telah menyerahkan uang tunai ke kantor sebagai DP, kuitansi fisik sudah diberikan. Seat sudah diamankan.","changed_at":"2026-03-03T20:58:56.963Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Pelunasan komplit! Rp 32.500.000 sudah masuk. Proses cetak ID Card jamaah sedang berjalan.","changed_at":"2026-03-04T10:15:36.963Z"}]'::jsonb,
    catatan = 'Pelunasan komplit! Rp 32.500.000 sudah masuk. Proses cetak ID Card jamaah sedang berjalan.',
    updated_at = '2026-03-04T10:15:36.963Z'
FROM CTE_109
WHERE leads.id = CTE_109.id;

WITH CTE_110 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 110 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-03-06T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Dihubungi via WA, merespon ''siap'' namun belum membaca detail paket yang dikirim.","changed_at":"2026-03-07T21:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-03-08T22:25:36.963Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Ternyata sudah membayar DP di travel kompetitor karena CS kompetitor lebih cepat merespon.","changed_at":"2026-03-10T11:42:16.963Z"}]'::jsonb,
    catatan = 'Ternyata sudah membayar DP di travel kompetitor karena CS kompetitor lebih cepat merespon.',
    updated_at = '2026-03-10T11:42:16.963Z'
FROM CTE_110
WHERE leads.id = CTE_110.id;

WITH CTE_111 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 111 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-17T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-02-18T03:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Lagi saya bantu hitungkan rincian budget untuk 4 orang rombongan keluarga. Menunggu konfirmasi dari suami.","changed_at":"2026-02-18T08:25:36.963Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Gagal berangkat karena sakit keras/alasan keluarga mendadak.","changed_at":"2026-02-19T15:42:16.963Z"}]'::jsonb,
    catatan = 'Gagal berangkat karena sakit keras/alasan keluarga mendadak.',
    updated_at = '2026-02-19T15:42:16.963Z'
FROM CTE_111
WHERE leads.id = CTE_111.id;

WITH CTE_112 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 112 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-27T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-02-28T23:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-03-02T20:25:36.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-03-04T04:42:16.963Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Scan paspor dan buku vaksin sudah masuk ke kotak masuk email. Sedang divalidasi.","changed_at":"2026-03-06T02:58:56.963Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"DP sudah masuk via Virtual Account. Sisa pelunasan dijanjikan akhir bulan depan setelah panen.","changed_at":"2026-03-07T18:15:36.963Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Pelunasan komplit! Rp 32.500.000 sudah masuk. Proses cetak ID Card jamaah sedang berjalan.","changed_at":"2026-03-08T00:32:16.963Z"}]'::jsonb,
    catatan = 'Pelunasan komplit! Rp 32.500.000 sudah masuk. Proses cetak ID Card jamaah sedang berjalan.',
    updated_at = '2026-03-08T00:32:16.963Z'
FROM CTE_112
WHERE leads.id = CTE_112.id;

WITH CTE_113 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 113 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Proses FU',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-13T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Dihubungi via WA, merespon ''siap'' namun belum membaca detail paket yang dikirim.","changed_at":"2026-02-13T05:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-02-13T22:25:36.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-02-14T14:42:16.963Z"}]'::jsonb,
    catatan = 'Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.',
    updated_at = '2026-02-14T14:42:16.963Z'
FROM CTE_113
WHERE leads.id = CTE_113.id;

WITH CTE_114 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 114 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'DP',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-02-12T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-02-12T12:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Lagi saya bantu hitungkan rincian budget untuk 4 orang rombongan keluarga. Menunggu konfirmasi dari suami.","changed_at":"2026-02-12T13:25:36.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-02-13T16:42:16.963Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Semua kelengkapan dokumen telah diterima, saya minta jamaah untuk segera melunasi uang muka pendaftaran.","changed_at":"2026-02-15T04:58:56.963Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Telah menyerahkan uang tunai ke kantor sebagai DP, kuitansi fisik sudah diberikan. Seat sudah diamankan.","changed_at":"2026-02-16T05:15:36.963Z"}]'::jsonb,
    catatan = 'Telah menyerahkan uang tunai ke kantor sebagai DP, kuitansi fisik sudah diberikan. Seat sudah diamankan.',
    updated_at = '2026-02-16T05:15:36.963Z'
FROM CTE_114
WHERE leads.id = CTE_114.id;

WITH CTE_115 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 115 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-02-16T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.","changed_at":"2026-02-18T01:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-02-19T02:25:36.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-02-20T09:42:16.963Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Gagal berangkat karena sakit keras/alasan keluarga mendadak.","changed_at":"2026-02-21T02:58:56.963Z"}]'::jsonb,
    catatan = 'Gagal berangkat karena sakit keras/alasan keluarga mendadak.',
    updated_at = '2026-02-21T02:58:56.963Z'
FROM CTE_115
WHERE leads.id = CTE_115.id;

WITH CTE_116 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 116 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Proses FU',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-25T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.","changed_at":"2026-02-26T08:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-02-27T09:25:36.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-02-27T19:42:16.963Z"}]'::jsonb,
    catatan = 'CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.',
    updated_at = '2026-02-27T19:42:16.963Z'
FROM CTE_116
WHERE leads.id = CTE_116.id;

WITH CTE_117 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 117 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Contacted',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-03-03T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-03-03T07:08:56.963Z"}]'::jsonb,
    catatan = 'Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.',
    updated_at = '2026-03-03T07:08:56.963Z'
FROM CTE_117
WHERE leads.id = CTE_117.id;

WITH CTE_118 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 118 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-02-24T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-02-25T22:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Lagi saya bantu hitungkan rincian budget untuk 4 orang rombongan keluarga. Menunggu konfirmasi dari suami.","changed_at":"2026-02-26T15:25:36.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-02-26T15:42:16.963Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Budget jauh dari yang diharapkan (minta diskon ekstrem). Lost.","changed_at":"2026-02-28T07:58:56.963Z"}]'::jsonb,
    catatan = 'Budget jauh dari yang diharapkan (minta diskon ekstrem). Lost.',
    updated_at = '2026-02-28T07:58:56.963Z'
FROM CTE_118
WHERE leads.id = CTE_118.id;

WITH CTE_119 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 119 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-03-02T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Dihubungi via WA, merespon ''siap'' namun belum membaca detail paket yang dikirim.","changed_at":"2026-03-02T05:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-03-03T11:25:36.963Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Semua kelengkapan dokumen telah diterima, saya minta jamaah untuk segera melunasi uang muka pendaftaran.","changed_at":"2026-03-03T19:42:16.963Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"DP sudah masuk via Virtual Account. Sisa pelunasan dijanjikan akhir bulan depan setelah panen.","changed_at":"2026-03-04T03:58:56.963Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Semua persiapan selesai. Jamaah fix berangkat di rombongan 15 Oktober. Terus menjaga silaturahmi untuk info manasik.","changed_at":"2026-03-04T18:15:36.963Z"}]'::jsonb,
    catatan = 'Semua persiapan selesai. Jamaah fix berangkat di rombongan 15 Oktober. Terus menjaga silaturahmi untuk info manasik.',
    updated_at = '2026-03-04T18:15:36.963Z'
FROM CTE_119
WHERE leads.id = CTE_119.id;

WITH CTE_120 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 120 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-03-03T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Ditelepon dan tersambung. Bapaknya sedang sibuk, minta dihubungi lagi besok jam 10 pagi.","changed_at":"2026-03-03T08:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-03-04T11:25:36.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-03-05T23:42:16.963Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Gagal berangkat karena sakit keras/alasan keluarga mendadak.","changed_at":"2026-03-07T08:58:56.963Z"}]'::jsonb,
    catatan = 'Gagal berangkat karena sakit keras/alasan keluarga mendadak.',
    updated_at = '2026-03-07T08:58:56.963Z'
FROM CTE_120
WHERE leads.id = CTE_120.id;

WITH CTE_121 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 121 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Contacted',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-03-02T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.","changed_at":"2026-03-03T19:08:56.963Z"}]'::jsonb,
    catatan = 'Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.',
    updated_at = '2026-03-03T19:08:56.963Z'
FROM CTE_121
WHERE leads.id = CTE_121.id;

WITH CTE_122 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 122 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-13T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.","changed_at":"2026-02-14T05:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-02-15T19:25:36.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-02-17T17:42:16.963Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Scan paspor dan buku vaksin sudah masuk ke kotak masuk email. Sedang divalidasi.","changed_at":"2026-02-18T09:58:56.963Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Alhamdulillah, DP Rp 5.000.000 sudah ditransfer atas nama ibu tersebut. Kuitansi sudah diterbitkan.","changed_at":"2026-02-19T21:15:36.963Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Semua persiapan selesai. Jamaah fix berangkat di rombongan 15 Oktober. Terus menjaga silaturahmi untuk info manasik.","changed_at":"2026-02-20T17:32:16.963Z"}]'::jsonb,
    catatan = 'Semua persiapan selesai. Jamaah fix berangkat di rombongan 15 Oktober. Terus menjaga silaturahmi untuk info manasik.',
    updated_at = '2026-02-20T17:32:16.963Z'
FROM CTE_122
WHERE leads.id = CTE_122.id;

WITH CTE_123 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 123 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-20T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan.","changed_at":"2026-02-21T23:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-02-22T18:25:36.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-02-23T19:42:16.963Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Alhamdulillah, DP Rp 5.000.000 sudah ditransfer atas nama ibu tersebut. Kuitansi sudah diterbitkan.","changed_at":"2026-02-25T10:58:56.963Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Pelunasan komplit! Rp 32.500.000 sudah masuk. Proses cetak ID Card jamaah sedang berjalan.","changed_at":"2026-02-25T13:15:36.963Z"}]'::jsonb,
    catatan = 'Pelunasan komplit! Rp 32.500.000 sudah masuk. Proses cetak ID Card jamaah sedang berjalan.',
    updated_at = '2026-02-25T13:15:36.963Z'
FROM CTE_123
WHERE leads.id = CTE_123.id;

WITH CTE_124 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 124 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Proses FU',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-23T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-02-24T04:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-02-25T19:25:36.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-02-26T08:42:16.963Z"}]'::jsonb,
    catatan = 'Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.',
    updated_at = '2026-02-26T08:42:16.963Z'
FROM CTE_124
WHERE leads.id = CTE_124.id;

WITH CTE_125 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 125 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-22T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Ditelepon dan tersambung. Bapaknya sedang sibuk, minta dihubungi lagi besok jam 10 pagi.","changed_at":"2026-02-22T06:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-02-24T01:25:36.963Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Gagal berangkat karena sakit keras/alasan keluarga mendadak.","changed_at":"2026-02-25T06:42:16.963Z"}]'::jsonb,
    catatan = 'Gagal berangkat karena sakit keras/alasan keluarga mendadak.',
    updated_at = '2026-02-25T06:42:16.963Z'
FROM CTE_125
WHERE leads.id = CTE_125.id;

WITH CTE_126 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 126 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-13T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-02-14T12:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Lagi saya bantu hitungkan rincian budget untuk 4 orang rombongan keluarga. Menunggu konfirmasi dari suami.","changed_at":"2026-02-15T20:25:36.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-02-17T10:42:16.963Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Semua kelengkapan dokumen telah diterima, saya minta jamaah untuk segera melunasi uang muka pendaftaran.","changed_at":"2026-02-18T13:58:56.963Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"DP sudah masuk via Virtual Account. Sisa pelunasan dijanjikan akhir bulan depan setelah panen.","changed_at":"2026-02-19T05:15:36.963Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Tanda terima pelunasan sudah keluar. Tinggal tunggu jadwal pengiriman koper dan perlengkapan dari gudang.","changed_at":"2026-02-20T05:32:16.963Z"}]'::jsonb,
    catatan = 'Tanda terima pelunasan sudah keluar. Tinggal tunggu jadwal pengiriman koper dan perlengkapan dari gudang.',
    updated_at = '2026-02-20T05:32:16.963Z'
FROM CTE_126
WHERE leads.id = CTE_126.id;

WITH CTE_127 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 127 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'DP',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-09T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-02-10T10:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-02-11T09:25:36.963Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Telah menyerahkan uang tunai ke kantor sebagai DP, kuitansi fisik sudah diberikan. Seat sudah diamankan.","changed_at":"2026-02-13T02:42:16.963Z"}]'::jsonb,
    catatan = 'Telah menyerahkan uang tunai ke kantor sebagai DP, kuitansi fisik sudah diberikan. Seat sudah diamankan.',
    updated_at = '2026-02-13T02:42:16.963Z'
FROM CTE_127
WHERE leads.id = CTE_127.id;

WITH CTE_128 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 128 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-19T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan.","changed_at":"2026-02-21T02:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-02-22T12:25:36.963Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Ternyata sudah membayar DP di travel kompetitor karena CS kompetitor lebih cepat merespon.","changed_at":"2026-02-22T23:42:16.963Z"}]'::jsonb,
    catatan = 'Ternyata sudah membayar DP di travel kompetitor karena CS kompetitor lebih cepat merespon.',
    updated_at = '2026-02-22T23:42:16.963Z'
FROM CTE_128
WHERE leads.id = CTE_128.id;

WITH CTE_129 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 129 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'DP',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-07T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.","changed_at":"2026-02-08T13:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-02-09T00:25:36.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-02-10T00:42:16.963Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Semua kelengkapan dokumen telah diterima, saya minta jamaah untuk segera melunasi uang muka pendaftaran.","changed_at":"2026-02-10T04:58:56.963Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Telah menyerahkan uang tunai ke kantor sebagai DP, kuitansi fisik sudah diberikan. Seat sudah diamankan.","changed_at":"2026-02-11T18:15:36.963Z"}]'::jsonb,
    catatan = 'Telah menyerahkan uang tunai ke kantor sebagai DP, kuitansi fisik sudah diberikan. Seat sudah diamankan.',
    updated_at = '2026-02-11T18:15:36.963Z'
FROM CTE_129
WHERE leads.id = CTE_129.id;

WITH CTE_130 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 130 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'DP',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-02-11T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.","changed_at":"2026-02-11T13:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-02-11T16:25:36.963Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"DP sudah masuk via Virtual Account. Sisa pelunasan dijanjikan akhir bulan depan setelah panen.","changed_at":"2026-02-12T07:42:16.963Z"}]'::jsonb,
    catatan = 'DP sudah masuk via Virtual Account. Sisa pelunasan dijanjikan akhir bulan depan setelah panen.',
    updated_at = '2026-02-12T07:42:16.963Z'
FROM CTE_130
WHERE leads.id = CTE_130.id;

WITH CTE_131 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 131 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Proses FU',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-02-23T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan.","changed_at":"2026-02-23T21:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-02-23T23:25:36.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-02-24T01:42:16.963Z"}]'::jsonb,
    catatan = 'CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.',
    updated_at = '2026-02-24T01:42:16.963Z'
FROM CTE_131
WHERE leads.id = CTE_131.id;

WITH CTE_132 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 132 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-16T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan.","changed_at":"2026-02-16T17:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-02-16T20:25:36.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-02-18T10:42:16.963Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Gagal berangkat karena sakit keras/alasan keluarga mendadak.","changed_at":"2026-02-19T11:58:56.963Z"}]'::jsonb,
    catatan = 'Gagal berangkat karena sakit keras/alasan keluarga mendadak.',
    updated_at = '2026-02-19T11:58:56.963Z'
FROM CTE_132
WHERE leads.id = CTE_132.id;

WITH CTE_133 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 133 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-03-08T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-03-10T04:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-03-10T11:25:36.963Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"DP sudah masuk via Virtual Account. Sisa pelunasan dijanjikan akhir bulan depan setelah panen.","changed_at":"2026-03-11T23:42:16.963Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Semua persiapan selesai. Jamaah fix berangkat di rombongan 15 Oktober. Terus menjaga silaturahmi untuk info manasik.","changed_at":"2026-03-13T07:58:56.963Z"}]'::jsonb,
    catatan = 'Semua persiapan selesai. Jamaah fix berangkat di rombongan 15 Oktober. Terus menjaga silaturahmi untuk info manasik.',
    updated_at = '2026-03-13T07:58:56.963Z'
FROM CTE_133
WHERE leads.id = CTE_133.id;

WITH CTE_134 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 134 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-03-01T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Ditelepon dan tersambung. Bapaknya sedang sibuk, minta dihubungi lagi besok jam 10 pagi.","changed_at":"2026-03-01T11:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-03-02T11:25:36.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-03-03T09:42:16.963Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Form aplikasi pendaftaran sudah diisi lengkap. Sedang menunggu KTP dan KK jamaah.","changed_at":"2026-03-04T21:58:56.963Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Telah menyerahkan uang tunai ke kantor sebagai DP, kuitansi fisik sudah diberikan. Seat sudah diamankan.","changed_at":"2026-03-06T13:15:36.963Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Tanda terima pelunasan sudah keluar. Tinggal tunggu jadwal pengiriman koper dan perlengkapan dari gudang.","changed_at":"2026-03-07T02:32:16.963Z"}]'::jsonb,
    catatan = 'Tanda terima pelunasan sudah keluar. Tinggal tunggu jadwal pengiriman koper dan perlengkapan dari gudang.',
    updated_at = '2026-03-07T02:32:16.963Z'
FROM CTE_134
WHERE leads.id = CTE_134.id;

WITH CTE_135 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 135 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-03-03T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan.","changed_at":"2026-03-04T01:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-03-05T16:25:36.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Lagi saya bantu hitungkan rincian budget untuk 4 orang rombongan keluarga. Menunggu konfirmasi dari suami.","changed_at":"2026-03-06T10:42:16.963Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Budget jauh dari yang diharapkan (minta diskon ekstrem). Lost.","changed_at":"2026-03-06T12:58:56.963Z"}]'::jsonb,
    catatan = 'Budget jauh dari yang diharapkan (minta diskon ekstrem). Lost.',
    updated_at = '2026-03-06T12:58:56.963Z'
FROM CTE_135
WHERE leads.id = CTE_135.id;

WITH CTE_136 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 136 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-16T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Dihubungi via WA, merespon ''siap'' namun belum membaca detail paket yang dikirim.","changed_at":"2026-02-16T20:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-02-17T10:25:36.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-02-18T01:42:16.963Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"DP sudah masuk via Virtual Account. Sisa pelunasan dijanjikan akhir bulan depan setelah panen.","changed_at":"2026-02-18T19:58:56.963Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Pelunasan komplit! Rp 32.500.000 sudah masuk. Proses cetak ID Card jamaah sedang berjalan.","changed_at":"2026-02-18T22:15:36.963Z"}]'::jsonb,
    catatan = 'Pelunasan komplit! Rp 32.500.000 sudah masuk. Proses cetak ID Card jamaah sedang berjalan.',
    updated_at = '2026-02-18T22:15:36.963Z'
FROM CTE_136
WHERE leads.id = CTE_136.id;

WITH CTE_137 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 137 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Proses FU',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-03-01T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-03-02T04:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-03-02T18:25:36.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-03-02T23:42:16.963Z"}]'::jsonb,
    catatan = 'Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.',
    updated_at = '2026-03-02T23:42:16.963Z'
FROM CTE_137
WHERE leads.id = CTE_137.id;

WITH CTE_138 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 138 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-03-07T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-03-08T16:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-03-09T04:25:36.963Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Budget jauh dari yang diharapkan (minta diskon ekstrem). Lost.","changed_at":"2026-03-09T13:42:16.963Z"}]'::jsonb,
    catatan = 'Budget jauh dari yang diharapkan (minta diskon ekstrem). Lost.',
    updated_at = '2026-03-09T13:42:16.963Z'
FROM CTE_138
WHERE leads.id = CTE_138.id;

WITH CTE_139 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 139 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-03-06T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Ditelepon dan tersambung. Bapaknya sedang sibuk, minta dihubungi lagi besok jam 10 pagi.","changed_at":"2026-03-07T10:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-03-07T14:25:36.963Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Semua kelengkapan dokumen telah diterima, saya minta jamaah untuk segera melunasi uang muka pendaftaran.","changed_at":"2026-03-08T16:42:16.963Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"DP sudah masuk via Virtual Account. Sisa pelunasan dijanjikan akhir bulan depan setelah panen.","changed_at":"2026-03-09T08:58:56.963Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Tanda terima pelunasan sudah keluar. Tinggal tunggu jadwal pengiriman koper dan perlengkapan dari gudang.","changed_at":"2026-03-11T00:15:36.963Z"}]'::jsonb,
    catatan = 'Tanda terima pelunasan sudah keluar. Tinggal tunggu jadwal pengiriman koper dan perlengkapan dari gudang.',
    updated_at = '2026-03-11T00:15:36.963Z'
FROM CTE_139
WHERE leads.id = CTE_139.id;

WITH CTE_140 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 140 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-22T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.","changed_at":"2026-02-22T16:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-02-24T06:25:36.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-02-24T18:42:16.963Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Scan paspor dan buku vaksin sudah masuk ke kotak masuk email. Sedang divalidasi.","changed_at":"2026-02-24T20:58:56.963Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"DP sudah masuk via Virtual Account. Sisa pelunasan dijanjikan akhir bulan depan setelah panen.","changed_at":"2026-02-25T02:15:36.963Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Tanda terima pelunasan sudah keluar. Tinggal tunggu jadwal pengiriman koper dan perlengkapan dari gudang.","changed_at":"2026-02-25T21:32:16.963Z"}]'::jsonb,
    catatan = 'Tanda terima pelunasan sudah keluar. Tinggal tunggu jadwal pengiriman koper dan perlengkapan dari gudang.',
    updated_at = '2026-02-25T21:32:16.963Z'
FROM CTE_140
WHERE leads.id = CTE_140.id;

WITH CTE_141 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 141 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-02-18T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan.","changed_at":"2026-02-18T21:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-02-19T23:25:36.963Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Gagal berangkat karena sakit keras/alasan keluarga mendadak.","changed_at":"2026-02-20T03:42:16.963Z"}]'::jsonb,
    catatan = 'Gagal berangkat karena sakit keras/alasan keluarga mendadak.',
    updated_at = '2026-02-20T03:42:16.963Z'
FROM CTE_141
WHERE leads.id = CTE_141.id;

WITH CTE_142 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 142 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-03-05T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan.","changed_at":"2026-03-07T00:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-03-08T22:25:36.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Lagi saya bantu hitungkan rincian budget untuk 4 orang rombongan keluarga. Menunggu konfirmasi dari suami.","changed_at":"2026-03-09T00:42:16.963Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Dokumen beres. Tinggal menunggu bukti transfer untuk diinput ke dalam sistem manifest.","changed_at":"2026-03-09T10:58:56.963Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Telah menyerahkan uang tunai ke kantor sebagai DP, kuitansi fisik sudah diberikan. Seat sudah diamankan.","changed_at":"2026-03-11T04:15:36.963Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Semua persiapan selesai. Jamaah fix berangkat di rombongan 15 Oktober. Terus menjaga silaturahmi untuk info manasik.","changed_at":"2026-03-12T06:32:16.963Z"}]'::jsonb,
    catatan = 'Semua persiapan selesai. Jamaah fix berangkat di rombongan 15 Oktober. Terus menjaga silaturahmi untuk info manasik.',
    updated_at = '2026-03-12T06:32:16.963Z'
FROM CTE_142
WHERE leads.id = CTE_142.id;

WITH CTE_143 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 143 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-02-18T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Ditelepon dan tersambung. Bapaknya sedang sibuk, minta dihubungi lagi besok jam 10 pagi.","changed_at":"2026-02-19T15:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-02-20T04:25:36.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-02-20T08:42:16.963Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Scan paspor dan buku vaksin sudah masuk ke kotak masuk email. Sedang divalidasi.","changed_at":"2026-02-21T09:58:56.963Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Telah menyerahkan uang tunai ke kantor sebagai DP, kuitansi fisik sudah diberikan. Seat sudah diamankan.","changed_at":"2026-02-22T19:15:36.963Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Tanda terima pelunasan sudah keluar. Tinggal tunggu jadwal pengiriman koper dan perlengkapan dari gudang.","changed_at":"2026-02-24T18:32:16.963Z"}]'::jsonb,
    catatan = 'Tanda terima pelunasan sudah keluar. Tinggal tunggu jadwal pengiriman koper dan perlengkapan dari gudang.',
    updated_at = '2026-02-24T18:32:16.963Z'
FROM CTE_143
WHERE leads.id = CTE_143.id;

WITH CTE_144 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 144 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-02-10T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-02-11T18:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-02-12T04:25:36.963Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Ghosting total, di-WA tidak dibalas, ditelepon direject. Setelah ditelaah, mungkin cuma nomor fiktif/ingin iseng.","changed_at":"2026-02-12T20:42:16.963Z"}]'::jsonb,
    catatan = 'Ghosting total, di-WA tidak dibalas, ditelepon direject. Setelah ditelaah, mungkin cuma nomor fiktif/ingin iseng.',
    updated_at = '2026-02-12T20:42:16.963Z'
FROM CTE_144
WHERE leads.id = CTE_144.id;

WITH CTE_145 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 145 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Contacted',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-02-16T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-02-16T05:08:56.963Z"}]'::jsonb,
    catatan = 'Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.',
    updated_at = '2026-02-16T05:08:56.963Z'
FROM CTE_145
WHERE leads.id = CTE_145.id;

WITH CTE_146 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 146 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-03-08T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-03-10T03:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Lagi saya bantu hitungkan rincian budget untuk 4 orang rombongan keluarga. Menunggu konfirmasi dari suami.","changed_at":"2026-03-10T09:25:36.963Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Ternyata sudah membayar DP di travel kompetitor karena CS kompetitor lebih cepat merespon.","changed_at":"2026-03-11T12:42:16.963Z"}]'::jsonb,
    catatan = 'Ternyata sudah membayar DP di travel kompetitor karena CS kompetitor lebih cepat merespon.',
    updated_at = '2026-03-11T12:42:16.963Z'
FROM CTE_146
WHERE leads.id = CTE_146.id;

WITH CTE_147 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 147 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-28T04:52:16.963Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan.","changed_at":"2026-03-01T14:08:56.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-03-01T19:25:36.963Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-03-03T10:42:16.963Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Semua kelengkapan dokumen telah diterima, saya minta jamaah untuk segera melunasi uang muka pendaftaran.","changed_at":"2026-03-05T05:58:56.963Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"DP sudah masuk via Virtual Account. Sisa pelunasan dijanjikan akhir bulan depan setelah panen.","changed_at":"2026-03-06T18:15:36.963Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Tanda terima pelunasan sudah keluar. Tinggal tunggu jadwal pengiriman koper dan perlengkapan dari gudang.","changed_at":"2026-03-06T19:32:16.963Z"}]'::jsonb,
    catatan = 'Tanda terima pelunasan sudah keluar. Tinggal tunggu jadwal pengiriman koper dan perlengkapan dari gudang.',
    updated_at = '2026-03-06T19:32:16.963Z'
FROM CTE_147
WHERE leads.id = CTE_147.id;

WITH CTE_148 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 148 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-09T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Dihubungi via WA, merespon ''siap'' namun belum membaca detail paket yang dikirim.","changed_at":"2026-02-10T03:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-02-10T03:25:36.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-02-11T11:42:16.964Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Alhamdulillah, DP Rp 5.000.000 sudah ditransfer atas nama ibu tersebut. Kuitansi sudah diterbitkan.","changed_at":"2026-02-12T10:58:56.964Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Tanda terima pelunasan sudah keluar. Tinggal tunggu jadwal pengiriman koper dan perlengkapan dari gudang.","changed_at":"2026-02-12T18:15:36.964Z"}]'::jsonb,
    catatan = 'Tanda terima pelunasan sudah keluar. Tinggal tunggu jadwal pengiriman koper dan perlengkapan dari gudang.',
    updated_at = '2026-02-12T18:15:36.964Z'
FROM CTE_148
WHERE leads.id = CTE_148.id;

WITH CTE_149 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 149 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-12T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.","changed_at":"2026-02-13T13:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-02-14T17:25:36.964Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Gagal berangkat karena sakit keras/alasan keluarga mendadak.","changed_at":"2026-02-16T09:42:16.964Z"}]'::jsonb,
    catatan = 'Gagal berangkat karena sakit keras/alasan keluarga mendadak.',
    updated_at = '2026-02-16T09:42:16.964Z'
FROM CTE_149
WHERE leads.id = CTE_149.id;

WITH CTE_150 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 150 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-03-01T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.","changed_at":"2026-03-02T10:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-03-03T18:25:36.964Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Semua kelengkapan dokumen telah diterima, saya minta jamaah untuk segera melunasi uang muka pendaftaran.","changed_at":"2026-03-04T23:42:16.964Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Telah menyerahkan uang tunai ke kantor sebagai DP, kuitansi fisik sudah diberikan. Seat sudah diamankan.","changed_at":"2026-03-05T01:58:56.964Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Tanda terima pelunasan sudah keluar. Tinggal tunggu jadwal pengiriman koper dan perlengkapan dari gudang.","changed_at":"2026-03-06T09:15:36.964Z"}]'::jsonb,
    catatan = 'Tanda terima pelunasan sudah keluar. Tinggal tunggu jadwal pengiriman koper dan perlengkapan dari gudang.',
    updated_at = '2026-03-06T09:15:36.964Z'
FROM CTE_150
WHERE leads.id = CTE_150.id;

WITH CTE_151 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 151 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-23T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Dihubungi via WA, merespon ''siap'' namun belum membaca detail paket yang dikirim.","changed_at":"2026-02-24T13:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-02-25T09:25:36.964Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Scan paspor dan buku vaksin sudah masuk ke kotak masuk email. Sedang divalidasi.","changed_at":"2026-02-26T11:42:16.964Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"DP sudah masuk via Virtual Account. Sisa pelunasan dijanjikan akhir bulan depan setelah panen.","changed_at":"2026-02-28T05:58:56.964Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Pelunasan komplit! Rp 32.500.000 sudah masuk. Proses cetak ID Card jamaah sedang berjalan.","changed_at":"2026-03-01T00:15:36.964Z"}]'::jsonb,
    catatan = 'Pelunasan komplit! Rp 32.500.000 sudah masuk. Proses cetak ID Card jamaah sedang berjalan.',
    updated_at = '2026-03-01T00:15:36.964Z'
FROM CTE_151
WHERE leads.id = CTE_151.id;

WITH CTE_152 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 152 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-13T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Ditelepon dan tersambung. Bapaknya sedang sibuk, minta dihubungi lagi besok jam 10 pagi.","changed_at":"2026-02-13T21:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Lagi saya bantu hitungkan rincian budget untuk 4 orang rombongan keluarga. Menunggu konfirmasi dari suami.","changed_at":"2026-02-15T07:25:36.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-02-15T13:42:16.964Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Ghosting total, di-WA tidak dibalas, ditelepon direject. Setelah ditelaah, mungkin cuma nomor fiktif/ingin iseng.","changed_at":"2026-02-16T10:58:56.964Z"}]'::jsonb,
    catatan = 'Ghosting total, di-WA tidak dibalas, ditelepon direject. Setelah ditelaah, mungkin cuma nomor fiktif/ingin iseng.',
    updated_at = '2026-02-16T10:58:56.964Z'
FROM CTE_152
WHERE leads.id = CTE_152.id;

WITH CTE_153 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 153 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'DP',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-03-04T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.","changed_at":"2026-03-04T16:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-03-05T21:25:36.964Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Scan paspor dan buku vaksin sudah masuk ke kotak masuk email. Sedang divalidasi.","changed_at":"2026-03-07T05:42:16.964Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"DP sudah masuk via Virtual Account. Sisa pelunasan dijanjikan akhir bulan depan setelah panen.","changed_at":"2026-03-07T12:58:56.964Z"}]'::jsonb,
    catatan = 'DP sudah masuk via Virtual Account. Sisa pelunasan dijanjikan akhir bulan depan setelah panen.',
    updated_at = '2026-03-07T12:58:56.964Z'
FROM CTE_153
WHERE leads.id = CTE_153.id;

WITH CTE_154 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 154 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'DP',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-02-15T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Ditelepon dan tersambung. Bapaknya sedang sibuk, minta dihubungi lagi besok jam 10 pagi.","changed_at":"2026-02-15T17:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-02-17T11:25:36.964Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Form aplikasi pendaftaran sudah diisi lengkap. Sedang menunggu KTP dan KK jamaah.","changed_at":"2026-02-18T22:42:16.964Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"DP sudah masuk via Virtual Account. Sisa pelunasan dijanjikan akhir bulan depan setelah panen.","changed_at":"2026-02-19T09:58:56.964Z"}]'::jsonb,
    catatan = 'DP sudah masuk via Virtual Account. Sisa pelunasan dijanjikan akhir bulan depan setelah panen.',
    updated_at = '2026-02-19T09:58:56.964Z'
FROM CTE_154
WHERE leads.id = CTE_154.id;

WITH CTE_155 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 155 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-21T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan.","changed_at":"2026-02-21T09:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-02-21T20:25:36.964Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Ternyata sudah membayar DP di travel kompetitor karena CS kompetitor lebih cepat merespon.","changed_at":"2026-02-22T05:42:16.964Z"}]'::jsonb,
    catatan = 'Ternyata sudah membayar DP di travel kompetitor karena CS kompetitor lebih cepat merespon.',
    updated_at = '2026-02-22T05:42:16.964Z'
FROM CTE_155
WHERE leads.id = CTE_155.id;

WITH CTE_156 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 156 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-02-07T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Dihubungi via WA, merespon ''siap'' namun belum membaca detail paket yang dikirim.","changed_at":"2026-02-07T06:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-02-08T08:25:36.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-02-08T21:42:16.964Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Ternyata sudah membayar DP di travel kompetitor karena CS kompetitor lebih cepat merespon.","changed_at":"2026-02-10T11:58:56.964Z"}]'::jsonb,
    catatan = 'Ternyata sudah membayar DP di travel kompetitor karena CS kompetitor lebih cepat merespon.',
    updated_at = '2026-02-10T11:58:56.964Z'
FROM CTE_156
WHERE leads.id = CTE_156.id;

WITH CTE_157 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 157 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'DP',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-21T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.","changed_at":"2026-02-21T05:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Lagi saya bantu hitungkan rincian budget untuk 4 orang rombongan keluarga. Menunggu konfirmasi dari suami.","changed_at":"2026-02-22T19:25:36.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-02-23T11:42:16.964Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"DP sudah masuk via Virtual Account. Sisa pelunasan dijanjikan akhir bulan depan setelah panen.","changed_at":"2026-02-25T00:58:56.964Z"}]'::jsonb,
    catatan = 'DP sudah masuk via Virtual Account. Sisa pelunasan dijanjikan akhir bulan depan setelah panen.',
    updated_at = '2026-02-25T00:58:56.964Z'
FROM CTE_157
WHERE leads.id = CTE_157.id;

WITH CTE_158 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 158 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Contacted',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-27T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Dihubungi via WA, merespon ''siap'' namun belum membaca detail paket yang dikirim.","changed_at":"2026-02-28T04:08:56.964Z"}]'::jsonb,
    catatan = 'Dihubungi via WA, merespon ''siap'' namun belum membaca detail paket yang dikirim.',
    updated_at = '2026-02-28T04:08:56.964Z'
FROM CTE_158
WHERE leads.id = CTE_158.id;

WITH CTE_159 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 159 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-02-25T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Ditelepon dan tersambung. Bapaknya sedang sibuk, minta dihubungi lagi besok jam 10 pagi.","changed_at":"2026-02-26T00:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-02-27T19:25:36.964Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Alhamdulillah, DP Rp 5.000.000 sudah ditransfer atas nama ibu tersebut. Kuitansi sudah diterbitkan.","changed_at":"2026-03-01T18:42:16.964Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Semua persiapan selesai. Jamaah fix berangkat di rombongan 15 Oktober. Terus menjaga silaturahmi untuk info manasik.","changed_at":"2026-03-03T03:58:56.964Z"}]'::jsonb,
    catatan = 'Semua persiapan selesai. Jamaah fix berangkat di rombongan 15 Oktober. Terus menjaga silaturahmi untuk info manasik.',
    updated_at = '2026-03-03T03:58:56.964Z'
FROM CTE_159
WHERE leads.id = CTE_159.id;

WITH CTE_160 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 160 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-02-26T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Dihubungi via WA, merespon ''siap'' namun belum membaca detail paket yang dikirim.","changed_at":"2026-02-26T05:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Lagi saya bantu hitungkan rincian budget untuk 4 orang rombongan keluarga. Menunggu konfirmasi dari suami.","changed_at":"2026-02-27T18:25:36.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-03-01T00:42:16.964Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Scan paspor dan buku vaksin sudah masuk ke kotak masuk email. Sedang divalidasi.","changed_at":"2026-03-01T03:58:56.964Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Telah menyerahkan uang tunai ke kantor sebagai DP, kuitansi fisik sudah diberikan. Seat sudah diamankan.","changed_at":"2026-03-03T01:15:36.964Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Pelunasan komplit! Rp 32.500.000 sudah masuk. Proses cetak ID Card jamaah sedang berjalan.","changed_at":"2026-03-03T05:32:16.964Z"}]'::jsonb,
    catatan = 'Pelunasan komplit! Rp 32.500.000 sudah masuk. Proses cetak ID Card jamaah sedang berjalan.',
    updated_at = '2026-03-03T05:32:16.964Z'
FROM CTE_160
WHERE leads.id = CTE_160.id;

WITH CTE_161 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 161 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-10T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan.","changed_at":"2026-02-11T21:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-02-11T21:25:36.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-02-12T02:42:16.964Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Semua kelengkapan dokumen telah diterima, saya minta jamaah untuk segera melunasi uang muka pendaftaran.","changed_at":"2026-02-12T13:58:56.964Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Telah menyerahkan uang tunai ke kantor sebagai DP, kuitansi fisik sudah diberikan. Seat sudah diamankan.","changed_at":"2026-02-14T13:15:36.964Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Semua persiapan selesai. Jamaah fix berangkat di rombongan 15 Oktober. Terus menjaga silaturahmi untuk info manasik.","changed_at":"2026-02-14T23:32:16.964Z"}]'::jsonb,
    catatan = 'Semua persiapan selesai. Jamaah fix berangkat di rombongan 15 Oktober. Terus menjaga silaturahmi untuk info manasik.',
    updated_at = '2026-02-14T23:32:16.964Z'
FROM CTE_161
WHERE leads.id = CTE_161.id;

WITH CTE_162 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 162 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Proses FU',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-10T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan.","changed_at":"2026-02-11T19:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-02-11T23:25:36.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-02-12T02:42:16.964Z"}]'::jsonb,
    catatan = 'Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.',
    updated_at = '2026-02-12T02:42:16.964Z'
FROM CTE_162
WHERE leads.id = CTE_162.id;

WITH CTE_163 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 163 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-03-06T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Dihubungi via WA, merespon ''siap'' namun belum membaca detail paket yang dikirim.","changed_at":"2026-03-07T21:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-03-08T23:25:36.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-03-10T13:42:16.964Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Dokumen beres. Tinggal menunggu bukti transfer untuk diinput ke dalam sistem manifest.","changed_at":"2026-03-12T02:58:56.964Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Telah menyerahkan uang tunai ke kantor sebagai DP, kuitansi fisik sudah diberikan. Seat sudah diamankan.","changed_at":"2026-03-12T13:15:36.964Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Tanda terima pelunasan sudah keluar. Tinggal tunggu jadwal pengiriman koper dan perlengkapan dari gudang.","changed_at":"2026-03-14T01:32:16.964Z"}]'::jsonb,
    catatan = 'Tanda terima pelunasan sudah keluar. Tinggal tunggu jadwal pengiriman koper dan perlengkapan dari gudang.',
    updated_at = '2026-03-14T01:32:16.964Z'
FROM CTE_163
WHERE leads.id = CTE_163.id;

WITH CTE_164 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 164 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-16T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.","changed_at":"2026-02-18T00:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-02-18T12:25:36.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-02-19T03:42:16.964Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Ghosting total, di-WA tidak dibalas, ditelepon direject. Setelah ditelaah, mungkin cuma nomor fiktif/ingin iseng.","changed_at":"2026-02-20T00:58:56.964Z"}]'::jsonb,
    catatan = 'Ghosting total, di-WA tidak dibalas, ditelepon direject. Setelah ditelaah, mungkin cuma nomor fiktif/ingin iseng.',
    updated_at = '2026-02-20T00:58:56.964Z'
FROM CTE_164
WHERE leads.id = CTE_164.id;

WITH CTE_165 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 165 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-02-09T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Dihubungi via WA, merespon ''siap'' namun belum membaca detail paket yang dikirim.","changed_at":"2026-02-10T14:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-02-11T21:25:36.964Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Ternyata sudah membayar DP di travel kompetitor karena CS kompetitor lebih cepat merespon.","changed_at":"2026-02-12T20:42:16.964Z"}]'::jsonb,
    catatan = 'Ternyata sudah membayar DP di travel kompetitor karena CS kompetitor lebih cepat merespon.',
    updated_at = '2026-02-12T20:42:16.964Z'
FROM CTE_165
WHERE leads.id = CTE_165.id;

WITH CTE_166 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 166 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Proses FU',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-24T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan.","changed_at":"2026-02-25T16:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-02-26T13:25:36.964Z"}]'::jsonb,
    catatan = 'Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.',
    updated_at = '2026-02-26T13:25:36.964Z'
FROM CTE_166
WHERE leads.id = CTE_166.id;

WITH CTE_167 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 167 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-15T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan.","changed_at":"2026-02-15T09:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-02-17T06:25:36.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-02-17T09:42:16.964Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Telah menyerahkan uang tunai ke kantor sebagai DP, kuitansi fisik sudah diberikan. Seat sudah diamankan.","changed_at":"2026-02-18T03:58:56.964Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Tanda terima pelunasan sudah keluar. Tinggal tunggu jadwal pengiriman koper dan perlengkapan dari gudang.","changed_at":"2026-02-18T07:15:36.964Z"}]'::jsonb,
    catatan = 'Tanda terima pelunasan sudah keluar. Tinggal tunggu jadwal pengiriman koper dan perlengkapan dari gudang.',
    updated_at = '2026-02-18T07:15:36.964Z'
FROM CTE_167
WHERE leads.id = CTE_167.id;

WITH CTE_168 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 168 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-18T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.","changed_at":"2026-02-19T11:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-02-21T04:25:36.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-02-21T04:42:16.964Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Ghosting total, di-WA tidak dibalas, ditelepon direject. Setelah ditelaah, mungkin cuma nomor fiktif/ingin iseng.","changed_at":"2026-02-21T06:58:56.964Z"}]'::jsonb,
    catatan = 'Ghosting total, di-WA tidak dibalas, ditelepon direject. Setelah ditelaah, mungkin cuma nomor fiktif/ingin iseng.',
    updated_at = '2026-02-21T06:58:56.964Z'
FROM CTE_168
WHERE leads.id = CTE_168.id;

WITH CTE_169 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 169 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'DP',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-02-07T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-02-08T00:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-02-08T08:25:36.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-02-10T07:42:16.964Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Dokumen beres. Tinggal menunggu bukti transfer untuk diinput ke dalam sistem manifest.","changed_at":"2026-02-12T02:58:56.964Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Alhamdulillah, DP Rp 5.000.000 sudah ditransfer atas nama ibu tersebut. Kuitansi sudah diterbitkan.","changed_at":"2026-02-13T00:15:36.964Z"}]'::jsonb,
    catatan = 'Alhamdulillah, DP Rp 5.000.000 sudah ditransfer atas nama ibu tersebut. Kuitansi sudah diterbitkan.',
    updated_at = '2026-02-13T00:15:36.964Z'
FROM CTE_169
WHERE leads.id = CTE_169.id;

WITH CTE_170 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 170 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Contacted',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-03-06T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Dihubungi via WA, merespon ''siap'' namun belum membaca detail paket yang dikirim.","changed_at":"2026-03-07T21:08:56.964Z"}]'::jsonb,
    catatan = 'Dihubungi via WA, merespon ''siap'' namun belum membaca detail paket yang dikirim.',
    updated_at = '2026-03-07T21:08:56.964Z'
FROM CTE_170
WHERE leads.id = CTE_170.id;

WITH CTE_171 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 171 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-03-05T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.","changed_at":"2026-03-06T08:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-03-08T05:25:36.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-03-10T01:42:16.964Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"DP sudah masuk via Virtual Account. Sisa pelunasan dijanjikan akhir bulan depan setelah panen.","changed_at":"2026-03-11T06:58:56.964Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Tanda terima pelunasan sudah keluar. Tinggal tunggu jadwal pengiriman koper dan perlengkapan dari gudang.","changed_at":"2026-03-11T11:15:36.964Z"}]'::jsonb,
    catatan = 'Tanda terima pelunasan sudah keluar. Tinggal tunggu jadwal pengiriman koper dan perlengkapan dari gudang.',
    updated_at = '2026-03-11T11:15:36.964Z'
FROM CTE_171
WHERE leads.id = CTE_171.id;

WITH CTE_172 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 172 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Proses FU',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-18T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Dihubungi via WA, merespon ''siap'' namun belum membaca detail paket yang dikirim.","changed_at":"2026-02-19T21:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-02-20T22:25:36.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-02-21T08:42:16.964Z"}]'::jsonb,
    catatan = 'Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.',
    updated_at = '2026-02-21T08:42:16.964Z'
FROM CTE_172
WHERE leads.id = CTE_172.id;

WITH CTE_173 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 173 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-27T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.","changed_at":"2026-02-27T15:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-03-01T04:25:36.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-03-02T01:42:16.964Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Gagal berangkat karena sakit keras/alasan keluarga mendadak.","changed_at":"2026-03-02T07:58:56.964Z"}]'::jsonb,
    catatan = 'Gagal berangkat karena sakit keras/alasan keluarga mendadak.',
    updated_at = '2026-03-02T07:58:56.964Z'
FROM CTE_173
WHERE leads.id = CTE_173.id;

WITH CTE_174 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 174 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Contacted',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-16T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan.","changed_at":"2026-02-17T17:08:56.964Z"}]'::jsonb,
    catatan = 'Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan.',
    updated_at = '2026-02-17T17:08:56.964Z'
FROM CTE_174
WHERE leads.id = CTE_174.id;

WITH CTE_175 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 175 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-12T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Ditelepon dan tersambung. Bapaknya sedang sibuk, minta dihubungi lagi besok jam 10 pagi.","changed_at":"2026-02-13T00:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-02-13T14:25:36.964Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Semua kelengkapan dokumen telah diterima, saya minta jamaah untuk segera melunasi uang muka pendaftaran.","changed_at":"2026-02-14T13:42:16.964Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Alhamdulillah, DP Rp 5.000.000 sudah ditransfer atas nama ibu tersebut. Kuitansi sudah diterbitkan.","changed_at":"2026-02-16T07:58:56.964Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Pelunasan komplit! Rp 32.500.000 sudah masuk. Proses cetak ID Card jamaah sedang berjalan.","changed_at":"2026-02-18T00:15:36.964Z"}]'::jsonb,
    catatan = 'Pelunasan komplit! Rp 32.500.000 sudah masuk. Proses cetak ID Card jamaah sedang berjalan.',
    updated_at = '2026-02-18T00:15:36.964Z'
FROM CTE_175
WHERE leads.id = CTE_175.id;

WITH CTE_176 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 176 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-03-06T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-03-07T14:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Lagi saya bantu hitungkan rincian budget untuk 4 orang rombongan keluarga. Menunggu konfirmasi dari suami.","changed_at":"2026-03-09T07:25:36.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-03-10T06:42:16.964Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Budget jauh dari yang diharapkan (minta diskon ekstrem). Lost.","changed_at":"2026-03-12T05:58:56.964Z"}]'::jsonb,
    catatan = 'Budget jauh dari yang diharapkan (minta diskon ekstrem). Lost.',
    updated_at = '2026-03-12T05:58:56.964Z'
FROM CTE_176
WHERE leads.id = CTE_176.id;

WITH CTE_177 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 177 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-09T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-02-09T17:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-02-11T08:25:36.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-02-12T13:42:16.964Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Scan paspor dan buku vaksin sudah masuk ke kotak masuk email. Sedang divalidasi.","changed_at":"2026-02-12T17:58:56.964Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Alhamdulillah, DP Rp 5.000.000 sudah ditransfer atas nama ibu tersebut. Kuitansi sudah diterbitkan.","changed_at":"2026-02-13T05:15:36.964Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Tanda terima pelunasan sudah keluar. Tinggal tunggu jadwal pengiriman koper dan perlengkapan dari gudang.","changed_at":"2026-02-15T02:32:16.964Z"}]'::jsonb,
    catatan = 'Tanda terima pelunasan sudah keluar. Tinggal tunggu jadwal pengiriman koper dan perlengkapan dari gudang.',
    updated_at = '2026-02-15T02:32:16.964Z'
FROM CTE_177
WHERE leads.id = CTE_177.id;

WITH CTE_178 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 178 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Proses FU',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-26T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan.","changed_at":"2026-02-26T15:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-02-27T08:25:36.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-02-28T05:42:16.964Z"}]'::jsonb,
    catatan = 'Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.',
    updated_at = '2026-02-28T05:42:16.964Z'
FROM CTE_178
WHERE leads.id = CTE_178.id;

WITH CTE_179 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 179 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-07T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-02-08T06:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Lagi saya bantu hitungkan rincian budget untuk 4 orang rombongan keluarga. Menunggu konfirmasi dari suami.","changed_at":"2026-02-09T14:25:36.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-02-11T12:42:16.964Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Budget jauh dari yang diharapkan (minta diskon ekstrem). Lost.","changed_at":"2026-02-11T14:58:56.964Z"}]'::jsonb,
    catatan = 'Budget jauh dari yang diharapkan (minta diskon ekstrem). Lost.',
    updated_at = '2026-02-11T14:58:56.964Z'
FROM CTE_179
WHERE leads.id = CTE_179.id;

WITH CTE_180 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 180 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-02-07T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Dihubungi via WA, merespon ''siap'' namun belum membaca detail paket yang dikirim.","changed_at":"2026-02-07T09:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Lagi saya bantu hitungkan rincian budget untuk 4 orang rombongan keluarga. Menunggu konfirmasi dari suami.","changed_at":"2026-02-09T07:25:36.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-02-10T00:42:16.964Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Budget jauh dari yang diharapkan (minta diskon ekstrem). Lost.","changed_at":"2026-02-10T12:58:56.964Z"}]'::jsonb,
    catatan = 'Budget jauh dari yang diharapkan (minta diskon ekstrem). Lost.',
    updated_at = '2026-02-10T12:58:56.964Z'
FROM CTE_180
WHERE leads.id = CTE_180.id;

WITH CTE_181 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 181 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-16T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Dihubungi via WA, merespon ''siap'' namun belum membaca detail paket yang dikirim.","changed_at":"2026-02-17T20:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-02-19T13:25:36.964Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Budget jauh dari yang diharapkan (minta diskon ekstrem). Lost.","changed_at":"2026-02-21T01:42:16.964Z"}]'::jsonb,
    catatan = 'Budget jauh dari yang diharapkan (minta diskon ekstrem). Lost.',
    updated_at = '2026-02-21T01:42:16.964Z'
FROM CTE_181
WHERE leads.id = CTE_181.id;

WITH CTE_182 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 182 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-03-05T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-03-05T23:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-03-07T11:25:36.964Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Budget jauh dari yang diharapkan (minta diskon ekstrem). Lost.","changed_at":"2026-03-08T02:42:16.964Z"}]'::jsonb,
    catatan = 'Budget jauh dari yang diharapkan (minta diskon ekstrem). Lost.',
    updated_at = '2026-03-08T02:42:16.964Z'
FROM CTE_182
WHERE leads.id = CTE_182.id;

WITH CTE_183 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 183 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-03-05T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan.","changed_at":"2026-03-06T04:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-03-07T22:25:36.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-03-07T22:42:16.964Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Semua kelengkapan dokumen telah diterima, saya minta jamaah untuk segera melunasi uang muka pendaftaran.","changed_at":"2026-03-08T02:58:56.964Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"DP sudah masuk via Virtual Account. Sisa pelunasan dijanjikan akhir bulan depan setelah panen.","changed_at":"2026-03-09T06:15:36.964Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Semua persiapan selesai. Jamaah fix berangkat di rombongan 15 Oktober. Terus menjaga silaturahmi untuk info manasik.","changed_at":"2026-03-09T21:32:16.964Z"}]'::jsonb,
    catatan = 'Semua persiapan selesai. Jamaah fix berangkat di rombongan 15 Oktober. Terus menjaga silaturahmi untuk info manasik.',
    updated_at = '2026-03-09T21:32:16.964Z'
FROM CTE_183
WHERE leads.id = CTE_183.id;

WITH CTE_184 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 184 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-03-07T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan.","changed_at":"2026-03-08T04:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-03-08T06:25:36.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-03-09T15:42:16.964Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Scan paspor dan buku vaksin sudah masuk ke kotak masuk email. Sedang divalidasi.","changed_at":"2026-03-09T22:58:56.964Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Telah menyerahkan uang tunai ke kantor sebagai DP, kuitansi fisik sudah diberikan. Seat sudah diamankan.","changed_at":"2026-03-10T05:15:36.964Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Pelunasan komplit! Rp 32.500.000 sudah masuk. Proses cetak ID Card jamaah sedang berjalan.","changed_at":"2026-03-10T13:32:16.964Z"}]'::jsonb,
    catatan = 'Pelunasan komplit! Rp 32.500.000 sudah masuk. Proses cetak ID Card jamaah sedang berjalan.',
    updated_at = '2026-03-10T13:32:16.964Z'
FROM CTE_184
WHERE leads.id = CTE_184.id;

WITH CTE_185 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 185 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'DP',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-28T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan.","changed_at":"2026-03-01T17:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-03-03T03:25:36.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-03-03T06:42:16.964Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Scan paspor dan buku vaksin sudah masuk ke kotak masuk email. Sedang divalidasi.","changed_at":"2026-03-03T16:58:56.964Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Alhamdulillah, DP Rp 5.000.000 sudah ditransfer atas nama ibu tersebut. Kuitansi sudah diterbitkan.","changed_at":"2026-03-04T10:15:36.964Z"}]'::jsonb,
    catatan = 'Alhamdulillah, DP Rp 5.000.000 sudah ditransfer atas nama ibu tersebut. Kuitansi sudah diterbitkan.',
    updated_at = '2026-03-04T10:15:36.964Z'
FROM CTE_185
WHERE leads.id = CTE_185.id;

WITH CTE_186 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 186 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-21T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan.","changed_at":"2026-02-23T04:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-02-24T03:25:36.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-02-25T21:42:16.964Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Ghosting total, di-WA tidak dibalas, ditelepon direject. Setelah ditelaah, mungkin cuma nomor fiktif/ingin iseng.","changed_at":"2026-02-27T12:58:56.964Z"}]'::jsonb,
    catatan = 'Ghosting total, di-WA tidak dibalas, ditelepon direject. Setelah ditelaah, mungkin cuma nomor fiktif/ingin iseng.',
    updated_at = '2026-02-27T12:58:56.964Z'
FROM CTE_186
WHERE leads.id = CTE_186.id;

WITH CTE_187 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 187 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-16T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan.","changed_at":"2026-02-16T12:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-02-17T14:25:36.964Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Scan paspor dan buku vaksin sudah masuk ke kotak masuk email. Sedang divalidasi.","changed_at":"2026-02-19T09:42:16.964Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Alhamdulillah, DP Rp 5.000.000 sudah ditransfer atas nama ibu tersebut. Kuitansi sudah diterbitkan.","changed_at":"2026-02-20T23:58:56.964Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Pelunasan komplit! Rp 32.500.000 sudah masuk. Proses cetak ID Card jamaah sedang berjalan.","changed_at":"2026-02-22T06:15:36.964Z"}]'::jsonb,
    catatan = 'Pelunasan komplit! Rp 32.500.000 sudah masuk. Proses cetak ID Card jamaah sedang berjalan.',
    updated_at = '2026-02-22T06:15:36.964Z'
FROM CTE_187
WHERE leads.id = CTE_187.id;

WITH CTE_188 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 188 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-02-25T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Dihubungi via WA, merespon ''siap'' namun belum membaca detail paket yang dikirim.","changed_at":"2026-02-25T22:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-02-26T09:25:36.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-02-26T11:42:16.964Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Gagal berangkat karena sakit keras/alasan keluarga mendadak.","changed_at":"2026-02-27T20:58:56.964Z"}]'::jsonb,
    catatan = 'Gagal berangkat karena sakit keras/alasan keluarga mendadak.',
    updated_at = '2026-02-27T20:58:56.964Z'
FROM CTE_188
WHERE leads.id = CTE_188.id;

WITH CTE_189 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 189 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-21T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Ditelepon dan tersambung. Bapaknya sedang sibuk, minta dihubungi lagi besok jam 10 pagi.","changed_at":"2026-02-22T03:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-02-22T16:25:36.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-02-23T04:42:16.964Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Scan paspor dan buku vaksin sudah masuk ke kotak masuk email. Sedang divalidasi.","changed_at":"2026-02-23T14:58:56.964Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Alhamdulillah, DP Rp 5.000.000 sudah ditransfer atas nama ibu tersebut. Kuitansi sudah diterbitkan.","changed_at":"2026-02-24T05:15:36.964Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Tanda terima pelunasan sudah keluar. Tinggal tunggu jadwal pengiriman koper dan perlengkapan dari gudang.","changed_at":"2026-02-25T12:32:16.964Z"}]'::jsonb,
    catatan = 'Tanda terima pelunasan sudah keluar. Tinggal tunggu jadwal pengiriman koper dan perlengkapan dari gudang.',
    updated_at = '2026-02-25T12:32:16.964Z'
FROM CTE_189
WHERE leads.id = CTE_189.id;

WITH CTE_190 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 190 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'DP',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-02-12T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Ditelepon dan tersambung. Bapaknya sedang sibuk, minta dihubungi lagi besok jam 10 pagi.","changed_at":"2026-02-12T12:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-02-13T09:25:36.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.","changed_at":"2026-02-14T08:42:16.964Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Form aplikasi pendaftaran sudah diisi lengkap. Sedang menunggu KTP dan KK jamaah.","changed_at":"2026-02-14T18:58:56.964Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Alhamdulillah, DP Rp 5.000.000 sudah ditransfer atas nama ibu tersebut. Kuitansi sudah diterbitkan.","changed_at":"2026-02-15T23:15:36.964Z"}]'::jsonb,
    catatan = 'Alhamdulillah, DP Rp 5.000.000 sudah ditransfer atas nama ibu tersebut. Kuitansi sudah diterbitkan.',
    updated_at = '2026-02-15T23:15:36.964Z'
FROM CTE_190
WHERE leads.id = CTE_190.id;

WITH CTE_191 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 191 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Order Complete',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-02-22T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Ditelepon dan tersambung. Bapaknya sedang sibuk, minta dihubungi lagi besok jam 10 pagi.","changed_at":"2026-02-23T20:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya.","changed_at":"2026-02-24T03:25:36.964Z"},{"status":"Kirim PPL/Dokumen","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Semua kelengkapan dokumen telah diterima, saya minta jamaah untuk segera melunasi uang muka pendaftaran.","changed_at":"2026-02-25T16:42:16.964Z"},{"status":"DP","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Telah menyerahkan uang tunai ke kantor sebagai DP, kuitansi fisik sudah diberikan. Seat sudah diamankan.","changed_at":"2026-02-27T00:58:56.964Z"},{"status":"Order Complete","changed_by":"admin1","changed_by_name":"Rini Indah","catatan":"Pelunasan komplit! Rp 32.500.000 sudah masuk. Proses cetak ID Card jamaah sedang berjalan.","changed_at":"2026-02-27T10:15:36.964Z"}]'::jsonb,
    catatan = 'Pelunasan komplit! Rp 32.500.000 sudah masuk. Proses cetak ID Card jamaah sedang berjalan.',
    updated_at = '2026-02-27T10:15:36.964Z'
FROM CTE_191
WHERE leads.id = CTE_191.id;

WITH CTE_192 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 192 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-03-07T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.","changed_at":"2026-03-07T05:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-03-08T11:25:36.964Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Gagal berangkat karena sakit keras/alasan keluarga mendadak.","changed_at":"2026-03-10T04:42:16.964Z"}]'::jsonb,
    catatan = 'Gagal berangkat karena sakit keras/alasan keluarga mendadak.',
    updated_at = '2026-03-10T04:42:16.964Z'
FROM CTE_192
WHERE leads.id = CTE_192.id;

WITH CTE_193 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 193 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Lost',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-02-19T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.","changed_at":"2026-02-19T17:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-02-21T16:25:36.964Z"},{"status":"Lost","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Budget jauh dari yang diharapkan (minta diskon ekstrem). Lost.","changed_at":"2026-02-23T01:42:16.964Z"}]'::jsonb,
    catatan = 'Budget jauh dari yang diharapkan (minta diskon ekstrem). Lost.',
    updated_at = '2026-02-23T01:42:16.964Z'
FROM CTE_193
WHERE leads.id = CTE_193.id;

WITH CTE_194 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 194 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Contacted',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-03-08T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.","changed_at":"2026-03-08T08:08:56.964Z"}]'::jsonb,
    catatan = 'Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.',
    updated_at = '2026-03-08T08:08:56.964Z'
FROM CTE_194
WHERE leads.id = CTE_194.id;

WITH CTE_195 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 195 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Proses FU',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-15T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan.","changed_at":"2026-02-15T23:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-02-16T03:25:36.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.","changed_at":"2026-02-18T02:42:16.964Z"}]'::jsonb,
    catatan = 'Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.',
    updated_at = '2026-02-18T02:42:16.964Z'
FROM CTE_195
WHERE leads.id = CTE_195.id;

WITH CTE_196 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 196 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Contacted',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Mendaftar dari IG Ads paket Umroh Plus Turki.","changed_at":"2026-02-25T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.","changed_at":"2026-02-26T07:08:56.964Z"}]'::jsonb,
    catatan = 'Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.',
    updated_at = '2026-02-26T07:08:56.964Z'
FROM CTE_196
WHERE leads.id = CTE_196.id;

WITH CTE_197 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 197 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Proses FU',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-03-01T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan.","changed_at":"2026-03-02T15:08:56.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.","changed_at":"2026-03-03T10:25:36.964Z"},{"status":"Proses FU","changed_by":"admin1","changed_by_name":"Agus Setiawan","catatan":"CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.","changed_at":"2026-03-04T18:42:16.964Z"}]'::jsonb,
    catatan = 'CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.',
    updated_at = '2026-03-04T18:42:16.964Z'
FROM CTE_197
WHERE leads.id = CTE_197.id;

WITH CTE_198 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 198 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Contacted',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Lead masuk organik via pencarian Google.","changed_at":"2026-02-22T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Andi Surya","catatan":"Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan.","changed_at":"2026-02-22T13:08:56.964Z"}]'::jsonb,
    catatan = 'Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan.',
    updated_at = '2026-02-22T13:08:56.964Z'
FROM CTE_198
WHERE leads.id = CTE_198.id;

WITH CTE_199 AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET 199 LIMIT 1
)
UPDATE leads SET 
    status_followup = 'Contacted',
    status_history = '[{"status":"New Data","changed_by":"system","changed_by_name":"System Otoriter","catatan":"Data baru masuk dari FB Ads Landing Page Liburan.","changed_at":"2026-02-21T04:52:16.964Z"},{"status":"Contacted","changed_by":"admin1","changed_by_name":"Nisa Kamil","catatan":"Ditelepon dan tersambung. Bapaknya sedang sibuk, minta dihubungi lagi besok jam 10 pagi.","changed_at":"2026-02-21T13:08:56.964Z"}]'::jsonb,
    catatan = 'Ditelepon dan tersambung. Bapaknya sedang sibuk, minta dihubungi lagi besok jam 10 pagi.',
    updated_at = '2026-02-21T13:08:56.964Z'
FROM CTE_199
WHERE leads.id = CTE_199.id;
