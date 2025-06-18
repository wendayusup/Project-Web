const mongoose = require('mongoose');

// Skema untuk satu baris/line item di dalam jurnal
const journalLineSchema = new mongoose.Schema({
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account', // Mereferensikan ke model Account
        required: [true, 'Akun pada baris jurnal harus diisi.']
    },
    debit: {
        type: Number,
        default: 0
    },
    kredit: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        default: ''
    }
}, { _id: false });

// Skema utama untuk dokumen jurnal
const journalSchema = new mongoose.Schema({
    journalNumber: {
        type: String,
        required: [true, 'Nomor Jurnal harus diisi.'],
        unique: true,
        trim: true
    },
    journalDate: {
        type: Date,
        required: [true, 'Tanggal Jurnal harus diisi.'],
        default: Date.now
    },
    description: {
        type: String,
        required: [true, 'Deskripsi Jurnal harus diisi.'],
        trim: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Draft', 'Posted'],
        default: 'Draft'
    },
    lines: {
        type: [journalLineSchema],
        validate: [v => Array.isArray(v) && v.length > 0, 'Jurnal harus memiliki setidaknya satu baris transaksi.']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Journal', journalSchema);
