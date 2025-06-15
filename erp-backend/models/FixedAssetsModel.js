const mongoose = require('mongoose');

// Skema untuk koleksi 'fixedassets' (Aset Tetap)
const fixedAssetSchema = new mongoose.Schema({
    assetCode: {
        type: String,
        required: [true, 'Kode Aset wajib diisi'],
        unique: true
    },
    assetName: {
        type: String,
        required: [true, 'Nama Aset wajib diisi']
    },
    acquisitionDate: {
        type: Date,
        required: [true, 'Tanggal Perolehan wajib diisi']
    },
    acquisitionCost: {
        type: Number,
        required: [true, 'Harga Perolehan wajib diisi'],
        min: 0
    },
    usefulLife: {
        type: Number, // Dalam satuan tahun
        required: [true, 'Masa Manfaat wajib diisi'],
        min: 0
    },
    salvageValue: {
        type: Number,
        default: 0
    },
    depreciationMethod: {
        type: String,
        required: true,
        enum: ['Garis Lurus', 'Saldo Menurun'],
        default: 'Garis Lurus'
    },
    location: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        required: true,
        enum: ['Aktif', 'Terjual', 'Dihapus'],
        default: 'Aktif'
    },
    // Relasi ke Chart of Accounts
    assetAccountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    accumDepAccountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    depExpenseAccountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('FixedAsset', fixedAssetSchema);
