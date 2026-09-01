'use strict';
/**
 * Elaina Bot v4.0 — Tools Commands
 */

const axios = require('axios');
const crypto = require('crypto');
const { sendMessage, reply } = require('../core/connection');
const { formatBytes, uuid } = require('../lib/functions');

const calc = {
    name: 'calc',
    category: 'tools',
    description: 'Kalkulator',
    aliases: ['kalkulator', 'math'],
    execute: async (ctx) => {
        const { jid, text, msg } = ctx;
        if (!text) return reply(jid, '❌ Usage: .calc 2 + 2', msg);
        
        try {
            // Safe math evaluation
            const sanitized = text.replace(/[^0-9+\-*/().%\s]/g, '');
            if (!sanitized) return reply(jid, '❌ Input tidak valid!', msg);
            
            const result = Function('"use strict"; return (' + sanitized + ')')();
            await reply(jid, `🔢 *Kalkulator*\n\n📝 ${text}\n📊 = *${result}*`, msg);
        } catch (e) {
            await reply(jid, `❌ Error: ${e.message}`, msg);
        }
    },
};

const qrcode = {
    name: 'qrcode',
    category: 'tools',
    description: 'Generate QR Code',
    aliases: ['qr'],
    execute: async (ctx) => {
        const { jid, text, msg } = ctx;
        if (!text) return reply(jid, '❌ Usage: .qrcode <text/url>', msg);
        
        try {
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`;
            await sendMessage(jid, {
                image: { url: qrUrl },
                caption: `📱 *QR Code*\n\n📝 ${text}`,
            }, { quoted: msg });
        } catch (e) {
            await reply(jid, `❌ Error: ${e.message}`, msg);
        }
    },
};

const uuid_cmd = {
    name: 'uuid',
    category: 'tools',
    description: 'Generate UUID',
    aliases: ['uid'],
    execute: async (ctx) => {
        const { jid, msg } = ctx;
        const id = uuid();
        await reply(jid, `🆔 *UUID Generated*\n\n\`${id}\``, msg);
    },
};

const password = {
    name: 'password',
    category: 'tools',
    description: 'Generate password',
    aliases: ['pass', 'pwd'],
    execute: async (ctx) => {
        const { jid, args, msg } = ctx;
        const length = parseInt(args[0]) || 12;
        
        if (length < 4 || length > 64) {
            return reply(jid, '❌ Length harus 4-64!', msg);
        }
        
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let pass = '';
        for (let i = 0; i < length; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        await reply(jid, `🔐 *Password Generated*\n\n\`${pass}\`\n\n📏 Length: ${length}`, msg);
    },
};

const hash = {
    name: 'hash',
    category: 'tools',
    description: 'Hash generator (MD5, SHA256)',
    execute: async (ctx) => {
        const { jid, text, msg } = ctx;
        if (!text) return reply(jid, '❌ Usage: .hash <text>', msg);
        
        const md5 = crypto.createHash('md5').update(text).digest('hex');
        const sha256 = crypto.createHash('sha256').update(text).digest('hex');
        
        const result = `
🔐 *Hash Generator*

📝 Input: ${text}

*MD5:*
\`${md5}\`

*SHA256:*
\`${sha256}\`
        `.trim();
        
        await reply(jid, result, msg);
    },
};

const base64_cmd = {
    name: 'base64',
    category: 'tools',
    description: 'Encode/Decode Base64',
    aliases: ['b64'],
    execute: async (ctx) => {
        const { jid, args, msg } = ctx;
        const action = (args[0] || '').toLowerCase();
        const text = args.slice(1).join(' ');
        
        if (!action || !text || !['encode', 'decode'].includes(action)) {
            return reply(jid, '❌ Usage:\n.base64 encode <text>\n.base64 decode <text>', msg);
        }
        
        try {
            let result;
            if (action === 'encode') {
                result = Buffer.from(text).toString('base64');
            } else {
                result = Buffer.from(text, 'base64').toString('utf8');
            }
            
            await reply(jid, `🔐 *Base64 ${action}*\n\n📝 Input: ${text}\n📊 Output: \`${result}\``, msg);
        } catch (e) {
            await reply(jid, `❌ Error: ${e.message}`, msg);
        }
    },
};

const weather = {
    name: 'weather',
    category: 'tools',
    description: 'Cek cuaca',
    aliases: ['cuaca'],
    execute: async (ctx) => {
        const { jid, text, msg } = ctx;
        if (!text) return reply(jid, '❌ Usage: .weather <city>', msg);
        
        try {
            const { data } = await axios.get(
                `https://wttr.in/${encodeURIComponent(text)}?format=j1`,
                { timeout: 10000 }
            );
            
            const current = data.current_condition[0];
            const result = `
🌤️ *Cuaca: ${text}*

🌡️ Suhu: ${current.temp_C}°C
🤔 Terasa: ${current.FeelsLikeC}°C
💧 Kelembapan: ${current.humidity}%
💨 Angin: ${current.windspeedKmph} km/h
🌧️ Kondisi: ${current.weatherDesc[0].value}
            `.trim();
            
            await reply(jid, result, msg);
        } catch (e) {
            await reply(jid, `❌ Error: ${e.message}`, msg);
        }
    },
};

const whois = {
    name: 'whois',
    category: 'tools',
    description: 'Domain info',
    execute: async (ctx) => {
        const { jid, text, msg } = ctx;
        if (!text) return reply(jid, '❌ Usage: .whois <domain>', msg);
        
        try {
            const { data } = await axios.get(
                `https://api.hackertarget.com/whois/?q=${encodeURIComponent(text)}`,
                { timeout: 10000 }
            );
            
            await reply(jid, `🔍 *Whois: ${text}\n\n${data.slice(0, 3000)}`, msg);
        } catch (e) {
            await reply(jid, `❌ Error: ${e.message}`, msg);
        }
    },
};

const urlshort = {
    name: 'urlshort',
    category: 'tools',
    description: 'Short URL',
    aliases: ['shorturl', 'short'],
    execute: async (ctx) => {
        const { jid, text, msg } = ctx;
        if (!text) return reply(jid, '❌ Usage: .urlshort <url>', msg);
        
        try {
            const { data } = await axios.get(
                `https://tinyurl.com/api-create.php?url=${encodeURIComponent(text)}`,
                { timeout: 10000 }
            );
            
            await reply(jid, `🔗 *URL Shortener*\n\n📝 Original: ${text}\n📊 Short: ${data}`, msg);
        } catch (e) {
            await reply(jid, `❌ Error: ${e.message}`, msg);
        }
    },
};

module.exports = { commands: { calc, qrcode, uuid: uuid_cmd, password, hash, base64: base64_cmd, weather, whois, urlshort } };
