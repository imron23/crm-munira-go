const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    tier: { type: String },
    room_type: { type: String },
    price: { type: Number, default: 0 }
});

const programSchema = new mongoose.Schema({
    nama_program: { type: String, required: true },
    poster_url: { type: String, default: '' },
    deskripsi: { type: String, default: '' },
    landing_url: { type: String, default: '' },
    departure_dates: { type: [{ label: String, start: String, end: String }], default: [] },
    sort_order: { type: Number, default: 0 },
    is_active: { type: Boolean, default: true },
    packages: [packageSchema],
    is_deleted: { type: Boolean, default: false },
    deleted_at: { type: Date, default: null },
    is_restored: { type: Boolean, default: false },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('Program', programSchema);
