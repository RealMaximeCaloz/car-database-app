const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));


// MAKE SURE THIS WORKS
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
    console.log(`Fetching details for car: ${name}`); // Log the car name being fetched


    db.get("SELECT * FROM cars WHERE name = ?", [name], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (row) {
            res.json(row);
        } else {
            res.status(404).json({ message: 'Car not found' });
            console.log('Car not found'); // Log when no car is found

        }
    });
});


// API endpoints for car navigation (LEFT/RIGHT)
app.get('/api/cars', (req, res) => {
    const direction = req.query.direction;
    const currentName = req.query.currentName || '';
    console.log(`Direction: ${direction}, Current Name: ${currentName}`); // Log direction and current car name


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

    db.get(query, params, (err, row) => {
        if (err) {
            console.error('Database error:', err.message); // Log database errors

            res.status(500).json({ error: err.message });
        } else if (row) {
            console.log('Car found:', row); // Log the car details found

            res.json(row);
            
        } else {
            console.log('No car found'); // Log when no car is found

            res.status(404).json({ message: 'No car found' });
        }
    });
});



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

