// === server.js FINAL ===
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

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Koneksi MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Berhasil terhubung ke MongoDB'))
  .catch(err => console.error('Koneksi ke MongoDB gagal.', err));

// Static frontend SPA + views
app.use(express.static(path.join(__dirname, '/')));
app.use('/views', express.static(path.join(__dirname, 'views'))); // penting untuk showView() load html

// === API AKUN ===
app.get('/api/accounts', async (req, res) => {
  try {
    const accounts = await Account.find().sort({ accountCode: 1 });
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.get('/api/accounts/:id', async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).json({ message: 'Akun tidak ditemukan' });
    res.json(account);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.post('/api/accounts', async (req, res) => {
  const data = { ...req.body, isActive: req.body.isActive === 'on' || req.body.isActive === true };
  try {
    const created = await new Account(data).save();
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
app.put('/api/accounts/:id', async (req, res) => {
  const data = { ...req.body, isActive: req.body.isActive === 'on' || req.body.isActive === true };
  try {
    const updated = await Account.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Akun tidak ditemukan' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
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

// === API ASET TETAP ===
app.get('/api/fixed-assets', async (req, res) => {
  try {
    const assets = await FixedAsset.find()
      .populate('assetAccountId accumDepAccountId depExpenseAccountId')
      .sort({ acquisitionDate: -1 });
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

// === Server start ===
app.listen(PORT, () => {
  console.log(`Server ERP berjalan di http://localhost:${PORT}`);
});
