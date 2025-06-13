const mongoose = require('mongoose');

// Ini adalah Schema atau cetakan untuk setiap dokumen vendor.
// Strukturnya disesuaikan dengan rancangan database dan input form HTML.
const vendorSchema = new mongoose.Schema({
    vendorCode: {
        type: String,
    },
    vendorName: {
        type: String,
        required: [true, 'Nama vendor wajib diisi']
    },
    contactPerson: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        // Validasi format email sederhana, bisa diperkuat jika perlu
        match: [/.+\@.+\..+/, 'Format email tidak valid'] 
    },
    phone: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    taxId: {
        type: String,
        default: ''
    },
    paymentTerms: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true 
    }
}, { 
    // Opsi ini akan secara otomatis menambahkan field `createdAt` dan `updatedAt`
    timestamps: true 
});

// 'Vendor' akan menjadi nama koleksi 'vendors' di database
module.exports = mongoose.model('Vendor', vendorSchema);
