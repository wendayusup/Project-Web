const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    customerCode: { type: String, default: '' },
    customerName: { type: String, required: [true, 'Nama pelanggan wajib diisi'] },
    contactPerson: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    taxId: { type: String, default: '' },
    creditLimit: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Customer', customerSchema);