const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { verifyToken } = require('../middleware/auth');
const Program = require('../models/Program');

// GET /api/programs — list all programs
router.get('/', async (req, res) => {
    try {
        const programs = await Program.find({ is_deleted: { $ne: true } }).sort({ sort_order: 1, created_at: -1 }).lean();
        const mapped = programs.map(p => ({ ...p, id: String(p._id) }));
        res.json({ success: true, programs: mapped });
    } catch (err) {
        console.error('Error fetching programs:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET /api/programs/active — only active programs
router.get('/active', async (req, res) => {
    try {
        const programs = await Program.find({ is_active: true, is_deleted: { $ne: true } }).sort({ sort_order: 1 }).lean();
        const mapped = programs.map(p => ({ ...p, id: String(p._id) }));
        res.json({ success: true, programs: mapped });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET /api/programs/:id — single program
router.get('/:id', async (req, res) => {
    try {
        const program = await Program.findOne({ _id: req.params.id, is_deleted: { $ne: true } }).lean();
        if (!program) return res.status(404).json({ success: false, message: 'Program tidak ditemukan atau telah dihapus' });
        res.json({ success: true, program: { ...program, id: String(program._id) } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST /api/programs — create new program
router.post('/', verifyToken, async (req, res) => {
    const { nama_program, poster_url, deskripsi, landing_url, sort_order, departure_dates, packages } = req.body;

    if (!nama_program) {
        return res.status(400).json({ success: false, message: 'Nama program wajib diisi' });
    }

    try {
        const program = await Program.create({
            nama_program,
            poster_url: poster_url || '',
            deskripsi: deskripsi || '',
            landing_url: landing_url || '',
            departure_dates: departure_dates || [],
            sort_order: sort_order || 0,
            packages: Array.isArray(packages) ? packages.map(p => ({
                tier: p.tier, room_type: p.room_type, price: parseInt(p.price) || 0
            })) : []
        });

        res.json({ success: true, message: 'Program created', id: program._id });
    } catch (err) {
        console.error('Error creating program:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// PUT /api/programs/:id — update program
router.put('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { nama_program, poster_url, deskripsi, landing_url, is_active, sort_order, departure_dates, packages } = req.body;

    try {
        const update = {};
        if (nama_program !== undefined) update.nama_program = nama_program;
        if (poster_url !== undefined) update.poster_url = poster_url;
        if (deskripsi !== undefined) update.deskripsi = deskripsi;
        if (landing_url !== undefined) update.landing_url = landing_url;
        if (is_active !== undefined) update.is_active = Boolean(is_active);
        if (sort_order !== undefined) update.sort_order = sort_order;
        if (departure_dates !== undefined) update.departure_dates = departure_dates;
        if (packages !== undefined) {
            update.packages = packages.map(p => ({
                tier: p.tier, room_type: p.room_type, price: parseInt(p.price) || 0
            }));
        }

        await Program.findByIdAndUpdate(id, { $set: update });
        res.json({ success: true, message: 'Program updated' });
    } catch (err) {
        console.error('Error updating program:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// DELETE /api/programs/:id
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await Program.findByIdAndUpdate(req.params.id, { is_deleted: true, deleted_at: new Date() });
        res.json({ success: true, message: 'Program dihapus ke recycle bin' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
