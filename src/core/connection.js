'use strict';
/**
 * Elaina Bot v4.0 — Connection Handler
 * 
 * PAIRING CODE FLOW:
 * 1. Bot generates 8-digit code (automatic from Baileys)
 * 2. Code displayed in terminal/console
 * 3. User enters code in WhatsApp:
 *    WhatsApp → Settings → Linked Devices → Link with Phone Number
 * 4. Device linked!
 */

const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
} = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const qrcode = require('qrcode-terminal');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const config = require('../config/settings');

const SESSION_DIR = config.authDir || './session/auth';
if (!fs.existsSync(SESSION_DIR)) fs.mkdirSync(SESSION_DIR, { recursive: true });

let sock = null;
let connectionState = 'starting';
let reconnectAttempts = 0;
const MAX_RECONNECT = 10;

// Readline for terminal input
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function askQuestion(question) {
    return new Promise(resolve => rl.question(question, resolve));
}

/**
 * Create WhatsApp connection
 * 
 * @param {Object} options
 * @param {boolean} options.usePairingCode - Use pairing code instead of QR
 */
async function createConnection(options = {}) {
    const { usePairingCode = false } = options;

    console.log('\n╔══════════════════════════════════════╗');
    console.log('║   🌙 ELAINA BOT v4.0 — CONNECTING   ║');
    console.log('║   Owner: Panxcz 👑                   ║');
    console.log('║   Rebuilt by: Opanx 🐙              ║');
    console.log('╚══════════════════════════════════════╝\n');

    // Load auth state
    const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);

    // Check if already registered (has previous session)
    const isRegistered = state.creds.registered;
    console.log(`[CONN] Session registered: ${isRegistered}`);

    // Fetch latest Baileys version
    const { version, isLatest } = await fetchLatestBaileysVersion();
    console.log(`[CONN] Baileys version: ${version.join('.')} (latest: ${isLatest})`);

    // Create socket (don't render QR yet)
    sock = makeWASocket({
        version,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
        },
        printQRInTerminal: false,
        logger: pino({ level: 'silent' }),
        browser: ['Elaina Bot v4.0', 'Safari', '3.0'],
        markOnlineOnConnect: true,
    });

    // Connection handler
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        // ─── QR / PAIRING CODE TRIGGER ───
        // QR event fires even in pairing code mode — use as trigger
        if (qr && !state.creds.registered) {
            if (usePairingCode) {
                // ─── PAIRING CODE MODE ───
                // Ask for phone number in terminal
                console.log('\n[PAIRING] 📱 PAIRING CODE MODE');
                console.log('[PAIRING] Bot will generate an 8-digit code.');
                console.log('[PAIRING] Enter that code in WhatsApp.\n');
                
                const phoneNumber = await askQuestion('[PAIRING] Enter your phone number (628xxx): ');
                const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
                
                if (cleanNumber && cleanNumber.length >= 10) {
                    try {
                        // Request pairing code from Baileys
                        const code = await sock.requestPairingCode(cleanNumber);
                        
                        console.log('\n╔══════════════════════════════════════╗');
                        console.log('║   📲 PAIRING CODE                    ║');
                        console.log('╚══════════════════════════════════════╝');
                        console.log(`\n   🔑 Code: ${code}\n`);
                        console.log('   📱 Cara:');
                        console.log('   1. Buka WhatsApp di HP');
                        console.log('   2. Settings → Linked Devices');
                        console.log('   3. Tap "Link with Phone Number"');
                        console.log(`   4. Masukkan code: ${code}`);
                        console.log('   5. Tap "Done" atau "Link"\n');
                        console.log('   ⏳ Menunggu konfirmasi...\n');
                    } catch (e) {
                        console.error('[PAIRING] Error:', e.message);
                        console.log('[PAIRING] Falling back to QR code...');
                    }
                } else {
                    console.log('[PAIRING] ❌ Invalid phone number. Falling back to QR...');
                }
            } else {
                // ─── QR CODE MODE ───
                connectionState = 'qr_needed';
                console.log('\n[CONN] 📱 Scan QR Code:\n');
                qrcode.generate(qr, { small: true });
                console.log('\n[CONN] WhatsApp → Settings → Linked Devices → Link a Device\n');
            }
        }

        // ─── CONNECTION CLOSED ───
        if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

            console.log(`[CONN] Closed: ${statusCode} | Reconnect: ${shouldReconnect}`);

            if (shouldReconnect && reconnectAttempts < MAX_RECONNECT) {
                reconnectAttempts++;
                const delay = Math.min(5000 * reconnectAttempts, 60000);
                console.log(`[CONN] Reconnecting in ${delay / 1000}s...`);
                connectionState = 'reconnecting';
                setTimeout(() => createConnection(options), delay);
            } else if (statusCode === DisconnectReason.loggedOut) {
                console.log('[CONN] ❌ Logged out! Delete session and scan again.');
                connectionState = 'logged_out';
                try { fs.rmSync(SESSION_DIR, { recursive: true }); } catch {}
            } else {
                console.log('[CONN] ❌ Max reconnect attempts reached.');
                connectionState = 'failed';
            }
        }

        // ─── CONNECTION OPEN ───
        if (connection === 'open') {
            connectionState = 'connected';
            reconnectAttempts = 0;
            const botNumber = sock.user?.id?.split(':')[0] || 'unknown';
            
            console.log('\n╔══════════════════════════════════════╗');
            console.log('║   ✅ ELAINA BOT — CONNECTED!         ║');
            console.log(`║   📱 Bot: ${botNumber}`);
            console.log(`║   👑 Owner: ${config.ownerName}`);
            console.log(`║   🕐 ${new Date().toLocaleString('id-ID')}`);
            console.log('╚══════════════════════════════════════╝\n');
        }
    });

    // Save credentials
    sock.ev.on('creds.update', saveCreds);

    rl.close();
    return sock;
}

function getSock() { return sock; }
function getConnectionState() { return connectionState; }

async function sendMessage(jid, content, options = {}) {
    if (!sock) throw new Error('Socket not connected');
    try { return await sock.sendMessage(jid, content, options); }
    catch (e) { console.error('[SEND] Error:', e.message); throw e; }
}

async function reply(jid, text, quoted) {
    return sendMessage(jid, { text }, { quoted });
}

async function sendMention(jid, text, mentions = []) {
    return sendMessage(jid, { text, mentions });
}

module.exports = { createConnection, getSock, getConnectionState, sendMessage, reply, sendMention };
