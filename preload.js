'use strict';

/**
 * Preload script — patches baileys before main code runs.
 * This adds makeInMemoryStore back to @whiskeysockets/baileys v6+
 * so the obfuscated Elaina.js code doesn't crash.
 */

const Module = require('module');
const originalLoad = Module._load;

Module._load = function(request, parent, isMain) {
    const result = originalLoad.apply(this, arguments);
    
    if (request === '@whiskeysockets/baileys' && result && !result.makeInMemoryStore) {
        try {
            const { makeInMemoryStore } = require('./lib/baileys-polyfill');
            result.makeInMemoryStore = makeInMemoryStore;
            console.log('[Polyfill] ✅ makeInMemoryStore injected into @whiskeysockets/baileys');
        } catch (e) {
            console.warn('[Polyfill] ⚠️ Failed to inject makeInMemoryStore:', e.message);
        }
    }
    
    return result;
};
