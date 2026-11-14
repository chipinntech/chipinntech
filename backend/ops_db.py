"""
Chipinn Technologies — Ops Center Database Module
Handles SQLite operations for internal finances, staff/electricians, inventory, and clients.
"""

import sqlite3
import hashlib
import os
from datetime import datetime
from typing import Dict, Any, List, Optional

DB_PATH = os.path.join(os.path.dirname(__file__), "chipinn_ops.db")
DEFAULT_OPS_PASSWORD = os.getenv("CHIPINN_OPS_PASSWORD", "chipinn2026")


def hash_password(password: str) -> str:
    """Hashes a password with SHA-256 and salt."""
    salt = "chipinn_ghana_salt_2026"
    return hashlib.sha256((salt + password).encode()).hexdigest()


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Initializes tables and seeds initial starter records if empty."""
    with get_db() as conn:
        cursor = conn.cursor()

        # 1. Auth table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS ops_auth (
                id INTEGER PRIMARY KEY,
                password_hash TEXT NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Set default password if not initialized
        cursor.execute("SELECT id FROM ops_auth WHERE id = 1")
        if not cursor.fetchone():
            cursor.execute(
                "INSERT INTO ops_auth (id, password_hash) VALUES (1, ?)",
                (hash_password(DEFAULT_OPS_PASSWORD),)
            )

        # 2. Financial Ledger
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS ops_finances (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                amount_ghc REAL NOT NULL,
                type TEXT NOT NULL, -- 'income' or 'expense'
                category TEXT NOT NULL,
                account TEXT NOT NULL, -- 'momo', 'bank', 'petty_cash'
                description TEXT NOT NULL,
                reference TEXT,
                party TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # 3. Employees & Field Electricians
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS ops_employees (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                role TEXT NOT NULL,
                phone TEXT NOT NULL,
                momo_number TEXT,
                ghana_card TEXT,
                zone TEXT,
                employment_type TEXT DEFAULT 'Contract / Commission',
                base_salary_ghc REAL DEFAULT 0,
                commission_per_meter_ghc REAL DEFAULT 120,
                meters_installed_count INTEGER DEFAULT 0,
                status TEXT DEFAULT 'Active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # 4. Hardware Inventory & Stock
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS ops_inventory (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                item_name TEXT NOT NULL,
                category TEXT NOT NULL,
                quantity INTEGER NOT NULL DEFAULT 0,
                unit TEXT DEFAULT 'pcs',
                unit_cost_ghc REAL DEFAULT 0,
                min_threshold INTEGER DEFAULT 10,
                location TEXT DEFAULT 'Main Lab',
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # 5. Clients & Installations
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS ops_clients (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                phone TEXT NOT NULL,
                alt_phone TEXT,
                location TEXT NOT NULL,
                ghana_post_gps TEXT,
                property_type TEXT DEFAULT 'Compound House (3 Tenants)',
                meters_ordered INTEGER DEFAULT 1,
                meter_serials TEXT,
                total_amount_ghc REAL DEFAULT 1250,
                amount_paid_ghc REAL DEFAULT 0,
                balance_due_ghc REAL DEFAULT 1250,
                status TEXT DEFAULT 'New Inquiry',
                assigned_installer_name TEXT,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Seed initial data if tables are empty
        cursor.execute("SELECT COUNT(*) as count FROM ops_finances")
        if cursor.fetchone()["count"] == 0:
            today = datetime.now().strftime("%Y-%m-%d")
            
            # Starter Financials
            finances_seed = [
                (today, 1250.0, "income", "meter_sale", "momo", "Full payment for Unity Meter #001 (East Legon)", "MTN-94810294", "Kwesi Mensah"),
                (today, 625.0, "income", "deposit", "momo", "50% pre-order deposit for Spintex compound", "MTN-94811048", "Mrs. Akua Frimpong"),
                (today, 120.0, "expense", "technician_payout", "momo", "Installation commission for Unit #001", "MTN-94813001", "Kofi Boateng (Installer)"),
                (today, 1850.0, "expense", "cogs_parts", "bank", "Batch 1 Enclosure Casing & Relays", "STANBIC-TRX-441", "Precision Moldings Ghana"),
                (today, 150.0, "expense", "delivery_fuel", "petty_cash", "Site inspection and delivery fuel", "CASH-PETTY-01", "Shell Spintex")
            ]
            cursor.executemany("""
                INSERT INTO ops_finances (date, amount_ghc, type, category, account, description, reference, party)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, finances_seed)

            # Starter Team
            employees_seed = [
                ("Kofi Boateng", "Lead Field Electrician", "+233 24 551 2341", "0245512341", "GHA-712894102-1", "Accra Central & Spintex", "Contract / Commission", 0.0, 120.0, 8, "Active"),
                ("Emmanuel Osei", "Field Electrician", "+233 50 119 8472", "0501198472", "GHA-820194829-3", "Tema & Kpone", "Contract / Commission", 0.0, 120.0, 4, "Active"),
                ("Derrick Addo", "Hardware Assembly Tech", "+233 27 492 0182", "0274920182", "GHA-910293810-4", "Lab Assembly", "Full-time", 2500.0, 20.0, 12, "Active"),
                ("Sarah Lamptey", "Customer Operations & Sales", "+233 20 839 1049", "0208391049", "GHA-510294819-2", "Head Office / Remote", "Full-time", 2800.0, 50.0, 0, "Active")
            ]
            cursor.executemany("""
                INSERT INTO ops_employees (name, role, phone, momo_number, ghana_card, zone, employment_type, base_salary_ghc, commission_per_meter_ghc, meters_installed_count, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, employees_seed)

            # Starter Inventory
            inventory_seed = [
                ("Unity Meter 3-in-1 (Assembled)", "finished_product", 18, "units", 580.0, 5, "Main Lab Shelf A"),
                ("Fire-Retardant Wall Enclosure Box", "casing_hardware", 45, "pcs", 65.0, 15, "Bin 01"),
                ("STS 100A Bi-Directional Relays", "electronic_component", 60, "pcs", 45.0, 20, "Electronics Shelf 2"),
                ("Split-Core 100A Current Transformers", "electronic_component", 72, "pcs", 38.0, 25, "Electronics Shelf 1"),
                ("ESP32 IoT & GSM Dual-Band Module", "electronic_component", 34, "pcs", 75.0, 10, "Secure Locker"),
                ("Fluke True-RMS Clamp Meter & Probe Kit", "tool", 3, "sets", 1200.0, 1, "Tool Rack")
            ]
            cursor.executemany("""
                INSERT INTO ops_inventory (item_name, category, quantity, unit, unit_cost_ghc, min_threshold, location)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, inventory_seed)

            # Starter Clients
            clients_seed = [
                ("Kwesi Mensah", "+233 24 410 9283", "+233 20 192 8374", "East Legon (near American House)", "GA-194-2819", "Compound House (3 Tenants)", 1, "CP-UM-1001", 1250.0, 1250.0, 0.0, "Installed & Tested", "Kofi Boateng", "Landlord thrilled with single 3-channel billing."),
                ("Mrs. Akua Frimpong", "+233 50 829 1029", "", "Spintex (Kotobabi Junction)", "GZ-029-4810", "Rental Apartments (6 units)", 2, "CP-UM-1002, CP-UM-1003", 2500.0, 1250.0, 1250.0, "Deposit Received", "Kofi Boateng", "Installation scheduled for Saturday 10am."),
                ("Dr. Nii Armah Tagoe", "+233 24 382 9102", "", "Dansoman (Keep Fit Club)", "GA-582-1948", "Storefront & Residential", 1, "Pending Allocation", 1250.0, 0.0, 1250.0, "New Inquiry", "", "Requested site inspection before committing.")
            ]
            cursor.executemany("""
                INSERT INTO ops_clients (name, phone, alt_phone, location, ghana_post_gps, property_type, meters_ordered, meter_serials, total_amount_ghc, amount_paid_ghc, balance_due_ghc, status, assigned_installer_name, notes)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, clients_seed)

        conn.commit()


# Initialize on import
init_db()


# --- Auth Services ---
def check_password(password: str) -> bool:
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT password_hash FROM ops_auth WHERE id = 1")
        row = cursor.fetchone()
        if not row:
            return password == DEFAULT_OPS_PASSWORD
        return row["password_hash"] == hash_password(password)


def update_password(old_pw: str, new_pw: str) -> bool:
    if not check_password(old_pw):
        return False
    if len(new_pw) < 6:
        return False
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE ops_auth SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1",
            (hash_password(new_pw),)
        )
        conn.commit()
        return True


# --- Overview Service ---
def get_overview_metrics() -> Dict[str, Any]:
    with get_db() as conn:
        cursor = conn.cursor()

        # Financial totals
        cursor.execute("SELECT type, account, SUM(amount_ghc) as total FROM ops_finances GROUP BY type, account")
        fin_rows = cursor.fetchall()
        
        income_total = 0.0
        expense_total = 0.0
        accounts = {"momo": 0.0, "bank": 0.0, "petty_cash": 0.0}

        for row in fin_rows:
            amt = float(row["total"] or 0)
            acc = row["account"]
            if row["type"] == "income":
                income_total += amt
                if acc in accounts:
                    accounts[acc] += amt
            else:
                expense_total += amt
                if acc in accounts:
                    accounts[acc] -= amt

        # Outstanding balances from clients
        cursor.execute("SELECT SUM(balance_due_ghc) as outstanding, SUM(meters_ordered) as meters_total FROM ops_clients")
        client_stats = cursor.fetchone()
        total_outstanding = float(client_stats["outstanding"] or 0)
        total_meters_sold = int(client_stats["meters_total"] or 0)

        # Inventory alerts
        cursor.execute("SELECT COUNT(*) as low_stock FROM ops_inventory WHERE quantity <= min_threshold")
        low_stock_count = int(cursor.fetchone()["low_stock"] or 0)

        # Team count
        cursor.execute("SELECT COUNT(*) as team_count FROM ops_employees WHERE status = 'Active'")
        team_count = int(cursor.fetchone()["team_count"] or 0)

        # Recent activities (latest 5 finances)
        cursor.execute("""
            SELECT id, date, amount_ghc, type, category, account, description, party
            FROM ops_finances ORDER BY id DESC LIMIT 5
        """)
        recent_finances = [dict(r) for r in cursor.fetchall()]

        return {
            "income_total_ghc": round(income_total, 2),
            "expense_total_ghc": round(expense_total, 2),
            "net_profit_ghc": round(income_total - expense_total, 2),
            "accounts_ghc": {k: round(v, 2) for k, v in accounts.items()},
            "total_cash_ghc": round(sum(accounts.values()), 2),
            "total_outstanding_ghc": round(total_outstanding, 2),
            "total_meters_ordered": total_meters_sold,
            "low_stock_alerts": low_stock_count,
            "active_team_count": team_count,
            "recent_activity": recent_finances
        }


# --- Finances Services ---
def list_finances(account_filter: Optional[str] = None, type_filter: Optional[str] = None) -> List[Dict[str, Any]]:
    with get_db() as conn:
        cursor = conn.cursor()
        query = "SELECT * FROM ops_finances WHERE 1=1"
        params = []
        if account_filter and account_filter != "all":
            query += " AND account = ?"
            params.append(account_filter)
        if type_filter and type_filter != "all":
            query += " AND type = ?"
            params.append(type_filter)
        query += " ORDER BY id DESC"
        cursor.execute(query, params)
        return [dict(r) for r in cursor.fetchall()]


def add_finance_record(data: Dict[str, Any]) -> Dict[str, Any]:
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO ops_finances (date, amount_ghc, type, category, account, description, reference, party)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            data.get("date") or datetime.now().strftime("%Y-%m-%d"),
            float(data["amount_ghc"]),
            data["type"],
            data.get("category", "other"),
            data.get("account", "momo"),
            data["description"],
            data.get("reference", ""),
            data.get("party", "")
        ))
        conn.commit()
        new_id = cursor.lastrowid
        cursor.execute("SELECT * FROM ops_finances WHERE id = ?", (new_id,))
        return dict(cursor.fetchone())


def delete_finance_record(record_id: int) -> bool:
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM ops_finances WHERE id = ?", (record_id,))
        conn.commit()
        return cursor.rowcount > 0


# --- Employees Services ---
def list_employees() -> List[Dict[str, Any]]:
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM ops_employees ORDER BY id ASC")
        return [dict(r) for r in cursor.fetchall()]


def add_or_update_employee(data: Dict[str, Any]) -> Dict[str, Any]:
    emp_id = data.get("id")
    with get_db() as conn:
        cursor = conn.cursor()
        if emp_id:
            cursor.execute("""
                UPDATE ops_employees SET
                    name = ?, role = ?, phone = ?, momo_number = ?, ghana_card = ?, zone = ?,
                    employment_type = ?, base_salary_ghc = ?, commission_per_meter_ghc = ?,
                    meters_installed_count = ?, status = ?
                WHERE id = ?
            """, (
                data["name"], data["role"], data["phone"], data.get("momo_number", ""),
                data.get("ghana_card", ""), data.get("zone", ""), data.get("employment_type", "Contract / Commission"),
                float(data.get("base_salary_ghc", 0)), float(data.get("commission_per_meter_ghc", 120)),
                int(data.get("meters_installed_count", 0)), data.get("status", "Active"), emp_id
            ))
        else:
            cursor.execute("""
                INSERT INTO ops_employees (
                    name, role, phone, momo_number, ghana_card, zone,
                    employment_type, base_salary_ghc, commission_per_meter_ghc,
                    meters_installed_count, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                data["name"], data["role"], data["phone"], data.get("momo_number", ""),
                data.get("ghana_card", ""), data.get("zone", ""), data.get("employment_type", "Contract / Commission"),
                float(data.get("base_salary_ghc", 0)), float(data.get("commission_per_meter_ghc", 120)),
                int(data.get("meters_installed_count", 0)), data.get("status", "Active")
            ))
            emp_id = cursor.lastrowid
        conn.commit()
        cursor.execute("SELECT * FROM ops_employees WHERE id = ?", (emp_id,))
        return dict(cursor.fetchone())


def record_employee_install(emp_id: int, count: int = 1) -> Optional[Dict[str, Any]]:
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE ops_employees SET meters_installed_count = meters_installed_count + ? WHERE id = ?", (count, emp_id))
        conn.commit()
        cursor.execute("SELECT * FROM ops_employees WHERE id = ?", (emp_id,))
        row = cursor.fetchone()
        return dict(row) if row else None


def delete_employee(emp_id: int) -> bool:
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM ops_employees WHERE id = ?", (emp_id,))
        conn.commit()
        return cursor.rowcount > 0


# --- Inventory Services ---
def list_inventory() -> List[Dict[str, Any]]:
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM ops_inventory ORDER BY id ASC")
        return [dict(r) for r in cursor.fetchall()]


def add_or_update_inventory(data: Dict[str, Any]) -> Dict[str, Any]:
    item_id = data.get("id")
    with get_db() as conn:
        cursor = conn.cursor()
        if item_id:
            cursor.execute("""
                UPDATE ops_inventory SET
                    item_name = ?, category = ?, quantity = ?, unit = ?,
                    unit_cost_ghc = ?, min_threshold = ?, location = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            """, (
                data["item_name"], data["category"], int(data["quantity"]), data.get("unit", "pcs"),
                float(data.get("unit_cost_ghc", 0)), int(data.get("min_threshold", 10)),
                data.get("location", "Main Lab"), item_id
            ))
        else:
            cursor.execute("""
                INSERT INTO ops_inventory (item_name, category, quantity, unit, unit_cost_ghc, min_threshold, location)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                data["item_name"], data["category"], int(data["quantity"]), data.get("unit", "pcs"),
                float(data.get("unit_cost_ghc", 0)), int(data.get("min_threshold", 10)),
                data.get("location", "Main Lab")
            ))
            item_id = cursor.lastrowid
        conn.commit()
        cursor.execute("SELECT * FROM ops_inventory WHERE id = ?", (item_id,))
        return dict(cursor.fetchone())


def adjust_inventory_quantity(item_id: int, delta: int) -> Optional[Dict[str, Any]]:
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE ops_inventory SET quantity = MAX(0, quantity + ?), updated_at = CURRENT_TIMESTAMP WHERE id = ?", (delta, item_id))
        conn.commit()
        cursor.execute("SELECT * FROM ops_inventory WHERE id = ?", (item_id,))
        row = cursor.fetchone()
        return dict(row) if row else None


def delete_inventory(item_id: int) -> bool:
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM ops_inventory WHERE id = ?", (item_id,))
        conn.commit()
        return cursor.rowcount > 0


# --- Clients Services ---
def list_clients() -> List[Dict[str, Any]]:
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM ops_clients ORDER BY id DESC")
        return [dict(r) for r in cursor.fetchall()]


def add_or_update_client(data: Dict[str, Any]) -> Dict[str, Any]:
    client_id = data.get("id")
    total = float(data.get("total_amount_ghc", 1250))
    paid = float(data.get("amount_paid_ghc", 0))
    balance = max(0.0, total - paid)

    with get_db() as conn:
        cursor = conn.cursor()
        if client_id:
            cursor.execute("""
                UPDATE ops_clients SET
                    name = ?, phone = ?, alt_phone = ?, location = ?, ghana_post_gps = ?,
                    property_type = ?, meters_ordered = ?, meter_serials = ?,
                    total_amount_ghc = ?, amount_paid_ghc = ?, balance_due_ghc = ?,
                    status = ?, assigned_installer_name = ?, notes = ?
                WHERE id = ?
            """, (
                data["name"], data["phone"], data.get("alt_phone", ""), data["location"],
                data.get("ghana_post_gps", ""), data.get("property_type", "Compound House"),
                int(data.get("meters_ordered", 1)), data.get("meter_serials", ""),
                total, paid, balance, data.get("status", "New Inquiry"),
                data.get("assigned_installer_name", ""), data.get("notes", ""), client_id
            ))
        else:
            cursor.execute("""
                INSERT INTO ops_clients (
                    name, phone, alt_phone, location, ghana_post_gps, property_type,
                    meters_ordered, meter_serials, total_amount_ghc, amount_paid_ghc,
                    balance_due_ghc, status, assigned_installer_name, notes
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                data["name"], data["phone"], data.get("alt_phone", ""), data["location"],
                data.get("ghana_post_gps", ""), data.get("property_type", "Compound House"),
                int(data.get("meters_ordered", 1)), data.get("meter_serials", ""),
                total, paid, balance, data.get("status", "New Inquiry"),
                data.get("assigned_installer_name", ""), data.get("notes", "")
            ))
            client_id = cursor.lastrowid
        conn.commit()
        cursor.execute("SELECT * FROM ops_clients WHERE id = ?", (client_id,))
        return dict(cursor.fetchone())


def update_client_status(client_id: int, status: str, amount_paid: Optional[float] = None) -> Optional[Dict[str, Any]]:
    with get_db() as conn:
        cursor = conn.cursor()
        if amount_paid is not None:
            cursor.execute("SELECT total_amount_ghc FROM ops_clients WHERE id = ?", (client_id,))
            row = cursor.fetchone()
            if row:
                balance = max(0.0, float(row["total_amount_ghc"]) - amount_paid)
                cursor.execute(
                    "UPDATE ops_clients SET status = ?, amount_paid_ghc = ?, balance_due_ghc = ? WHERE id = ?",
                    (status, amount_paid, balance, client_id)
                )
        else:
            cursor.execute("UPDATE ops_clients SET status = ? WHERE id = ?", (status, client_id))
        conn.commit()
        cursor.execute("SELECT * FROM ops_clients WHERE id = ?", (client_id,))
        row = cursor.fetchone()
        return dict(row) if row else None


def delete_client(client_id: int) -> bool:
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM ops_clients WHERE id = ?", (client_id,))
        conn.commit()
        return cursor.rowcount > 0

