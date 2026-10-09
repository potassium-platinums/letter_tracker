const db = require("better-sqlite3")('data/database.db');
const fs = require('fs');
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
db.pragma('foreign_keys = ON');
const {APP_NAME} = require('../config/constants');

function initDB() {
  const createTableQuery = fs.readFileSync('./data/schema/schema.sql', 'utf-8');
  db.exec(createTableQuery);
}

function insertLetter(sn, owner_name, owner_phone, owner_email, subject, priority, current_status, current_holder) {
  const insertQuery = `
  INSERT INTO letters (sn, owner_name, owner_phone, owner_email, subject, priority, current_status, current_holder, submitted_at, updated_at) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`;
  const stmt = db.prepare(insertQuery);
  const info = stmt.run(sn, owner_name, owner_phone, owner_email, subject, priority, current_status, current_holder);
  return info.lastInsertRowid;
}

function letter_event(sn, event_type, actor, actor_role, note, metadata) {
  const insertQuery = `
  INSERT INTO letter_events (sn, type, actor, actor_role, note, metadata, occurred_at)
  VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`;
  const stmt = db.prepare(insertQuery);
  stmt.run(sn, event_type, actor, actor_role, note, metadata);
}

function insertappointment(sn, appointment_date) {
  const insertQuery = `
  INSERT INTO appointments (sn, appointment_date)
  VALUES (?, ?)`;
  const stmt = db.prepare(insertQuery);
  stmt.run(sn, appointment_date);
}

function insertReply(sn, reply_content) {
  const insertQuery = `
  INSERT INTO replys (sn, reply_text, replied_at)
  VALUES (?, ?, datetime('now'))`;
  const stmt = db.prepare(insertQuery);
  stmt.run(sn, reply_content);
}

function getLetterByid(id) {
  const selectQuery = `SELECT * FROM letters WHERE id = ?`;
  const stmt = db.prepare(selectQuery);
  return stmt.all(id);
}

function getLetterBysn(sn) {
  const selectQuery = `SELECT * FROM letters WHERE sn = ?`;
  const stmt = db.prepare(selectQuery);
  return stmt.all(sn);
}


function getLetterEventsById(sn) {
  const selectQuery = `SELECT * FROM letter_events WHERE sn = ? ORDER BY occurred_at ASC`;
  const stmt = db.prepare(selectQuery);
  return stmt.all(sn);
}

function updateLetterStatus(sn, newStatus) {
  const updateQuery = `UPDATE letters SET current_status = ?, updated_at = datetime('now') WHERE sn = ?`;
  const stmt = db.prepare(updateQuery);
  stmt.run(newStatus, sn);
}

function getLetterPA() {
  const selectQuery = `SELECT * FROM letters WHERE current_status = 'FORWARDED_TO_PA' ORDER BY submitted_at DESC`;
  const stmt = db.prepare(selectQuery);
  return stmt.all();
}

function getacknowledPA() {
  const selectQuery = `SELECT * FROM letters WHERE current_status = 'RECEIVED_BY_PA' ORDER BY submitted_at DESC`;
  const stmt = db.prepare(selectQuery);
  return stmt.all();
}

function getLetterCeo() {
  const selectQuery = `SELECT * FROM letters WHERE current_status = 'FORWARDED_TO_CEO' ORDER BY submitted_at DESC`;
  const stmt = db.prepare(selectQuery);
  return stmt.all();
}

module.exports = {
  initDB,
  insertLetter,
  letter_event,
  getLetterByid,
  getLetterBysn,
  getLetterEventsById,
  updateLetterStatus,
  insertappointment,
  insertReply,
  getLetterPA,
  getacknowledPA,
  getLetterCeo
};