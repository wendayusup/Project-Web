// --- 1. Impor Package & Model ---
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Impor semua model yang dibutuhkan
const Vendor = require('./models/vendorModel');
const Customer = require('./models/customerModel');
const Account = require('./models/accountModel');
const Journal = require('./models/journalModel');

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

// Generic function untuk membuat CRUD endpoints
const createCrudEndpoints = (app, model, routeName, sortOption = { createdAt: -1 }) => {
    app.get(`/api/${routeName}`, async (req, res) => {
        try {
            const data = await model.find().sort(sortOption);
            res.status(200).json(data);
        } catch (err) { res.status(500).json({ message: `Gagal mengambil data ${routeName}: ${err.message}` }); }
    });
    app.post(`/api/${routeName}`, async (req, res) => {
        try {
            const savedData = await new model(req.body).save();
            res.status(201).json(savedData);
        } catch (err) { res.status(400).json({ message: `Data ${routeName} tidak valid: ${err.message}` }); }
    });
    app.delete(`/api/${routeName}/:id`, async (req, res) => {
        try {
            const deletedData = await model.findByIdAndDelete(req.params.id);
            if (!deletedData) return res.status(404).json({ message: "Data tidak ditemukan" });
            res.status(200).json({ message: "Data berhasil dihapus" });
        } catch (err) { res.status(500).json({ message: `Gagal menghapus data ${routeName}` }); }
    });
};

// Gunakan generic function untuk Master Data
createCrudEndpoints(app, Account, 'accounts', { accountCode: 1 });
createCrudEndpoints(app, Vendor, 'vendors');
createCrudEndpoints(app, Customer, 'customers');

// == API KHUSUS UNTUK JURNAL ==
app.get('/api/journals', async (req, res) => {
    try {
        const data = await Journal.find().sort({ journalDate: -1, createdAt: -1 });
        res.status(200).json(data);
    } catch (err) { res.status(500).json({ message: "Gagal mengambil data jurnal: " + err.message }); }
});

app.post('/api/journals', async (req, res) => {
    console.log("Menerima data jurnal:", JSON.stringify(req.body, null, 2));
    try {
        const { lines } = req.body;
        if (!lines || lines.length < 2) {
             return res.status(400).json({ message: "Jurnal harus memiliki minimal 2 baris." });
        }
        
        const totalDebit = lines.reduce((sum, line) => sum + (Number(line.debit) || 0), 0);
        const totalKredit = lines.reduce((sum, line) => sum + (Number(line.kredit) || 0), 0);

        if (Math.abs(totalDebit - totalKredit) > 0.01 || totalDebit === 0) {
            return res.status(400).json({ message: "Total Debit dan Kredit harus seimbang dan tidak boleh nol." });
        }
        
        const newJournal = new Journal(req.body);
        const savedData = await newJournal.save();
        res.status(201).json(savedData);
    } catch (err) {
        console.error("Error saat menyimpan jurnal:", err);
        res.status(400).json({ message: `Data jurnal tidak valid: ${err.message}` });
    }
});

app.delete('/api/journals/:id', async (req, res) => {
    try {
        const deletedData = await Journal.findByIdAndDelete(req.params.id);
        if (!deletedData) return res.status(404).json({ message: "Jurnal tidak ditemukan" });
        res.status(200).json({ message: "Jurnal berhasil dihapus" });
    } catch (err) { res.status(500).json({ message: "Gagal menghapus jurnal" }); }
});
