'use strict';
/**
 * Elaina Bot v4.0 — Anti-Ban System
 * Human-like behavior patterns to prevent WhatsApp bans
 * 
 * Features:
 * - Gaussian jitter rate limiting
 * - 7-day warm-up for new numbers
 * - Typing simulation
 * - Presence cycling
 * - Message content variation
 * - Health monitoring
 * - Delivery rate tracking
 * 
 * Credits: Panxcz (owner) | Rebuilt by Opanx
 */

const config = require('../config/settings');

// ═══════════════════════════════════════════════
// GAUSSIAN JITTER RATE LIMITER
// ═══════════════════════════════════════════════

class GaussianRateLimiter {
    constructor(opts = {}) {
        this.maxPerMinute = opts.maxPerMinute || 10;
        this.windowMs = opts.windowMs || 60000;
        this.timestamps = [];
        this.paused = false;
        this.speedFactor = 1.0;
    }

    gaussianRandom(mean = 0, stdev = 1) {
        let u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        return mean + stdev * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    }

    async waitIfNeeded() {
        if (this.paused) {
            console.log('[ANTIBAN] ⏸️  Rate limiter paused (soft ban detected)');
            await new Promise(r => setTimeout(r, 60000));
            return this.waitIfNeeded();
        }

        const now = Date.now();
        this.timestamps = this.timestamps.filter(t => now - t < this.windowMs);

        if (this.timestamps.length >= this.maxPerMinute * this.speedFactor) {
            const oldestInWindow = Math.min(...this.timestamps);
            const waitTime = this.windowMs - (now - oldestInWindow);
            // Add gaussian jitter (±30% of wait time)
            const jitter = waitTime * 0.3 * this.gaussianRandom(0, 1);
            const finalWait = Math.max(1000, waitTime + jitter);
            
            console.log(`[ANTIBAN] ⏳ Waiting ${Math.round(finalWait / 1000)}s (rate limit)`);
            await new Promise(r => setTimeout(r, finalWait));
        }

        this.timestamps.push(Date.now());
    }

    adaptLimits(deliveryRate) {
        if (deliveryRate >= 0.85) this.speedFactor = 1.0;
        else if (deliveryRate >= 0.70) this.speedFactor = 0.75;
        else if (deliveryRate >= 0.55) this.speedFactor = 0.50;
        else {
            this.speedFactor = 0.25;
            console.log('[ANTIBAN] ⚠️  Low delivery rate — throttling to 25%');
        }
    }

    pause() { this.paused = true; }
    resume() { this.paused = false; }
}

// ═══════════════════════════════════════════════
// WARM-UP SYSTEM (7-day ramp)
// ═══════════════════════════════════════════════

class WarmUpSystem {
    constructor() {
        this.startDate = null;
        this.warmUpDays = 7;
    }

    start() {
        this.startDate = Date.now();
        console.log('[ANTIBAN] 🔥 Warm-up started — 7 day ramp');
    }

    getSpeedMultiplier() {
        if (!this.startDate) return 1.0;
        const daysSinceStart = (Date.now() - this.startDate) / (24 * 60 * 60 * 1000);
        
        if (daysSinceStart < 1) return 0.1;   // Day 1: 10%
        if (daysSinceStart < 2) return 0.2;   // Day 2: 20%
        if (daysSinceStart < 3) return 0.35;  // Day 3: 35%
        if (daysSinceStart < 4) return 0.5;   // Day 4: 50%
        if (daysSinceStart < 5) return 0.65;  // Day 5: 65%
        if (daysSinceStart < 6) return 0.8;   // Day 6: 80%
        return 1.0;                            // Day 7+: 100%
    }

    isWarmedUp() {
        if (!this.startDate) return true;
        return (Date.now() - this.startDate) >= (this.warmUpDays * 24 * 60 * 60 * 1000);
    }
}

// ═══════════════════════════════════════════════
// HUMAN-LIKE BEHAVIOR ENGINE
// ═══════════════════════════════════════════════

class HumanBehavior {
    constructor(sock) {
        this.sock = sock;
        this.recentContacts = new Set();
        this.lastActivity = Date.now();
        this.entropyInterval = null;
    }

    addContact(jid) {
        if (jid && !jid.includes('g.us')) {
            this.recentContacts.add(jid);
            // Keep only last 50 contacts
            if (this.recentContacts.size > 50) {
                const arr = [...this.recentContacts];
                this.recentContacts = new Set(arr.slice(-50));
            }
        }
    }

    // Typing indicator simulation
    async simulateTyping(jid, durationMs = null) {
        if (!this.sock || !jid) return;
        const duration = durationMs || (3000 + Math.random() * 5000); // 3-8 seconds
        
        try {
            await this.sock.sendPresenceUpdate('composing', jid);
            await new Promise(r => setTimeout(r, duration));
            await this.sock.sendPresenceUpdate('paused', jid);
        } catch {}
    }

    // Read receipt delay (simulate human reading)
    async simulateReadDelay(message, minDelay = 600000, maxDelay = 3600000) {
        if (!this.sock) return;
        const delay = minDelay + Math.random() * (maxDelay - minDelay);
        
        setTimeout(async () => {
            try {
                await this.sock.readMessages([message.key]);
            } catch {}
        }, delay);
    }

    // Presence cycling (available/unavailable)
    async cyclePresence() {
        if (!this.sock) return;
        try {
            await this.sock.sendPresenceUpdate('available');
            await new Promise(r => setTimeout(r, 30000 + Math.random() * 90000)); // 30-120s
            await this.sock.sendPresenceUpdate('unavailable');
        } catch {}
    }

    // Background entropy service (human-like idle activity)
    startEntropyService() {
        const runCycle = async () => {
            if (!this.sock?.user) return;

            const actions = [
                // Typing to random contact then stopping
                async () => {
                    const contacts = [...this.recentContacts];
                    if (contacts.length > 0) {
                        const jid = contacts[Math.floor(Math.random() * contacts.length)];
                        await this.simulateTyping(jid, 2000 + Math.random() * 4000);
                    }
                },
                // Presence cycle
                () => this.cyclePresence(),
            ];

            const action = actions[Math.floor(Math.random() * actions.length)];
            try { await action(); } catch {}
        };

        // Run every 2-6 hours
        const scheduleNext = () => {
            const interval = (2 + Math.random() * 4) * 60 * 60 * 1000;
            this.entropyInterval = setTimeout(async () => {
                await runCycle();
                scheduleNext();
            }, interval);
        };

        scheduleNext();
        console.log('[ANTIBAN] 🔄 Human entropy service started');
    }

    stopEntropyService() {
        if (this.entropyInterval) {
            clearTimeout(this.entropyInterval);
            this.entropyInterval = null;
        }
    }
}

// ═══════════════════════════════════════════════
// DELIVERY TRACKER
// ═══════════════════════════════════════════════

class DeliveryTracker {
    constructor() {
        this.sent = new Map(); // messageId -> timestamp
        this.delivered = new Set();
        this.failed = new Set();
    }

    onSent(messageId) {
        this.sent.set(messageId, Date.now());
    }

    onDelivered(messageId) {
        this.delivered.add(messageId);
    }

    onFailed(messageId) {
        this.failed.add(messageId);
    }

    getDeliveryRate() {
        const total = this.sent.size;
        if (total === 0) return 1.0;
        return this.delivered.size / total;
    }

    getStats() {
        return {
            sent: this.sent.size,
            delivered: this.delivered.size,
            failed: this.failed.size,
            rate: this.getDeliveryRate(),
        };
    }

    cleanup() {
        const cutoff = Date.now() - 3600000; // 1 hour
        for (const [id, ts] of this.sent) {
            if (ts < cutoff) this.sent.delete(id);
        }
    }
}

// ═══════════════════════════════════════════════
// HEALTH MONITOR
// ═══════════════════════════════════════════════

class HealthMonitor {
    constructor() {
        this.riskLevel = 'low'; // low, medium, high, critical
        this.events = [];
        this.banWarnings = 0;
    }

    onDisconnect(statusCode) {
        if (statusCode === 403 || statusCode === 401) {
            this.banWarnings++;
            this.riskLevel = this.banWarnings >= 3 ? 'critical' : 
                           this.banWarnings >= 2 ? 'high' : 'medium';
            console.log(`[ANTIBAN] ⚠️  Ban warning #${this.banWarnings} — Risk: ${this.riskLevel}`);
        }
    }

    onSuccessfulMessage() {
        this.banWarnings = Math.max(0, this.banWarnings - 1);
        if (this.banWarnings === 0) this.riskLevel = 'low';
    }

    shouldPause() {
        return this.riskLevel === 'critical';
    }

    getRiskLevel() {
        return this.riskLevel;
    }
}

// ═══════════════════════════════════════════════
// MESSAGE CONTENT VARIATOR
// ═══════════════════════════════════════════════

function addInvisibleVariation(text) {
    // Add zero-width characters to make each message unique
    const variations = ['\u200B', '\u200C', '\u200D', '\uFEFF'];
    const char = variations[Math.floor(Math.random() * variations.length)];
    // Insert at random position (not at start/end)
    const pos = 1 + Math.floor(Math.random() * Math.max(1, text.length - 2));
    return text.slice(0, pos) + char + text.slice(pos);
}

// ═══════════════════════════════════════════════
// MAIN ANTI-BAN WRAPPER
// ═══════════════════════════════════════════════

function wrapSocketWithAntiBan(sock, opts = {}) {
    const rateLimiter = new GaussianRateLimiter({
        maxPerMinute: opts.maxPerMinute || 10,
    });
    const warmUp = new WarmUpSystem();
    const humanBehavior = new HumanBehavior(sock);
    const deliveryTracker = new DeliveryTracker();
    const healthMonitor = new HealthMonitor();

    // Start warm-up
    warmUp.start();

    // Start entropy service after connection
    const origOn = sock.ev.on.bind(sock.ev);
    sock.ev.on = (event, handler) => {
        if (event === 'connection.update') {
            const wrappedHandler = (update) => {
                handler(update);
                if (update.connection === 'open') {
                    humanBehavior.startEntropyService();
                }
                if (update.connection === 'close') {
                    healthMonitor.onDisconnect(update.lastDisconnect?.error?.output?.statusCode);
                }
            };
            return origOn(event, wrappedHandler);
        }

        // Track incoming contacts
        if (event === 'messages.upsert') {
            const wrappedHandler = (data) => {
                handler(data);
                if (data.messages) {
                    data.messages.forEach(m => humanBehavior.addContact(m.key.remoteJid));
                }
            };
            return origOn(event, wrappedHandler);
        }

        // Track delivery receipts
        if (event === 'messages.update') {
            const wrappedHandler = (updates) => {
                handler(updates);
                updates.forEach(({ key, update }) => {
                    if (update.status === 3) deliveryTracker.onDelivered(key.id);
                    if (update.status === 0) deliveryTracker.onFailed(key.id);
                });
            };
            return origOn(event, wrappedHandler);
        }

        return origOn(event, handler);
    };

    // Wrap sendMessage
    const origSend = sock.sendMessage.bind(sock);
    sock.sendMessage = async (jid, content, options = {}) => {
        // Health check
        if (healthMonitor.shouldPause()) {
            console.log('[ANTIBAN] 🛑 Paused due to critical risk level');
            await new Promise(r => setTimeout(r, 300000)); // 5 min pause
        }

        // Rate limit with warm-up multiplier
        const warmUpFactor = warmUp.getSpeedMultiplier();
        rateLimiter.maxPerMinute = Math.max(2, Math.floor((opts.maxPerMinute || 10) * warmUpFactor));
        await rateLimiter.waitIfNeeded();

        // Human typing simulation for text messages
        if (content.text && !options.isForwarded) {
            const typingTime = 1000 + Math.random() * 3000;
            await humanBehavior.simulateTyping(jid, typingTime);
        }

        // Add invisible variation to text messages
        if (content.text && !content.text.startsWith('[')) {
            content.text = addInvisibleVariation(content.text);
        }

        try {
            const result = await origSend(jid, content, options);
            if (result?.key?.id) {
                deliveryTracker.onSent(result.key.id);
                healthMonitor.onSuccessfulMessage();
            }
            return result;
        } catch (err) {
            console.error('[ANTIBAN] Send error:', err.message);
            throw err;
        }
    };

    // Cleanup old delivery data periodically
    setInterval(() => {
        deliveryTracker.cleanup();
        const stats = deliveryTracker.getStats();
        if (stats.sent > 10) {
            rateLimiter.adaptLimits(stats.rate);
        }
    }, 600000); // Every 10 min

    console.log('[ANTIBAN] ✅ Anti-ban system active');
    console.log(`[ANTIBAN] 📊 Rate: ${rateLimiter.maxPerMinute}/min | Warm-up: 7 days`);

    return {
        sock,
        rateLimiter,
        warmUp,
        humanBehavior,
        deliveryTracker,
        healthMonitor,
    };
}

module.exports = {
    GaussianRateLimiter,
    WarmUpSystem,
    HumanBehavior,
    DeliveryTracker,
    HealthMonitor,
    addInvisibleVariation,
    wrapSocketWithAntiBan,
};
