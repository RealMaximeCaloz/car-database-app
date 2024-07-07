const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create a new database or connect to existing one
const dbPath = path.join(__dirname, 'cars.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Create the cars table
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS cars (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            logo_path TEXT,
            image_path TEXT,
            horsepower INTEGER,
            torque INTEGER,
            fuel_consumption REAL,
            engine_type TEXT,
            seating_capacity INTEGER,
            price REAL
        )
    `, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Cars table created or already exists.');
        }
    });

    // Insert initial data
    const insertStmt = db.prepare(`
        INSERT INTO cars (name, logo_path, image_path, horsepower, torque, fuel_consumption, engine_type, seating_capacity, price)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Example car data
    const carData = [
        ['Lamborghini Revuelto', '/images/logos/lamborghini-logo.png', '/images/cars/lamborghini-revuelto.png', 814, 535, 14.2, 'Hybrid', 2, 600000],
        ['Ferrari SF90', '/images/logos/ferrari.png', '/images/cars/sf90.png', 986, 590, 6.1, 'Gasoline', 2, 625000],
        // Add more cars as needed
    ];

    carData.forEach(car => {
        insertStmt.run(car, (err) => {
            if (err) {
                console.error('Error inserting data:', err.message);
            }
        });
    });

    insertStmt.finalize();
});

db.close((err) => {
    if (err) {
        console.error('Error closing the database:', err.message);
    } else {
        console.log('Database connection closed.');
    }
});
