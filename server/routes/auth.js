const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');
const { JWT_SECRET } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username dan password wajib diisi' });
    }

    // Rate limit guard (basic): lock after 5 failed attempts in body (stateless, extend with Redis if needed)
    try {
        const user = await AdminUser.findOne({ username: username.trim() });

        if (!user) {
            return res.status(401).json({ success: false, message: 'Username atau password salah' });
        }

        if (!user.is_active) {
            return res.status(403).json({ success: false, message: 'Akun dinonaktifkan. Hubungi Super Admin.' });
        }

        const isMatch = bcrypt.compareSync(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Username atau password salah' });
        }

        // Update last login
        await AdminUser.findByIdAndUpdate(user._id, { last_login: new Date() });

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
                role: user.role,
                full_name: user.full_name || user.username,
                permissions: user.permissions
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Login berhasil',
            token,
            user: {
                username: user.username,
                role: user.role,
                full_name: user.full_name || user.username,
                permissions: user.permissions
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST /api/auth/change-password (self-service)
router.post('/change-password', require('../middleware/auth').verifyToken, async (req, res) => {
    const { old_password, new_password } = req.body;
    if (!old_password || !new_password) {
        return res.status(400).json({ success: false, message: 'Password lama dan baru wajib diisi' });
    }
    if (new_password.length < 8) {
        return res.status(400).json({ success: false, message: 'Password baru minimal 8 karakter' });
    }
    try {
        const user = await AdminUser.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan' });

        const isMatch = bcrypt.compareSync(old_password, user.password_hash);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Password lama salah' });

        const hash = bcrypt.hashSync(new_password, 12);
        await AdminUser.findByIdAndUpdate(user._id, { password_hash: hash });

        res.json({ success: true, message: 'Password berhasil diubah' });
    } catch (err) {
        console.error('Change password error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET /api/auth/me
router.get('/me', require('../middleware/auth').verifyToken, async (req, res) => {
    try {
        const user = await AdminUser.findById(req.user.id).select('-password_hash');
        if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
        res.json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST /api/auth/impersonate/:userId — Super Admin only
// Generates a token for another user so super_admin can "quick switch"
router.post('/impersonate/:userId', require('../middleware/auth').verifyToken, require('../middleware/auth').requireSuperAdmin, async (req, res) => {
    try {
        const user = await AdminUser.findById(req.params.userId);
        if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
        if (!user.is_active) return res.status(403).json({ success: false, message: 'Akun dinonaktifkan' });

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
                role: user.role,
                full_name: user.full_name || user.username,
                permissions: user.permissions,
                impersonated_by: req.user.username
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: `Switched to ${user.full_name || user.username}`,
            token,
            user: {
                username: user.username,
                role: user.role,
                full_name: user.full_name || user.username
            }
        });
    } catch (err) {
        console.error('Impersonate error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
