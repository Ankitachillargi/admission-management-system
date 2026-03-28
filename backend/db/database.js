const sqlite3 = require("sqlite3").verbose();

// Create or connect database
const db = new sqlite3.Database("./db/database.db", (err) => {
  if (err) {
    console.error("Error connecting to database", err);
  } else {
    console.log("Connected to SQLite database");
  }
});

// Create tables
db.serialize(() => {
  // Program Table
  db.run(`
    CREATE TABLE IF NOT EXISTS programs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      intake INTEGER
    )
  `);

  // Quota Table
  db.run(`
    CREATE TABLE IF NOT EXISTS quotas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      program_id INTEGER,
      name TEXT,
      seats INTEGER
    )
  `);

  // Applicant Table
  db.run(`
    CREATE TABLE IF NOT EXISTS applicants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      phone TEXT,
      category TEXT,
      entry_type TEXT,
      quota_type TEXT,
      marks INTEGER,
      document_status TEXT
    )
  `);

  // Admission Table
  db.run(`
    CREATE TABLE IF NOT EXISTS admissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      applicant_id INTEGER,
      program_id INTEGER,
      quota TEXT,
      admission_number TEXT,
      fee_status TEXT,
      status TEXT
    )
  `);
});

module.exports = db;