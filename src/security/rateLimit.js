'use strict';
/**
 * Elaina Bot v4.0 — Rate Limiter
 */

const config = require('../config/settings');

const _rateMap = new Map();
const _penaltyMap = new Map();

function check(sender, command) {
    const now = Date.now();
    const key = `${sender}:${command}`;
    const penaltyKey = `${sender}:__penalty__`;

    // Check penalty
    const penalty = _penaltyMap.get(penaltyKey);
    if (penalty && penalty.until > now) {
        return { allowed: false, retryAfter: Math.ceil((penalty.until - now) / 1000) };
    }

    // Track requests
    if (!_rateMap.has(key)) _rateMap.set(key, []);
    const hits = _rateMap.get(key).filter(t => now - t < config.rateLimitWindow);
    hits.push(now);
    _rateMap.set(key, hits);

    if (hits.length > config.rateLimitMax) {
        // Apply penalty
        const level = (penalty?.level || 0) + 1;
        const penaltyMs = config.rateLimitWindow * Math.pow(2, Math.min(level, 5));
        _penaltyMap.set(penaltyKey, { level, until: now + penaltyMs });
        return { allowed: false, retryAfter: Math.ceil(penaltyMs / 1000) };
    }

    return { allowed: true };
}

function reset(sender) {
    for (const k of _rateMap.keys()) {
        if (k.startsWith(sender + ':')) _rateMap.delete(k);
    }
    _penaltyMap.delete(`${sender}:__penalty__`);
}

// Cleanup old entries
setInterval(() => {
    const now = Date.now();
    for (const [k, arr] of _rateMap) {
        const fresh = arr.filter(t => now - t < 300000);
        if (!fresh.length) _rateMap.delete(k);
        else _rateMap.set(k, fresh);
    }
}, 60000);

module.exports = { check, reset };
