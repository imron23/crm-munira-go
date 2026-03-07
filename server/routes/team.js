const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const AdminUser = require('../models/AdminUser');
const { verifyToken, requireAdmin, requireSuperAdmin } = require('../middleware/auth');

// GET /api/team - List all team members (admin+)
router.get('/', verifyToken, requireAdmin, async (req, res) => {
    try {
        const members = await AdminUser.find()
            .select('-password_hash')
            .sort({ createdAt: -1 });
        res.json({ success: true, data: members });
    } catch (err) {
        console.error('Error fetching team:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST /api/team - Create team member (super_admin only)
router.post('/', verifyToken, requireSuperAdmin, async (req, res) => {
    const { username, password, role, full_name, email, phone, permissions } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username dan password wajib diisi' });
    }
    if (password.length < 8) {
        return res.status(400).json({ success: false, message: 'Password minimal 8 karakter' });
    }

    const validRoles = ['super_admin', 'admin', 'sales', 'viewer', 'owner'];
    if (role && !validRoles.includes(role)) {
        return res.status(400).json({ success: false, message: 'Role tidak valid' });
    }

    // super_admin cannot create another super_admin unless they are super_admin
    if (role === 'super_admin' && req.user.role !== 'super_admin') {
        return res.status(403).json({ success: false, message: 'Tidak bisa membuat Super Admin' });
    }

    try {
        const existing = await AdminUser.findOne({ username: username.trim() });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Username sudah digunakan' });
        }

        const hash = bcrypt.hashSync(password, 12);
        const initial = (full_name || username).charAt(0).toUpperCase();

        const defaultPermissions = {
            can_delete: ['super_admin', 'admin'].includes(role || 'sales'),
            can_export: true,
            can_manage_team: role === 'super_admin',
            can_view_revenue: ['super_admin', 'admin', 'owner'].includes(role || 'sales'),
        };

        const member = await AdminUser.create({
            username: username.trim(),
            password_hash: hash,
            role: role || 'sales',
            full_name: full_name || '',
            email: email || '',
            phone: phone || '',
            avatar_initial: initial,
            permissions: { ...defaultPermissions, ...(permissions || {}) }
        });

        res.status(201).json({
            success: true,
            message: 'Anggota tim berhasil ditambahkan',
            data: { id: member._id, username: member.username, role: member.role }
        });
    } catch (err) {
        console.error('Error creating team member:', err);
        res.status(500).json({ success: false, message: 'Gagal membuat anggota tim' });
    }
});

// PUT /api/team/:id - Update member (super_admin, or admin updating sales/viewer)
router.put('/:id', verifyToken, requireAdmin, async (req, res) => {
    const { full_name, email, phone, role, is_active, permissions } = req.body;

    try {
        const target = await AdminUser.findById(req.params.id);
        if (!target) return res.status(404).json({ success: false, message: 'User tidak ditemukan' });

        // Only super_admin can change roles or edit other admins
        if (target.role === 'super_admin' && req.user.role !== 'super_admin') {
            return res.status(403).json({ success: false, message: 'Tidak bisa mengedit Super Admin' });
        }
        if (role === 'super_admin' && req.user.role !== 'super_admin') {
            return res.status(403).json({ success: false, message: 'Tidak bisa menetapkan role Super Admin' });
        }

        const update = {};
        if (full_name !== undefined) update.full_name = full_name;
        if (email !== undefined) update.email = email;
        if (phone !== undefined) update.phone = phone;
        // Allow super_admin to set any role; admin can set non-super_admin roles
        if (role !== undefined) {
            if (req.user.role === 'super_admin' || (req.user.role === 'admin' && role !== 'super_admin')) {
                update.role = role;
            }
        }
        if (is_active !== undefined) {
            if (req.user.role === 'super_admin' || req.user.role === 'admin') update.is_active = is_active;
        }
        // Allow admin+ to set permissions
        if (permissions !== undefined) {
            if (req.user.role === 'super_admin' || req.user.role === 'admin') update.permissions = permissions;
        }
        if (full_name) update.avatar_initial = full_name.charAt(0).toUpperCase();

        await AdminUser.findByIdAndUpdate(req.params.id, { $set: update });
        res.json({ success: true, message: 'Data anggota tim diperbarui' });

    } catch (err) {
        console.error('Error updating team member:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST /api/team/:id/reset-password - Reset password (super_admin only)
router.post('/:id/reset-password', verifyToken, requireSuperAdmin, async (req, res) => {
    const { new_password } = req.body;
    if (!new_password || new_password.length < 8) {
        return res.status(400).json({ success: false, message: 'Password baru minimal 8 karakter' });
    }
    try {
        const hash = bcrypt.hashSync(new_password, 12);
        await AdminUser.findByIdAndUpdate(req.params.id, { password_hash: hash });
        res.json({ success: true, message: 'Password berhasil direset' });
    } catch (err) {
        console.error('Error resetting password:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// DELETE /api/team/:id (super_admin only, cannot delete self)
router.delete('/:id', verifyToken, requireSuperAdmin, async (req, res) => {
    try {
        if (req.params.id === req.user.id) {
            return res.status(400).json({ success: false, message: 'Tidak bisa menghapus akun sendiri' });
        }
        const target = await AdminUser.findById(req.params.id);
        if (!target) return res.status(404).json({ success: false, message: 'User tidak ditemukan' });

        await AdminUser.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Anggota tim dihapus' });
    } catch (err) {
        console.error('Error deleting team member:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
