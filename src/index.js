'use strict';
/**
 * ╔═══════════════════════════════════════════╗
 * ║   🌙 ELAINA BOT v4.0 — THE PRIMARY       ║
 * ║   ═══════════════════════════════════════  ║
 * ║   Developer   : FallZx Infinity           ║
 * ║   Base ORI    : KyyInfinite               ║
 * ║   Rebuilt by  : Opanx 🐙                 ║
 * ║   Version     : 4.0.0                     ║
 * ╚═══════════════════════════════════════════╝
 *
 * Credits must remain intact.
 * Do not remove developer attribution.
 */

// Load environment
require('dotenv').config();

const config = require('./config/settings');
const { createConnection } = require('./core/connection');
const { initEvents } = require('./core/eventHandler');
const { loadCommands, executeCommand } = require('./core/commandLoader');
const db = require('./database/engine');

// ============ BANNER ============
console.log(`
╔═══════════════════════════════════════════╗
║                                           ║
║   🌙  ELAINA — THE PRIMARY  🌙           ║
║   ═══════════════════════════════         ║
║                                           ║
║   Developer   : FallZx Infinity           ║
║   Base ORI    : KyyInfinite               ║
║   Rebuilt by  : Opanx 🐙                 ║
║   Version     : 4.0.0                     ║
║                                           ║
║   "Your AI-Powered WhatsApp Butler"       ║
║                                           ║
╚═══════════════════════════════════════════╝
`);

// ============ PARSE ARGS ============
const args = process.argv.slice(2);
let pairingCode = false;
let phoneNumber = '';

if (args.includes('--pairing') || args.includes('-p')) {
    pairingCode = true;
    const phoneIdx = args.indexOf('--phone') !== -1 ? args.indexOf('--phone') : args.indexOf('-n');
    if (phoneIdx !== -1 && args[phoneIdx + 1]) {
        phoneNumber = args[phoneIdx + 1].replace(/[^0-9]/g, '');
    }
}

// ============ MAIN ============
async function main() {
    try {
        // 1. Load commands
        console.log('[BOT] Loading commands...');
        loadCommands();

        // 2. Create connection
        console.log('[BOT] Creating WhatsApp connection...');
        const sock = await createConnection({ pairingCode, phoneNumber });

        // 3. Initialize event handler
        console.log('[BOT] Initializing event handler...');
        initEvents(sock, executeCommand);

        console.log('[BOT] ✅ Bot is ready!');
        console.log(`[BOT] 📱 Pairing code mode: ${pairingCode ? 'YES' : 'NO (QR code)'}`);
        console.log(`[BOT] 🔧 Prefix: ${config.prefix}`);
        console.log(`[BOT] 👑 Owner: ${config.ownerName}`);
        console.log('');

    } catch (e) {
        console.error('[BOT] ❌ Fatal error:', e);
        process.exit(1);
    }
}

// ============ ERROR HANDLERS ============
process.on('uncaughtException', (err) => {
    console.error('[FATAL] Uncaught Exception:', err.message);
});

process.on('unhandledRejection', (reason) => {
    console.error('[FATAL] Unhandled Rejection:', reason);
});

process.on('SIGINT', () => {
    console.log('\n[BOT] Shutting down...');
    process.exit(0);
});

// ============ START ============
main();
