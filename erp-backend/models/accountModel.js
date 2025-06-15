const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    accountCode: {
        type: String,
        required: [true, 'Kode akun wajib diisi.'],
        unique: true,
        trim: true
    },
    accountName: {
        type: String,
        required: [true, 'Nama akun wajib diisi.'],
        trim: true
    },
    accountType: {
        type: String,
        required: [true, 'Tipe akun wajib diisi.'],
        // Menyesuaikan enum dengan opsi yang ada di frontend Anda
        enum: ['Aset', 'Liabilitas', 'Ekuitas', 'Pendapatan', 'Beban'] 
    },
    balanceType: {
        type: String,
        required: [true, 'Saldo normal wajib diisi.'],
        enum: ['Debit', 'Kredit']
    },
    description: {
        type: String,
        trim: true,
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
