const mongoose = require('mongoose');

const formFieldSchema = new mongoose.Schema({
    type: { type: String, enum: ['text', 'tel', 'email', 'number', 'select', 'textarea', 'radio', 'checkbox'], required: true },
    label: { type: String, required: true },
    name: { type: String, required: true },
    placeholder: { type: String, default: '' },
    required: { type: Boolean, default: false },
    options: [{ type: String }], // for select/radio/checkbox
    order: { type: Number, default: 0 },
}, { _id: false });

const formSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
    fields: { type: [formFieldSchema], default: [] },
    // Custom thank-you message after submit
    success_message: { type: String, default: 'Terima kasih! Tim kami akan segera menghubungi Anda.' },
    success_redirect_url: { type: String, default: '' }, // optional redirect after submit
    // WA Rotator for leads distribution
    wa_rotator: [{
        name: { type: String, default: '' },
        wa_number: { type: String, required: true },
        is_active: { type: Boolean, default: true },
        weight: { type: Number, default: 1 }, // for weighted distribution
    }],
    rotator_mode: { type: String, enum: ['round_robin', 'weighted', 'random'], default: 'round_robin' },
    rotator_index: { type: Number, default: 0 }, // tracks current index for round-robin
    is_active: { type: Boolean, default: true },
    created_by: { type: String, default: '' },
    is_deleted: { type: Boolean, default: false },
    deleted_at: { type: Date, default: null },
    is_restored: { type: Boolean, default: false },
}, {
    timestamps: true
});

module.exports = mongoose.model('Form', formSchema);
