'use strict';
/**
 * Elaina Bot v4.0 — Group Management Commands
 */

const { sendMessage, reply, getSock } = require('../core/connection');
const db = require('../database/engine');
const config = require('../config/settings');

const kick = {
    name: 'kick',
    category: 'group',
    description: 'Keluarkan member dari grup',
    aliases: ['keluarkan', 'remove'],
    groupOnly: true,
    adminOnly: true,
    botAdminOnly: true,
    execute: async (ctx) => {
        const { jid, args, msg, groupMetadata } = ctx;
        const target = ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] 
            || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);
        
        if (!target) return reply(jid, '❌ Tag atau ketik nomor yang mau di-kick!', msg);
        
        try {
            const sock = getSock();
            await sock.groupParticipantsUpdate(jid, [target], 'remove');
            await reply(jid, `✅ @${target.split('@')[0]} telah dikeluarkan!`, msg);
        } catch (e) {
            await reply(jid, `❌ Gagal kick: ${e.message}`, msg);
        }
    },
};

const add = {
    name: 'add',
    category: 'group',
    description: 'Tambah member ke grup',
    aliases: ['tambah'],
    groupOnly: true,
    adminOnly: true,
    botAdminOnly: true,
    execute: async (ctx) => {
        const { jid, args, msg } = ctx;
        if (!args[0]) return reply(jid, '❌ Ketik nomor yang mau ditambah!', msg);
        
        const target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        
        try {
            const sock = getSock();
            await sock.groupParticipantsUpdate(jid, [target], 'add');
            await reply(jid, `✅ @${target.split('@')[0]} telah ditambahkan!`, msg);
        } catch (e) {
            await reply(jid, `❌ Gagal add: ${e.message}`, msg);
        }
    },
};

const promote = {
    name: 'promote',
    category: 'group',
    description: 'Jadikan admin',
    aliases: ['jadiadmin'],
    groupOnly: true,
    adminOnly: true,
    botAdminOnly: true,
    execute: async (ctx) => {
        const { jid, msg } = ctx;
        const target = ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        if (!target) return reply(jid, '❌ Tag user yang mau di-promote!', msg);
        
        try {
            const sock = getSock();
            await sock.groupParticipantsUpdate(jid, [target], 'promote');
            await reply(jid, `✅ @${target.split('@')[0]} sekarang admin!`, msg);
        } catch (e) {
            await reply(jid, `❌ Gagal: ${e.message}`, msg);
        }
    },
};

const demote = {
    name: 'demote',
    category: 'group',
    description: 'Hapus admin',
    aliases: ['turunadmin'],
    groupOnly: true,
    adminOnly: true,
    botAdminOnly: true,
    execute: async (ctx) => {
        const { jid, msg } = ctx;
        const target = ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        if (!target) return reply(jid, '❌ Tag user yang mau di-demote!', msg);
        
        try {
            const sock = getSock();
            await sock.groupParticipantsUpdate(jid, [target], 'demote');
            await reply(jid, `✅ @${target.split('@')[0]} tidak lagi admin!`, msg);
        } catch (e) {
            await reply(jid, `❌ Gagal: ${e.message}`, msg);
        }
    },
};

const tagall = {
    name: 'tagall',
    category: 'group',
    description: 'Tag semua member',
    aliases: ['everyone', 'mentionall'],
    groupOnly: true,
    execute: async (ctx) => {
        const { jid, text, msg, groupMetadata } = ctx;
        if (!groupMetadata) return reply(jid, '❌ Error!', msg);
        
        const participants = groupMetadata.participants.map(p => p.id);
        const caption = text || '📢 Announcement';
        
        await sendMessage(jid, {
            text: `${caption}\n\n${participants.map(p => `@${p.split('@')[0]}`).join('\n')}`,
            mentions: participants,
        }, { quoted: msg });
    },
};

const hidetag = {
    name: 'hidetag',
    category: 'group',
    description: 'Hidden tag semua member',
    aliases: ['h', 'ht'],
    groupOnly: true,
    execute: async (ctx) => {
        const { jid, text, msg, groupMetadata } = ctx;
        if (!groupMetadata) return reply(jid, '❌ Error!', msg);
        
        const participants = groupMetadata.participants.map(p => p.id);
        
        await sendMessage(jid, {
            text: text || '📢',
            mentions: participants,
        }, { quoted: msg });
    },
};

const setname = {
    name: 'setname',
    category: 'group',
    description: 'Ubah nama grup',
    aliases: ['setnamegc'],
    groupOnly: true,
    adminOnly: true,
    botAdminOnly: true,
    execute: async (ctx) => {
        const { jid, text, msg } = ctx;
        if (!text) return reply(jid, '❌ Ketik nama baru!', msg);
        
        try {
            const sock = getSock();
            await sock.groupUpdateSubject(jid, text);
            await reply(jid, `✅ Nama grup diubah ke: ${text}`, msg);
        } catch (e) {
            await reply(jid, `❌ Gagal: ${e.message}`, msg);
        }
    },
};

const setdesc = {
    name: 'setdesc',
    category: 'group',
    description: 'Ubah deskripsi grup',
    aliases: ['cleardesc'],
    groupOnly: true,
    adminOnly: true,
    botAdminOnly: true,
    execute: async (ctx) => {
        const { jid, text, msg } = ctx;
        if (!text) return reply(jid, '❌ Ketik deskripsi baru!', msg);
        
        try {
            const sock = getSock();
            await sock.groupUpdateDescription(jid, text);
            await reply(jid, `✅ Deskripsi grup diubah!`, msg);
        } catch (e) {
            await reply(jid, `❌ Gagal: ${e.message}`, msg);
        }
    },
};

const link = {
    name: 'link',
    category: 'group',
    description: 'Dapatkan link grup',
    aliases: ['grouplink', 'linkgc'],
    groupOnly: true,
    botAdminOnly: true,
    execute: async (ctx) => {
        const { jid, msg } = ctx;
        
        try {
            const sock = getSock();
            const code = await sock.groupInviteCode(jid);
            await reply(jid, `🔗 *Link Grup:*\nhttps://chat.whatsapp.com/${code}`, msg);
        } catch (e) {
            await reply(jid, `❌ Gagal: ${e.message}`, msg);
        }
    },
};

const revoke = {
    name: 'revoke',
    category: 'group',
    description: 'Reset link grup',
    aliases: ['resetlink'],
    groupOnly: true,
    adminOnly: true,
    botAdminOnly: true,
    execute: async (ctx) => {
        const { jid, msg } = ctx;
        
        try {
            const sock = getSock();
            await sock.groupRevokeInvite(jid);
            await reply(jid, '✅ Link grup telah di-reset!', msg);
        } catch (e) {
            await reply(jid, `❌ Gagal: ${e.message}`, msg);
        }
    },
};

const poll = {
    name: 'poll',
    category: 'group',
    description: 'Buat polling',
    aliases: ['voting'],
    groupOnly: true,
    execute: async (ctx) => {
        const { jid, args, msg } = ctx;
        if (args.length < 2) return reply(jid, '❌ Usage: .poll Question | Option1 | Option2', msg);
        
        const [question, ...options] = args.join(' ').split('|').map(s => s.trim());
        
        try {
            const sock = getSock();
            await sendMessage(jid, {
                poll: {
                    name: question,
                    values: options,
                    selectableCount: 1,
                },
            }, { quoted: msg });
        } catch (e) {
            await reply(jid, `❌ Gagal: ${e.message}`, msg);
        }
    },
};

module.exports = { commands: { kick, add, promote, demote, tagall, hidetag, setname, setdesc, link, revoke, poll } };
