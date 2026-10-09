-- ============================================================
-- LETTER TRACKER — SQLite Schema
-- ============================================================
-- Design principles:
--   1. letters is the CURRENT STATE (projection, fast reads)
--   2. letter_events is the APPEND-ONLY source of truth
--   3. notifications is a QUEUE (worker drains it)
--   4. Never mutate events — only append
-- ============================================================

PRAGMA journal_mode = WAL;       -- better concurrency
PRAGMA foreign_keys = ON;        -- enforce referential integrity
PRAGMA synchronous = NORMAL;     -- safe + fast for MVP

-- ------------------------------------------------------------
-- 1. LETTERS — current state projection
-- ------------------------------------------------------------
-- One row per letter. Updated every time an event is appended.
-- Think of it as a "materialized view" of letter_events.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS letters ( 
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  sn                TEXT UNIQUE NOT NULL,           -- LTR-YYYYMMDD-XXXXXX
  owner_name        TEXT NOT NULL,
  owner_phone       TEXT NOT NULL,
  owner_email       TEXT,
  subject           TEXT NOT NULL DEFAULT '(no subject)',
  priority          TEXT NOT NULL DEFAULT 'NORMAL', -- NORMAL | HIGH | URGENT

  -- Denormalized current state (derived from letter_events)
  current_status    TEXT,                       -- SUBMITTED, REPLIED, etc.
  current_holder    TEXT,                       -- CLERK | PA | CEO | OWNER

  submitted_at      TEXT NOT NULL,              -- ISO 8601 string
  updated_at        TEXT NOT NULL,

  CHECK (current_holder IN ('CLERK','PA','CEO','OWNER') OR current_holder IS NULL)
);

CREATE INDEX IF NOT EXISTS idx_letters_holder ON letters(current_holder);
CREATE INDEX IF NOT EXISTS idx_letters_status ON letters(current_status);
CREATE INDEX IF NOT EXISTS idx_letters_owner_phone ON letters(owner_phone);

-- ------------------------------------------------------------
-- 2. LETTER_EVENTS — append-only audit log
-- ------------------------------------------------------------
-- Every action on a letter = one row. Never updated, never deleted.
-- This is the source of truth. If letters ever gets out of sync,
-- you can rebuild it by replaying these rows in order.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS letter_events (
  event_id      INTEGER PRIMARY KEY AUTOINCREMENT,
  sn            TEXT NOT NULL,
  type          TEXT UNIQUE NOT NULL,                  -- SUBMITTED, REPLIED, etc.
  actor         TEXT NOT NULL,                  -- who did it
  actor_role    TEXT NOT NULL,                  -- CLERK | PA | CEO
  note          TEXT,
  metadata      TEXT,                           -- JSON string (reply text, etc.)
  occurred_at   TEXT NOT NULL,                  -- ISO 8601

  FOREIGN KEY (sn) REFERENCES letters(sn) ON DELETE CASCADE,

  CHECK (actor_role IN ('CLERK','PA','CEO')),
  CHECK (type IN (
    'SUBMITTED',
    'FORWARDED_TO_PA',
    'RECEIVED_BY_PA',
    'FORWARDED_TO_CEO',
    'REPLIED',
    'APPOINTMENT_SET',
    'NO_ACTION_FILED',
    'RETURNED_TO_CLERK',
    'OWNER_NOTIFIED_PICKUP',
    'COLLECTED'
  ))
);

CREATE INDEX IF NOT EXISTS idx_events_sn ON letter_events(sn, occurred_at);
CREATE INDEX IF NOT EXISTS idx_events_type ON letter_events(type);

-- ------------------------------------------------------------
-- 3. NOTIFICATIONS — outgoing message queue
-- ------------------------------------------------------------
-- Written when events fire. Worker drains PENDING rows.
-- Never sent inline with the API request — always async.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  sn            TEXT NOT NULL,
  recipient     TEXT NOT NULL,                  -- phone, email, or role name
  channel       TEXT NOT NULL,                  -- SMS | EMAIL | PUSH
  message       TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'PENDING',-- PENDING | SENT | FAILED
  attempts      INTEGER NOT NULL DEFAULT 0,
  error         TEXT,
  created_at    TEXT NOT NULL,
  sent_at       TEXT,

  FOREIGN KEY (sn) REFERENCES letters(sn) ON DELETE CASCADE,

  CHECK (channel IN ('SMS','EMAIL','PUSH')),
  CHECK (status IN ('PENDING','SENT','FAILED'))
);

CREATE INDEX IF NOT EXISTS idx_notif_status ON notifications(status, created_at);
CREATE INDEX IF NOT EXISTS idx_notif_sn ON notifications(sn);


-- 4 . REPLYS — store replies to letters
CREATE TABLE IF NOT EXISTS replys (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  sn            TEXT NOT NULL,
  reply_text    TEXT NOT NULL,
  replied_at    TEXT NOT NULL,

  FOREIGN KEY (sn) REFERENCES letters(sn) ON DELETE CASCADE
);

-- 5 . APPOINTMENTS — store appointments for letters
CREATE TABLE IF NOT EXISTS appointments (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  sn            TEXT NOT NULL,
  appointment_date    TEXT NOT NULL,

  FOREIGN KEY (sn) REFERENCES letters(sn) ON DELETE CASCADE
);
