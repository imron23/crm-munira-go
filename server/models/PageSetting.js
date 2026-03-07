const mongoose = require('mongoose');

const pageSettingSchema = new mongoose.Schema({
    folder: { type: String, required: true, unique: true },
    image_url: { type: String, default: '' },
    description: { type: String, default: '' },
    // Form integration
    linked_form_id: { type: String, default: '' },   // Form._id linked to this LP
    // Program integration — LP dapat menampilkan banyak paket program
    linked_program_ids: { type: [String], default: [] }, // Program._id[]
    is_default: { type: Boolean, default: false },
}, {
    timestamps: true
});

module.exports = mongoose.model('PageSetting', pageSettingSchema);

