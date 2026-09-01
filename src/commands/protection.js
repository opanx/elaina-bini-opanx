'use strict';
/**
 * Elaina Bot v4.0 — Protection Commands
 */

const { reply } = require('../core/connection');
const db = require('../database/engine');

const antilink = {
    name: 'antilink',
    category: 'protection',
    description: 'Anti-link toggle',
    groupOnly: true,
    adminOnly: true,
    execute: async (ctx) => {
        const { jid, args, msg } = ctx;
        const state = (args[0] || '').toLowerCase();
        
        if (!['on', 'off'].includes(state)) {
            return reply(jid, '❌ Usage: .antilink on/off', msg);
        }
        
        db.gsSet(jid, { antilink: state === 'on' });
        await reply(jid, `✅ Antilink *${state === 'on' ? 'AKTIF' : 'NONAKTIF'}*`, msg);
    },
};

const antilinkWA = {
    name: 'antilinkwa',
    category: 'protection',
    description: 'Anti-WA link toggle',
    groupOnly: true,
    adminOnly: true,
    execute: async (ctx) => {
        const { jid, args, msg } = ctx;
        const state = (args[0] || '').toLowerCase();
        
        if (!['on', 'off'].includes(state)) {
            return reply(jid, '❌ Usage: .antilinkwa on/off', msg);
        }
        
        db.gsSet(jid, { antilinkWA: state === 'on' });
        await reply(jid, `✅ Anti-WA Link *${state === 'on' ? 'AKTIF' : 'NONAKTIF'}*`, msg);
    },
};

const antispam = {
    name: 'antispam',
    category: 'protection',
    description: 'Anti-spam toggle',
    groupOnly: true,
    adminOnly: true,
    execute: async (ctx) => {
        const { jid, args, msg } = ctx;
        const state = (args[0] || '').toLowerCase();
        
        if (!['on', 'off'].includes(state)) {
            return reply(jid, '❌ Usage: .antispam on/off', msg);
        }
        
        db.gsSet(jid, { antispam: state === 'on' });
        await reply(jid, `✅ Antispam *${state === 'on' ? 'AKTIF' : 'NONAKTIF'}*`, msg);
    },
};

const antitoxic = {
    name: 'antitoxic',
    category: 'protection',
    description: 'Anti-toxic toggle',
    groupOnly: true,
    adminOnly: true,
    execute: async (ctx) => {
        const { jid, args, msg } = ctx;
        const state = (args[0] || '').toLowerCase();
        
        if (!['on', 'off'].includes(state)) {
            return reply(jid, '❌ Usage: .antitoxic on/off', msg);
        }
        
        db.gsSet(jid, { antitoxic: state === 'on' });
        await reply(jid, `✅ Anti-toxic *${state === 'on' ? 'AKTIF' : 'NONAKTIF'}*`, msg);
    },
};

const antinsfw = {
    name: 'antinsfw',
    category: 'protection',
    description: 'Anti-NSFW toggle',
    groupOnly: true,
    adminOnly: true,
    execute: async (ctx) => {
        const { jid, args, msg } = ctx;
        const state = (args[0] || '').toLowerCase();
        
        if (!['on', 'off'].includes(state)) {
            return reply(jid, '❌ Usage: .antinsfw on/off', msg);
        }
        
        db.gsSet(jid, { antinsfw: state === 'on' });
        await reply(jid, `✅ Anti-NSFW *${state === 'on' ? 'AKTIF' : 'NONAKTIF'}*`, msg);
    },
};

const welcome = {
    name: 'welcome',
    category: 'protection',
    description: 'Welcome message toggle',
    groupOnly: true,
    adminOnly: true,
    execute: async (ctx) => {
        const { jid, args, msg, text } = ctx;
        const state = (args[0] || '').toLowerCase();
        
        if (!['on', 'off', 'set'].includes(state)) {
            return reply(jid, '❌ Usage:\n.welcome on/off\n.welcome set <message>', msg);
        }
        
        if (state === 'set') {
            const welcomeMsg = args.slice(1).join(' ');
            if (!welcomeMsg) return reply(jid, '❌ Ketik pesan welcome!', msg);
            db.gsSet(jid, { welcome: true, welcomeMsg });
            return reply(jid, `✅ Welcome message diatur!\n\nPesan: ${welcomeMsg}`, msg);
        }
        
        db.gsSet(jid, { welcome: state === 'on' });
        await reply(jid, `✅ Welcome *${state === 'on' ? 'AKTIF' : 'NONAKTIF'}*`, msg);
    },
};

const setleave = {
    name: 'setleave',
    category: 'protection',
    aliases: ['leavemsg'],
    description: 'Leave message toggle',
    groupOnly: true,
    adminOnly: true,
    execute: async (ctx) => {
        const { jid, args, msg } = ctx;
        const state = (args[0] || '').toLowerCase();
        
        if (!['on', 'off', 'set'].includes(state)) {
            return reply(jid, '❌ Usage:\n.leave on/off\n.leave set <message>', msg);
        }
        
        if (state === 'set') {
            const leaveMsg = args.slice(1).join(' ');
            if (!leaveMsg) return reply(jid, '❌ Ketik pesan leave!', msg);
            db.gsSet(jid, { leave: true, leaveMsg });
            return reply(jid, `✅ Leave message diatur!\n\nPesan: ${leaveMsg}`, msg);
        }
        
        db.gsSet(jid, { leave: state === 'on' });
        await reply(jid, `✅ Leave *${state === 'on' ? 'AKTIF' : 'NONAKTIF'}*`, msg);
    },
};

const slowmode = {
    name: 'slowmode',
    category: 'protection',
    description: 'Slowmode toggle',
    groupOnly: true,
    adminOnly: true,
    execute: async (ctx) => {
        const { jid, args, msg } = ctx;
        const state = (args[0] || '').toLowerCase();
        
        if (!['on', 'off'].includes(state)) {
            return reply(jid, '❌ Usage: .slowmode on/off [detik]', msg);
        }
        
        const delay = parseInt(args[1]) || 10;
        db.gsSet(jid, { slowmode: state === 'on', slowmodeDelay: delay });
        await reply(jid, `✅ Slowmode *${state === 'on' ? 'AKTIF' : 'NONAKTIF'}* (${delay}s)`, msg);
    },
};

const warn = {
    name: 'warn',
    category: 'protection',
    description: 'Warning user',
    groupOnly: true,
    adminOnly: true,
    execute: async (ctx) => {
        const { jid, msg } = ctx;
        const target = ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        if (!target) return reply(jid, '❌ Tag user yang mau di-warn!', msg);
        
        const warnings = db.gsAddWarn(jid, target);
        const maxWarn = 3;
        
        if (warnings >= maxWarn) {
            try {
                const sock = require('../core/connection').getSock();
                await sock.groupParticipantsUpdate(jid, [target], 'remove');
                await reply(jid, `🚫 @${target.split('@')[0]} telah di-kick (3 warnings)`, msg);
            } catch (e) {
                await reply(jid, `⚠️ Warning ${warnings}/${maxWarn} untuk @${target.split('@')[0]} (gagal kick)`, msg);
            }
        } else {
            await reply(jid, `⚠️ Warning ${warnings}/${maxWarn} untuk @${target.split('@')[0]}`, msg);
        }
    },
};

const resetwarn = {
    name: 'resetwarn',
    category: 'protection',
    description: 'Reset warning user',
    groupOnly: true,
    adminOnly: true,
    execute: async (ctx) => {
        const { jid, msg } = ctx;
        const target = ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        if (!target) return reply(jid, '❌ Tag user!', msg);
        
        db.gsResetWarn(jid, target);
        await reply(jid, `✅ Warning @${target.split('@')[0]} di-reset!`, msg);
    },
};

module.exports = { commands: { antilink, antilinkWA, antispam, antitoxic, antinsfw, welcome, setleave, slowmode, warn, resetwarn } };
