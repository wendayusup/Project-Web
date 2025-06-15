// Import modul-modul yang diperlukan
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import semua model
const Account = require('./models/accountModel');
const Vendor = require('./models/vendorModel');
const Customer = require('./models/customerModel');
const FixedAsset = require('./models/FixedAssetsModel');
const Journal = require('./models/journalModel');

// Inisialisasi aplikasi Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Untuk mem-parsing body permintaan JSON
app.use(express.urlencoded({ extended: true })); // Untuk mem-parsing form data

// Koneksi ke MongoDB
// Pastikan Anda memiliki file .env di folder erp-backend dengan MONGODB_URI
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Berhasil terhubung ke MongoDB');
}).catch(err => {
  console.error('Koneksi ke MongoDB gagal.', err);
});

// Menyajikan file statis dari direktori root proyek
app.use(express.static(path.join(__dirname, '..')));

// ===================================
// API ROUTES
// ===================================

// --- AKUN ---
app.get('/api/accounts', async (req, res) => {
    try {
        const accounts = await Account.find().sort({ accountCode: 1 });
        res.json(accounts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/accounts', async (req, res) => {
    const account = new Account({
        accountCode: req.body.accountCode,
        accountName: req.body.accountName,
        accountType: req.body.accountType,
        balanceType: req.body.balanceType,
        description: req.body.description,
        isActive: req.body.isActive === 'on' ? true : false
    });
    try {
        const newAccount = await account.save();
        res.status(201).json(newAccount);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/api/accounts/:id', async (req, res) => {
    try {
        const result = await Account.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ message: 'Akun tidak ditemukan' });
        res.json({ message: 'Akun berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- ASET TETAP ---
app.get('/api/fixed-assets', async (req, res) => {
  try {
    const assets = await FixedAsset.find().populate('assetAccountId accumDepAccountId depExpenseAccountId').sort({ acquisitionDate: -1 });
    res.json(assets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/fixed-assets', async (req, res) => {
  try {
    const newAsset = new FixedAsset(req.body);
    await newAsset.save();
    res.status(201).json(newAsset);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/fixed-assets/:id', async (req, res) => {
    try {
        const result = await FixedAsset.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ message: 'Aset tidak ditemukan' });
        res.json({ message: 'Aset berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- VENDOR ---
app.get('/api/vendors', async (req, res) => {
    try {
        const data = await Vendor.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/vendors', async (req, res) => {
    try {
        const newData = new Vendor(req.body);
        await newData.save();
        res.status(201).json(newData);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/api/vendors/:id', async (req, res) => {
    try {
        const result = await Vendor.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ message: 'Vendor tidak ditemukan' });
        res.json({ message: 'Vendor berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- PELANGGAN ---
app.get('/api/customers', async (req, res) => {
    try {
        const data = await Customer.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/customers', async (req, res) => {
    try {
        const newData = new Customer(req.body);
        await newData.save();
        res.status(201).json(newData);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/api/customers/:id', async (req, res) => {
    try {
        const result = await Customer.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ message: 'Pelanggan tidak ditemukan' });
        res.json({ message: 'Pelanggan berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- JURNAL ---
app.get('/api/journals', async (req, res) => {
    try {
        const data = await Journal.find().sort({ journalDate: -1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/journals', async (req, res) => {
    try {
        const newData = new Journal(req.body);
        await newData.save();
        res.status(201).json(newData);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/api/journals/:id', async (req, res) => {
    try {
        const result = await Journal.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ message: 'Jurnal tidak ditemukan' });
        res.json({ message: 'Jurnal berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server ERP berjalan di http://localhost:${PORT}`);
});
