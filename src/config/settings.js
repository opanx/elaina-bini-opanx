'use strict';
/**
 * Elaina Bot v4.0 — Configuration
 * Rebuilt by Opanx | Base by FallZx Infinity
 * Owner: Panxcz
 */

require('dotenv').config();

const config = {
    // Bot Info
    botName: process.env.BOT_NAME || 'Elaina The Primary',
    ownerNumber: process.env.OWNER_NUMBER || '6285706665203',
    botNumber: process.env.BOT_NUMBER || '',
    ownerName: process.env.OWNER_NAME || 'Panxcz',
    prefix: process.env.PREFIX || '.',

    // Pairing Code Settings
    pairingCode: process.env.PAIRING_CODE || 'PANXC-ELMY', // Custom pairing code
    autoPairing: process.env.AUTO_PAIRING !== 'false', // Auto pairing on start

    // Credits
    credits: {
        developer: 'FallZx Infinity',
        baseOri: 'KyyInfinite',
        rebuiltBy: 'Opanx',
        version: '4.0.0',
    },

    // AI API Keys
    openaiKey: process.env.OPENAI_API_KEY || '',
    geminiKey: process.env.GEMINI_API_KEY || '',
    groqKey: process.env.GROQ_API_KEY || '',
    deepseekKey: process.env.DEEPSEEK_API_KEY || '',

    // Database
    dbEngine: process.env.DB_ENGINE || 'sqlite',
    dbPath: process.env.DB_PATH || './database/elaina.db',

    // Rate Limiting
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 20,
    rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW) || 60000,

    // Server
    port: parseInt(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',

    // Optional
    sightengineUser: process.env.SIGHTENGINE_USER || '',
    sightengineSecret: process.env.SIGHTENGINE_SECRET || '',
    midtransServerKey: process.env.MIDTRANS_SERVER_KEY || '',
    midtransClientKey: process.env.MIDTRANS_CLIENT_KEY || '',
    midtransProduction: process.env.MIDTRANS_PRODUCTION === 'true',

    // Session
    sessionDir: './session',
    authDir: './session/auth',
};

// Computed values
config.ownerJid = config.ownerNumber ? config.ownerNumber + '@s.whatsapp.net' : '';
config.botJid = config.botNumber ? config.botNumber + '@s.whatsapp.net' : '';
config.creator = config.ownerJid;
config.foother = `© ${config.botName}`;
config.namaBot = config.botName;
config.namaowner = config.ownerName;
config.versi = 'Elaina The Primary v4.0';

// ═══════════════════════════════════════════════
// WIBU STYLE EMOJIS ✨
// ═══════════════════════════════════════════════

config.emoji = {
    star: '⭐', sparkles: '✨', moon: '🌙', heart: '💖', fire: '🔥',
    lightning: '⚡', gem: '💎', crown: '👑', wand: '🪄', crystal: '🔮',
    anime: '🌸', sakura: '🎐', torii: '⛩️', katana: '⚔️', shuriken: '🌀',
    oni: '👹', kitsune: '🦊', dragon: '🐉', phoenix: '🔥',
    sword: '🗡️', shield: '🛡️', potion: '🧪', scroll: '📜', chest: '📦',
    trophy: '🏆', medal: '🥇', rank: '📊', level: '📈', exp: '⭐',
    online: '🟢', offline: '🔴', warning: '⚠️', error: '❌', success: '✅',
    loading: '⏳', searching: '🔍', download: '📥', upload: '📤',
    dice: '🎲', slot: '🎰', coin: '🪙', card: '🃏', game: '🎮',
    music: '🎵', video: '🎬', photo: '📸', sticker: '🪄', gift: '🎁',
    user: '👤', group: '👥', admin: '🛡️', owner: '👑', bot: '🤖',
    chat: '💬', voice: '🎤',
};

// Messages
config.mess = {
    owner: `${config.emoji.katana} *Akses Ditolak!*\n_Hanya untuk ${config.emoji.crown} Owner Bot._`,
    prem: `${config.emoji.crystal} *Premium Required!*\n_Fitur ini untuk ${config.emoji.star} User Premium._`,
    group: `${config.emoji.group} *Group Only!*\n_Command ini hanya bisa digunakan di ${config.emoji.group} Grup._`,
    admin: `${config.emoji.shield} *Admin Required!*\n_Hanya ${config.emoji.admin} Admin._`,
    botadmin: `${config.emoji.bot} *Bot Admin Required!*\n_Bot harus jadi admin._`,
    private: `${config.emoji.chat} *Private Chat Only!*\n_Command ini hanya bisa digunakan di chat pribadi._`,
    done: `${config.emoji.success} *Selesai!* ${config.emoji.sparkles}`,
    error: `${config.emoji.error} *Error!* ${config.emoji.warning}`,
};

module.exports = config;
