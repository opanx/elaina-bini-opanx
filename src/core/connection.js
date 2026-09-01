'use strict';
/**
 * Elaina Bot v4.0 — Connection Handler
 * Supports QR Code + Pairing Code
 * Rebuilt by Opanx
 */

const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    isJidUser,
    isLidUser,
} = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const config = require('../config/settings');

const SESSION_DIR = config.authDir || './session/auth';

// Ensure session directory exists
if (!fs.existsSync(SESSION_DIR)) fs.mkdirSync(SESSION_DIR, { recursive: true });

let sock = null;
let connectionState = 'starting';
let reconnectAttempts = 0;
const MAX_RECONNECT = 10;

/**
 * Create WhatsApp connection
 * @param {Object} options - { pairingCode: string|false, phoneNumber: string }
 * @returns {Promise<Object>} - WhatsApp socket
 */
async function createConnection(options = {}) {
    const { pairingCode = false, phoneNumber = '' } = options;

    console.log('\n╔══════════════════════════════════════╗');
    console.log('║   🌙 ELAINA BOT v4.0 — CONNECTING   ║');
    console.log('║   Rebuilt by Opanx                   ║');
    console.log('╚══════════════════════════════════════╝\n');

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
        printQRInTerminal: false, // We handle QR manually
        logger: pino({ level: 'silent' }),
        browser: ['Elaina Bot v4.0', 'Safari', '3.0'],
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: false,
        syncFullHistory: false,
    });

    // ============ CONNECTION HANDLER ============
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr, loginCredentials } = update;

        if (qr) {
            connectionState = 'qr_needed';
            console.log('\n[CONN] 📱 Scan QR Code ini dari WhatsApp:\n');
            qrcode.generate(qr, { small: true });
            console.log('\n[CONN] Buka WhatsApp → Settings → Linked Devices → Link a Device\n');
        }

        if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

            console.log(`[CONN] Connection closed. Status: ${statusCode} | Reconnect: ${shouldReconnect}`);

            if (shouldReconnect && reconnectAttempts < MAX_RECONNECT) {
                reconnectAttempts++;
                const delay = Math.min(5000 * reconnectAttempts, 60000);
                console.log(`[CONN] Reconnecting in ${delay / 1000}s (attempt ${reconnectAttempts}/${MAX_RECONNECT})...`);
                connectionState = 'reconnecting';
                setTimeout(() => createConnection(options), delay);
            } else if (statusCode === DisconnectReason.loggedOut) {
                console.log('[CONN] ❌ Logged out! Hapus session dan scan ulang.');
                connectionState = 'logged_out';
                // Clean session
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
            console.log(`║   📱 Bot Number: ${botNumber}`);
            console.log(`║   🤖 Bot Name: ${config.botName}`);
            console.log(`║   👑 Owner: ${config.ownerName}`);
            console.log(`║   ⏰ ${new Date().toLocaleString('id-ID')}`);
            console.log('╚══════════════════════════════════════╝\n');
        }
    });

    // ============ PAIRING CODE ============
    if (pairingCode && phoneNumber) {
        console.log(`[CONN] 🔗 Requesting pairing code for: ${phoneNumber}`);
        try {
            const code = await sock.requestPairingCode(phoneNumber);
            console.log(`\n[CONN] 📲 Pairing Code: ${code}`);
            console.log('[CONN] Buka WhatsApp → Settings → Linked Devices → Link with Phone Number');
            console.log(`[CONN] Masukkan code: ${code}\n`);
        } catch (e) {
            console.error('[CONN] Pairing code error:', e.message);
            console.log('[CONN] Falling back to QR code...');
        }
    }

    // ============ SAVE CREDENTIALS ============
    sock.ev.on('creds.update', saveCreds);

    return sock;
}

/**
 * Get current socket
 */
function getSock() {
    return sock;
}

/**
 * Get connection state
 */
function getConnectionState() {
    return connectionState;
}

/**
 * Send message with retry
 */
async function sendMessage(jid, content, options = {}) {
    if (!sock) throw new Error('Socket not connected');
    try {
        return await sock.sendMessage(jid, content, options);
    } catch (e) {
        console.error('[SEND] Error:', e.message);
        throw e;
    }
}

/**
 * Reply to message
 */
async function reply(jid, text, quoted) {
    return sendMessage(jid, { text }, { quoted });
}

/**
 * Send with mention
 */
async function sendMention(jid, text, mentions = []) {
    return sendMessage(jid, { text, mentions });
}

module.exports = {
    createConnection,
    getSock,
    getConnectionState,
    sendMessage,
    reply,
    sendMention,
};
