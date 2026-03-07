const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const Setting = require('../models/Setting');

// GET /api/settings/admin
router.get('/admin', verifyToken, async (req, res) => {
    try {
        const rows = await Setting.find();
        const data = {};
        rows.forEach(r => { data[r.key] = r.value; });
        res.json({ success: true, data });
    } catch (err) {
        console.error('Error fetching settings:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET /api/settings/public (Tracking Pixels)
router.get('/public', async (req, res) => {
    try {
        const rows = await Setting.find({ key: { $in: ['meta_pixel_id', 'ga4_id'] } });
        const data = {};
        rows.forEach(r => { data[r.key] = r.value; });
        res.json({ success: true, data });
    } catch (err) {
        console.error('Error fetching public settings:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// PUT /api/settings/admin
router.put('/admin', verifyToken, async (req, res) => {
    const payload = req.body;
    const allowedKeys = ['meta_pixel_id', 'ga4_id', 'tg_bot_token', 'tg_chat_id', 'ui_highlight_color', 'ui_highlight_style', 'ui_highlight_count'];

    try {
        const ops = allowedKeys
            .filter(key => payload[key] !== undefined)
            .map(key => ({
                updateOne: {
                    filter: { key },
                    update: { $set: { value: payload[key] } },
                    upsert: true
                }
            }));

        if (ops.length > 0) await Setting.bulkWrite(ops);

        res.json({ success: true, message: 'Settings saved' });
    } catch (err) {
        console.error('Error saving settings:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
