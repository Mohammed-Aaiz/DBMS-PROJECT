const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all contacts + search + sort
router.get('/', (req, res) => {
  const { search, sort } = req.query;
  let sql = 'SELECT * FROM contacts';
  let conditions = [];

  if (search) {
    conditions.push(`(name LIKE '%${search}%' OR email LIKE '%${search}%' OR phone LIKE '%${search}%')`);
  }

  if (conditions.length) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  if (sort === 'name') {
    sql += ' ORDER BY name ASC';
  } else if (sort === 'recent') {
    sql += ' ORDER BY id DESC';
  }

  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// POST a new contact
router.post('/', (req, res) => {
  const { name, email, phone, address } = req.body;
  const sql = 'INSERT INTO contacts (name, email, phone, address) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email, phone, address], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId });
  });
});

// PUT update a contact
router.put('/:id', (req, res) => {
  const { name, email, phone, address } = req.body;
  const sql = 'UPDATE contacts SET name=?, email=?, phone=?, address=? WHERE id=?';
  db.query(sql, [name, email, phone, address, req.params.id], (err) => {
    if (err) throw err;
    res.sendStatus(200);
  });
});

// DELETE a contact
router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM contacts WHERE id=?';
  db.query(sql, [req.params.id], (err) => {
    if (err) throw err;
    res.sendStatus(200);
  });
});

module.exports = router;
