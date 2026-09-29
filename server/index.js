const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// Testna ruta za provjeru konekcije sa bazom
app.get('/api/test', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS solution');
    res.json({ message: 'Baza je uspjesno povezana!', result: rows[0].solution });
  } catch (error) {
    res.status(500).json({ error: 'Greska pri povezivanju sa bazom', details: error.message });
  }
});

// Ruta za dohvaćanje svih animea
app.get('/api/anime', async (req, res) => {
  try {
    const [animeList] = await db.query('SELECT * FROM anime');
    res.json(animeList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Greška pri dohvaćanju podataka iz baze' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server radi na portu ${PORT}`);
});