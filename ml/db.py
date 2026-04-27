import sqlite3
import json
from datetime import datetime

DB_NAME = "smartgrid.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS dispatch_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            solar_kw REAL,
            wind_kw REAL,
            total_generation REAL,
            deficit REAL,
            price_per_unit REAL,
            allocation TEXT
        )
    """)

    conn.commit()
    conn.close()


def save_dispatch_history(data):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO dispatch_history
        (timestamp, solar_kw, wind_kw, total_generation, deficit, price_per_unit, allocation)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        data["solar_kw"],
        data["wind_kw"],
        data["total_generation"],
        data["deficit"],
        data["price_per_unit"],
        json.dumps(data["allocation"])
    ))

    conn.commit()
    conn.close()


def get_last_7_days():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT timestamp, total_generation, price_per_unit
        FROM dispatch_history
        ORDER BY id DESC
        LIMIT 7
    """)

    rows = cursor.fetchall()
    conn.close()

    return [
        {
            "date": row[0],
            "generation": row[1],
            "price": row[2]
        }
        for row in rows
    ]