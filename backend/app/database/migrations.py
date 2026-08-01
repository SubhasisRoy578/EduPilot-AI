"""Lightweight, idempotent SQLite migrations run at application startup.

Fixes the `roadmaps.completed_milestones` column so that the database,
the SQLAlchemy model (Integer) and the Pydantic schema (int) all agree.

During earlier debugging the column ended up declared as TEXT DEFAULT '[]'
and rows contain string values such as '0' or JSON lists. This migration
safely rebuilds the column as INTEGER DEFAULT 0, converting existing data:
  - integers / numeric strings -> int(value)
  - JSON lists (e.g. '[1,2]')  -> number of completed milestones (len)
  - NULL / empty / anything else -> 0
"""

import json
import sqlite3


def _to_int(value):
    """Convert a legacy completed_milestones value to an integer count."""
    if value is None:
        return 0
    if isinstance(value, int):
        return value
    if isinstance(value, float):
        return int(value)
    if isinstance(value, str):
        value = value.strip()
        if not value:
            return 0
        try:
            return int(value)
        except ValueError:
            pass
        try:
            parsed = json.loads(value)
            if isinstance(parsed, list):
                return len(parsed)
            if isinstance(parsed, (int, float)):
                return int(parsed)
        except (ValueError, TypeError):
            pass
    return 0


def migrate_completed_milestones(db_path: str) -> None:
    conn = sqlite3.connect(db_path)
    try:
        cursor = conn.cursor()

        # Nothing to do if the table doesn't exist yet (create_all handles it).
        table = cursor.execute(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='roadmaps'"
        ).fetchone()
        if not table:
            return

        columns = cursor.execute("PRAGMA table_info(roadmaps)").fetchall()
        col_names = [c[1] for c in columns]

        # Ensure the progress columns exist (repair of the original migration).
        if "completed_milestones" not in col_names:
            cursor.execute(
                "ALTER TABLE roadmaps ADD COLUMN completed_milestones INTEGER DEFAULT 0"
            )
        if "completed_weeks" not in col_names:
            cursor.execute(
                "ALTER TABLE roadmaps ADD COLUMN completed_weeks INTEGER DEFAULT 0"
            )
        if "total_weeks" not in col_names:
            cursor.execute(
                "ALTER TABLE roadmaps ADD COLUMN total_weeks INTEGER DEFAULT 8"
            )
        if "last_learned_date" not in col_names:
            cursor.execute(
                "ALTER TABLE roadmaps ADD COLUMN last_learned_date DATE NULL"
            )
        conn.commit()

        # Check the declared type of completed_milestones.
        columns = cursor.execute("PRAGMA table_info(roadmaps)").fetchall()
        cm_type = next(
            (c[2] or "").upper() for c in columns if c[1] == "completed_milestones"
        )

        if cm_type != "INTEGER":
            # Rebuild the table with the correct column type, converting data.
            rows = cursor.execute(
                "SELECT id, title, description, status, user_id, hours_per_day, "
                "created_at, completed_milestones, completed_weeks, total_weeks, "
                "last_learned_date FROM roadmaps"
            ).fetchall()

            cursor.execute("PRAGMA foreign_keys=off")
            cursor.execute("BEGIN")
            cursor.execute("ALTER TABLE roadmaps RENAME TO roadmaps_old")
            cursor.execute(
                """
                CREATE TABLE roadmaps (
                    id INTEGER NOT NULL PRIMARY KEY,
                    title VARCHAR NOT NULL,
                    description VARCHAR,
                    status VARCHAR,
                    hours_per_day INTEGER DEFAULT 0,
                    created_at DATETIME,
                    completed_milestones INTEGER DEFAULT 0,
                    completed_weeks INTEGER DEFAULT 0,
                    total_weeks INTEGER DEFAULT 8,
                    last_learned_date DATE,
                    user_id INTEGER,
                    FOREIGN KEY(user_id) REFERENCES users (id)
                )
                """
            )
            for r in rows:
                cursor.execute(
                    "INSERT INTO roadmaps (id, title, description, status, user_id, "
                    "hours_per_day, created_at, completed_milestones, completed_weeks, "
                    "total_weeks, last_learned_date) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
                    (
                        r[0], r[1], r[2], r[3], r[4], r[5], r[6],
                        _to_int(r[7]),
                        _to_int(r[8]),
                        _to_int(r[9]) or 8,
                        r[10],
                    ),
                )
            cursor.execute("DROP TABLE roadmaps_old")
            conn.commit()
            cursor.execute("PRAGMA foreign_keys=on")
            cursor.execute("CREATE INDEX IF NOT EXISTS ix_roadmaps_id ON roadmaps (id)")
            conn.commit()
        else:
            # Column type is fine; just normalize any stray non-integer values.
            rows = cursor.execute(
                "SELECT id, completed_milestones FROM roadmaps "
                "WHERE typeof(completed_milestones) != 'integer'"
            ).fetchall()
            for row_id, value in rows:
                cursor.execute(
                    "UPDATE roadmaps SET completed_milestones = ? WHERE id = ?",
                    (_to_int(value), row_id),
                )
            conn.commit()
    finally:
        conn.close()


def run_startup_migrations(database_url: str) -> None:
    if database_url.startswith("sqlite"):
        db_path = database_url.split("///")[-1]
        migrate_completed_milestones(db_path)
