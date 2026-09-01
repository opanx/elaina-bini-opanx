'use strict';
/**
 * Elaina Bot v4.0 — HTML Renderer
 * Send rich HTML content via WhatsApp
 * Credit: Found via community research
 */

const crypto = require('crypto');
const { generateWAMessageFromContent } = require('@whiskeysockets/baileys');

/**
 * Send HTML-rendered message via WhatsApp
 * Uses GenAI unified response type for rich content
 * 
 * @param {Object} sock - WhatsApp socket
 * @param {string} jid - Target JID
 * @param {string} html - HTML content to render
 */
async function sendHtml(sock, jid, html) {
    const msg = generateWAMessageFromContent(jid, {
        botForwardedMessage: {
            message: {
                richResponseMessage: {
                    messageType: 1,
                    unifiedResponse: {
                        data: Buffer.from(
                            JSON.stringify({
                                __typename: "GenAIUnifiedResponse",
                                response_id: crypto.randomUUID(),
                                sections: [
                                    {
                                        __typename: "GenAIUnifiedResponseSection",
                                        view_model: {
                                            __typename: "GenAISingleLayoutViewModel",
                                            primitive: {
                                                __typename: "FOAHtmlPrimitiveDemoDONOTUSE",
                                                trusted_sources: [],
                                                payload: html.trim()
                                            }
                                        }
                                    }
                                ]
                            })
                        ).toString("base64")
                    },
                    contextInfo: {
                        isForwarded: true,
                        forwardOrigin: 4
                    }
                }
            }
        }
    }, {});

    return sock.relayMessage(jid, msg.message, { messageId: msg.key.id });
}

/**
 * Send styled card via HTML
 * 
 * @param {Object} sock - WhatsApp socket
 * @param {string} jid - Target JID
 * @param {Object} cardData - Card data
 * @param {string} cardData.title - Card title
 * @param {string} cardData.subtitle - Card subtitle
 * @param {Array} cardData.items - Card items [{label, value, icon}]
 * @param {string} cardData.footer - Footer text
 * @param {string} cardData.color - Theme color (hex without #)
 */
async function sendCard(sock, jid, cardData) {
    const { title, subtitle, items = [], footer, color = '6c63ff' } = cardData;

    const itemsHtml = items.map(item => `
        <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05)">
            <span style="color:#a0a0b0">${item.icon || ''} ${item.label}</span>
            <span style="color:#fff;font-weight:bold">${item.value}</span>
        </div>
    `).join('');

    const html = `
<div style="background:#0a0a0f;border-radius:16px;padding:20px;max-width:400px;font-family:system-ui,-apple-system,sans-serif;color:#fff">
    <div style="background:linear-gradient(135deg,#${color},#${color}99);border-radius:12px;padding:15px;margin-bottom:15px">
        <h2 style="margin:0;font-size:18px;color:#fff">${title}</h2>
        ${subtitle ? `<p style="margin:5px 0 0;color:rgba(255,255,255,0.8);font-size:13px">${subtitle}</p>` : ''}
    </div>
    <div style="padding:0 5px">
        ${itemsHtml}
    </div>
    ${footer ? `<div style="text-align:center;margin-top:15px;color:#6c6c80;font-size:11px">${footer}</div>` : ''}
</div>
    `.trim();

    return sendHtml(sock, jid, html);
}

/**
 * Send status dashboard via HTML
 * 
 * @param {Object} sock - WhatsApp socket
 * @param {string} jid - Target JID
 * @param {Object} statusData - Status data
 */
async function sendStatusDashboard(sock, jid, statusData) {
    const { botName, uptime, ram, commands, ping, ownerName, version } = statusData;

    const html = `
<div style="background:#0a0a0f;border-radius:16px;padding:20px;max-width:400px;font-family:system-ui,-apple-system,sans-serif;color:#fff">
    <!-- Header -->
    <div style="text-align:center;padding:15px 0">
        <h1 style="margin:0;font-size:24px;background:linear-gradient(135deg,#6c63ff,#00d2d3);-webkit-background-clip:text;-webkit-text-fill-color:transparent">🌙 ${botName}</h1>
        <p style="margin:5px 0 0;color:#a0a0b0;font-size:13px">AI-Powered WhatsApp Bot</p>
    </div>
    
    <!-- Status Badge -->
    <div style="text-align:center;margin:15px 0">
        <span style="background:rgba(85,239,196,0.15);color:#55efc4;padding:5px 15px;border-radius:20px;font-size:12px;font-weight:bold">🟢 ONLINE</span>
    </div>
    
    <!-- Stats Grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:15px 0">
        <div style="background:#12121a;border-radius:10px;padding:12px;text-align:center">
            <div style="font-size:20px;font-weight:bold;color:#6c63ff">${uptime || '0d 0h'}</div>
            <div style="font-size:11px;color:#a0a0b0;margin-top:3px">⏱️ Uptime</div>
        </div>
        <div style="background:#12121a;border-radius:10px;padding:12px;text-align:center">
            <div style="font-size:20px;font-weight:bold;color:#00d2d3">${ram || '0 MB'}</div>
            <div style="font-size:11px;color:#a0a0b0;margin-top:3px">🧠 RAM</div>
        </div>
        <div style="background:#12121a;border-radius:10px;padding:12px;text-align:center">
            <div style="font-size:20px;font-weight:bold;color:#55efc4">${commands || '0'}</div>
            <div style="font-size:11px;color:#a0a0b0;margin-top:3px">📦 Commands</div>
        </div>
        <div style="background:#12121a;border-radius:10px;padding:12px;text-align:center">
            <div style="font-size:20px;font-weight:bold;color:#ffeaa7">${ping || '0'}ms</div>
            <div style="font-size:11px;color:#a0a0b0;margin-top:3px">📡 Ping</div>
        </div>
    </div>
    
    <!-- Footer -->
    <div style="text-align:center;margin-top:15px;padding-top:10px;border-top:1px solid #1a1a2e">
        <p style="margin:0;color:#6c6c80;font-size:11px">v${version || '4.0.0'} | Owner: ${ownerName || 'Unknown'}</p>
        <p style="margin:5px 0 0;color:#6c6c80;font-size:10px">© FallZx Infinity | Rebuilt by Opanx 🐙</p>
    </div>
</div>
    `.trim();

    return sendHtml(sock, jid, html);
}

/**
 * Send download result via HTML
 * 
 * @param {Object} sock - WhatsApp socket
 * @param {string} jid - Target JID
 * @param {Object} downloadData - Download data
 */
async function sendDownloadResult(sock, jid, downloadData) {
    const { platform, title, author, thumbnail, url, type } = downloadData;

    const platformColors = {
        tiktok: 'ff0050',
        instagram: 'e1306c',
        youtube: 'ff0000',
        spotify: '1db954',
        twitter: '1da1f2',
        facebook: '1877f2',
    };

    const color = platformColors[platform?.toLowerCase()] || '6c63ff';

    const html = `
<div style="background:#0a0a0f;border-radius:16px;padding:20px;max-width:400px;font-family:system-ui,-apple-system,sans-serif;color:#fff">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#${color},#${color}99);border-radius:12px;padding:15px;text-align:center">
        <div style="font-size:24px;margin-bottom:5px">${type === 'video' ? '🎬' : type === 'audio' ? '🎵' : '📸'}</div>
        <h2 style="margin:0;font-size:16px;color:#fff">${platform || 'Download'}</h2>
    </div>
    
    <!-- Content -->
    <div style="margin:15px 0;padding:10px;background:#12121a;border-radius:10px">
        ${title ? `<p style="margin:0 0 5px;color:#fff;font-weight:bold">📝 ${title}</p>` : ''}
        ${author ? `<p style="margin:0;color:#a0a0b0;font-size:13px">👤 ${author}</p>` : ''}
    </div>
    
    <!-- Status -->
    <div style="text-align:center">
        <span style="background:rgba(85,239,196,0.15);color:#55efc4;padding:5px 15px;border-radius:20px;font-size:12px">✅ Downloaded</span>
    </div>
    
    <!-- Footer -->
    <div style="text-align:center;margin-top:15px;padding-top:10px;border-top:1px solid #1a1a2e">
        <p style="margin:0;color:#6c6c80;font-size:10px">Elaina Bot v4.0 | Rebuilt by Opanx 🐙</p>
    </div>
</div>
    `.trim();

    return sendHtml(sock, jid, html);
}

module.exports = {
    sendHtml,
    sendCard,
    sendStatusDashboard,
    sendDownloadResult,
};
