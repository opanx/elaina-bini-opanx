'use strict';
/**
 * ╔═══════════════════════════════════════════╗
 * ║   🌙 ELAINA BOT v4.0 — THE PRIMARY       ║
 * ║   ═══════════════════════════════════════  ║
 * ║   Developer   : FallZx Infinity           ║
 * ║   Base ORI    : KyyInfinite               ║
 * ║   Rebuilt by  : Opanx 🐙                 ║
 * ║   Version     : 4.0.0                     ║
 * ║   License     : MIT (4-Layer Protected)   ║
 * ╚═══════════════════════════════════════════╝
 *
 * ⚠️ Credits must remain intact.
 * ⚠️ Do not remove developer attribution.
 * 🔐 This code is protected by 4-layer encryption.
 */

// Load environment
require('dotenv').config();

const config = require('./config/settings');
const { validateLicense, checkIntegrity, getLicenseInfo, CREDITS } = require('./lib/license');
const { createConnection } = require('./core/connection');
const { initEvents } = require('./core/eventHandler');
const { loadCommands, executeCommand } = require('./core/commandLoader');

// ============ LICENSE CHECK ============
console.log('\n🔐 Checking license...');
const licenseStatus = validateLicense();
const integrityStatus = checkIntegrity();

if (!licenseStatus.valid) {
    console.error('❌ License invalid!');
    console.error('❌ This copy may be tampered with.');
    console.error('❌ Please download from official source.');
    process.exit(1);
}

if (!integrityStatus.valid) {
    console.error('⚠️  Integrity check failed:');
    integrityStatus.issues.forEach(issue => console.error('   -', issue));
    console.error('❌ Credits may have been removed.');
    console.error('❌ Please restore credits to continue.');
    process.exit(1);
}

console.log('✅ License valid');
console.log('✅ Integrity check passed');

// ============ BANNER ============
console.log(`
╔═══════════════════════════════════════════╗
║                                           ║
║   🌙  𝑬𝒍𝒂𝒊𝒏𝒂 — 𝑻𝒉𝒆 𝑷𝒓𝒊𝒎𝒂𝒓𝒚  🌙       ║
║   ═══════════════════════════════         ║
║                                           ║
║   🌸 "Your AI-Powered Butler" 🌸         ║
║                                           ║
║   Developer   : FallZx Infinity           ║
║   Base ORI    : KyyInfinite               ║
║   Rebuilt by  : Opanx 🐙                 ║
║   Version     : 4.0.0                     ║
║   License     : MIT                       ║
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
        console.log(`[BOT] 🔐 License: ${CREDITS.license} (4-Layer Protected)`);
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
