/**
 * MUNIRA WORLD CRM — Seed Script
 * Hapus semua leads lama, buat 100 leads baru dengan variasi lengkap + status history
 * Jalankan: node seed_100_leads_mongo.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/munira_crm';

// ─── Models ─────────────────────────────────────────────────────────────────

const statusHistorySchema = new mongoose.Schema({
    status: { type: String, required: true },
    changed_by: { type: String, default: 'system' },
    changed_by_name: { type: String, default: 'System' },
    catatan: { type: String, default: '' },
    changed_at: { type: Date, default: Date.now }
}, { _id: false });

const leadSchema = new mongoose.Schema({
    _id: { type: String },
    user_id: { type: String },
    nama_lengkap: { type: String, required: true },
    whatsapp_num: { type: String, required: true },
    domisili: { type: String, default: '' },
    yang_berangkat: { type: String, default: '' },
    paket_pilihan: { type: String, default: '' },
    kesiapan_paspor: { type: String, default: '' },
    fasilitas_utama: { type: String, default: '' },
    utm_source: { type: String, default: '' },
    utm_medium: { type: String, default: '' },
    utm_campaign: { type: String, default: '' },
    landing_page: { type: String, default: '' },
    status_followup: { type: String, default: 'New Data' },
    catatan: { type: String, default: '' },
    revenue: { type: Number, default: 0 },
    program_id: { type: String, default: '' },
    last_contact: { type: Date },
    rencana_umrah: { type: String, default: '' },
    assigned_to: { type: String, default: '' },
    assigned_to_name: { type: String, default: '' },
    status_history: { type: [statusHistorySchema], default: [] },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Lead = mongoose.model('Lead', leadSchema);

// ─── Data Pool ───────────────────────────────────────────────────────────────

const namaList = [
    'Ahmad Fauzi', 'Siti Rahayu', 'Budi Santoso', 'Nur Hidayah', 'Muhammad Rizky',
    'Fatimah Zahra', 'Hendra Wijaya', 'Dewi Lestari', 'Agus Purnomo', 'Rina Susanti',
    'Bambang Setiawan', 'Anita Kurniawan', 'Joko Widodo', 'Sri Mulyani', 'Dian Pratiwi',
    'Wahyu Hidayat', 'Yuli Astuti', 'Rudi Hermawan', 'Mega Sari', 'Doni Kusuma',
    'Eko Prasetyo', 'Wulandari', 'Hendri Gunawan', 'Lina Marlina', 'Suprianto',
    'Novita Sari', 'Ari Wibowo', 'Tuti Rahayu', 'Firman Syah', 'Mira Andini',
    'Cahyo Nugroho', 'Endah Permata', 'Teguh Santoso', 'Ratna Dewi', 'Irfan Hakim',
    'Yanti Purnama', 'Reza Pahlefi', 'Kartini Budi', 'Arif Rahman', 'Sulistyowati',
    'Fredy Hartono', 'Nurlela Sari', 'Bagus Setiawan', 'Ernawati', 'Haris Maulana',
    'Santi Rahayu', 'Anton Wahyu', 'Lasmi Indrawati', 'Rizal Ansori', 'Yeni Marlena',
    'Galih Prasetyo', 'Murni Setiani', 'Dimas Aditya', 'Sri Utami', 'Fahri Maulana',
    'Hayati Nasution', 'Gilang Ramadhan', 'Astrid Paramitha', 'Usman Saleh', 'Putri Andriani',
    'Ferry Irawan', 'Widi Rahayu', 'Saiful Bahri', 'Nila Sari', 'Dedy Firmansyah',
    'Rahma Wulandari', 'Zulkifli Arif', 'Sinta Permatasari', 'Hamid Arifin', 'Dwi Lestari',
    'Akbar Maulana', 'Poppy Aulia', 'Surya Darma', 'Fatmawati', 'Ryan Prasetyo',
    'Nadia Chairunnisa', 'Iwan Setiawan', 'Yuliana Pratiwi', 'Ricky Abdurrahman', 'Sulastri',
    'Andi Saputra', 'Melinda Sari', 'Faisal Hidayat', 'Trisna Wulan', 'Muhamad Yusuf',
    'Lia Ramadhani', 'Tedy Hartawan', 'Ningsih', 'Rizwan Hakim', 'Sumarti',
    'Fajri Rahman', 'Dian Lestari', 'Wahid Nurdin', 'Reski Amelia', 'Zaki Anwar',
    'Indah Permata', 'Bagas Nurohman', 'Aulia Rahmawati', 'Hendra Kurniawan', 'Vivi Oktaviani'
];

const kotaList = [
    'Jakarta', 'Jakarta', 'Jakarta', // bobot lebih tinggi Jakarta
    'Surabaya', 'Surabaya',
    'Bandung', 'Bandung',
    'Medan', 'Makassar', 'Semarang',
    'Bekasi', 'Depok', 'Tangerang', 'Bogor',
    'Yogyakarta', 'Solo', 'Malang',
    'Palembang', 'Pekanbaru', 'Batam',
    'Balikpapan', 'Samarinda', 'Pontianak',
    'Manado', 'Denpasar', 'Lombok',
    'Aceh', 'Padang', 'Jambi'
];

const paketList = [
    'Umrah Reguler Ekonomi', 'Umrah Reguler Ekonomi',
    'Umrah Reguler Bintang 4', 'Umrah Reguler Bintang 4', 'Umrah Reguler Bintang 4',
    'Umrah Reguler Bintang 5', 'Umrah Reguler Bintang 5',
    'Umrah Plus Turki', 'Umrah Plus Turki',
    'Umrah Plus Aqsa',
    'Umrah Liburan Keluarga',
    'Umrah Ramadhan Khusus',
    'Haji Plus Ekslusif',
    'Umrah VIP Bintang 5',
];

const revenueByPaket = {
    'Umrah Reguler Ekonomi': 22000000,
    'Umrah Reguler Bintang 4': 28500000,
    'Umrah Reguler Bintang 5': 35000000,
    'Umrah Plus Turki': 42000000,
    'Umrah Plus Aqsa': 38000000,
    'Umrah Liburan Keluarga': 31000000,
    'Umrah Ramadhan Khusus': 45000000,
    'Haji Plus Ekslusif': 85000000,
    'Umrah VIP Bintang 5': 65000000,
};

const utmSources = ['facebook', 'instagram', 'tiktok', 'google', 'whatsapp', 'organic', 'referral'];
const utmMediums = ['cpc', 'social', 'story', 'reel', 'organic', 'direct'];
const landingPages = ['lp-liburan', 'lp-liburan-short', 'lp-itikaf-premium', 'lp-bakti-anak', 'lp-2-long'];
const rencanaList = ['Secepatnya', '1-3 bulan', '3-6 bulan', '6-12 bulan', 'Lebih dari setahun', 'Belum pasti'];
const pasporList = ['Sudah punya', 'Sedang proses', 'Belum ada'];
const yangBerangkatList = ['Sendiri', 'Berdua (suami/istri)', 'Keluarga (3-4 orang)', 'Rombongan (5+ orang)'];
const fasilitasUtamaList = ['Hotel dekat Masjid', 'Makan 3x Sehari', 'Transportasi Mewah', 'Pembimbing Berpengalaman', 'Visa Cepat'];

const salesTeam = [
    { username: 'cs1', full_name: 'Siti Aisyah (CS 1)' },
    { username: 'cs2', full_name: 'Ahmad Fauzi (CS 2)' },
    { username: 'owner1', full_name: 'Pak Hasan (Owner)' },
    { username: 'Imron23', full_name: 'Super Admin' },
];

const catatanByStatus = {
    'Contacted': [
        'Lead sudah dihubungi via WA, respon positif.',
        'Sudah kenalan, lead ingin tahu info lebih lanjut.',
        'Lead antusias, minta dikirim brosur.',
        'Sudah kontak, lead meminta harga terbaru.',
        'Respon bagus, lead bilang sedang pertimbangkan.',
    ],
    'Proses FU': [
        'Lead sedang diskusi dengan keluarga.',
        'Sudah FU 2x, lead masih consider.',
        'Lead minta waktu seminggu untuk pikir-pikir.',
        'Sedang follow up aktif, lead masih hangat.',
        'Lead tertarik tapi budget belum siap.',
    ],
    'Nego Harga': [
        'Lead minta diskon 5%, sedang negosiasi.',
        'Permintaan cicilan dari lead, sedang diproses.',
        'Lead bandingkan harga dengan kompetitor.',
        'Sedang nego DP, lead minta keringanan.',
    ],
    'DP': [
        'DP sudah masuk Rp 5.000.000.',
        'DP diterima, menunggu pelunasan.',
        'DP sudah transfer, bukti sudah diterima.',
        'DP Rp 3.000.000 masuk, jadwal confirmed.',
    ],
    'Order Complete': [
        'CLOSING! ✅ Pembayaran lunas, dokumen lengkap.',
        'Order selesai, lead sudah konfirmasi keberangkatan.',
        'Deal! Pembayaran penuh sudah masuk.',
        'CLOSING! Pelunasan diterima, jadwal fixed.',
        'Order complete, lead sudah dapat kursi.',
    ],
    'Lost': [
        'Lead tidak respon setelah 7 hari follow up.',
        'Lead memilih kompetitor lain.',
        'Budget tidak sesuai, lead mundur.',
        'Lead tidak jadi berangkat karena urusan pribadi.',
        'Tidak ada respon meski sudah di-follow up 5x.',
    ],
    'Pembatalan': [
        'Lead membatalkan karena kondisi kesehatan.',
        'Pembatalan atas permintaan lead, refund diproses.',
        'Lead cancel karena pekerjaan mendadak.',
    ],
};

// ─── Helper Functions ─────────────────────────────────────────────────────────

function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randDate(daysAgo) {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    d.setHours(randInt(8, 22), randInt(0, 59));
    return d;
}

function randWA() {
    const prefix = ['628111', '628112', '628113', '628119', '628122', '628123',
        '628125', '628131', '628138', '628139', '628151', '628156', '628157', '628158'];
    return pick(prefix) + String(randInt(100000, 9999999)).padStart(7, '0');
}

function generateStatusHistory(finalStatus, createdAt, assignedBy) {
    const statusPath = {
        'New Data': ['New Data'],
        'Contacted': ['New Data', 'Contacted'],
        'Proses FU': ['New Data', 'Contacted', 'Proses FU'],
        'Nego Harga': ['New Data', 'Contacted', 'Proses FU', 'Nego Harga'],
        'DP': ['New Data', 'Contacted', 'Proses FU', 'Nego Harga', 'DP'],
        'Order Complete': ['New Data', 'Contacted', 'Proses FU', 'Nego Harga', 'DP', 'Order Complete'],
        'Lost': ['New Data', 'Contacted', 'Proses FU', 'Lost'],
        'Pembatalan': ['New Data', 'Contacted', 'Proses FU', 'Nego Harga', 'DP', 'Pembatalan'],
    };

    const path = statusPath[finalStatus] || ['New Data'];
    const history = [];
    let currentDate = new Date(createdAt);

    path.forEach((status, idx) => {
        currentDate = new Date(currentDate.getTime() + randInt(1, 3) * 24 * 60 * 60 * 1000 + randInt(1, 8) * 60 * 60 * 1000);
        const agent = pick(salesTeam);
        history.push({
            status,
            changed_by: agent.username,
            changed_by_name: agent.full_name,
            catatan: idx === 0 ? 'Lead baru masuk dari ' + pick(landingPages) : pick(catatanByStatus[status] || ['Diperbarui.']),
            changed_at: currentDate
        });
    });

    return history;
}

// ─── Status distribution ─────────────────────────────────────────────────────
// Target: 100 leads dengan distribusi realistis
const statusDistribution = [
    ...Array(25).fill('New Data'),          // 25 New Data (baru masuk)
    ...Array(18).fill('Contacted'),          // 18 Contacted
    ...Array(15).fill('Proses FU'),          // 15 Follow Up
    ...Array(8).fill('Nego Harga'),          // 8 Negosiasi
    ...Array(12).fill('DP'),                 // 12 DP
    ...Array(14).fill('Order Complete'),     // 14 Closing ✅
    ...Array(5).fill('Lost'),                // 5 Lost
    ...Array(3).fill('Pembatalan'),          // 3 Pembatalan
];

// ─── Main Seed ───────────────────────────────────────────────────────────────

async function seed() {
    console.log('🔌 Connecting to MongoDB:', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected!');

    // Hapus semua leads lama
    const deleted = await Lead.deleteMany({});
    console.log(`🗑️  Dihapus ${deleted.deletedCount} leads lama.`);

    const leads = [];
    const usedWA = new Set();
    const usedUID = new Set();

    for (let i = 0; i < 100; i++) {
        // WA unik
        let wa;
        do { wa = randWA(); } while (usedWA.has(wa));
        usedWA.add(wa);

        // User ID unik format MWxxx
        let uid;
        do { uid = 'MW' + String(randInt(1000, 9999)); } while (usedUID.has(uid));
        usedUID.add(uid);

        const status = statusDistribution[i];
        const nama = namaList[i] || (namaList[randInt(0, namaList.length - 1)] + ' ' + String(i));
        const paket = pick(paketList);
        const createdDaysAgo = randInt(1, 90);
        const createdAt = randDate(createdDaysAgo);
        const salesAgent = pick(salesTeam);

        // Revenue hanya untuk DP, Order Complete, Pembatalan
        let revenue = 0;
        if (status === 'Order Complete') {
            revenue = revenueByPaket[paket] || 30000000;
        } else if (status === 'DP') {
            revenue = Math.floor((revenueByPaket[paket] || 30000000) * pick([0.2, 0.25, 0.3]));
        } else if (status === 'Pembatalan') {
            revenue = 0;
        }

        const statusHistory = generateStatusHistory(status, createdAt, salesAgent);
        const lastHistory = statusHistory[statusHistory.length - 1];

        const lead = {
            _id: wa,
            user_id: uid,
            nama_lengkap: nama,
            whatsapp_num: wa,
            domisili: pick(kotaList),
            yang_berangkat: pick(yangBerangkatList),
            paket_pilihan: paket,
            kesiapan_paspor: pick(pasporList),
            fasilitas_utama: pick(fasilitasUtamaList),
            utm_source: pick(utmSources),
            utm_medium: pick(utmMediums),
            utm_campaign: pick(['ramadhan2026', 'liburan-sekolah', 'promo-haji-plus', 'umrah-keluarga', 'flash-sale', 'eid-special']),
            landing_page: pick(landingPages),
            status_followup: status,
            catatan: lastHistory ? lastHistory.catatan : '',
            revenue,
            program_id: '', // dibiarkan kosong, bisa diisi manual
            last_contact: lastHistory ? lastHistory.changed_at : createdAt,
            rencana_umrah: pick(rencanaList),
            assigned_to: salesAgent.username,
            assigned_to_name: salesAgent.full_name,
            status_history: statusHistory,
            created_at: createdAt,
            updated_at: lastHistory ? lastHistory.changed_at : createdAt,
        };

        leads.push(lead);
    }

    // Sort by created_at (terbaru dulu)
    leads.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    await Lead.insertMany(leads, { ordered: false });
    console.log(`✅ 100 leads baru berhasil di-seed!`);

    // Summary
    const byStatus = {};
    leads.forEach(l => { byStatus[l.status_followup] = (byStatus[l.status_followup] || 0) + 1; });
    console.log('\n📊 Distribusi Status:');
    Object.entries(byStatus).sort((a, b) => b[1] - a[1]).forEach(([status, count]) => {
        const bar = '█'.repeat(count);
        console.log(`  ${status.padEnd(20)} ${String(count).padStart(3)} ${bar}`);
    });

    const totalRevenue = leads.reduce((s, l) => s + (l.revenue || 0), 0);
    console.log(`\n💰 Total Revenue: Rp ${totalRevenue.toLocaleString('id-ID')}`);
    console.log(`📅 Range Tanggal: ${leads[leads.length - 1].created_at.toLocaleDateString('id-ID')} s/d ${leads[0].created_at.toLocaleDateString('id-ID')}`);

    await mongoose.disconnect();
    console.log('\n🎉 Selesai! Database siap digunakan.');
}

seed().catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
});
