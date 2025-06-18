const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Skema untuk data aset tetap
const assetSchema = new Schema({
    assetName: { type: String, required: [true, 'Nama aset tidak boleh kosong.'] },
    assetCode: { type: String, required: [true, 'Kode aset tidak boleh kosong.'], unique: true },
    acquisitionDate: { type: Date, required: [true, 'Tanggal perolehan tidak boleh kosong.'] },
    acquisitionCost: { type: Number, required: [true, 'Harga perolehan tidak boleh kosong.'] },
    usefulLife: { type: Number, required: [true, 'Masa manfaat tidak boleh kosong.'] }, // Dalam satuan tahun
    salvageValue: { type: Number, required: true, default: 0 },
    depreciationMethod: { type: String, enum: ['Garis Lurus', 'Saldo Menurun'], required: true },
    assetAccountId: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
    accumDepAccountId: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
    depExpenseAccountId: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
    status: { type: String, enum: ['Aktif', 'Terjual', 'Dihapus'], required: true, default: 'Aktif' }
}, {
    timestamps: true // Menambahkan createdAt dan updatedAt secara otomatis
});

module.exports = mongoose.model('FixedAsset', assetSchema);
