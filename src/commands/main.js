'use strict';
/**
 * Elaina Bot v4.0 — Main Commands (Wibu Style)
 */

const config = require('../config/settings');
const { sendMessage, reply, getSock } = require('../core/connection');
const { getCommandCount } = require('../core/commandLoader');
const { sendStatusDashboard, sendCard, sendHtml } = require('../lib/htmlRenderer');
const os = require('os');

const startTime = Date.now();

function formatUptime(ms) {
    const s = Math.floor(ms / 1000);
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${d}d ${h}h ${m}m ${sec}s`;
}

function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
}

const E = config.emoji; // Shortcut

const commands = {
    menu: {
        name: 'menu',
        category: 'main',
        description: 'Tampilkan menu utama',
        aliases: ['help', 'menuh', 'h'],
        execute: async (ctx) => {
            const { jid, prefix, isOwner, msg } = ctx;
            const uptime = formatUptime(Date.now() - startTime);
            const ram = formatBytes(process.memoryUsage().rss);
            const cmdCount = getCommandCount();

            const html = `
<div style="background:#0a0a0f;border-radius:16px;padding:20px;max-width:400px;font-family:system-ui,-apple-system,sans-serif;color:#fff">
    <!-- Header -->
    <div style="text-align:center;padding:15px 0">
        <h1 style="margin:0;font-size:22px;background:linear-gradient(135deg,#ff6b9d,#c44dff,#6c63ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent">🌙 ELAINA THE PRIMARY ✨</h1>
        <p style="margin:5px 0 0;color:#a0a0b0;font-size:12px">"${E.sakura} Your AI-Powered Butler ${E.sakura}" | Rebuilt by Opanx 🐙</p>
    </div>
    
    <!-- Status Bar -->
    <div style="background:#12121a;border-radius:10px;padding:12px;margin:10px 0">
        <div style="display:flex;justify-content:space-between;font-size:12px">
            <span style="color:#55efc4">${E.online} Online</span>
            <span style="color:#a0a0b0">${E.star} ${uptime}</span>
            <span style="color:#c44dff">${E.sparkles} ${cmdCount} cmds</span>
        </div>
    </div>
    
    <!-- Menu Grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:15px 0">
        <div style="background:linear-gradient(135deg,#ff6b9d20,#ff6b9d10);border:1px solid #ff6b9d30;border-radius:10px;padding:12px;text-align:center">
            <div style="font-size:20px">${E.download}</div>
            <div style="font-size:12px;color:#fff;margin-top:3px">Downloader</div>
            <div style="font-size:10px;color:#a0a0b0">8 platform</div>
        </div>
        <div style="background:linear-gradient(135deg,#6c63ff20,#6c63ff10);border:1px solid #6c63ff30;border-radius:10px;padding:12px;text-align:center">
            <div style="font-size:20px">${E.bot}</div>
            <div style="font-size:12px;color:#fff;margin-top:3px">AI Chat</div>
            <div style="font-size:10px;color:#a0a0b0">4 models</div>
        </div>
        <div style="background:linear-gradient(135deg,#c44dff20,#c44dff10);border:1px solid #c44dff30;border-radius:10px;padding:12px;text-align:center">
            <div style="font-size:20px">${E.game}</div>
            <div style="font-size:12px;color:#fff;margin-top:3px">Games</div>
            <div style="font-size:10px;color:#a0a0b0">18+ games</div>
        </div>
        <div style="background:linear-gradient(135deg,#ff6b6b20,#ff6b6b10);border:1px solid #ff6b6b30;border-radius:10px;padding:12px;text-align:center">
            <div style="font-size:20px">${E.katana}</div>
            <div style="font-size:12px;color:#fff;margin-top:3px">PvP Battle</div>
            <div style="font-size:10px;color:#a0a0b0">1v1 Arena</div>
        </div>
        <div style="background:linear-gradient(135deg,#ffd93d20,#ffd93d10);border:1px solid #ffd93d30;border-radius:10px;padding:12px;text-align:center">
            <div style="font-size:20px">${E.anime}</div>
            <div style="font-size:12px;color:#fff;margin-top:3px">Sticker</div>
            <div style="font-size:10px;color:#a0a0b0">6 tools</div>
        </div>
        <div style="background:linear-gradient(135deg,#55efc420,#55efc410);border:1px solid #55efc430;border-radius:10px;padding:12px;text-align:center">
            <div style="font-size:20px">${E.group}</div>
            <div style="font-size:12px;color:#fff;margin-top:3px">Group</div>
            <div style="font-size:10px;color:#a0a0b0">11 cmds</div>
        </div>
        <div style="background:linear-gradient(135deg,#ff9ff320,#ff9ff310);border:1px solid #ff9ff330;border-radius:10px;padding:12px;text-align:center">
            <div style="font-size:20px">${E.shield}</div>
            <div style="font-size:12px;color:#fff;margin-top:3px">Protection</div>
            <div style="font-size:10px;color:#a0a0b0">8 features</div>
        </div>
        <div style="background:linear-gradient(135deg,#ffd93d20,#ffd93d10);border:1px solid #ffd93d30;border-radius:10px;padding:12px;text-align:center;${isOwner ? '' : 'opacity:0.5'}">
            <div style="font-size:20px">${E.crown}</div>
            <div style="font-size:12px;color:#fff;margin-top:3px">Owner</div>
            <div style="font-size:10px;color:#a0a0b0">${isOwner ? 'Unlocked' : 'Locked'}</div>
        </div>
    </div>
    
    <!-- Quick Commands -->
    <div style="background:#12121a;border-radius:10px;padding:12px;margin:10px 0">
        <div style="font-size:11px;color:#ff6b9d;margin-bottom:8px">⚡ QUICK COMMANDS</div>
        <div style="font-size:12px;color:#a0a0b0">
            ${prefix}menu • ${prefix}ping • ${prefix}status • ${prefix}owner
        </div>
    </div>
    
    <!-- Footer -->
    <div style="text-align:center;margin-top:15px;padding-top:10px;border-top:1px solid #1a1a2e">
        <p style="margin:0;color:#ff6b9d;font-size:11px">${E.sakura} ${E.moon} ${E.star} ${E.sakura}</p>
        <p style="margin:5px 0 0;color:#6c6c80;font-size:10px">© FallZx Infinity × KyyInfinite | Rebuilt by Opanx 🐙</p>
    </div>
</div>
            `.trim();

            try {
                const sock = getSock();
                if (sock) await sendHtml(sock, jid, html);
                else throw new Error('No socket');
            } catch {
                await sendMessage(jid, { text: `${E.moon} *ELAINA THE PRIMARY* ${E.sparkles}\n\n"${E.sakura} Your AI-Powered Butler ${E.sakura}"\n\n${E.online} Online | ${E.star} ${uptime} | ${E.sparkles} ${cmdCount} cmds\n\n> ${config.foother}\n> Rebuilt by Opanx 🐙` });
            }
        },
    },

    ping: {
        name: 'ping',
        category: 'main',
        description: 'Cek respon bot',
        aliases: ['p'],
        execute: async (ctx) => {
            const { jid, msg } = ctx;
            const start = Date.now();
            await reply(jid, `${E.lightning} *Pinging...*`, msg);
            const latency = Date.now() - start;

            let status = `${E.online} Excellent`;
            let color = '55efc4';
            if (latency > 500) { status = `${E.error} Slow`; color = 'ff6b6b'; }
            else if (latency > 200) { status = `${E.warning} Fair`; color = 'ffd93d'; }
            else if (latency > 100) { status = `${E.success} Good`; color = '55efc4'; }

            await sendMessage(jid, {
                text: `${E.shuriken} *PONG!* ${E.shuriken}\n\n${E.lightning} Latency: *${latency}ms*\n${E.star} Status: ${status}\n\n${E.sakura} ${new Date().toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' })} ${E.sakura}`,
            });
        },
    },

    status: {
        name: 'status',
        category: 'main',
        description: 'Status lengkap bot',
        aliases: ['botstatus', 'botinfo'],
        execute: async (ctx) => {
            const { jid, msg } = ctx;
            const uptime = formatUptime(Date.now() - startTime);
            const mem = process.memoryUsage();

            try {
                const sock = getSock();
                if (sock) {
                    await sendStatusDashboard(sock, jid, {
                        botName: config.botName,
                        uptime,
                        ram: formatBytes(mem.rss),
                        commands: getCommandCount(),
                        ping: '120',
                        ownerName: config.ownerName,
                        version: config.credits.version,
                    });
                    return;
                }
            } catch {}

            await sendMessage(jid, {
                text: `${E.crystal} *BOT STATUS* ${E.crystal}\n\n${E.online} Status: Online\n${E.star} Uptime: ${uptime}\n${E.bot} RAM: ${formatBytes(mem.rss)}\n${E.sparkles} Commands: ${getCommandCount()}\n${E.gear} Platform: ${os.platform()} ${os.arch()}\n${E.moon} Node: ${process.version}\n\n${E.sakura} © ${config.botName} ${E.sakura}`,
            });
        },
    },

    info: {
        name: 'info',
        category: 'main',
        description: 'Info bot',
        execute: async (ctx) => {
            const { jid, msg } = ctx;

            try {
                const sock = getSock();
                if (sock) {
                    await sendCard(sock, jid, {
                        title: `${E.crystal} Bot Info ${E.sparkles}`,
                        subtitle: `${config.botName} v${config.credits.version}`,
                        items: [
                            { icon: E.bot, label: 'Name', value: config.botName },
                            { icon: E.sparkles, label: 'Version', value: config.credits.version },
                            { icon: E.crown, label: 'Owner', value: config.ownerName },
                            { icon: E.wrench, label: 'Developer', value: config.credits.developer },
                            { icon: E.scroll, label: 'Base', value: config.credits.baseOri },
                            { icon: '🐙', label: 'Rebuilt by', value: config.credits.rebuiltBy },
                        ],
                        footer: `${E.sakura} Do not remove credits! ${E.sakura}`,
                        color: 'ff6b9d',
                    });
                    return;
                }
            } catch {}

            await sendMessage(jid, {
                text: `${E.crystal} *BOT INFO* ${E.crystal}\n\n${E.bot} Name: ${config.botName}\n${E.sparkles} Version: ${config.credits.version}\n${E.crown} Owner: ${config.ownerName}\n${E.wrench} Developer: ${config.credits.developer}\n${E.scroll} Base: ${config.credits.baseOri}\n${E.star} Rebuilt by: ${config.credits.rebuiltBy}\n\n${E.sakura} Do not remove credits! ${E.sakura}`,
            });
        },
    },

    owner: {
        name: 'owner',
        category: 'main',
        description: 'Kontak owner',
        execute: async (ctx) => {
            const { jid, msg } = ctx;
            const ownerNum = config.ownerNumber.split(',')[0].replace(/[^0-9]/g, '');

            try {
                const sock = getSock();
                if (sock) {
                    await sendCard(sock, jid, {
                        title: `${E.crown} Owner ${E.katana}`,
                        subtitle: 'Hubungi owner untuk info',
                        items: [
                            { icon: E.user, label: 'Name', value: config.ownerName },
                            { icon: '📱', label: 'Number', value: ownerNum },
                            { icon: E.bot, label: 'Bot', value: config.botName },
                            { icon: '🐙', label: 'Rebuilt by', value: config.credits.rebuiltBy },
                        ],
                        footer: `${E.katana} Sewa bot • Laporan bug • Saran fitur ${E.katana}`,
                        color: 'c44dff',
                    });
                    return;
                }
            } catch {}

            await sendMessage(jid, {
                text: `${E.crown} *OWNER* ${E.crown}\n\n${E.user} Name: ${config.ownerName}\n📱 Number: ${ownerNum}\n\n${E.katana} Hubungi owner untuk:\n• Sewa bot\n• Laporan bug\n• Saran fitur`,
            });
        },
    },

    runtime: {
        name: 'runtime',
        category: 'main',
        description: 'Uptime bot',
        execute: async (ctx) => {
            await reply(ctx.jid, `${E.star} *Runtime:* ${formatUptime(Date.now() - startTime)}`, ctx.msg);
        },
    },
};

module.exports = { commands };
