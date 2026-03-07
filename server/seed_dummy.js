const mongoose = require('mongoose');
const Lead = require('./models/Lead');
const AdminUser = require('./models/AdminUser');
const Program = require('./models/Program');

// URI Koneksi Database
const MONGO_URI = 'mongodb://localhost:27017/munira_crm';

const NAMA_DEPAN = ['Ahmad', 'Budi', 'Cahyo', 'Dewi', 'Endang', 'Fajar', 'Gita', 'Hadi', 'Iwan', 'Joko', 'Siti', 'Yuni', 'Agus', 'Lestari', 'Putri', 'Rahmat', 'Rizky', 'Nur', 'Indra', 'Eko', 'Rini', 'Tari', 'Susanti', 'Wawan', 'Dian'];
const NAMA_BELAKANG = ['Pratama', 'Santoso', 'Hidayat', 'Wibowo', 'Saputra', 'Wijaya', 'Siregar', 'Setiawan', 'Kurniawan', 'Sari', 'Ningsih', 'Lestari', 'Maulana', 'Firmansyah', 'Syahputra', 'Baskoro', 'Kusuma', 'Ramadhan', 'Purnomo'];

const DOMISILI = ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Makassar', 'Semarang', 'Palembang', 'Depok', 'Tangerang', 'Bekasi', 'Bogor', 'Denpasar', 'Yogyakarta', 'Padang', 'Banjarmasin'];
const JUMLAH_BERANGKAT = ['1 Orang', '2 Orang', '3 Orang', 'Keluarga (4+)', 'Keluarga Besar (5+)'];
const KESIAPAN_PASPOR = ['Sudah Ada', 'Belum Ada', 'Sedang Diurus', 'Expired (Perpanjang)', 'Tidak Tahu'];
const STATUS = ['New Data', 'Contacted', 'Proses FU', 'Kirim PPL/Dokumen', 'DP', 'Order Complete', 'Lost', 'Invalid'];
const STATUS_WEIGHT = [10, 10, 20, 10, 15, 20, 10, 5]; // percent used for better data shape

const SOURCES = ['facebook', 'instagram', 'tiktok', 'google', 'organic', 'youtube', 'whatsapp_share'];
const MEDIUMS = ['cpc', 'cpa', 'social', 'video', 'referral', 'organic_search'];
const CAMPAIGNS = ['promo_ramadhan', 'itikaf_premium', 'liburan_keluarga', 'milad_munira', 'awalsafari', 'year_end_sale', 'diskon_dp'];
const LPS = ['/lp-bakti-anak', '/lp-itikaf-premium', '/lp-liburan', '/lp-liburan-short', '/lp-2-long'];
const FORMS = ['Form Popup', 'Form Footer', 'Sticky CTA', 'WA Floating'];
const PAKET_OPSI = ['Quad (Berempat)', 'Triple (Bertiga)', 'Double (Berdua)', 'Custom (Sesuai Permintaan)'];

const LOST_NOTES = ['Mahal', 'Tidak sesuai jadwal', 'Sudah pesan travel lain', 'Paspor masalah', 'Nunggu suami / istri setuju', 'Uang belum cukup', 'Hanya tanya-tanya', 'No tidak bisa dihubungi (Ghosting)'];
const WIN_NOTES = ['Alhamdulillah sepakat harga', 'Transfer DP cepat', 'Pelunasan lancar', 'Minta tolong kursi dekat jendela', 'Rombongan keluarga kompak', 'CS berhasil meyakinkan untuk itikaf'];
const FU_NOTES = ['Masih diskusi keluarga', 'Akan kabari lusa', 'Minta dikirimkan brosur via WA', 'Tanya soal vaksin', 'Tanya itinerary lengkap'];

function randomEl(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomWeighted(arr, weights) {
    let sum = weights.reduce((a, b) => a + b, 0);
    let rand = Math.random() * sum;
    for (let i = 0; i < weights.length; i++) {
        if (rand < weights[i]) return arr[i];
        rand -= weights[i];
    }
    return arr[0];
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePhone() {
    let prefix = '08' + randomEl(['12', '13', '52', '53', '21', '22', '19', '18', '77', '78', '96', '95']);
    for (let i = 0; i < 7; i++) {
        prefix += Math.floor(Math.random() * 10).toString();
    }
    return prefix;
}

async function runSeed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to DB');

        console.log('Menghapus data leads dan status history...');
        await Lead.deleteMany({});

        let salesUsers = await AdminUser.find({ role: 'sales' });
        let salesList = salesUsers.map(u => ({ username: u.username, full_name: u.full_name || u.username }));

        if (salesList.length === 0) {
            salesList = [
                { username: 'cs_ani', full_name: 'CS Ani' },
                { username: 'cs_budi', full_name: 'CS Budi' },
                { username: 'cs_caca', full_name: 'CS Caca' }
            ];
        }

        let programs = await Program.find({});
        let programIds = programs.map(p => p._id.toString());
        if (programIds.length === 0) programIds = ['PROG-XYZ', 'PROG-ABC', ''];

        const leads = [];

        // Timerange: 1 tahun lalu s.d 1 minggu lalu
        const satuTahunLalu = new Date();
        satuTahunLalu.setFullYear(satuTahunLalu.getFullYear() - 1);

        const satuMingguLalu = new Date();
        satuMingguLalu.setDate(satuMingguLalu.getDate() - 7);
        satuMingguLalu.setHours(23, 59, 59, 999);

        for (let i = 0; i < 200; i++) {
            // Generate random date between 1 year ago and 1 week ago
            let generatedTime = new Date(satuTahunLalu.getTime() + Math.random() * (satuMingguLalu.getTime() - satuTahunLalu.getTime()));
            let createdDate = new Date(generatedTime);

            // Randomly skew lead generation by months to make charts dynamic (e.g. cluster more close to Ramadhan/etc)

            let id = 'L-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 5);
            let nama = randomEl(NAMA_DEPAN) + ' ' + randomEl(NAMA_BELAKANG);
            let wa = generatePhone();
            let status = randomWeighted(STATUS, STATUS_WEIGHT);

            let revenue = 0;
            let currentCatatan = '';

            if (status === 'DP') {
                revenue = randInt(5, 15) * 1000000; // DP 5 - 15 jt
                currentCatatan = randomEl(WIN_NOTES);
            } else if (status === 'Order Complete') {
                revenue = randInt(25, 45) * 1000000; // Pelunasan 25 - 45 jt per pax
                currentCatatan = randomEl(WIN_NOTES);
            } else if (status === 'Lost' || status === 'Invalid') {
                currentCatatan = randomEl(LOST_NOTES) + '. ' + randomEl(LOST_NOTES);
            } else {
                currentCatatan = randomEl(FU_NOTES);
            }

            let lastContactDate = new Date(createdDate.getTime());
            // last contact bisa 1 s/d 14 hari sesudah created
            let daysAdded = randInt(1, 14);
            lastContactDate.setDate(lastContactDate.getDate() + daysAdded);
            if (lastContactDate > new Date()) lastContactDate = new Date();

            let cs = randomEl(salesList);

            // Create History records
            let histories = [];
            histories.push({
                status: 'New Data',
                changed_by: 'system',
                changed_by_name: 'Web System',
                catatan: 'Data masuk via LP',
                changed_at: createdDate
            });

            if (status !== 'New Data') {
                let midDate = new Date(createdDate.getTime() + (lastContactDate.getTime() - createdDate.getTime()) / 2);
                histories.push({
                    status: 'Contacted',
                    changed_by: cs.username,
                    changed_by_name: cs.full_name,
                    catatan: 'Sudah disapa perdana',
                    changed_at: midDate
                });
                histories.push({
                    status: status,
                    changed_by: cs.username,
                    changed_by_name: cs.full_name,
                    catatan: currentCatatan,
                    changed_at: lastContactDate
                });
            }

            leads.push({
                _id: id,
                user_id: 'USR-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
                nama_lengkap: nama,
                whatsapp_num: wa,
                domisili: randomEl(DOMISILI),
                yang_berangkat: randomEl(JUMLAH_BERANGKAT),
                paket_pilihan: randomEl(PAKET_OPSI),
                kesiapan_paspor: randomEl(KESIAPAN_PASPOR),
                fasilitas_utama: 'Minta hotel yang dekat dengan masjid haram',
                utm_source: randomEl(SOURCES),
                utm_medium: randomEl(MEDIUMS),
                utm_campaign: randomEl(CAMPAIGNS),
                landing_page: randomEl(LPS),
                form_source: randomEl(FORMS),
                status_followup: status,
                catatan: currentCatatan,
                revenue: revenue,
                program_id: randomEl(programIds) || '',
                last_contact: status !== 'New Data' ? lastContactDate : null,
                rencana_umrah: randomEl(['Bulan Depan', '2-3 Bulan Lagi', 'Tahun Depan', 'Menyesuaikan Budget']),
                assigned_to: cs.username,
                assigned_to_name: cs.full_name,
                status_history: histories,
                created_at: createdDate,
                updated_at: lastContactDate
            });
        }

        // Sort leads by created_at explicitly (for good measure before insert)
        leads.sort((a, b) => a.created_at - b.created_at);

        console.log(`Menyisipkan ${leads.length} data Leads...`);
        await Lead.insertMany(leads);

        console.log('✅ Selesai Menjalankan Seed!');
        process.exit(0);

    } catch (err) {
        console.error('❌ Terjadi kesalahan saat seed:', err);
        process.exit(1);
    }
}

runSeed();
