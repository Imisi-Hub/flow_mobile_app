import * as SQLite from "expo-sqlite";

// ─── Local SQLite Database ────────────────────────────────────────────────────
//
// This is the local cache layer for offline-first operation.
// It mirrors the Supabase schema but stores only data relevant to the
// current authenticated user on this device.
//
// Sync strategy:
//   - Reads: prefer local cache, hydrate from Supabase on reconnect
//   - Writes: write locally first, queue for remote sync
//
// TODO: Implement full conflict resolution and sync queue.
//       For now, only the schema and DB connection are set up.
//       See /src/features/sync/ (future pass) for the sync queue implementation.

const DB_NAME = "flow.db";
const DB_VERSION = 1;

// Open (or create) the database
export const db = SQLite.openDatabaseSync(DB_NAME);

// ─── Schema Init ──────────────────────────────────────────────────────────────

export async function initializeDatabase(): Promise<void> {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    -- Local tasks cache
    -- Mirrors supabase public.tasks table
    CREATE TABLE IF NOT EXISTS tasks (
      id              TEXT PRIMARY KEY,
      user_id         TEXT NOT NULL,
      domain_id       TEXT,
      title           TEXT NOT NULL,
      quadrant        TEXT CHECK(quadrant IN ('Q1','Q2','Q3','Q4')),
      status          TEXT NOT NULL DEFAULT 'active'
                           CHECK(status IN ('active','completed','archived','deleted')),
      due_date        TEXT,                      -- ISO8601 string
      created_at      TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at      TEXT NOT NULL DEFAULT (datetime('now')),
      encrypted_content TEXT,                   -- AES-encrypted blob (future)
      synced_at       TEXT,                      -- last successful remote sync
      is_dirty        INTEGER NOT NULL DEFAULT 1 -- 1 = needs sync to remote
    );

    -- Local focus sessions cache
    CREATE TABLE IF NOT EXISTS focus_sessions (
      id          TEXT PRIMARY KEY,
      user_id     TEXT NOT NULL,
      task_id     TEXT REFERENCES tasks(id) ON DELETE SET NULL,
      duration    INTEGER NOT NULL DEFAULT 0,   -- seconds
      started_at  TEXT NOT NULL,
      ended_at    TEXT,
      synced_at   TEXT,
      is_dirty    INTEGER NOT NULL DEFAULT 1
    );

    -- Local streaks cache
    CREATE TABLE IF NOT EXISTS streaks (
      id           TEXT PRIMARY KEY,
      user_id      TEXT NOT NULL,
      type         TEXT NOT NULL,
      count        INTEGER NOT NULL DEFAULT 0,
      last_updated TEXT NOT NULL DEFAULT (date('now')),
      synced_at    TEXT,
      is_dirty     INTEGER NOT NULL DEFAULT 1
    );

    -- Metadata table for DB versioning
    CREATE TABLE IF NOT EXISTS _meta (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    INSERT OR IGNORE INTO _meta (key, value) VALUES ('db_version', '${DB_VERSION}');
  `);

  console.log("[SQLite] Database initialized (v" + DB_VERSION + ")");
}

// ─── Basic CRUD Helpers ───────────────────────────────────────────────────────
// These are intentionally minimal. Full repository pattern will be added
// per-feature in subsequent passes.

export type TaskRow = {
  id: string;
  user_id: string;
  domain_id?: string | null;
  title: string;
  quadrant?: "Q1" | "Q2" | "Q3" | "Q4" | null;
  status: "active" | "completed" | "archived" | "deleted";
  due_date?: string | null;
  created_at: string;
  updated_at: string;
  encrypted_content?: string | null;
  synced_at?: string | null;
  is_dirty: 0 | 1;
};

export function getAllTasksForUser(userId: string): TaskRow[] {
  return db.getAllSync<TaskRow>(
    `SELECT * FROM tasks WHERE user_id = ? AND status != 'deleted' ORDER BY created_at DESC`,
    [userId]
  );
}

export function upsertTask(task: Omit<TaskRow, "created_at" | "updated_at">): void {
  db.runSync(
    `INSERT INTO tasks (id, user_id, domain_id, title, quadrant, status, due_date, encrypted_content, is_dirty)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
     ON CONFLICT(id) DO UPDATE SET
       title = excluded.title,
       quadrant = excluded.quadrant,
       status = excluded.status,
       due_date = excluded.due_date,
       domain_id = excluded.domain_id,
       encrypted_content = excluded.encrypted_content,
       updated_at = datetime('now'),
       is_dirty = 1`,
    [
      task.id,
      task.user_id,
      task.domain_id ?? null,
      task.title,
      task.quadrant ?? null,
      task.status,
      task.due_date ?? null,
      task.encrypted_content ?? null,
    ]
  );
}

export function getDirtyTasks(userId: string): TaskRow[] {
  return db.getAllSync<TaskRow>(
    `SELECT * FROM tasks WHERE user_id = ? AND is_dirty = 1`,
    [userId]
  );
}

export function markTaskSynced(taskId: string): void {
  db.runSync(
    `UPDATE tasks SET is_dirty = 0, synced_at = datetime('now') WHERE id = ?`,
    [taskId]
  );
}

// TODO: Add getDirtyFocusSessions(), markFocusSessionSynced() in the sync-queue pass.
// TODO: Add getDirtyStreaks(), markStreakSynced() in the sync-queue pass.
