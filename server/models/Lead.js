const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema({
    status: { type: String, required: true },
    changed_by: { type: String, default: 'system' },
    changed_by_name: { type: String, default: 'System' },
    catatan: { type: String, default: '' },
    changed_at: { type: Date, default: Date.now }
}, { _id: false });

const leadSchema = new mongoose.Schema({
    _id: { type: String }, // WA number atau UUID sebagai ID
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
    form_source: { type: String, default: '' },
    status_followup: { type: String, default: 'New Data' },
    catatan: { type: String, default: '' },
    revenue: { type: Number, default: 0 },
    program_id: { type: String, default: '' },
    last_contact: { type: Date },
    rencana_umrah: { type: String, default: '' },
    assigned_to: { type: String, default: '' }, // username of assigned sales
    assigned_to_name: { type: String, default: '' },
    // Status change history
    status_history: { type: [statusHistorySchema], default: [] },
    is_deleted: { type: Boolean, default: false },
    deleted_at: { type: Date, default: null },
    is_restored: { type: Boolean, default: false },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('Lead', leadSchema);
