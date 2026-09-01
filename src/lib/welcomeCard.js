'use strict';
/**
 * Elaina Bot v4.0 — Welcome Card Generator
 */

/**
 * Generate welcome text card
 */
function generateWelcomeText({ groupName, userName, userId, memberCount }) {
    const time = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
    return `
╭─────────────────────────────────╮
│  🎉 *WELCOME!*                  │
│  ═══════════════════════════     │
│                                  │
│  👤 User: @${userId.split('@')[0]}
│  🏘️ Group: ${groupName}
│  👥 Members: ${memberCount}
│  🕐 Time: ${time}
│                                  │
│  ╭─────────────────────────╮    │
│  │  Selamat datang! 🎊     │    │
│  │  Harap baca rules grup  │    │
│  │  dan nikmati fitur bot  │    │
│  ╰─────────────────────────╯    │
│                                  │
│  🤖 ${config?.botName || 'Elaina Bot'}
╰─────────────────────────────────╯
    `.trim();
}

/**
 * Generate leave text card
 */
function generateLeaveText({ groupName, userName, userId }) {
    return `
╭─────────────────────────────────╮
│  👋 *GOODBYE!*                  │
│  ═══════════════════════════     │
│                                  │
│  👤 User: @${userId.split('@')[0]}
│  🏘️ Group: ${groupName}
│                                  │
│  ╭─────────────────────────╮    │
│  │  Sampai jumpa! 👋       │    │
│  │  Semoga sukses selalu   │    │
│  ╰─────────────────────────╯    │
│                                  │
│  🤖 ${config?.botName || 'Elaina Bot'}
╰─────────────────────────────────╯
    `.trim();
}

module.exports = { generateWelcomeText, generateLeaveText };
