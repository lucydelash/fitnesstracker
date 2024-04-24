const sqlite3 = require('sqlite3').verbose();

// Create a new database instance
const db = new sqlite3.Database(':memory:');

// Create tables and seed data
db.serialize(() => {
  // Create tables
  db.run(`CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY,
    name TEXT,
    description TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS routines (
    id INTEGER PRIMARY KEY,
    is_public BOOLEAN,
    name TEXT,
    goal TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS routines_activities (
    id INTEGER PRIMARY KEY,
    routine_id INTEGER,
    activity_id INTEGER,
    count INTEGER,
    FOREIGN KEY (routine_id) REFERENCES routines(id),
    FOREIGN KEY (activity_id) REFERENCES activities(id)
  )`);

  // Seed data
  db.run(`INSERT INTO activities (name, description) VALUES ('Running', 'Run for 30 minutes.')`);
  db.run(`INSERT INTO routines (is_public, name, goal) VALUES (1, 'Morning Workout', 'Stay active every morning.')`);
  db.run(`INSERT INTO routines_activities (routine_id, activity_id, count) VALUES (1, 1, 1)`);
});

module.exports = db;