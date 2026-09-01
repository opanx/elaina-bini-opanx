'use strict';
/**
 * Elaina Bot v4.0 — Configuration
 * Rebuilt by Opanx | Base by FallZx Infinity
 * Wibu Style Edition ✨
 */

require('dotenv').config();

const config = {
    // Bot Info
    botName: process.env.BOT_NAME || 'Elaina The Primary',
    ownerNumber: process.env.OWNER_NUMBER || '6285706665203',
    botNumber: process.env.BOT_NUMBER || '',
    ownerName: process.env.OWNER_NAME || 'Riko',
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

// ═══════════════════════════════════════════════
// WIBU STYLE EMOJIS ✨
// ═══════════════════════════════════════════════

config.emoji = {
    // Main
    star: '⭐', sparkles: '✨', moon: '🌙', heart: '💖', fire: '🔥',
    lightning: '⚡', gem: '💎', crown: '👑', wand: '🪄', crystal: '🔮',
    
    // Anime/Wibu
    anime: '🌸', sakura: '🎐', torii: '⛩️', katana: '⚔️', shuriken: '🌀',
    oni: '👹', kitsune: '🦊', tanuki: '🦝', dragon: '🐉', phoenix: '🔥',
    
    // Gaming
    sword: '🗡️', shield: '🛡️', potion: '🧪', scroll: '📜', chest: '📦',
    trophy: '🏆', medal: '🥇', rank: '📊', level: '📈', exp: '⭐',
    
    // Status
    online: '🟢', offline: '🔴', warning: '⚠️', error: '❌', success: '✅',
    loading: '⏳', searching: '🔍', download: '📥', upload: '📤',
    
    // Fun
    dice: '🎲', slot: '🎰', coin: '🪙', card: '🃏', game: '🎮',
    music: '🎵', video: '🎬', photo: '📸', sticker: '🪄', gift: '🎁',
    
    // Social
    user: '👤', group: '👥', admin: '🛡️', owner: '👑', bot: '🤖',
    chat: '💬', voice: '🎤', emoji: '😀', reaction: '❤️',
    
    // Nature
    sun: '☀️', cloud: '☁️', rain: '🌧️', snow: '❄️', wind: '💨',
    flower: '🌺', leaf: '🍃', tree: '🌳', mountain: '🏔️', ocean: '🌊',
    
    // Food
    food: '🍱', tea: '🍵', sake: '🍶', ramen: '🍜', sushi: '🍣',
    cake: '🎂', apple: '🍎', grape: '🍇', melon: '🍈',
    
    // Tools
    wrench: '🔧', hammer: '🔨', key: '🔑', lock: '🔒', unlock: '🔓',
    gear: '⚙️', magnet: '🧲', link: '🔗', QR: '📱', wifi: '📶',
};

// Wibu-style messages
config.mess = {
    owner: `${config.emoji.katana} *Akses Ditolak!*\n\n_Hanya untuk ${config.emoji.crown} Owner Bot._`,
    prem: `${config.emoji.crystal} *Premium Required!*\n\n_Fitur ini untuk ${config.emoji.star} User Premium._`,
    group: `${config.emoji.group} *Group Only!*\n\n_Command ini hanya bisa digunakan di ${config.emoji.group} Grup._`,
    admin: `${config.emoji.shield} *Admin Required!*\n\n_Hanya ${config.emoji.admin} Admin yang bisa menggunakan command ini._`,
    botadmin: `${config.emoji.bot} *Bot Admin Required!*\n\n_Bot harus jadi ${config.emoji.admin} admin terlebih dahulu._`,
    private: `${config.emoji.chat} *Private Chat Only!*\n\n_Command ini hanya bisa digunakan di ${config.emoji.heart} Chat Pribadi._`,
    done: `${config.emoji.success} *Selesai!* ${config.emoji.sparkles}`,
    error: `${config.emoji.error} *Error!*\n\n_Terjadi kesalahan, coba lagi nanti._ ${config.emoji.warning}`,
};

// ═══════════════════════════════════════════════
// WIBU STYLE BANNER
// ═══════════════════════════════════════════════

config.banner = `
╔═══════════════════════════════════════════╗
║                                           ║
║   🌙  𝑬𝒍𝒂𝒊𝒏𝒂 — 𝑻𝒉𝒆 𝑷𝒓𝒊𝒎𝒂𝒓𝒚  🌙       ║
║   ═══════════════════════════════         ║
║                                           ║
║   ${config.emoji.sakura} "Your AI-Powered WhatsApp Butler" ${config.emoji.sakura}
║                                           ║
║   Developer   : FallZx Infinity           ║
║   Base ORI    : KyyInfinite               ║
║   Rebuilt by  : Opanx 🐙                 ║
║   Version     : 4.0.0                     ║
║                                           ║
╚═══════════════════════════════════════════╝
`;

module.exports = config;
