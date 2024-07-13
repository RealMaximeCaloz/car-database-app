const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve images from the backend images directory
app.use('/images', express.static(path.join(__dirname, 'images')));

// Connect to the SQLite database
const dbPath = path.join(__dirname, 'cars.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Endpoint for fetching specific car details
app.get('/api/car/:name', (req, res) => {
    const name = req.params.name;

    db.get("SELECT * FROM cars WHERE name = ?", [name], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (row) {
            res.json(row);
        } else {
            res.status(404).json({ message: 'Car not found' });
        }
    });
});

// Endpoint for car navigation (LEFT/RIGHT)
app.get('/api/cars', (req, res) => {
    const direction = req.query.direction;
    const currentName = req.query.currentName || '';
    let query = '';
    let params = [];

    if (direction === 'next') {
        query = "SELECT * FROM cars WHERE name > ? ORDER BY name ASC LIMIT 1";
        params = [currentName];
    } else if (direction === 'previous') {
        query = "SELECT * FROM cars WHERE name < ? ORDER BY name DESC LIMIT 1";
        params = [currentName];
    } else {
        query = "SELECT * FROM cars ORDER BY name ASC";
    }

    db.all(query, params, (err, rows) => { // Use db.all to return multiple rows
        if (err) {
            console.error('Database error:', err.message); // Log database errors
            res.status(500).json({ error: err.message });
        } else {
            if (rows.length > 0) {
                res.json(rows); // Return the array of car objects
            } else {
                res.status(404).json({ message: 'No cars found' });
            }
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});