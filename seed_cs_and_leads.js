const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const adminUserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    password_hash: { type: String, required: true },
    role: { type: String, default: 'sales' },
    full_name: { type: String, default: '' },
    is_active: { type: Boolean, default: true },
    permissions: {
        can_delete: { type: Boolean, default: false },
        can_export: { type: Boolean, default: true },
        can_manage_team: { type: Boolean, default: false },
        can_view_revenue: { type: Boolean, default: true },
        can_view_leads: { type: Boolean, default: true },
        can_edit_leads: { type: Boolean, default: true },
        can_view_pages: { type: Boolean, default: true },
        can_edit_pages: { type: Boolean, default: false },
        can_view_programs: { type: Boolean, default: true },
        can_edit_programs: { type: Boolean, default: false },
        can_view_marketing: { type: Boolean, default: true },
        can_edit_marketing: { type: Boolean, default: false },
        can_view_forms: { type: Boolean, default: true },
        can_edit_forms: { type: Boolean, default: false },
    }
}, { timestamps: true });

const Lead = mongoose.model('Lead', leadSchema);
const AdminUser = mongoose.model('AdminUser', adminUserSchema);

// ─── Data Pool ───────────────────────────────────────────────────────────────

const namaList = [
    'Ahmad Fauzi', 'Siti Rahayu', 'Budi Santoso', 'Nur Hidayah', 'Muhammad Rizky',
    'Fatimah Zahra', 'Hendra Wijaya', 'Dewi Lestari', 'Agus Purnomo', 'Rina Susanti',
    'Bambang Setiawan', 'Anita Kurniawan', 'Joko Widodo', 'Sri Mulyani', 'Dian Pratiwi',
    'Wahyu Hidayat', 'Yuli Astuti', 'Rudi Hermawan', 'Mega Sari', 'Doni Kusuma',
    'Eko Prasetyo', 'Wulandari', 'Hendri Gunawan', 'Lina Marlina', 'Suprianto',
    'Novita Sari', 'Ari Wibowo', 'Tuti Rahayu', 'Firman Syah', 'Mira Andini',
    'Cahyo Nugroho', 'Endah Permata', 'Teguh Santoso', 'Ratna Dewi', 'Irfan Hakim'
];

const kotaList = ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Makassar', 'Bekasi', 'Depok', 'Yogyakarta'];
const paketList = ['Umrah Reguler Ekonomi', 'Umrah Reguler Bintang 4', 'Umrah Reguler Bintang 5', 'Umrah Plus Turki', 'Haji Plus Ekslusif'];
const revenueByPaket = {
    'Umrah Reguler Ekonomi': 22000000,
    'Umrah Reguler Bintang 4': 28500000,
    'Umrah Reguler Bintang 5': 35000000,
    'Umrah Plus Turki': 42000000,
    'Haji Plus Ekslusif': 85000000,
};
const utmSources = ['facebook', 'instagram', 'tiktok', 'google', 'organic', 'organic'];
const utmMediums = ['cpc', 'social', 'organic'];
const landingPages = ['lp-liburan', 'lp-itikaf-premium', 'lp-bakti-anak'];

// ─── Helper Functions ─────────────────────────────────────────────────────────

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randDate(daysAgo) {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    d.setHours(randInt(8, 22), randInt(0, 59));
    return d;
}
function randWA() {
    return '628' + String(randInt(100000000, 999999999));
}

// ─── Main Seed ───────────────────────────────────────────────────────────────

async function seed() {
    console.log('🔌 Connecting to MongoDB:', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected!');

    console.log('🗑️  Menghapus data lama...');
    await Lead.deleteMany({});
    await AdminUser.deleteMany({});

    console.log('👥 Membuat CS / Users...');
    const hash = bcrypt.hashSync('12345678', 12);

    const users = [
        { username: 'imron23', full_name: 'Imron Super Admin', role: 'super_admin', isGood: true },
        { username: 'cs1', full_name: 'Citra (CS 1)', role: 'sales', isGood: true },
        { username: 'cs2', full_name: 'Dion (CS 2)', role: 'sales', isGood: true },
        { username: 'cs3', full_name: 'Eka (CS 3)', role: 'sales', isGood: true },
        { username: 'cs4', full_name: 'Fandi (CS 4)', role: 'sales', isGood: false },
        { username: 'cs5', full_name: 'Gita (CS 5)', role: 'sales', isGood: false },
    ];

    const dbUsers = [];
    for (const u of users) {
        let perms = { can_view_leads: true, can_edit_leads: true, can_view_pages: true, can_view_programs: true, can_view_marketing: true };
        if (u.role === 'super_admin') {
            perms = { can_delete: true, can_export: true, can_manage_team: true, can_view_revenue: true, can_view_leads: true, can_edit_leads: true, can_view_pages: true, can_edit_pages: true, can_view_programs: true, can_edit_programs: true, can_view_marketing: true, can_edit_marketing: true, can_view_forms: true, can_edit_forms: true };
        }

        const created = await AdminUser.create({
            username: u.username,
            full_name: u.full_name,
            password_hash: hash,
            role: u.role,
            permissions: perms
        });
        dbUsers.push({ ...created.toObject(), isGood: u.isGood });
    }

    // exclude super admin from purely taking leads commonly, though they can. Let's just use sales.
    const salesTeam = dbUsers.filter(u => u.role === 'sales');

    console.log('🌱 Generating Leads... (Skala besar, bervariasi)');
    const leads = [];
    const usedWA = new Set();
    const usedUID = new Set();
    const now = new Date();

    for (let i = 0; i < 200; i++) {
        let wa; do { wa = randWA(); } while (usedWA.has(wa)); usedWA.add(wa);
        let uid; do { uid = 'MW' + String(randInt(10000, 99999)); } while (usedUID.has(uid)); usedUID.add(uid);

        const salesAgent = pick(salesTeam);
        // Is this CS good or bad?
        const isGood = salesAgent.isGood;

        // Tentukan skenario berdasarkan performa CS
        let status;
        let diffDaysEndup = 0; // Seberapa lama terakhir disentuh
        let responseMins = 0;

        if (isGood) {
            // CS Bagus: Banyak order complete, sedikit lost, tidak ada yang stagnan > 3 hari (baru disentuh max 1-2 hari lalu)
            const roll = Math.random();
            if (roll < 0.4) status = 'Order Complete'; // 40% CVR
            else if (roll < 0.6) status = 'DP'; // 20% DP
            else if (roll < 0.8) status = 'Nego Harga';
            else if (roll < 0.95) status = 'Proses FU';
            else status = 'Lost';
            diffDaysEndup = randInt(0, 1); // Disentuh belum lama (stagnan sangat rendah)
            responseMins = randInt(2, 30); // 2-30 menit response
        } else {
            // CS Kurang: Banyak Lost, banyak Stagnant (> 3 hari), Order complete sangat tipis
            const roll = Math.random();
            if (roll < 0.05) status = 'Order Complete'; // 5% closing rintisan
            else if (roll < 0.1) status = 'DP';
            else if (roll < 0.4) status = 'Proses FU'; // Bisa stagnant
            else if (roll < 0.6) status = 'Contacted'; // Bisa stagnant
            else if (roll < 0.7) status = 'New Data'; // Belum disentuh
            else status = 'Lost'; // 30% lost

            if (['Proses FU', 'Contacted', 'New Data'].includes(status)) {
                diffDaysEndup = randInt(4, 10); // STAGNANT > 3 HARI
            } else {
                diffDaysEndup = randInt(1, 15);
            }
            responseMins = randInt(120, 2880); // Response lelet, 2 jam s/d 2 hari
        }

        const createdDaysAgo = randInt(diffDaysEndup + 2, 60);
        const createdAt = randDate(createdDaysAgo);

        // Generate history logs
        const history = [];
        let currentDate = new Date(createdAt);

        // Initial insert
        history.push({
            status: 'New Data',
            changed_by: 'system',
            changed_by_name: 'System',
            catatan: 'Lead baru masuk web',
            changed_at: new Date(currentDate)
        });

        // First response (contacted)
        if (status !== 'New Data') {
            currentDate = new Date(currentDate.getTime() + responseMins * 60000);
            history.push({
                status: 'Contacted',
                changed_by: salesAgent.username,
                changed_by_name: salesAgent.full_name,
                catatan: isGood ? 'Fast response via wa, nasabah welcome' : 'Maaf telat wa, lead slow respon',
                changed_at: new Date(currentDate)
            });

            // Status akhir
            if (status !== 'Contacted') {
                const finalDate = new Date(now.getTime() - (diffDaysEndup * 86400000));
                history.push({
                    status: status,
                    changed_by: salesAgent.username,
                    changed_by_name: salesAgent.full_name,
                    catatan: status === 'Order Complete' ? 'LUNAS!' : (status === 'Lost' ? 'Tidak tertarik (kemahalan)' : 'Sedang follow up rutin'),
                    changed_at: new Date(finalDate)
                });
            }
        }

        const paket = pick(paketList);
        let revenue = 0;
        if (status === 'Order Complete') revenue = revenueByPaket[paket];
        else if (status === 'DP') revenue = Math.floor(revenueByPaket[paket] * 0.2);

        leads.push({
            _id: wa,
            user_id: uid,
            nama_lengkap: pick(namaList) + ' ' + String(i),
            whatsapp_num: wa,
            domisili: pick(kotaList),
            paket_pilihan: paket,
            utm_source: pick(utmSources),
            utm_medium: pick(utmMediums),
            landing_page: pick(landingPages),
            status_followup: status,
            revenue,
            assigned_to: salesAgent.username,
            assigned_to_name: salesAgent.full_name,
            status_history: history,
            created_at: createdAt,
            updated_at: history[history.length - 1].changed_at
        });
    }

    await Lead.insertMany(leads, { ordered: false });

    console.log(`✅ Seed Sukses! 5 Tim Sales (3 Bagus, 2 Buruk) dengan total ${leads.length} Leads.`);
    console.log('Semua password akun adalah: 12345678');

    const byCS = {};
    leads.forEach(l => {
        if (!byCS[l.assigned_to_name]) byCS[l.assigned_to_name] = { total: 0, order: 0, stagnanCount: 0 };
        byCS[l.assigned_to_name].total++;
        if (l.status_followup === 'Order Complete' || l.status_followup === 'DP') byCS[l.assigned_to_name].order++;

        if (['Contacted', 'Proses FU', 'New Data'].includes(l.status_followup)) {
            const diffDays = (now - new Date(l.updated_at)) / 86400000;
            if (diffDays > 3) byCS[l.assigned_to_name].stagnanCount++;
        }
    });

    console.log('\n📊 Performa Simulasi per CS:');
    Object.keys(byCS).forEach(k => {
        const d = byCS[k];
        console.log(`- ${k.padEnd(16)}: ${d.total} leads | Closing: ${d.order} | Stagnan Alert: ${d.stagnanCount}`);
    });

    await mongoose.disconnect();
    process.exit(0);
}

seed().catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
});
