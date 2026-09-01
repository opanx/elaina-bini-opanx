'use strict';
/**
 * Elaina Bot v4.0 — Configuration
 * Rebuilt by Opanx | Base by FallZx Infinity
 */

require('dotenv').config();

const config = {
    // Bot Info
    botName: process.env.BOT_NAME || 'Elaina The Primary',
    ownerNumber: process.env.OWNER_NUMBER || '',
    botNumber: process.env.BOT_NUMBER || '',
    ownerName: process.env.OWNER_NAME || 'Owner',
    prefix: process.env.PREFIX || '.',

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

// Messages
config.mess = {
    owner: '🚫 *Akses Ditolak!*\n_Hanya untuk owner bot._',
    prem: '👑 *Premium Required!*\n_Fitur ini untuk user premium._',
    group: '👥 *Group Only!*\n_Command ini hanya bisa digunakan di grup._',
    admin: '🛡️ *Admin Required!*\n_Hanya admin yang bisa menggunakan command ini._',
    botadmin: '🤖 *Bot Admin Required!*\n_Bot harus jadi admin terlebih dahulu._',
    private: '💬 *Private Chat Only!*\n_Command ini hanya bisa digunakan di chat pribadi._',
    done: '✅ *Done!*',
    error: '❌ *Error!*\n_Terjadi kesalahan, coba lagi nanti._',
};

module.exports = config;
