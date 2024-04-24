const express = require('express');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Routes
// GET all activities
app.get('/api/v1/activities', (req, res) => {
  db.all('SELECT * FROM activities', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET all routines
app.get('/api/v1/routines', (req, res) => {
  db.all('SELECT * FROM routines', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET activity by id
app.get('/api/v1/activities/:activityId', (req, res) => {
  const { activityId } = req.params;
  db.get('SELECT * FROM activities WHERE id = ?', [activityId], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ message: 'Activity not found' });
      return;
    }
    res.json(row);
  });
});

// GET routine by id
app.get('/api/v1/routines/:routineId', (req, res) => {
  const { routineId } = req.params;
  db.get('SELECT * FROM routines WHERE id = ?', [routineId], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ message: 'Routine not found' });
      return;
    }
    res.json(row);
  });
});

// POST new activity
app.post('/api/v1/activities', (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    res.status(400).json({ message: 'Name and description are required' });
    return;
  }
  db.run('INSERT INTO activities (name, description) VALUES (?, ?)', [name, description], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      id: this.lastID,
      name,
      description
    });
  });
});

// POST new routine
app.post('/api/v1/routines', (req, res) => {
  const { is_public, name, goal } = req.body;
  if (is_public === undefined || !name || !goal) {
    res.status(400).json({ message: 'is_public, name, and goal are required' });
    return;
  }
  db.run('INSERT INTO routines (is_public, name, goal) VALUES (?, ?, ?)', [is_public, name, goal], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      id: this.lastID,
      is_public,
      name,
      goal
    });
  });
});

// POST new routines_activities
app.post('/api/v1/routines_activities', (req, res) => {
  const { routine_id, activity_id, count } = req.body;
  if (!routine_id || !activity_id || !count) {
    res.status(400).json({ message: 'routine_id, activity_id, and count are required' });
    return;
  }
  db.run('INSERT INTO routines_activities (routine_id, activity_id, count) VALUES (?, ?, ?)', [routine_id, activity_id, count], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      id: this.lastID,
      routine_id,
      activity_id,
      count
    });
  });
});

// DELETE activity by id
app.delete('/api/v1/activities/:activityId', (req, res) => {
  const { activityId } = req.params;
  db.run('DELETE FROM activities WHERE id = ?', [activityId], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ message: 'Activity not found' });
      return;
    }
    res.json({ message: 'Activity deleted successfully' });
  });
});

// DELETE routine by id
app.delete('/api/v1/routines/:routineId', (req, res) => {
  const { routineId } = req.params;
  db.run('DELETE FROM routines WHERE id = ?', [routineId], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ message: 'Routine not found' });
      return;
    }
    res.json({ message: 'Routine deleted successfully' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});