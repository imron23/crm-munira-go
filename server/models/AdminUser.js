const mongoose = require('mongoose');

const adminUserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    password_hash: { type: String, required: true },
    role: {
        type: String,
        enum: ['super_admin', 'admin', 'sales', 'viewer', 'owner'],
        default: 'sales'
    },
    full_name: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    avatar_initial: { type: String, default: '' },
    is_active: { type: Boolean, default: true },
    last_login: { type: Date },
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
}, {
    timestamps: true
});

module.exports = mongoose.model('AdminUser', adminUserSchema);
