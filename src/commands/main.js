'use strict';
/**
 * Elaina Bot v4.0 — Main Commands
 * Menu, Ping, Status, Info, Owner
 * With HTML Renderer support
 */

const config = require('../config/settings');
const { sendMessage, reply, getSock } = require('../core/connection');
const { getCommandCount } = require('../core/commandLoader');
const { sendStatusDashboard, sendCard, sendHtml } = require('../lib/htmlRenderer');
const db = require('../database/engine');
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
            const time = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

            const html = `
<div style="background:#0a0a0f;border-radius:16px;padding:20px;max-width:400px;font-family:system-ui,-apple-system,sans-serif;color:#fff">
    <!-- Header -->
    <div style="text-align:center;padding:15px 0">
        <h1 style="margin:0;font-size:22px;background:linear-gradient(135deg,#6c63ff,#00d2d3);-webkit-background-clip:text;-webkit-text-fill-color:transparent">🌙 ELAINA THE PRIMARY</h1>
        <p style="margin:5px 0 0;color:#a0a0b0;font-size:12px">"Your AI-Powered WhatsApp Bot" | Rebuilt by Opanx 🐙</p>
    </div>
    
    <!-- Status Bar -->
    <div style="background:#12121a;border-radius:10px;padding:12px;margin:10px 0">
        <div style="display:flex;justify-content:space-between;font-size:12px">
            <span style="color:#55efc4">🟢 Online</span>
            <span style="color:#a0a0b0">⏱️ ${uptime}</span>
            <span style="color:#6c63ff">📦 ${cmdCount} cmds</span>
        </div>
    </div>
    
    <!-- Menu Grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:15px 0">
        <div style="background:linear-gradient(135deg,#6c63ff20,#6c63ff10);border:1px solid #6c63ff30;border-radius:10px;padding:12px;text-align:center">
            <div style="font-size:20px">📥</div>
            <div style="font-size:12px;color:#fff;margin-top:3px">Downloader</div>
            <div style="font-size:10px;color:#a0a0b0">8 platform</div>
        </div>
        <div style="background:linear-gradient(135deg,#00d2d320,#00d2d310);border:1px solid #00d2d330;border-radius:10px;padding:12px;text-align:center">
            <div style="font-size:20px">🤖</div>
            <div style="font-size:12px;color:#fff;margin-top:3px">AI Chat</div>
            <div style="font-size:10px;color:#a0a0b0">4 models</div>
        </div>
        <div style="background:linear-gradient(135deg,#55efc420,#55efc410);border:1px solid #55efc430;border-radius:10px;padding:12px;text-align:center">
            <div style="font-size:20px">🎮</div>
            <div style="font-size:12px;color:#fff;margin-top:3px">Game</div>
            <div style="font-size:10px;color:#a0a0b0">5 games</div>
        </div>
        <div style="background:linear-gradient(135deg,#ffeaa720,#ffeaa710);border:1px solid #ffeaa730;border-radius:10px;padding:12px;text-align:center">
            <div style="font-size:20px">🪄</div>
            <div style="font-size:12px;color:#fff;margin-top:3px">Sticker</div>
            <div style="font-size:10px;color:#a0a0b0">6 tools</div>
        </div>
        <div style="background:linear-gradient(135deg,#e1705520,#e1705510);border:1px solid #e1705530;border-radius:10px;padding:12px;text-align:center">
            <div style="font-size:20px">👥</div>
            <div style="font-size:12px;color:#fff;margin-top:3px">Group</div>
            <div style="font-size:10px;color:#a0a0b0">12 cmds</div>
        </div>
        <div style="background:linear-gradient(135deg,#a29bfe20,#a29bfe10);border:1px solid #a29bfe30;border-radius:10px;padding:12px;text-align:center">
            <div style="font-size:20px">🛡️</div>
            <div style="font-size:12px;color:#fff;margin-top:3px">Protection</div>
            <div style="font-size:10px;color:#a0a0b0">8 features</div>
        </div>
        <div style="background:linear-gradient(135deg,#fd79a820,#fd79a810);border:1px solid #fd79a830;border-radius:10px;padding:12px;text-align:center">
            <div style="font-size:20px">🔧</div>
            <div style="font-size:12px;color:#fff;margin-top:3px">Tools</div>
            <div style="font-size:10px;color:#a0a0b0">7 tools</div>
        </div>
        <div style="background:linear-gradient(135deg,#fdcb6e20,#fdcb6e10);border:1px solid #fdcb6e30;border-radius:10px;padding:12px;text-align:center;${isOwner ? '' : 'opacity:0.5'}">
            <div style="font-size:20px">👑</div>
            <div style="font-size:12px;color:#fff;margin-top:3px">Owner</div>
            <div style="font-size:10px;color:#a0a0b0">${isOwner ? 'Unlocked' : 'Locked'}</div>
        </div>
    </div>
    
    <!-- Quick Commands -->
    <div style="background:#12121a;border-radius:10px;padding:12px;margin:10px 0">
        <div style="font-size:11px;color:#6c6c80;margin-bottom:8px">⚡ QUICK COMMANDS</div>
        <div style="font-size:12px;color:#a0a0b0">
            ${prefix}menu • ${prefix}ping • ${prefix}status • ${prefix}owner
        </div>
    </div>
    
    <!-- Footer -->
    <div style="text-align:center;margin-top:15px;padding-top:10px;border-top:1px solid #1a1a2e">
        <p style="margin:0;color:#6c6c80;font-size:10px">© FallZx Infinity × KyyInfinite | Rebuilt by Opanx 🐙</p>
        <p style="margin:5px 0 0;color:#6c6c80;font-size:10px">Do not remove credits!</p>
    </div>
</div>
            `.trim();

            try {
                const sock = getSock();
                if (sock) {
                    await sendHtml(sock, jid, html);
                } else {
                    throw new Error('Socket not available');
                }
            } catch (e) {
                // Fallback to plain text
                const text = `
🌙 *ELAINA THE PRIMARY*
"Your AI-Powered WhatsApp Bot"

📊 Status: Online
⏱️ Uptime: ${uptime}
🧠 RAM: ${ram}
📦 Commands: ${cmdCount}

> ${config.foother}
> Rebuilt by Opanx 🐙
                `.trim();
                await sendMessage(jid, { text });
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
            await reply(jid, '🏓 *Pinging...*', msg);
            const latency = Date.now() - start;

            let status = '🟢 Excellent';
            let color = '55efc4';
            if (latency > 500) { status = '🔴 Slow'; color = 'e17055'; }
            else if (latency > 200) { status = '🟡 Fair'; color = 'ffeaa7'; }
            else if (latency > 100) { status = '🟢 Good'; color = '55efc4'; }

            const html = `
<div style="background:#0a0a0f;border-radius:16px;padding:20px;max-width:350px;font-family:system-ui,-apple-system,sans-serif;color:#fff;text-align:center">
    <div style="font-size:40px;margin-bottom:10px">🏓</div>
    <h2 style="margin:0;font-size:20px;color:#fff">PONG!</h2>
    
    <div style="background:#12121a;border-radius:12px;padding:15px;margin:15px 0">
        <div style="font-size:28px;font-weight:bold;color:#${color}">${latency}ms</div>
        <div style="font-size:12px;color:#a0a0b0;margin-top:3px">${status}</div>
    </div>
    
    <div style="font-size:11px;color:#6c6c80">
        ${new Date().toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' })}
    </div>
</div>
            `.trim();

            try {
                const sock = getSock();
                if (sock) await sendHtml(sock, jid, html);
                else throw new Error('No socket');
            } catch {
                await sendMessage(jid, {
                    text: `🏓 *PONG!*\n\n⏱️ Latency: *${latency}ms*\n📊 Status: ${status}`,
                });
            }
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

            // Fallback
            const text = `
╭─── 🩺 *BOT STATUS* ───────────╮
│  🟢 Status: Online              │
│  ⏱️ Uptime: ${uptime}
│  🧠 RAM: ${formatBytes(mem.rss)}
│  💾 Heap: ${formatBytes(mem.heapUsed)} / ${formatBytes(mem.heapTotal)}
│  📦 Commands: ${getCommandCount()}
│  🖥️ Platform: ${os.platform()} ${os.arch()}
│  📦 Node: ${process.version}
╰────────────────────────────────╯
            `.trim();
            await sendMessage(jid, { text });
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
                        title: 'ℹ️ Bot Info',
                        subtitle: 'Elaina The Primary v' + config.credits.version,
                        items: [
                            { icon: '🤖', label: 'Name', value: config.botName },
                            { icon: '📦', label: 'Version', value: config.credits.version },
                            { icon: '👑', label: 'Owner', value: config.ownerName },
                            { icon: '🔧', label: 'Developer', value: config.credits.developer },
                            { icon: '📚', label: 'Base', value: config.credits.baseOri },
                            { icon: '🐙', label: 'Rebuilt by', value: config.credits.rebuiltBy },
                            { icon: '📝', label: 'License', value: 'MIT' },
                        ],
                        footer: 'Do not remove credits!',
                        color: '6c63ff',
                    });
                    return;
                }
            } catch {}

            // Fallback
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
> Do not remove credits!
            `.trim();
            await sendMessage(jid, { text });
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
                        title: '👑 Owner',
                        subtitle: 'Hubungi owner untuk info',
                        items: [
                            { icon: '👤', label: 'Name', value: config.ownerName },
                            { icon: '📱', label: 'Number', value: ownerNum },
                            { icon: '🤖', label: 'Bot', value: config.botName },
                            { icon: '🐙', label: 'Rebuilt by', value: config.credits.rebuiltBy },
                        ],
                        footer: 'Sewa bot • Laporan bug • Saran fitur',
                        color: 'fdcb6e',
                    });
                    return;
                }
            } catch {}

            // Fallback
            await sendMessage(jid, { text: `👑 *OWNER*\n\n👤 Name: ${config.ownerName}\n📱 Number: ${ownerNum}` });
        },
    },

    runtime: {
        name: 'runtime',
        category: 'main',
        description: 'Uptime bot',
        execute: async (ctx) => {
            await reply(ctx.jid, `⏱️ *Runtime:* ${formatUptime(Date.now() - startTime)}`, ctx.msg);
        },
    },
};

module.exports = { commands };
