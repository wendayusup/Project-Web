const mongoose = require('mongoose');

// Skema untuk koleksi 'accounts' (Daftar Akun)
const accountSchema = new mongoose.Schema({
    accountCode: {
        type: String,
        required: [true, 'Kode Akun wajib diisi'],
        unique: true // Pastikan setiap kode akun unik
    },
    accountName: {
        type: String,
        required: [true, 'Nama Akun wajib diisi']
    },
    accountType: {
        type: String,
        required: [true, 'Tipe Akun wajib diisi'],
        enum: ['Aset', 'Liabilitas', 'Ekuitas', 'Pendapatan', 'Beban']
    },
    balanceType: {
        type: String,
        required: [true, 'Saldo Normal wajib diisi'],
        enum: ['Debit', 'Kredit']
    },
    description: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Account', accountSchema);
