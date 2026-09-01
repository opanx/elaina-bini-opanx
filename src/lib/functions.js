'use strict';
/**
 * Elaina Bot v4.0 — Utility Functions
 */

const crypto = require('crypto');
const fs = require('fs');

/**
 * Sleep/delay
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Random from array
 */
function random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Random number between min and max
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Format number with commas
 */
function formatNumber(n) {
    return n.toLocaleString('id-ID');
}

/**
 * Parse duration string (e.g., "1d", "2h", "30m")
 */
function parseDuration(str) {
    const match = str.match(/^(\d+)(d|h|m|s)$/);
    if (!match) return null;
    const [, num, unit] = match;
    const ms = { d: 86400000, h: 3600000, m: 60000, s: 1000 };
    return parseInt(num) * ms[unit];
}

/**
 * Format duration from ms
 */
function formatDuration(ms) {
    const s = Math.floor(ms / 1000);
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    const parts = [];
    if (d) parts.push(`${d}d`);
    if (h) parts.push(`${h}h`);
    if (m) parts.push(`${m}m`);
    if (sec) parts.push(`${sec}s`);
    return parts.join(' ') || '0s';
}

/**
 * Generate UUID
 */
function uuid() {
    return crypto.randomUUID();
}

/**
 * Hash string (MD5)
 */
function md5(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}

/**
 * Hash string (SHA256)
 */
function sha256(str) {
    return crypto.createHash('sha256').update(str).digest('hex');
}

/**
 * Truncate text
 */
function truncate(text, maxLen = 100) {
    if (text.length <= maxLen) return text;
    return text.slice(0, maxLen - 3) + '...';
}

/**
 * Extract text from WhatsApp message
 */
function extractText(msg) {
    const m = msg.message;
    if (!m) return '';
    return (
        m.conversation ||
        m.extendedTextMessage?.text ||
        m.imageMessage?.caption ||
        m.videoMessage?.caption ||
        m.documentMessage?.caption ||
        ''
    ).trim();
}

/**
 * Extract mentioned users
 */
function extractMentions(msg) {
    return msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
}

/**
 * Extract quoted message
 */
function extractQuoted(msg) {
    return msg.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;
}

/**
 * Get message type
 */
function getMessageType(msg) {
    const m = msg.message;
    if (!m) return null;
    if (m.conversation || m.extendedTextMessage) return 'text';
    if (m.imageMessage) return 'image';
    if (m.videoMessage) return 'video';
    if (m.audioMessage) return 'audio';
    if (m.stickerMessage) return 'sticker';
    if (m.documentMessage) return 'document';
    return null;
}

/**
 * Check if URL is valid
 */
function isUrl(text) {
    try {
        new URL(text);
        return true;
    } catch {
        return false;
    }
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
    return (bytes / 1073741824).toFixed(2) + ' GB';
}

/**
 * Create progress bar
 */
function progressBar(percent, length = 10) {
    const filled = Math.round(length * (percent / 100));
    const empty = length - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
}

module.exports = {
    sleep, random, randomInt,
    formatNumber, formatDuration, formatBytes,
    parseDuration, uuid, md5, sha256,
    truncate, extractText, extractMentions, extractQuoted,
    getMessageType, isUrl, progressBar,
};
