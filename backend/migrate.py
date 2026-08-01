import sqlite3

from app.database.migrations import migrate_completed_milestones

DB_PATH = "edupilot.db"

def run_migration():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    try:
        cursor.execute("ALTER TABLE roadmaps ADD COLUMN completed_milestones INTEGER DEFAULT 0")
    except sqlite3.OperationalError:
        pass

    try:
        cursor.execute("ALTER TABLE roadmaps ADD COLUMN completed_weeks INTEGER DEFAULT 0")
    except sqlite3.OperationalError:
        pass

    try:
        cursor.execute("ALTER TABLE roadmaps ADD COLUMN total_weeks INTEGER DEFAULT 8")
    except sqlite3.OperationalError:
        pass

    try:
        cursor.execute("ALTER TABLE roadmaps ADD COLUMN last_learned_date DATE NULL")
    except sqlite3.OperationalError:
        pass

    conn.commit()
    conn.close()

    # Repair completed_milestones column type and normalize existing values.
    migrate_completed_milestones(DB_PATH)

    print("Migration completed successfully.")

if __name__ == "__main__":
    run_migration()
