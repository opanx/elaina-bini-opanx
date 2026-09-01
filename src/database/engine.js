'use strict';
/**
 * Elaina Bot v4.0 — Database Engine
 * SQLite (primary) + JSON (fallback)
 */

const fs = require('fs');
const path = require('path');
const config = require('../config/settings');

const DB_DIR = path.resolve('./database');
const DB_PATH = path.resolve(config.dbPath || './database/elaina.db');

// Ensure directories exist
if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

let DB = null;
let _sqliteOK = false;

// Try to load better-sqlite3
try {
    const Database = require('better-sqlite3');
    DB = new Database(DB_PATH);
    DB.pragma('journal_mode = WAL');
    DB.pragma('synchronous = NORMAL');
    DB.pragma('foreign_keys = ON');
    _sqliteOK = true;
    console.log('[DB] ✅ SQLite aktif:', DB_PATH);
} catch (e) {
    console.warn('[DB] ⚠️  SQLite tidak tersedia, fallback ke JSON:', e.message);
}

// JSON helpers
const _jRead = (p, fallback) => {
    try {
        if (!fs.existsSync(p)) return fallback;
        return JSON.parse(fs.readFileSync(p, 'utf8'));
    } catch { return fallback; }
};

const _jWrite = (p, data) => {
    try { fs.writeFileSync(p, JSON.stringify(data, null, 2)); } catch {}
};

// ============ MIGRATION ============
const _migrate = () => {
    if (!_sqliteOK) return;
    DB.exec(`
        CREATE TABLE IF NOT EXISTS simple_lists (
            list_name TEXT NOT NULL,
            jid TEXT NOT NULL,
            added_at INTEGER DEFAULT (strftime('%s','now') * 1000),
            PRIMARY KEY (list_name, jid)
        );

        CREATE TABLE IF NOT EXISTS group_settings (
            group_id TEXT PRIMARY KEY,
            settings TEXT NOT NULL DEFAULT '{}'
        );

        CREATE TABLE IF NOT EXISTS user_profile (
            jid TEXT PRIMARY KEY,
            name TEXT DEFAULT '',
            exp INTEGER DEFAULT 0,
            koin INTEGER DEFAULT 0,
            level INTEGER DEFAULT 1,
            last_daily INTEGER DEFAULT 0,
            warnings INTEGER DEFAULT 0,
            is_premium INTEGER DEFAULT 0,
            premium_expiry INTEGER DEFAULT 0,
            created_at INTEGER DEFAULT (strftime('%s','now') * 1000)
        );

        CREATE TABLE IF NOT EXISTS gs_members (
            group_id TEXT NOT NULL,
            jid TEXT NOT NULL,
            name TEXT DEFAULT '',
            count INTEGER DEFAULT 0,
            PRIMARY KEY (group_id, jid)
        );

        CREATE TABLE IF NOT EXISTS gs_daily (
            group_id TEXT NOT NULL,
            date TEXT NOT NULL,
            count INTEGER DEFAULT 0,
            PRIMARY KEY (group_id, date)
        );

        CREATE TABLE IF NOT EXISTS sewa (
            group_id TEXT PRIMARY KEY,
            paket TEXT DEFAULT 'basic',
            expiry INTEGER,
            lifetime INTEGER DEFAULT 0,
            added_by TEXT DEFAULT ''
        );

        CREATE TABLE IF NOT EXISTS commands (
            name TEXT PRIMARY KEY,
            code TEXT NOT NULL,
            author TEXT DEFAULT '',
            created_at INTEGER DEFAULT (strftime('%s','now') * 1000),
            updated_at INTEGER DEFAULT (strftime('%s','now') * 1000)
        );

        CREATE TABLE IF NOT EXISTS _meta (
            key TEXT PRIMARY KEY,
            value TEXT
        );
    `);
};

if (_sqliteOK) _migrate();

// ============ SIMPLE LISTS ============
const loadList = (name) => {
    if (_sqliteOK) {
        try {
            const rows = DB.prepare('SELECT jid FROM simple_lists WHERE list_name = ?').all(name);
            return rows.map(r => r.jid);
        } catch {}
    }
    const p = path.join(DB_DIR, `${name}.json`);
    const data = _jRead(p, []);
    return Array.isArray(data) ? data : [];
};

const saveList = (name, arr) => {
    if (_sqliteOK) {
        try {
            const tx = DB.transaction(() => {
                DB.prepare('DELETE FROM simple_lists WHERE list_name = ?').run(name);
                const ins = DB.prepare('INSERT OR IGNORE INTO simple_lists(list_name,jid) VALUES(?,?)');
                for (const jid of arr) ins.run(name, jid);
            });
            tx();
        } catch {}
    }
    const p = path.join(DB_DIR, `${name}.json`);
    _jWrite(p, arr);
};

// ============ GROUP SETTINGS ============
const GS_DEFAULT = () => ({
    antilink: false, antilinkWA: false,
    antispam: false, antivortex: false, antiautobot: false,
    antinsfw: false, antitoxic: false,
    welcome: false, leave: false,
    welcomeMsg: '', leaveMsg: '',
    slowmode: false, slowmodeDelay: 10,
    verify: false,
    warnings: {},
    muted: [],
    banned: [],
});

const gsGet = (gid) => {
    if (_sqliteOK) {
        try {
            const row = DB.prepare('SELECT settings FROM group_settings WHERE group_id = ?').get(gid);
            if (row) return { ...GS_DEFAULT(), ...JSON.parse(row.settings) };
        } catch {}
    }
    const db = _jRead(path.join(DB_DIR, 'groupsettings.json'), {});
    return { ...GS_DEFAULT(), ...(db[gid] || {}) };
};

const gsSet = (gid, updates) => {
    const current = gsGet(gid);
    const merged = { ...current, ...updates };
    if (_sqliteOK) {
        try {
            DB.prepare('INSERT OR REPLACE INTO group_settings(group_id,settings) VALUES(?,?)').run(gid, JSON.stringify(merged));
        } catch {}
    }
    const db = _jRead(path.join(DB_DIR, 'groupsettings.json'), {});
    db[gid] = merged;
    _jWrite(path.join(DB_DIR, 'groupsettings.json'), db);
    return merged;
};

// ============ USER PROFILES ============
const getUser = (jid) => {
    if (_sqliteOK) {
        try {
            let row = DB.prepare('SELECT * FROM user_profile WHERE jid = ?').get(jid);
            if (!row) {
                DB.prepare('INSERT OR IGNORE INTO user_profile(jid) VALUES(?)').run(jid);
                row = { jid, name: '', exp: 0, koin: 0, level: 1, last_daily: 0, warnings: 0, is_premium: 0, premium_expiry: 0, created_at: Date.now() };
            }
            return row;
        } catch {}
    }
    const db = _jRead(path.join(DB_DIR, 'userprofile.json'), {});
    if (!db[jid]) {
        db[jid] = { name: '', exp: 0, koin: 0, level: 1, lastDaily: 0, warnings: 0, isPremium: false, premiumExpiry: 0 };
        _jWrite(path.join(DB_DIR, 'userprofile.json'), db);
    }
    return db[jid];
};

const saveUser = (jid, data) => {
    if (_sqliteOK) {
        try {
            DB.prepare(`INSERT OR REPLACE INTO user_profile(jid,name,exp,koin,level,last_daily,warnings,is_premium,premium_expiry)
                VALUES(?,?,?,?,?,?,?,?,?)`).run(
                jid, data.name || '', data.exp || 0, data.koin || 0, data.level || 1,
                data.last_daily || data.lastDaily || 0, data.warnings || 0,
                data.is_premium || data.isPremium ? 1 : 0, data.premium_expiry || data.premiumExpiry || 0
            );
        } catch {}
    }
    const db = _jRead(path.join(DB_DIR, 'userprofile.json'), {});
    db[jid] = data;
    _jWrite(path.join(DB_DIR, 'userprofile.json'), db);
};

// ============ SEWA ============
const loadSewa = () => {
    if (_sqliteOK) {
        try {
            const rows = DB.prepare('SELECT * FROM sewa').all();
            const out = {};
            for (const r of rows) out[r.group_id] = r;
            return out;
        } catch {}
    }
    return _jRead(path.join(DB_DIR, 'sewa.json'), {});
};

const saveSewa = (data) => {
    if (_sqliteOK) {
        try {
            const tx = DB.transaction(() => {
                DB.prepare('DELETE FROM sewa').run();
                const ins = DB.prepare('INSERT INTO sewa(group_id,paket,expiry,lifetime,added_by) VALUES(?,?,?,?,?)');
                for (const [gid, r] of Object.entries(data)) {
                    ins.run(gid, r.paket || 'basic', r.expiry || null, r.lifetime ? 1 : 0, r.addedBy || r.added_by || '');
                }
            });
            tx();
        } catch {}
    }
    _jWrite(path.join(DB_DIR, 'sewa.json'), data);
};

// ============ CUSTOM COMMANDS ============
const loadCommands = () => {
    if (_sqliteOK) {
        try {
            const rows = DB.prepare('SELECT * FROM commands').all();
            const out = {};
            for (const r of rows) out[r.name] = r;
            return out;
        } catch {}
    }
    return _jRead(path.join(DB_DIR, 'commands.json'), {});
};

const saveCommand = (name, code, author = '') => {
    if (_sqliteOK) {
        try {
            DB.prepare('INSERT OR REPLACE INTO commands(name,code,author,updated_at) VALUES(?,?,?,?)').run(name, code, author, Date.now());
        } catch {}
    }
    const db = _jRead(path.join(DB_DIR, 'commands.json'), {});
    db[name] = { name, code, author, createdAt: db[name]?.createdAt || Date.now(), updatedAt: Date.now() };
    _jWrite(path.join(DB_DIR, 'commands.json'), db);
};

const deleteCommand = (name) => {
    if (_sqliteOK) {
        try { DB.prepare('DELETE FROM commands WHERE name = ?').run(name); } catch {}
    }
    const db = _jRead(path.join(DB_DIR, 'commands.json'), {});
    delete db[name];
    _jWrite(path.join(DB_DIR, 'commands.json'), db);
};

// ============ WARNINGS ============
const gsAddWarn = (gid, jid) => {
    const gs = gsGet(gid);
    if (!gs.warnings) gs.warnings = {};
    gs.warnings[jid] = (gs.warnings[jid] || 0) + 1;
    gsSet(gid, { warnings: gs.warnings });
    return gs.warnings[jid];
};

const gsResetWarn = (gid, jid) => {
    const gs = gsGet(gid);
    if (!gs.warnings) gs.warnings = {};
    gs.warnings[jid] = 0;
    gsSet(gid, { warnings: gs.warnings });
};

// ============ LEADERBOARD ============
const getTopUsers = (limit = 10) => {
    if (_sqliteOK) {
        try {
            return DB.prepare('SELECT jid, name, exp, koin FROM user_profile ORDER BY koin DESC LIMIT ?').all(limit);
        } catch {}
    }
    const db = _jRead(path.join(DB_DIR, 'userprofile.json'), {});
    return Object.entries(db)
        .map(([jid, u]) => ({ jid, name: u.name || jid.split('@')[0], exp: u.exp || 0, koin: u.koin || 0 }))
        .sort((a, b) => b.koin - a.koin)
        .slice(0, limit);
};

module.exports = {
    DB, isSQLite: () => _sqliteOK,
    loadList, saveList,
    gsGet, gsSet, GS_DEFAULT,
    gsAddWarn, gsResetWarn,
    getUser, saveUser,
    getTopUsers,
    loadSewa, saveSewa,
    loadCommands, saveCommand, deleteCommand,
};
