'use strict';
/**
 * Elaina Bot v4.0 — Connection Handler
 * Supports QR Code + Custom Pairing Code
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

/**
 * Ask user input via terminal
 */
function askQuestion(question) {
    return new Promise(resolve => rl.question(question, resolve));
}

/**
 * Create WhatsApp connection
 */
async function createConnection(options = {}) {
    let { pairingCode = false, phoneNumber = '' } = options;

    console.log('\n╔══════════════════════════════════════╗');
    console.log('║   🌙 ELAINA BOT v4.0 — CONNECTING   ║');
    console.log('║   Owner: Panxcz 👑                   ║');
    console.log('║   Rebuilt by: Opanx 🐙              ║');
    console.log('╚══════════════════════════════════════╝\n');

    // Check if pairing code is needed
    if (!phoneNumber && config.autoPairing) {
        // Ask for phone number via terminal
        const customCode = config.pairingCode || 'PANXC-ELMY';
        console.log(`[PAIRING] Custom pairing code: ${customCode}`);
        console.log('[PAIRING] This code will be used when linking devices.\n');
        
        phoneNumber = await askQuestion('[PAIRING] Enter phone number (628xxx): ');
        phoneNumber = phoneNumber.replace(/[^0-9]/g, '');
        
        if (phoneNumber && phoneNumber.length >= 10) {
            pairingCode = true;
        }
    }

    // Load auth state
    const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);

    // Fetch latest Baileys version
    const { version, isLatest } = await fetchLatestBaileysVersion();
    console.log(`[CONN] Baileys version: ${version.join('.')} (latest: ${isLatest})`);

    // Create socket
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

        if (qr) {
            connectionState = 'qr_needed';
            console.log('\n[CONN] 📱 Scan QR Code:\n');
            qrcode.generate(qr, { small: true });
            console.log('\n[CONN] WhatsApp → Settings → Linked Devices → Link a Device\n');
        }

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

    // Pairing code
    if (pairingCode && phoneNumber) {
        console.log(`[PAIRING] 🔗 Requesting pairing code for: ${phoneNumber}`);
        try {
            const code = await sock.requestPairingCode(phoneNumber);
            console.log(`\n[PAIRING] 📲 Your Pairing Code: ${code}`);
            console.log('[PAIRING] WhatsApp → Settings → Linked Devices → Link with Phone Number');
            console.log(`[PAIRING] Enter code: ${code}\n`);
        } catch (e) {
            console.error('[PAIRING] Error:', e.message);
            console.log('[PAIRING] Falling back to QR code...');
        }
    }

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
