'use strict';
/**
 * Elaina Bot v4.0 — Sticker Commands
 */

const { sendMessage, reply } = require('../core/connection');
const { downloadMediaMessage } = require('@qwerty-xcv/baileys');

const toimg = {
    name: 'toimg',
    category: 'sticker',
    description: 'Sticker ke gambar',
    aliases: ['stokimg', 'stickertoimg'],
    execute: async (ctx) => {
        const { jid, msg } = ctx;
        const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        
        if (!quotedMsg?.stickerMessage) {
            return reply(jid, '❌ Reply sticker yang mau dijadikan gambar!', msg);
        }
        
        try {
            const buffer = await downloadMediaMessage(quotedMsg, 'buffer', {});
            await sendMessage(jid, {
                image: buffer,
                caption: '🖼️ *Sticker converted to image*',
            }, { quoted: msg });
        } catch (e) {
            await reply(jid, `❌ Error: ${e.message}`, msg);
        }
    },
};

const ttp = {
    name: 'ttp',
    category: 'sticker',
    description: 'Text to picture',
    execute: async (ctx) => {
        const { jid, text, msg } = ctx;
        if (!text) return reply(jid, '❌ Usage: .ttp <text>', msg);
        
        try {
            const url = `https://api.lolhuman.xyz/api/ttp?text=${encodeURIComponent(text)}&apikey=GataDios`;
            await sendMessage(jid, {
                sticker: { url },
            }, { quoted: msg });
        } catch (e) {
            await reply(jid, `❌ Error: ${e.message}`, msg);
        }
    },
};

const attp = {
    name: 'attp',
    category: 'sticker',
    description: 'Animated text sticker',
    execute: async (ctx) => {
        const { jid, text, msg } = ctx;
        if (!text) return reply(jid, '❌ Usage: .attp <text>', msg);
        
        try {
            const url = `https://api.lolhuman.xyz/api/attp?text=${encodeURIComponent(text)}&apikey=GataDios`;
            await sendMessage(jid, {
                sticker: { url },
            }, { quoted: msg });
        } catch (e) {
            await reply(jid, `❌ Error: ${e.message}`, msg);
        }
    },
};

const brat = {
    name: 'brat',
    category: 'sticker',
    description: 'Brat style sticker',
    execute: async (ctx) => {
        const { jid, text, msg } = ctx;
        if (!text) return reply(jid, '❌ Usage: .brat <text>', msg);
        
        try {
            const url = `https://api.lolhuman.xyz/api/brat?text=${encodeURIComponent(text)}&apikey=GataDios`;
            await sendMessage(jid, {
                sticker: { url },
            }, { quoted: msg });
        } catch (e) {
            await reply(jid, `❌ Error: ${e.message}`, msg);
        }
    },
};

const emojimix = {
    name: 'emojimix',
    category: 'sticker',
    description: 'Mix 2 emoji',
    execute: async (ctx) => {
        const { jid, args, msg } = ctx;
        if (args.length < 2) return reply(jid, '❌ Usage: .emojimix 😀+😡', msg);
        
        const emojis = args.join(' ').split('+').map(e => e.trim());
        if (emojis.length !== 2) return reply(jid, '❌ Format: emoji1+emoji2', msg);
        
        try {
            const url = `https://api.lolhuman.xyz/api/emojimix?emoji1=${encodeURIComponent(emojis[0])}&emoji2=${encodeURIComponent(emojis[1])}&apikey=GataDios`;
            await sendMessage(jid, {
                sticker: { url },
            }, { quoted: msg });
        } catch (e) {
            await reply(jid, `❌ Error: ${e.message}`, msg);
        }
    },
};

const tourl = {
    name: 'tourl',
    category: 'sticker',
    description: 'Media ke URL',
    aliases: ['geturl'],
    execute: async (ctx) => {
        const { jid, msg } = ctx;
        const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const mediaMsg = quotedMsg?.imageMessage || quotedMsg?.videoMessage || quotedMsg?.audioMessage;
        
        if (!mediaMsg) return reply(jid, '❌ Reply media yang mau dijadikan URL!', msg);
        
        try {
            const { downloadMediaMessage } = require('@qwerty-xcv/baileys');
            const buffer = await downloadMediaMessage(quotedMsg, 'buffer', {});
            
            // Upload to telegraph
            const FormData = require('form-data');
            const form = new FormData();
            form.append('file', buffer, { filename: 'media.jpg' });
            
            const { data } = await require('axios').post('https://telegra.ph/upload', form, {
                headers: form.getHeaders(),
                timeout: 30000,
            });
            
            if (data[0]?.src) {
                await reply(jid, `🔗 *URL:* https://telegra.ph${data[0].src}`, msg);
            } else {
                await reply(jid, '❌ Gagal upload!', msg);
            }
        } catch (e) {
            await reply(jid, `❌ Error: ${e.message}`, msg);
        }
    },
};

module.exports = { commands: { toimg, ttp, attp, brat, emojimix, tourl } };
