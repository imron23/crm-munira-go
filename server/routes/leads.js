const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { verifyToken } = require('../middleware/auth');
const Lead = require('../models/Lead');
const Setting = require('../models/Setting');

// Utility XSS (basic)
const escapeHTML = (str) => {
    if (typeof str !== 'string') return str;
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

// === SEND TELEGRAM NOTIFICATION ===
async function sendTelegramAlert(message) {
    try {
        const tgToken = await Setting.findOne({ key: 'tg_bot_token' });
        const tgChat = await Setting.findOne({ key: 'tg_chat_id' });
        if (!tgToken?.value || !tgChat?.value) return;

        const https = require('https');
        const dataStr = JSON.stringify({
            chat_id: tgChat.value,
            text: message,
            parse_mode: 'Markdown'
        });
        const url = `https://api.telegram.org/bot${tgToken.value}/sendMessage`;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(dataStr)
            }
        };
        const req = https.request(url, options, (r) => {
            r.on('data', () => { });
        });
        req.on('error', (e) => console.error("Telegram Error:", e.message));
        req.write(dataStr);
        req.end();
    } catch (e) {
        console.error('Telegram notification error:', e);
    }
}

// === PUBLIC ROUTES ===

// POST /api/leads - Create new lead from landing page
router.post('/', async (req, res) => {
    console.log('[DEBUG] POST /api/leads incoming body:', req.body);
    let {
        nama_lengkap, whatsapp_num, domisili, yang_berangkat,
        paket_pilihan, kesiapan_paspor, fasilitas_utama,
        utm_source, utm_medium, utm_campaign, landing_page, form_source, rencana_umrah
    } = req.body;

    nama_lengkap = escapeHTML(nama_lengkap);
    domisili = escapeHTML(domisili);
    yang_berangkat = escapeHTML(yang_berangkat);
    paket_pilihan = escapeHTML(paket_pilihan);
    kesiapan_paspor = escapeHTML(kesiapan_paspor);
    fasilitas_utama = escapeHTML(fasilitas_utama);
    utm_source = escapeHTML(utm_source);
    utm_medium = escapeHTML(utm_medium);
    utm_campaign = escapeHTML(utm_campaign);
    landing_page = escapeHTML(landing_page);
    form_source = escapeHTML(form_source);
    rencana_umrah = escapeHTML(rencana_umrah);

    if (!nama_lengkap || !whatsapp_num) {
        return res.status(400).json({ success: false, message: 'Nama dan nomor WhatsApp wajib diisi' });
    }

    const cleanWA = whatsapp_num.replace(/\D/g, '');
    const id = cleanWA || uuidv4();

    // Generate user_id: YYMMDD-last4-seq
    const now = new Date();
    const yy = String(now.getFullYear()).slice(2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const last4 = cleanWA.length >= 4 ? cleanWA.slice(-4) : Math.floor(1000 + Math.random() * 9000).toString();

    try {
        let user_id;
        const existing = await Lead.findById(id);
        if (existing && existing.user_id) {
            user_id = existing.user_id;
        } else {
            const count = await Lead.countDocuments();
            const seqText = String(count + 1).padStart(5, '0');
            user_id = `${yy}${mm}${dd}-${last4}-${seqText}`;
        }

        const isNew = !existing;

        // Upsert by ID (WA number as key)
        const updatedLead = await Lead.findByIdAndUpdate(
            id,
            {
                $set: {
                    _id: id, user_id, nama_lengkap, whatsapp_num, domisili, yang_berangkat,
                    paket_pilihan, kesiapan_paspor, fasilitas_utama,
                    utm_source, utm_medium, utm_campaign, landing_page, form_source,
                    ...(rencana_umrah ? { rencana_umrah } : {})
                },
                $setOnInsert: {
                    status_followup: 'New Data',
                    status_history: [{
                        status: 'New Data',
                        changed_by: 'system',
                        changed_by_name: 'Landing Page',
                        catatan: `Lead masuk dari ${landing_page || 'LP'} (Form: ${form_source || 'Default'})`,
                        changed_at: new Date()
                    }]
                }
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // Async Telegram Notification for new leads
        if (isNew) {
            const message = `🔔 *NEW LEAD ALERT* 🔔\n\n`
                + `👤 *Nama:* ${nama_lengkap}\n`
                + `📱 *WA:* ${whatsapp_num}\n`
                + `📍 *Domisili:* ${domisili || '-'}\n`
                + `🕋 *Paket:* ${paket_pilihan || '-'}\n`
                + `🎯 *Berangkat:* ${yang_berangkat || '-'}\n`
                + `🛂 *Paspor:* ${kesiapan_paspor || '-'}\n`
                + `📣 *Sumber:* ${utm_source || 'organic'} / ${landing_page || '-'}\n\n`
                + `✅ Silakan cek CRM Dashboard untuk Follow-Up cepat! ⚡`;
            sendTelegramAlert(message);
        }

        res.status(201).json({ success: true, message: 'Lead berhasil dibuat', lead_id: id });
    } catch (err) {
        console.error('Error creating lead:', err);
        res.status(500).json({ success: false, message: 'Gagal membuat lead' });
    }
});

// === PROTECTED ROUTES (Dashboard) ===

// GET /api/leads - List all leads
router.get('/', verifyToken, async (req, res) => {
    try {
        const { status, limit = 50, offset = 0, search, assigned_to } = req.query;
        const filter = { is_deleted: { $ne: true } };
        if (status && status !== 'All') filter.status_followup = status;
        if (assigned_to) filter.assigned_to = assigned_to;
        if (search) {
            filter.$or = [
                { nama_lengkap: { $regex: search, $options: 'i' } },
                { whatsapp_num: { $regex: search, $options: 'i' } },
                { user_id: { $regex: search, $options: 'i' } }
            ];
        }

        // Sales: only see their own leads
        if (req.user.role === 'sales' || req.user.role === 'viewer') {
            if (req.user.role === 'sales') {
                filter.assigned_to = req.user.username;
            }
        }

        const [leads, total] = await Promise.all([
            Lead.find(filter).sort({ created_at: -1 }).skip(Number(offset)).limit(Number(limit)).lean(),
            Lead.countDocuments(filter)
        ]);

        // Normalize _id -> id for frontend
        const data = leads.map(l => ({ ...l, id: l._id }));

        res.json({ success: true, data, pagination: { total, limit: Number(limit), offset: Number(offset) } });
    } catch (err) {
        console.error('Error fetching leads:', err);
        res.status(500).json({ success: false, message: 'Gagal mengambil data leads' });
    }
});

// GET /api/leads/:id/history - Get status history for a lead
router.get('/:id/history', verifyToken, async (req, res) => {
    try {
        const lead = await Lead.findOne({ _id: req.params.id, is_deleted: { $ne: true } }).lean();
        if (!lead) return res.status(404).json({ success: false, message: 'Lead tidak ditemukan atau telah dihapus' });
        res.json({ success: true, data: lead.status_history || [] });
    } catch (err) {
        console.error('Error fetching history:', err);
        res.status(500).json({ success: false, message: 'Gagal mengambil history' });
    }
});

// PUT /api/leads/:id - Update lead
router.put('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    let { status_followup, catatan, last_contact, revenue, program_id, paket_pilihan, assigned_to, assigned_to_name } = req.body;

    status_followup = escapeHTML(status_followup);
    catatan = escapeHTML(catatan);
    paket_pilihan = escapeHTML(paket_pilihan);

    try {
        const lead = await Lead.findById(id);
        if (!lead) return res.status(404).json({ success: false, message: 'Lead tidak ditemukan' });

        const update = { $set: {} };
        const historyEntry = {};
        let statusChanged = false;

        if (status_followup !== undefined && status_followup !== lead.status_followup) {
            update.$set.status_followup = status_followup;
            statusChanged = true;
            historyEntry.status = status_followup;
            historyEntry.changed_by = req.user.username;
            historyEntry.changed_by_name = req.user.full_name || req.user.username;
            historyEntry.catatan = catatan || '';
            historyEntry.changed_at = new Date();
        }

        if (catatan !== undefined) update.$set.catatan = catatan;
        if (revenue !== undefined) update.$set.revenue = parseInt(revenue) || 0;
        if (program_id !== undefined) update.$set.program_id = program_id;
        if (paket_pilihan !== undefined) update.$set.paket_pilihan = paket_pilihan;
        if (last_contact !== undefined) update.$set.last_contact = new Date();
        if (assigned_to !== undefined) {
            update.$set.assigned_to = assigned_to;
            update.$set.assigned_to_name = assigned_to_name || assigned_to;
        }

        if (Object.keys(update.$set).length === 0) {
            return res.status(400).json({ success: false, message: 'Tidak ada field yang diupdate' });
        }

        // Push status history entry if status changed
        if (statusChanged) {
            update.$push = { status_history: historyEntry };
        }

        await Lead.findByIdAndUpdate(id, update, { new: true });

        // Telegram alert for status change
        if (statusChanged) {
            const tgMsg = `📊 *STATUS UPDATE*\n\n`
                + `👤 *Lead:* ${lead.nama_lengkap}\n`
                + `📱 *WA:* ${lead.whatsapp_num}\n`
                + `🔄 *Status:* ${lead.status_followup} → *${status_followup}*\n`
                + `👨‍💼 *Oleh:* ${req.user.full_name || req.user.username}\n`
                + (catatan ? `📝 *Catatan:* ${catatan}\n` : '');
            sendTelegramAlert(tgMsg);
        }

        res.json({ success: true, message: 'Lead berhasil diperbarui' });
    } catch (err) {
        console.error('Error updating lead:', err);
        res.status(500).json({ success: false, message: 'Gagal memperbarui lead' });
    }
});

// POST /api/leads/manual - Admin manual entry
router.post('/manual', verifyToken, async (req, res) => {
    let {
        nama_lengkap, whatsapp_num, domisili, yang_berangkat,
        paket_pilihan, kesiapan_paspor, status_followup,
        catatan, revenue, program_id, landing_page, form_source, rencana_umrah
    } = req.body;

    nama_lengkap = escapeHTML(nama_lengkap);
    domisili = escapeHTML(domisili);
    paket_pilihan = escapeHTML(paket_pilihan);
    catatan = escapeHTML(catatan);

    if (!nama_lengkap || !whatsapp_num) {
        return res.status(400).json({ success: false, message: 'Nama dan WhatsApp wajib diisi' });
    }

    const cleanWA = whatsapp_num.replace(/\D/g, '');
    const id = uuidv4();
    const now = new Date();
    const yy = String(now.getFullYear()).slice(2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const last4 = cleanWA.length >= 4 ? cleanWA.slice(-4) : '0000';
    const count = await Lead.countDocuments();
    const user_id = `${yy}${mm}${dd}-${last4}-${String(count + 1).padStart(5, '0')}`;

    const initStatus = status_followup || 'New Data';

    try {
        await Lead.create({
            _id: id, user_id, nama_lengkap, whatsapp_num,
            domisili: domisili || '', yang_berangkat: yang_berangkat || '',
            paket_pilihan: paket_pilihan || '', kesiapan_paspor: kesiapan_paspor || '',
            status_followup: initStatus,
            catatan: catatan || '', revenue: parseInt(revenue) || 0,
            program_id: program_id || '', landing_page: landing_page || 'manual',
            form_source: form_source || 'manual output',
            rencana_umrah: rencana_umrah || '',
            assigned_to: req.user.username,
            assigned_to_name: req.user.full_name || req.user.username,
            status_history: [{
                status: initStatus,
                changed_by: req.user.username,
                changed_by_name: req.user.full_name || req.user.username,
                catatan: 'Lead diinput manual oleh admin',
                changed_at: new Date()
            }]
        });

        res.status(201).json({ success: true, message: 'Order berhasil ditambahkan', lead_id: id });
    } catch (err) {
        console.error('Error creating manual order:', err);
        res.status(500).json({ success: false, message: 'Gagal membuat order' });
    }
});

// DELETE /api/leads/:id
router.delete('/:id', verifyToken, async (req, res) => {
    // Only super_admin or admin with delete permission
    if (!['super_admin', 'admin'].includes(req.user.role)) {
        return res.status(403).json({ success: false, message: 'Hanya admin yang bisa menghapus leads' });
    }
    try {
        const result = await Lead.findByIdAndUpdate(req.params.id, { is_deleted: true, deleted_at: new Date() });
        if (!result) return res.status(404).json({ success: false, message: 'Lead tidak ditemukan' });
        res.json({ success: true, message: 'Lead berhasil dihapus ke recycle bin' });
    } catch (err) {
        console.error('Error deleting lead:', err);
        res.status(500).json({ success: false, message: 'Gagal menghapus lead' });
    }
});

// GET /api/leads/template - Download CSV template
router.get('/template', verifyToken, async (req, res) => {
    const headers = [
        'nama_lengkap', 'whatsapp_num', 'domisili', 'yang_berangkat',
        'paket_pilihan', 'kesiapan_paspor', 'rencana_umrah', 'status_followup', 'catatan'
    ];
    const rows = [
        headers.join(','),
        '"Siti Rahayu","081234567890","Jakarta","2 Pax","Umrah Reguler","Sudah Ada","Maret 2026","New Data","Lead dari referral"',
        '"Ahmad Fauzi","087712345678","Bandung","1 Pax","Umrah Premium","Belum Ada","Juni 2026","Contacted",""',
        '"Dewi Hartini","089987654321","Surabaya","4 Pax","Umrah Liburan Sekolah","Dalam Proses","Juli 2026","New Data","Keluarga besar"'
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="template_import_leads_munira.csv"');
    res.send(rows);
});

// POST /api/leads/import - Bulk import from CSV
router.post('/import', verifyToken, async (req, res) => {
    if (!['super_admin', 'admin'].includes(req.user.role)) {
        return res.status(403).json({ success: false, message: 'Hanya admin yang boleh import data' });
    }
    const { leads: importedLeads } = req.body;
    if (!Array.isArray(importedLeads) || importedLeads.length === 0) {
        return res.status(400).json({ success: false, message: 'Data import kosong atau tidak valid' });
    }

    const VALID_STATUSES = ['New Data', 'Contacted', 'Proses FU', 'DP', 'Order Complete', 'Lost', 'Pembatalan', 'Pengembalian'];

    let imported = 0, skipped = 0, errors = [];
    const now = new Date();
    const yy = String(now.getFullYear()).slice(2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');

    for (let i = 0; i < importedLeads.length; i++) {
        const row = importedLeads[i];
        const nama = escapeHTML(String(row.nama_lengkap || '').trim());
        const wa = String(row.whatsapp_num || '').replace(/\D/g, '');

        if (!nama || !wa) {
            errors.push(`Baris ${i + 2}: nama/WA kosong`);
            skipped++;
            continue;
        }

        try {
            const existing = await Lead.findById(wa);
            if (existing) { skipped++; continue; }

            const count = await Lead.countDocuments();
            const last4 = wa.length >= 4 ? wa.slice(-4) : '0000';
            const user_id = `${yy}${mm}${dd}-${last4}-${String(count + 1).padStart(5, '0')}`;
            const initStatus = VALID_STATUSES.includes(row.status_followup) ? row.status_followup : 'New Data';

            await Lead.create({
                _id: wa, user_id, nama_lengkap: nama, whatsapp_num: wa,
                domisili: escapeHTML(String(row.domisili || '')),
                yang_berangkat: escapeHTML(String(row.yang_berangkat || '')),
                paket_pilihan: escapeHTML(String(row.paket_pilihan || '')),
                kesiapan_paspor: escapeHTML(String(row.kesiapan_paspor || '')),
                rencana_umrah: escapeHTML(String(row.rencana_umrah || '')),
                catatan: escapeHTML(String(row.catatan || '')),
                status_followup: initStatus,
                landing_page: 'import-csv',
                assigned_to: req.user.username,
                assigned_to_name: req.user.full_name || req.user.username,
                status_history: [{
                    status: initStatus,
                    changed_by: req.user.username,
                    changed_by_name: req.user.full_name || req.user.username,
                    catatan: 'Diimport via CSV',
                    changed_at: new Date()
                }]
            });
            imported++;
        } catch (err) {
            errors.push(`Baris ${i + 2}: ${err.message}`);
            skipped++;
        }
    }

    res.json({
        success: true,
        message: `Import selesai: ${imported} berhasil, ${skipped} dilewati`,
        imported, skipped, errors: errors.slice(0, 10)
    });
});

// GET /api/leads/stats/overview - Statistics
router.get('/stats/overview', verifyToken, async (req, res) => {
    try {
        const totalLeads = await Lead.countDocuments({ is_deleted: { $ne: true } });
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todaysLeads = await Lead.countDocuments({ created_at: { $gte: today }, is_deleted: { $ne: true } });
        const totalClosing = await Lead.countDocuments({ status_followup: 'Closing', is_deleted: { $ne: true } });
        const conversionRate = totalLeads > 0 ? ((totalClosing / totalLeads) * 100).toFixed(1) : 0;

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const chartRaw = await Lead.aggregate([
            { $match: { created_at: { $gte: sevenDaysAgo }, is_deleted: { $ne: true } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$created_at' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const chartData = chartRaw.map(r => ({ date: r._id, count: r.count }));

        res.json({
            success: true,
            data: { totalLeads, todaysLeads, totalClosing, conversionRate, chartData }
        });
    } catch (err) {
        console.error('Error fetching stats:', err);
        res.status(500).json({ success: false, message: 'Gagal mengambil statistik' });
    }
});

module.exports = router;
