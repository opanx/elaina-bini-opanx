'use strict';
/**
 * Elaina Bot v4.0 — Main Commands
 * Menu, Ping, Status, Info, Owner
 */

const config = require('../config/settings');
const { sendMessage, reply } = require('../core/connection');
const { getCommandCount } = require('../core/commandLoader');
const db = require('../database/engine');
const os = require('os');

const startTime = Date.now();

function formatUptime(ms) {
    const s = Math.floor(ms / 1000);
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) => 60);
    const sec = s % 60;
    return `${d}d ${h}h ${m}m ${sec}s`;
}

function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
}

const commands = {
    menu: {
        name: 'menu',
        category: 'main',
        description: 'Tampilkan menu utama',
        aliases: ['help', 'menuh', 'h'],
        execute: async (ctx) => {
            const { jid, prefix, isOwner } = ctx;
            const uptime = formatUptime(Date.now() - startTime);
            const ram = formatBytes(process.memoryUsage().rss);
            const cmdCount = getCommandCount();
            const time = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

            const text = `
╭─────────────────────────────────╮
│  🌙 *ELAINA THE PRIMARY*        │
│  ═══════════════════════════     │
│  "Your AI-Powered WhatsApp Bot"  │
│  Rebuilt by *Opanx* 🐙          │
╰─────────────────────────────────╯

╭─── 📊 *STATUS* ────────────────╮
│  🟢 Status  : Online            │
│  ⏱️ Uptime  : ${uptime}
│  🧠 RAM     : ${ram}
│  📦 Commands: ${cmdCount}
│  🕐 Time    : ${time}
╰────────────────────────────────╯

╭─── 🗂️ *MENU* ─────────────────╮
│                                  │
│  🏠 *Main*                       │
│  ${prefix}menu ${prefix}ping ${prefix}status ${prefix}owner
│                                  │
│  📥 *Downloader*                 │
│  ${prefix}tiktok ${prefix}ig ${prefix}ytmp3 ${prefix}ytmp4
│  ${prefix}fb ${prefix}spotify ${prefix}mediafire
│                                  │
│  🤖 *AI Chat*                    │
│  ${prefix}gpt ${prefix}gemini ${prefix}deepseek ${prefix}llama
│  ${prefix}translate ${prefix}ask
│                                  │
│  🎨 *AI Image*                   │
│  ${prefix}img ${prefix}anime ${prefix}ghibli ${prefix}removebg
│                                  │
│  🪄 *Sticker*                    │
│  ${prefix}s ${prefix}toimg ${prefix}attp ${prefix}ttp
│  ${prefix}brat ${prefix}emojimix
│                                  │
│  🎮 *Game*                       │
│  ${prefix}tebakkata ${prefix}suit ${prefix}slot ${prefix}daily
│                                  │
│  👥 *Group*                      │
│  ${prefix}kick ${prefix}promote ${prefix}demote
│  ${prefix}tagall ${prefix}antilink
│                                  │
│  🛡️ *Protection*                 │
│  ${prefix}antispam ${prefix}antitoxic ${prefix}welcome
│                                  │
│  🔧 *Tools*                      │
│  ${prefix}ocr ${prefix}calc ${prefix}qrcode ${prefix}translate
│                                  │
│  🔐 *Security*                   │
│  ${prefix}pmguard ${prefix}antibot ${prefix}firewall
│                                  │
│  🩺 *Doctor*                     │
│  ${prefix}doctor ${prefix}healthcheck ${prefix}autofix
│                                  │
│  👑 *Owner* ${isOwner ? '✅' : '🔒'}
│  ${prefix}addcase ${prefix}delcase ${prefix}broadcast
│  ${prefix}eval ${prefix}restart ${prefix}backup
│                                  │
╰────────────────────────────────╯

> ${config.foother}
> Credits: ${config.credits.developer} | Base: ${config.credits.baseOri}
> Rebuilt by: *${config.credits.rebuiltBy}*
            `.trim();

            await sendMessage(jid, { text });
        },
    },

    ping: {
        name: 'ping',
        category: 'main',
        description: 'Cek respon bot',
        aliases: ['p'],
        execute: async (ctx) => {
            const start = Date.now();
            const msg = await reply(ctx.jid, '🏓 *Pinging...*', ctx.msg);
            const latency = Date.now() - start;

            let status = '🟢 Excellent';
            if (latency > 500) status = '🔴 Slow';
            else if (latency > 200) status = '🟡 Fair';
            else if (latency > 100) status = '🟢 Good';

            await sendMessage(ctx.jid, {
                text: `🏓 *PONG!*\n\n⏱️ Latency: *${latency}ms*\n📊 Status: ${status}\n⏰ ${new Date().toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' })}`,
            });
        },
    },

    status: {
        name: 'status',
        category: 'main',
        description: 'Status lengkap bot',
        aliases: ['botstatus', 'botinfo'],
        execute: async (ctx) => {
            const uptime = formatUptime(Date.now() - startTime);
            const mem = process.memoryUsage();
            const cpu = os.loadavg();
            const cmdCount = getCommandCount();

            const text = `
╭─── 🩺 *BOT STATUS* ───────────╮
│  🟢 Status: Online              │
│  ⏱️ Uptime: ${uptime}
│  🧠 RAM: ${formatBytes(mem.rss)}
│  💾 Heap: ${formatBytes(mem.heapUsed)} / ${formatBytes(mem.heapTotal)}
│  ⚡ CPU: ${cpu[0].toFixed(2)}%
│  📦 Commands: ${cmdCount}
│  🖥️ Platform: ${os.platform()} ${os.arch()}
│  📦 Node: ${process.version}
│  🕐 ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
╰────────────────────────────────╯
            `.trim();

            await sendMessage(ctx.jid, { text });
        },
    },

    info: {
        name: 'info',
        category: 'main',
        description: 'Info bot',
        execute: async (ctx) => {
            const text = `
╭─── ℹ️ *BOT INFO* ─────────────╮
│  🤖 Name: ${config.botName}
│  📦 Version: ${config.credits.version}
│  👑 Owner: ${config.ownerName}
│  🔧 Developer: ${config.credits.developer}
│  📚 Base: ${config.credits.baseOri}
│  🐙 Rebuilt by: ${config.credits.rebuiltBy}
│  📝 License: MIT
│  🌐 GitHub: github.com/opanx/elaina-bini-opanx
╰────────────────────────────────╯

> *Credits:*
> • Developer: ${config.credits.developer}
> • Base ORI: ${config.credits.baseOri}
> • Rebuilt by: *${config.credits.rebuiltBy}*

> Do not remove credits!
            `.trim();

            await sendMessage(ctx.jid, { text });
        },
    },

    owner: {
        name: 'owner',
        category: 'main',
        description: 'Kontak owner',
        execute: async (ctx) => {
            const ownerNum = config.ownerNumber.split(',')[0].replace(/[^0-9]/g, '');
            const text = `
╭─── 👑 *OWNER* ────────────────╮
│  👤 Name: ${config.ownerName}
│  📱 Number: ${ownerNum}
│  🤖 Bot: ${config.botName}
│  🐙 Rebuilt by: ${config.credits.rebuiltBy}
╰────────────────────────────────╯

> Hubungi owner untuk:
> • Sewa bot
> • Laporan bug
> • Saran fitur
> • Kerjasama
            `.trim();

            await sendMessage(ctx.jid, { text });
        },
    },

    runtime: {
        name: 'runtime',
        category: 'main',
        description: 'Uptime bot',
        execute: async (ctx) => {
            const uptime = formatUptime(Date.now() - startTime);
            await reply(ctx.jid, `⏱️ *Runtime:* ${uptime}`, ctx.msg);
        },
    },
};

module.exports = { commands };
