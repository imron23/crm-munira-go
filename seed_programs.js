/**
 * Seed Programs untuk Munira CRM
 * 3 Jenis Program Umrah + 3 Jenis Kelas (Bronze/Silver/Gold)
 * Range harga: 37jt - 60jt
 *
 * Run: node seed_programs.js
 */
require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/munira_crm';

const packageSchema = new mongoose.Schema({
    tier: String,
    room_type: String,
    price: { type: Number, default: 0 }
});

const programSchema = new mongoose.Schema({
    nama_program: { type: String, required: true },
    poster_url: { type: String, default: '' },
    deskripsi: { type: String, default: '' },
    landing_url: { type: String, default: '' },
    departure_dates: { type: [mongoose.Schema.Types.Mixed], default: [] },
    sort_order: { type: Number, default: 0 },
    is_active: { type: Boolean, default: true },
    packages: [packageSchema],
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const Program = mongoose.models.Program || mongoose.model('Program', programSchema);

// ==============================================================
// 3 JENIS PROGRAM UMRAH
// ==============================================================
const programs = [
    {
        nama_program: 'Umrah Reguler 2026',
        deskripsi: 'Program umrah standar berkualitas dengan maskapai terpercaya, hotel bintang 3-4, dan pembimbing bersertifikat. Cocok untuk jamaah yang ingin berangkat dengan budget terencana.',
        landing_url: '/lp-liburan/index.html',
        sort_order: 1,
        is_active: true,
        departure_dates: [
            { label: 'Keberangkatan Maret 2026', start: '2026-03-10', end: '2026-03-24' },
            { label: 'Keberangkatan April 2026', start: '2026-04-07', end: '2026-04-21' },
            { label: 'Keberangkatan Mei 2026', start: '2026-05-05', end: '2026-05-19' }
        ],
        packages: [
            // Bronze (Economy) - Kelas 1
            { tier: 'bronze', room_type: 'quad', price: 37_000_000 },
            { tier: 'bronze', room_type: 'triple', price: 39_000_000 },
            { tier: 'bronze', room_type: 'double', price: 42_000_000 },
            // Silver (Business) - Kelas 2
            { tier: 'silver', room_type: 'quad', price: 42_000_000 },
            { tier: 'silver', room_type: 'triple', price: 44_000_000 },
            { tier: 'silver', room_type: 'double', price: 47_000_000 },
            // Gold (Premium) - Kelas 3
            { tier: 'gold', room_type: 'quad', price: 48_000_000 },
            { tier: 'gold', room_type: 'triple', price: 50_500_000 },
            { tier: 'gold', room_type: 'double', price: 54_000_000 }
        ]
    },
    {
        nama_program: 'Umrah Liburan Sekolah 2026',
        deskripsi: 'Program umrah spesial di musim liburan sekolah. Dirancang untuk keluarga dengan anak-anak, dilengkapi program edukatif, hotel dekat Masjidil Haram, dan jadwal yang fleksibel.',
        landing_url: '/lp-liburan-short/index.html',
        sort_order: 2,
        is_active: true,
        departure_dates: [
            { label: 'Liburan Kenaikan Kelas Jun 2026', start: '2026-06-15', end: '2026-06-30' },
            { label: 'Liburan Sekolah Jul 2026', start: '2026-07-06', end: '2026-07-22' },
            { label: 'Libur Agustus 2026', start: '2026-08-10', end: '2026-08-25' }
        ],
        packages: [
            // Bronze - hotel bintang 3, jarak 1-2km
            { tier: 'bronze', room_type: 'quad', price: 40_000_000 },
            { tier: 'bronze', room_type: 'triple', price: 43_000_000 },
            { tier: 'bronze', room_type: 'double', price: 46_000_000 },
            // Silver - hotel bintang 4, jarak 500m-1km
            { tier: 'silver', room_type: 'quad', price: 45_000_000 },
            { tier: 'silver', room_type: 'triple', price: 48_000_000 },
            { tier: 'silver', room_type: 'double', price: 52_000_000 },
            // Gold - hotel bintang 5, walking distance
            { tier: 'gold', room_type: 'quad', price: 51_000_000 },
            { tier: 'gold', room_type: 'triple', price: 55_000_000 },
            { tier: 'gold', room_type: 'double', price: 60_000_000 }
        ]
    },
    {
        nama_program: "Umrah I'tikaf Ramadhan 17 Hari 2027",
        deskripsi: "Program umrah spesial Ramadhan dengan I'tikaf selama 17 malam di Masjidil Haram dan Masjid Nabawi. Menghadirkan pengalaman spiritual puncak di 10 malam terakhir Ramadhan. Termasuk sahur dan buka bersama.",
        landing_url: '/lp-bakti-anak/index.html',
        sort_order: 3,
        is_active: true,
        departure_dates: [
            { label: "Ramadhan 1448H (2027) - Batch A", start: '2027-03-14', end: '2027-03-31' },
            { label: "Ramadhan 1448H (2027) - Batch B (Last 10 Nights)", start: '2027-03-22', end: '2027-04-07' }
        ],
        packages: [
            // Bronze - hotel klas menengah, 17 hari termasuk sahur/buka
            { tier: 'bronze', room_type: 'quad', price: 45_000_000 },
            { tier: 'bronze', room_type: 'triple', price: 48_000_000 },
            { tier: 'bronze', room_type: 'double', price: 52_000_000 },
            // Silver - hotel bintang 4 dekat masjid, full board ramadhan
            { tier: 'silver', room_type: 'quad', price: 50_000_000 },
            { tier: 'silver', room_type: 'triple', price: 54_000_000 },
            { tier: 'silver', room_type: 'double', price: 58_000_000 },
            // Gold - hotel bintang 5 premium, full service ramadhan
            { tier: 'gold', room_type: 'quad', price: 55_000_000 },
            { tier: 'gold', room_type: 'triple', price: 58_000_000 },
            { tier: 'gold', room_type: 'double', price: 62_000_000 }
        ]
    }
];

// ==============================================================
// SEED
// ==============================================================
async function seed() {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected!');

    // Check dan hapus program lama dengan nama sama
    for (const prog of programs) {
        const existing = await Program.findOne({ nama_program: prog.nama_program });
        if (existing) {
            console.log(`⚠️  Program "${prog.nama_program}" sudah ada, skip.`);
            continue;
        }
        const created = await Program.create(prog);
        console.log(`✅ Created: ${created.nama_program} (${prog.packages.length} packages, min Rp ${Math.min(...prog.packages.map(p => p.price)).toLocaleString('id-ID')} - max Rp ${Math.max(...prog.packages.map(p => p.price)).toLocaleString('id-ID')})`);
    }

    const total = await Program.countDocuments();
    console.log(`\n🎉 Selesai! Total program di database: ${total}`);
    await mongoose.disconnect();
}

seed().catch(err => {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
});
