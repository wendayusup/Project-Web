// --- 1. Impor Package & Model ---
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Impor semua model yang dibutuhkan
const Vendor = require('./models/vendorModel');
const Customer = require('./models/customerModel');
// Tambahkan impor untuk model lain di sini saat Anda membuatnya

// --- 2. Inisialisasi & Konfigurasi Server ---
const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

// --- 3. Koneksi ke Database ---
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Berhasil terhubung ke MongoDB...');
    app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));
  })
  .catch(err => console.error('Koneksi database gagal!', err));

// --- 4. ENDPOINT API ---

// == API UNTUK VENDOR ==

// GET all vendors
app.get('/api/vendors', async (req, res) => {
    try {
        const data = await Vendor.find().sort({ createdAt: -1 });
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: "Gagal mengambil data vendor: " + err.message });
    }
});

// POST new vendor
app.post('/api/vendors', async (req, res) => {
    try {
        const newData = new Vendor(req.body);
        const savedData = await newData.save();
        res.status(201).json(savedData);
    } catch (err) {
        res.status(400).json({ message: "Data vendor tidak valid: " + err.message });
    }
});

// DELETE a vendor by ID
app.delete('/api/vendors/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedData = await Vendor.findByIdAndDelete(id);
        if (!deletedData) return res.status(404).json({ message: "Vendor tidak ditemukan" });
        res.status(200).json({ message: "Vendor berhasil dihapus" });
    } catch (err) {
         res.status(500).json({ message: "Gagal menghapus vendor: " + err.message });
    }
});


// == API UNTUK CUSTOMER ==

// GET all customers
app.get('/api/customers', async (req, res) => {
    try {
        const data = await Customer.find().sort({ createdAt: -1 });
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: "Gagal mengambil data pelanggan: " + err.message });
    }
});

// POST new customer
app.post('/api/customers', async (req, res) => {
    try {
        const newData = new Customer(req.body);
        const savedData = await newData.save();
        res.status(201).json(savedData);
    } catch (err) {
        res.status(400).json({ message: "Data pelanggan tidak valid: " + err.message });
    }
});

// DELETE a customer by ID
app.delete('/api/customers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedData = await Customer.findByIdAndDelete(id);
        if (!deletedData) return res.status(404).json({ message: "Pelanggan tidak ditemukan" });
        res.status(200).json({ message: "Pelanggan berhasil dihapus" });
    } catch (err) {
         res.status(500).json({ message: "Gagal menghapus pelanggan: " + err.message });
    }
});
