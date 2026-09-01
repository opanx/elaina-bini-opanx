'use strict';
/**
 * Elaina Bot v4.1.0 — Anti-Spam System
 * Detects spam, flood, and duplicate messages
 */

const config = require('../config/settings');

class AntiSpam {
    constructor() {
        this.userMessages = new Map(); // jid -> [{ text, timestamp }]
        this.userWarnings = new Map(); // jid -> count
        this.muted = new Set();
        this.floodThreshold = 5; // messages in window
        this.floodWindow = 5000; // 5 seconds
        this.duplicateWindow = 10000; // 10 seconds
        this.maxWarnings = 3;
    }

    /**
     * Check if message is spam
     * @returns {{ isSpam: boolean, reason: string, action: string }}
     */
    check(jid, text) {
        if (this.muted.has(jid)) {
            return { isSpam: true, reason: 'Muted', action: 'ignore' };
        }

        const now = Date.now();
        if (!this.userMessages.has(jid)) {
            this.userMessages.set(jid, []);
        }
        const msgs = this.userMessages.get(jid);

        // Add current message
        msgs.push({ text: text.toLowerCase().trim(), timestamp: now });

        // Cleanup old messages
        const cutoff = now - this.floodWindow;
        while (msgs.length > 0 && msgs[0].timestamp < cutoff) {
            msgs.shift();
        }

        // Check flood (too many messages in short time)
        if (msgs.length >= this.floodThreshold) {
            this._addWarning(jid);
            return {
                isSpam: true,
                reason: `Flood detected (${msgs.length} messages in ${this.floodWindow / 1000}s)`,
                action: 'warn',
            };
        }

        // Check duplicate (same message sent repeatedly)
        const recentMsgs = msgs.filter(m => now - m.timestamp < this.duplicateWindow);
        if (recentMsgs.length >= 3) {
            const uniqueTexts = new Set(recentMsgs.map(m => m.text));
            if (uniqueTexts.size === 1) {
                this._addWarning(jid);
                return {
                    isSpam: true,
                    reason: 'Duplicate messages',
                    action: 'warn',
                };
            }
        }

        return { isSpam: false, reason: '', action: 'none' };
    }

    _addWarning(jid) {
        const count = (this.userWarnings.get(jid) || 0) + 1;
        this.userWarnings.set(jid, count);

        if (count >= this.maxWarnings) {
            this.muted.add(jid);
            console.log(`[ANTISPAM] 🚫 Muted ${jid} (${count} warnings)`);
        }
    }

    unmute(jid) {
        this.muted.delete(jid);
        this.userWarnings.delete(jid);
    }

    getWarningCount(jid) {
        return this.userWarnings.get(jid) || 0;
    }

    isMuted(jid) {
        return this.muted.has(jid);
    }

    getStats() {
        return {
            tracked: this.userMessages.size,
            muted: this.muted.size,
            warnings: this.userWarnings.size,
        };
    }
}

module.exports = new AntiSpam();
