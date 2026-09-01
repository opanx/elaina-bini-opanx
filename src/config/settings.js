'use strict';
/**
 * Elaina Bot v4.1.0 — Configuration
 * Rebuilt by Opanx | Base by FallZx Infinity
 * Owner: Panxcz
 * 
 * Sets both global variables (for Elaina.js compat) AND exports config object
 */

require('dotenv').config();

// ═══════════════════════════════════════════════
// SET GLOBALS (for Elaina.js compatibility)
// ═══════════════════════════════════════════════

global.owner = process.env.OWNER_NUMBER || '6285706665203';
global.nobot = process.env.BOT_NUMBER || '';
global.nomorowner = process.env.OWNER_NUMBER || '6285706665203';
global.namaowner = process.env.OWNER_NAME || 'Panxcz';
global.namaBot = process.env.BOT_NAME || 'Elaina The Primary';
global.nama = global.namaBot;
global.namach = global.namaBot;
global.namafile = `© ${global.namaBot}`;
global.author = global.namaowner;
global.versi = 'Elaina The Primary v4.1.0';
global.creator = `${global.owner}@s.whatsapp.net`;
global.foother = `© ${global.namaBot}`;
global.packname = global.namaBot;
global.prefix = process.env.PREFIX || '.';
global.mute = false;
global.onlygc = false;
global.allowedGroupIds = global.allowedGroupIds || [''];
global.welcome = true;
global.leave = true;
global.antitags = false;
global.welcomeMessage = 'Welcome! 🎉';
global.leaveMessage = 'Goodbye! 👋';
global.autoreadsw = false;
global.autoreactsw = false;
global.autoreactemoji = '😂';

// Thumbnails & images
global.thumnail2 = 'https://files.catbox.moe/i58vrz.jpg';
global.replyimg = 'https://files.catbox.moe/2hhala.jpg';
global.ppowner = 'https://files.catbox.moe/h5zya9.png';
global.menuBg = 'https://u.pone.rs/ezchqsab.jpg';
global.welcomeBg = 'https://files.catbox.moe/qbihzq.jpg';
global.idch = '120363186130999681@newsletter';
global.linkSaluran = 'https://whatsapp.com/channel/0029Vb7MGFI7j6g0cOofOn1a';

// Flaming text URLs
global.flaming = 'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=sketch-name&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&text=';
global.fluming = 'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=fluffy-logo&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&text=';
global.flarun = 'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=runner-logo&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&text=';
global.flasmurf = 'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=smurfs-logo&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&text=';

// Messages
global.mess = {
    owner: 'You are not owner',
    prem: 'You are not premium',
    group: 'Only group command',
    admin: 'You are not Admin',
    botadmin: 'Bot Harus Jadi Admin',
    private: 'Only Private Chat',
    done: 'Done',
};

// Payment
global.midtransServerKey = process.env.MIDTRANS_SERVER_KEY || '';
global.midtransClientKey = process.env.MIDTRANS_CLIENT_KEY || '';
global.midtransProduction = process.env.MIDTRANS_PRODUCTION === 'true';
global.paymentMode = 'both';

// AI Keys
global.keyopenai = process.env.OPENAI_API_KEY || '';
global.geminiKey = process.env.GEMINI_API_KEY || '';
global.groqKey = process.env.GROQ_API_KEY || '';
global.deepseekKey = process.env.DEEPSEEK_API_KEY || '';

// ═══════════════════════════════════════════════
// CONFIG OBJECT (for modular code)
// ═══════════════════════════════════════════════

const config = {
    // Bot Info
    botName: global.namaBot,
    ownerNumber: global.owner,
    botNumber: global.nobot,
    ownerName: global.namaowner,
    prefix: global.prefix,

    // Pairing Code Settings
    pairingCode: process.env.PAIRING_CODE || 'PANXCELM',
    autoPairing: process.env.AUTO_PAIRING !== 'false',

    // Credits
    credits: {
        developer: 'FallZx Infinity',
        baseOri: 'KyyInfinite',
        rebuiltBy: 'Opanx',
        owner: 'Panxcz',
        version: '4.1.0',
    },

    // AI API Keys
    openaiKey: global.keyopenai,
    geminiKey: global.geminiKey,
    groqKey: global.groqKey,
    deepseekKey: global.deepseekKey,

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
    midtransServerKey: global.midtransServerKey,
    midtransClientKey: global.midtransClientKey,
    midtransProduction: global.midtransProduction,

    // Session
    sessionDir: './session',
    authDir: './session/auth',
};

// Computed values
config.ownerJid = config.ownerNumber ? config.ownerNumber + '@s.whatsapp.net' : '';
config.botJid = config.botNumber ? config.botNumber + '@s.whatsapp.net' : '';
config.creator = global.creator;
config.foother = global.foother;
config.namaBot = global.namaBot;
config.namaowner = global.namaowner;
config.versi = global.versi;

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
    chat: '💬', voice: '🎤', wrench: '🔧', gear: '⚙️',
};

// Messages
config.mess = global.mess;

module.exports = config;
