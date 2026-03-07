const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/auth');
const Lead = require('../models/Lead');
const Program = require('../models/Program');
const Form = require('../models/Form');

// GET /api/trash - Get all deleted items
router.get('/', verifyToken, requireAdmin, async (req, res) => {
    try {
        const leadsRaw = await Lead.find({ is_deleted: true }).sort({ deleted_at: -1 }).lean();
        const programsRaw = await Program.find({ is_deleted: true }).sort({ deleted_at: -1 }).lean();
        const formsRaw = await Form.find({ is_deleted: true }).sort({ deleted_at: -1 }).lean();

        const leads = leadsRaw.map(l => ({
            ...l,
            id: String(l._id),
            type: 'leads',
            label: l.nama_lengkap || 'Unknown Lead',
            meta: `WA: ${l.whatsapp_num}`
        }));

        const programs = programsRaw.map(p => ({
            ...p,
            id: String(p._id),
            type: 'programs',
            label: p.nama_program || 'Unknown Program',
            meta: `Kategori: Program`
        }));

        const forms = formsRaw.map(f => ({
            ...f,
            id: String(f._id),
            type: 'forms',
            label: f.name || 'Unknown Form',
            meta: `Fields: ${f.fields ? f.fields.length : 0}`
        }));

        const allTrash = [...leads, ...programs, ...forms].sort((a, b) => {
            const dateA = new Date(a.deleted_at || 0);
            const dateB = new Date(b.deleted_at || 0);
            return dateB - dateA;
        });

        res.json({ success: true, data: allTrash });
    } catch (err) {
        console.error('Error fetching trash:', err);
        res.status(500).json({ success: false, message: 'Gagal mengambil data recycle bin' });
    }
});

// POST /api/trash/restore/:type/:id - Restore an item
router.post('/restore/:type/:id', verifyToken, requireAdmin, async (req, res) => {
    const { type, id } = req.params;
    try {
        let model;
        if (type === 'leads') model = Lead;
        else if (type === 'programs') model = Program;
        else if (type === 'forms') model = Form;
        else return res.status(400).json({ success: false, message: 'Tipe data tidak valid' });

        const result = await model.findByIdAndUpdate(id, {
            is_deleted: false,
            is_restored: true
        }, { new: true });

        if (!result) return res.status(404).json({ success: false, message: 'Data tidak ditemukan di Recycle Bin' });

        res.json({ success: true, message: 'Data berhasil dipulihkan' });
    } catch (err) {
        console.error('Error restoring data:', err);
        res.status(500).json({ success: false, message: 'Gagal memulihkan data' });
    }
});

// DELETE /api/trash/hard-delete/:type/:id - Delete permanently
router.delete('/hard-delete/:type/:id', verifyToken, requireAdmin, async (req, res) => {
    const { type, id } = req.params;
    try {
        let model;
        if (type === 'leads') model = Lead;
        else if (type === 'programs') model = Program;
        else if (type === 'forms') model = Form;
        else return res.status(400).json({ success: false, message: 'Tipe data tidak valid' });

        const result = await model.findByIdAndDelete(id);
        if (!result) return res.status(404).json({ success: false, message: 'Data tidak ditemukan di Recycle Bin' });

        res.json({ success: true, message: 'Data berhasil dihapus permanen' });
    } catch (err) {
        console.error('Error hard-deleting data:', err);
        res.status(500).json({ success: false, message: 'Gagal menghapus data secara permanen' });
    }
});

// POST /api/trash/empty - Empty recycle bin
router.post('/empty', verifyToken, requireAdmin, async (req, res) => {
    try {
        await Lead.deleteMany({ is_deleted: true });
        await Program.deleteMany({ is_deleted: true });
        await Form.deleteMany({ is_deleted: true });
        res.json({ success: true, message: 'Recycle bin berhasil dikosongkan' });
    } catch (err) {
        console.error('Error emptying trash:', err);
        res.status(500).json({ success: false, message: 'Gagal mengosongkan recycle bin' });
    }
});

module.exports = router;
