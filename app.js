const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// create database connection
const db = new sqlite3.Database('courses.db');

// create courses table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  period INTEGER
)`);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
// serve add_course.html page
app.get('/courses', (req, res) => {
    res.sendFile(__dirname + '/add_course.html');
  });
  // serve view_course.html page

  app.get('/view', (req, res) => {
    res.sendFile(__dirname + '/view_course.html');
  });
// handle POST request to add a new course
app.post('/courses', (req, res) => {
  const { name, period } = req.body;

  // insert new course into database
  db.run(`INSERT INTO courses (name, period) VALUES (?, ?)`, [name, period], function(err) {
    if (err) {
      console.error(err.message);
      res.status(500).send('Error saving course to database');
    } else {
      // send response with newly created course ID
      res.json({ id: this.lastID });
    }
  });
});

// handle GET request to retrieve a course by ID
app.get('/courses/:id', (req, res) => {
  const { id } = req.params;

  // retrieve course from database by ID
  db.get(`SELECT * FROM courses WHERE id = ?`, [id], (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Error retrieving course from database');
    } else if (!row) {
      res.status(404).send('Course not found');
    } else {
      // send response with course data
      res.json(row);
    }
  });
});

// start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});