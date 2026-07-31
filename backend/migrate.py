import sqlite3

def run_migration():
    conn = sqlite3.connect('test.db')
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
    print("Migration completed successfully.")

if __name__ == "__main__":
    run_migration()
