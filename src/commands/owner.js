'use strict';
/**
 * Elaina Bot v4.0 — Owner Commands
 */

const { sendMessage, reply, getSock } = require('../core/connection');
const { exec } = require('child_process');
const config = require('../config/settings');
const db = require('../database/engine');

const eval_cmd = {
    name: 'eval',
    category: 'owner',
    description: 'Execute JavaScript',
    aliases: ['ev', 'execute'],
    ownerOnly: true,
    execute: async (ctx) => {
        const { jid, text, msg } = ctx;
        if (!text) return reply(jid, '❌ Usage: .eval <code>', msg);
        
        try {
            let result = eval(text);
            if (typeof result !== 'string') result = JSON.stringify(result, null, 2);
            await reply(jid, `✅ *Result:*\n\`\`\`${result.slice(0, 3000)}\`\`\``, msg);
        } catch (e) {
            await reply(jid, `❌ Error: ${e.message}`, msg);
        }
    },
};

const broadcast = {
    name: 'broadcast',
    category: 'owner',
    description: 'Broadcast pesan',
    aliases: ['bc'],
    ownerOnly: true,
    execute: async (ctx) => {
        const { jid, text, msg } = ctx;
        if (!text) return reply(jid, '❌ Usage: .broadcast <text>', msg);
        
        try {
            const sock = getSock();
            const groups = await sock.groupFetchAllParticipating();
            const groupIds = Object.keys(groups);
            
            let success = 0;
            let failed = 0;
            
            await reply(jid, `📢 Broadcasting ke ${groupIds.length} grup...`, msg);
            
            for (const gid of groupIds) {
                try {
                    await sock.sendMessage(gid, { text: `📢 *BROADCAST*\n\n${text}\n\n> ${config.foother}` });
                    success++;
                    await new Promise(r => setTimeout(r, 2000)); // Anti-spam
                } catch {
                    failed++;
                }
            }
            
            await reply(jid, `✅ Broadcast selesai!\n\n📊 Berhasil: ${success}\n❌ Gagal: ${failed}`, msg);
        } catch (e) {
            await reply(jid, `❌ Error: ${e.message}`, msg);
        }
    },
};

const restart = {
    name: 'restart',
    category: 'owner',
    description: 'Restart bot',
    ownerOnly: true,
    execute: async (ctx) => {
        const { jid, msg } = ctx;
        await reply(jid, '🔄 Restarting bot...', msg);
        
        setTimeout(() => {
            process.exit(0);
        }, 1000);
    },
};

const addsewa = {
    name: 'addsewa',
    category: 'owner',
    description: 'Tambah sewa grup',
    ownerOnly: true,
    execute: async (ctx) => {
        const { jid, args, msg } = ctx;
        const target = args[0]?.replace(/[^0-9]/g, '') + '@g.us';
        const duration = args[1]; // e.g., 30d, 7d
        
        if (!target || !target.includes('@g.us')) {
            return reply(jid, '❌ Usage: .addsewa <group_id> <duration>', msg);
        }
        
        const ms = require('ms');
        const expiry = duration ? Date.now() + ms(duration) : null;
        
        const sewa = db.loadSewa();
        sewa[target] = {
            paket: 'basic',
            expiry,
            lifetime: !duration,
            addedBy: ctx.sender,
        };
        db.saveSewa(sewa);
        
        await reply(jid, `✅ Sewa ditambahkan!\n\nGrup: ${target}\nDurasi: ${duration || 'Lifetime'}`, msg);
    },
};

const delsewa = {
    name: 'delsewa',
    category: 'owner',
    description: 'Hapus sewa',
    ownerOnly: true,
    execute: async (ctx) => {
        const { jid, args, msg } = ctx;
        const target = args[0]?.replace(/[^0-9]/g, '') + '@g.us';
        
        if (!target || !target.includes('@g.us')) {
            return reply(jid, '❌ Usage: .delsewa <group_id>', msg);
        }
        
        const sewa = db.loadSewa();
        delete sewa[target];
        db.saveSewa(sewa);
        
        await reply(jid, `✅ Sewa dihapus: ${target}`, msg);
    },
};

const addprem = {
    name: 'addprem',
    category: 'owner',
    description: 'Tambah premium user',
    aliases: ['addpremium'],
    ownerOnly: true,
    execute: async (ctx) => {
        const { jid, args, msg } = ctx;
        const target = ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
            || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);
        
        if (!target) return reply(jid, '❌ Tag user atau ketik nomor!', msg);
        
        const user = db.getUser(target);
        user.isPremium = true;
        user.premiumExpiry = args[1] ? Date.now() + require('ms')(args[1]) : 0; // 0 = lifetime
        db.saveUser(target, user);
        
        await reply(jid, `✅ @${target.split('@')[0]} sekarang premium!`, msg);
    },
};

const delprem = {
    name: 'delprem',
    category: 'owner',
    description: 'Hapus premium user',
    aliases: ['delpremium'],
    ownerOnly: true,
    execute: async (ctx) => {
        const { jid, args, msg } = ctx;
        const target = ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
            || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);
        
        if (!target) return reply(jid, '❌ Tag user!', msg);
        
        const user = db.getUser(target);
        user.isPremium = false;
        user.premiumExpiry = 0;
        db.saveUser(target, user);
        
        await reply(jid, `✅ @${target.split('@')[0]} tidak lagi premium!`, msg);
    },
};

const ban = {
    name: 'ban',
    category: 'owner',
    description: 'Ban user',
    ownerOnly: true,
    execute: async (ctx) => {
        const { jid, args, msg } = ctx;
        const target = ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
            || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);
        
        if (!target) return reply(jid, '❌ Tag user!', msg);
        
        const banned = db.loadList('banned');
        if (!banned.includes(target)) {
            banned.push(target);
            db.saveList('banned', banned);
        }
        
        await reply(jid, `🚫 @${target.split('@')[0]} telah di-ban!`, msg);
    },
};

const unban = {
    name: 'unban',
    category: 'owner',
    description: 'Unban user',
    ownerOnly: true,
    execute: async (ctx) => {
        const { jid, args, msg } = ctx;
        const target = ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
            || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);
        
        if (!target) return reply(jid, '❌ Tag user!', msg);
        
        let banned = db.loadList('banned');
        banned = banned.filter(b => b !== target);
        db.saveList('banned', banned);
        
        await reply(jid, `✅ @${target.split('@')[0]} di-unban!`, msg);
    },
};

const block = {
    name: 'block',
    category: 'owner',
    description: 'Block user WhatsApp',
    ownerOnly: true,
    execute: async (ctx) => {
        const { jid, args, msg } = ctx;
        const target = ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
            || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);
        
        if (!target) return reply(jid, '❌ Tag user!', msg);
        
        try {
            const sock = getSock();
            await sock.updateBlockStatus(target, 'block');
            await reply(jid, `🚫 @${target.split('@')[0]} telah di-block!`, msg);
        } catch (e) {
            await reply(jid, `❌ Error: ${e.message}`, msg);
        }
    },
};

const unblock = {
    name: 'unblock',
    category: 'owner',
    description: 'Unblock user WhatsApp',
    ownerOnly: true,
    execute: async (ctx) => {
        const { jid, args, msg } = ctx;
        const target = ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
            || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);
        
        if (!target) return reply(jid, '❌ Tag user!', msg);
        
        try {
            const sock = getSock();
            await sock.updateBlockStatus(target, 'unblock');
            await reply(jid, `✅ @${target.split('@')[0]} di-unblock!`, msg);
        } catch (e) {
            await reply(jid, `❌ Error: ${e.message}`, msg);
        }
    },
};

const join = {
    name: 'join',
    category: 'owner',
    description: 'Join grup via link',
    ownerOnly: true,
    execute: async (ctx) => {
        const { jid, text, msg } = ctx;
        if (!text) return reply(jid, '❌ Usage: .join <group_link>', msg);
        
        try {
            const sock = getSock();
            const link = text.match(/chat\.whatsapp\.com\/([a-zA-Z0-9]+)/);
            if (!link) return reply(jid, '❌ Link tidak valid!', msg);
            
            await sock.groupAcceptInvite(link[1]);
            await reply(jid, '✅ Berhasil join grup!', msg);
        } catch (e) {
            await reply(jid, `❌ Error: ${e.message}`, msg);
        }
    },
};

const leave = {
    name: 'leave',
    category: 'owner',
    description: 'Keluar dari grup',
    ownerOnly: true,
    execute: async (ctx) => {
        const { jid, msg } = ctx;
        
        try {
            const sock = getSock();
            await reply(jid, '👋 Bye!', msg);
            await sock.groupLeave(jid);
        } catch (e) {
            await reply(jid, `❌ Error: ${e.message}`, msg);
        }
    },
};

const backup = {
    name: 'backup',
    category: 'owner',
    description: 'Backup database',
    ownerOnly: true,
    execute: async (ctx) => {
        const { jid, msg } = ctx;
        
        try {
            const { exec } = require('child_process');
            await reply(jid, '📦 Creating backup...', msg);
            
            exec('cd database && tar czf ../backup.tar.gz *.json', (err) => {
                if (err) {
                    reply(jid, `❌ Backup gagal: ${err.message}`, msg);
                } else {
                    reply(jid, '✅ Backup berhasil!\n📁 File: backup.tar.gz', msg);
                }
            });
        } catch (e) {
            await reply(jid, `❌ Error: ${e.message}`, msg);
        }
    },
};

module.exports = { commands: { eval: eval_cmd, broadcast, restart, addsewa, delsewa, addprem, delprem, ban, unban, block, unblock, join, leave, backup } };
