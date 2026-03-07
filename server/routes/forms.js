const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/auth');
const Form = require('../models/Form');

// ========== PROTECTED ROUTES (Dashboard) ==========

// GET /api/forms - List all forms
router.get('/', verifyToken, async (req, res) => {
    try {
        const forms = await Form.find({ is_deleted: { $ne: true } }).sort({ createdAt: -1 }).lean();
        res.json({ success: true, data: forms });
    } catch (err) {
        console.error('Error fetching forms:', err);
        res.status(500).json({ success: false, message: 'Gagal mengambil data form' });
    }
});

// GET /api/forms/:id - Get single form (also public for LP rendering)
router.get('/:id', async (req, res) => {
    try {
        const form = await Form.findOne({ _id: req.params.id, is_deleted: { $ne: true } }).lean();
        if (!form) return res.status(404).json({ success: false, message: 'Form tidak ditemukan atau telah dihapus' });
        // Don't expose rotator_index in public
        const safeForm = { ...form };
        delete safeForm.rotator_index;
        res.json({ success: true, data: safeForm });
    } catch (err) {
        console.error('Error fetching form:', err);
        res.status(500).json({ success: false, message: 'Gagal mengambil form' });
    }
});

// POST /api/forms - Create new form (admin+)
router.post('/', verifyToken, requireAdmin, async (req, res) => {
    try {
        const { name, description, fields, success_message, success_redirect_url, wa_rotator, rotator_mode } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: 'Nama form wajib diisi' });
        }

        const form = await Form.create({
            name,
            description: description || '',
            fields: fields || [],
            success_message: success_message || 'Terima kasih! Tim kami akan segera menghubungi Anda.',
            success_redirect_url: success_redirect_url || '',
            wa_rotator: wa_rotator || [],
            rotator_mode: rotator_mode || 'round_robin',
            created_by: req.user.username,
        });

        res.status(201).json({ success: true, message: 'Form berhasil dibuat', data: form });
    } catch (err) {
        console.error('Error creating form:', err);
        res.status(500).json({ success: false, message: 'Gagal membuat form' });
    }
});

// PUT /api/forms/:id - Update form (admin+)
router.put('/:id', verifyToken, requireAdmin, async (req, res) => {
    try {
        const { name, description, fields, success_message, success_redirect_url, wa_rotator, rotator_mode, is_active } = req.body;

        const update = {};
        if (name !== undefined) update.name = name;
        if (description !== undefined) update.description = description;
        if (fields !== undefined) update.fields = fields;
        if (success_message !== undefined) update.success_message = success_message;
        if (success_redirect_url !== undefined) update.success_redirect_url = success_redirect_url;
        if (wa_rotator !== undefined) update.wa_rotator = wa_rotator;
        if (rotator_mode !== undefined) update.rotator_mode = rotator_mode;
        if (is_active !== undefined) update.is_active = is_active;

        const form = await Form.findByIdAndUpdate(req.params.id, { $set: update }, { new: true });
        if (!form) return res.status(404).json({ success: false, message: 'Form tidak ditemukan' });

        res.json({ success: true, message: 'Form berhasil diperbarui', data: form });
    } catch (err) {
        console.error('Error updating form:', err);
        res.status(500).json({ success: false, message: 'Gagal memperbarui form' });
    }
});

// DELETE /api/forms/:id - Delete form (admin+)
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
    try {
        const form = await Form.findByIdAndUpdate(req.params.id, { is_deleted: true, deleted_at: new Date() });
        if (!form || form.is_deleted === true) return res.status(404).json({ success: false, message: 'Form tidak ditemukan' });
        res.json({ success: true, message: 'Form berhasil dihapus ke recycle bin' });
    } catch (err) {
        console.error('Error deleting form:', err);
        res.status(500).json({ success: false, message: 'Gagal menghapus form' });
    }
});

// POST /api/forms/:id/get-wa - Get next WA from rotator (PUBLIC, called after form submit)
router.post('/:id/get-wa', async (req, res) => {
    try {
        const form = await Form.findById(req.params.id);
        if (!form) return res.json({ success: false, wa: null });

        const activeNumbers = form.wa_rotator.filter(w => w.is_active);
        if (activeNumbers.length === 0) return res.json({ success: true, wa: null });

        let chosen;

        if (form.rotator_mode === 'random') {
            // Random selection
            chosen = activeNumbers[Math.floor(Math.random() * activeNumbers.length)];
        } else if (form.rotator_mode === 'weighted') {
            // Weighted: pick based on weight proportionally
            const totalWeight = activeNumbers.reduce((sum, w) => sum + (w.weight || 1), 0);
            let rand = Math.random() * totalWeight;
            for (const w of activeNumbers) {
                rand -= (w.weight || 1);
                if (rand <= 0) { chosen = w; break; }
            }
            if (!chosen) chosen = activeNumbers[0];
        } else {
            // Round robin
            const idx = form.rotator_index % activeNumbers.length;
            chosen = activeNumbers[idx];
            await Form.findByIdAndUpdate(req.params.id, { $set: { rotator_index: idx + 1 } });
        }

        res.json({ success: true, wa: chosen });
    } catch (err) {
        console.error('Error getting WA from rotator:', err);
        res.status(500).json({ success: false, wa: null });
    }
});

module.exports = router;
