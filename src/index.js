'use strict';
/**
 * ╔═══════════════════════════════════════════╗
 * ║   🌙 ELAINA BOT v4.0 — THE PRIMARY       ║
 * ║   ═══════════════════════════════════════  ║
 * ║   Developer   : FallZx Infinity           ║
 * ║   Base ORI    : KyyInfinite               ║
 * ║   Rebuilt by  : Opanx 🐙                 ║
 * ║   Owner       : Panxcz 👑                ║
 * ║   Version     : 4.0.0                     ║
 * ║   License     : MIT (4-Layer Protected)   ║
 * ╚═══════════════════════════════════════════╝
 *
 * ⚠️ Credits must remain intact.
 * 🔐 This code is protected by 4-layer encryption.
 */

require('dotenv').config();

const config = require('./config/settings');
const { validateLicense, checkIntegrity, CREDITS } = require('./lib/license');
const { createConnection } = require('./core/connection');
const { initEvents } = require('./core/eventHandler');
const { loadCommands, executeCommand } = require('./core/commandLoader');

// ============ LICENSE CHECK ============
console.log('\n🔐 Checking license...');
const licenseStatus = validateLicense();
const integrityStatus = checkIntegrity();

if (!licenseStatus.valid) {
    console.error('❌ License invalid! This copy may be tampered with.');
    process.exit(1);
}

if (!integrityStatus.valid) {
    console.error('⚠️  Integrity check failed:');
    integrityStatus.issues.forEach(issue => console.error('   -', issue));
    console.error('❌ Credits may have been removed.');
    process.exit(1);
}

console.log('✅ License valid | ✅ Integrity passed');

// ============ BANNER ============
console.log(`
╔═══════════════════════════════════════════╗
║                                           ║
║   🌙  𝑬𝒍𝒂𝒊𝒏𝒂 — 𝑻𝒉𝒆 𝑷𝒓𝒊𝒎𝒂𝒓𝒚  🌙       ║
║   ═══════════════════════════════         ║
║                                           ║
║   🌸 "Your AI-Powered Butler" 🌸         ║
║                                           ║
║   👑 Owner: Panxcz                        ║
║   🐙 Rebuilt by: Opanx                    ║
║   📦 Version: 4.0.0                       ║
║                                           ║
╚═══════════════════════════════════════════╝
`);

// ============ PARSE ARGS ============
const args = process.argv.slice(2);
const usePairingCode = args.includes('--pairing') || args.includes('-p');
const useQR = args.includes('--qr') || args.includes('-q');

// Default: QR code mode
// Use --pairing or -p for pairing code mode

// ============ MAIN ============
async function main() {
    try {
        // 1. Load commands
        console.log('[BOT] Loading commands...');
        loadCommands();

        // 2. Create connection
        console.log('[BOT] Creating WhatsApp connection...');
        console.log(`[BOT] Mode: ${usePairingCode ? 'PAIRING CODE 📲' : 'QR CODE 📱'}`);
        
        const sock = await createConnection({ usePairingCode });

        // 3. Initialize event handler
        console.log('[BOT] Initializing event handler...');
        initEvents(sock, executeCommand);

        console.log('[BOT] ✅ Bot is ready!');
        console.log(`[BOT] 🔧 Prefix: ${config.prefix}`);
        console.log(`[BOT] 👑 Owner: ${config.ownerName} (${config.ownerNumber})`);

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
