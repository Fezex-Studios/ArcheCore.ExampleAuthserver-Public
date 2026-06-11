import path from "path";
import { Database } from "bun:sqlite";
import {AuthDatabasePath} from "../ServerConfig";

// Resolve relative to the running executable/script so the DB always lands
// in the same place regardless of what directory you launch from.

export const db = new Database(AuthDatabasePath);

db.exec(`
    CREATE TABLE IF NOT EXISTS accounts
    (
        account_id    INTEGER PRIMARY KEY AUTOINCREMENT,
        username      TEXT    UNIQUE NOT NULL,
        password_hash TEXT    NOT NULL
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS sessions
    (
        token      TEXT    PRIMARY KEY,
        account_id INTEGER NOT NULL,
        expires_at TEXT    NOT NULL
    )
`);

// Purge expired sessions on startup and every hour after that.
function purgeExpiredSessions(): void
{
    const result = db
        .prepare(`DELETE FROM sessions WHERE expires_at < ?`)
        .run(new Date().toISOString());

    if (result.changes > 0)
        console.log(`[DB] Purged ${result.changes} expired session(s)`);
}

purgeExpiredSessions();
setInterval(purgeExpiredSessions, 60 * 60 * 1000);

console.log(`Database Ready (${AuthDatabasePath})`);