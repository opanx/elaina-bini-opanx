'use strict';
/**
 * Elaina Bot v4.0 — PvP Battle System
 * vs Player, Challenge on Loss, Arena
 */

const { sendMessage, reply } = require('../core/connection');
const { random, randomInt, formatNumber } = require('../lib/functions');
const db = require('../database/engine');

// ============ PENDING CHALLENGES ============
const pendingChallenges = new Map(); // targetJid -> { challenger, type, timestamp }
const activeBattles = new Map(); // "jid1:jid2" -> battle state

// ============ 1V1 BATTLE ============
const battle = {
    name: 'battle',
    category: 'game',
    description: 'Battle 1v1 dengan player lain',
    aliases: ['1v1', 'duel', 'fight'],
    execute: async (ctx) => {
        const { jid, sender, args, msg, isGroup } = ctx;

        if (!isGroup) return reply(jid, '❌ Battle hanya bisa di grup!', msg);

        const subcmd = (args[0] || '').toLowerCase();
        const target = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

        // .battle @user — Challenge someone
        if (subcmd === 'challenge' || (!subcmd && target)) {
            if (!target) return reply(jid, '❌ Tag lawan kamu!\n\n.battle @user', msg);
            if (target === sender) return reply(jid, '❌ Ga bisa battle sama diri sendiri! 😂', msg);

            pendingChallenges.set(target, {
                challenger: sender,
                timestamp: Date.now(),
            });

            const text = `
⚔️ *BATTLE CHALLENGE!*

@${sender.split('@')[0]} menantang @${target.split('@')[0]}!

Ketik *.battle accept* untuk terima
Ketik *.battle decline* untuk tolak

⏰ Expire dalam 60 detik
            `.trim();

            return sendMessage(jid, { text, mentions: [sender, target] }, { quoted: msg });
        }

        // .battle accept — Accept challenge
        if (subcmd === 'accept') {
            const challenge = pendingChallenges.get(sender);
            if (!challenge) return reply(jid, '❌ Tidak ada challenge untuk kamu!', msg);

            if (Date.now() - challenge.timestamp > 60000) {
                pendingChallenges.delete(sender);
                return reply(jid, '❌ Challenge sudah expired!', msg);
            }

            pendingChallenges.delete(sender);
            return startBattle(jid, challenge.challenger, sender, msg);
        }

        // .battle decline — Decline challenge
        if (subcmd === 'decline') {
            const challenge = pendingChallenges.get(sender);
            if (!challenge) return reply(jid, '❌ Tidak ada challenge untuk kamu!', msg);

            pendingChallenges.delete(sender);
            return reply(jid, `@${sender.split('@')[0]} menolak challenge! 😏`, msg);
        }

        // .battle random — Find random opponent
        if (subcmd === 'random') {
            return reply(jid, '🔍 Mencari lawan random...\n\n(Masih dalam pengembangan)', msg);
        }

        // Help
        return reply(jid, `
⚔️ *BATTLE SYSTEM*

.battle @user — Challenge player
.battle accept — Terima challenge
.battle decline — Tolak challenge
.battle stats — Lihat stats
.battle leaderboard — Top fighters

💰 Reward: 50-200 coins
💀 Kalah: Challenge orang lain!
        `.trim(), msg);
    },
};

async function startBattle(jid, player1, player2, msg) {
    const hp1 = 100;
    const hp2 = 100;
    let turn = 1;

    const getPlayerName = (jid) => jid.split('@')[0];
    const attacks = ['⚔️ Slash', '🗡️ Stab', '🏹 Shoot', '👊 Punch', '🦶 Kick', '🔥 Fire', '❄️ Ice', '⚡ Lightning'];
    const defends = ['🛡️ Block', '💨 Dodge', '🔄 Counter'];

    let battleLog = '';
    let p1hp = hp1;
    let p2hp = hp2;

    // Battle loop (simplified - auto battle)
    while (p1hp > 0 && p2hp > 0 && turn <= 10) {
        // Player 1 attacks
        const atk1 = randomInt(8, 25);
        const def1 = randomInt(0, 10);
        const dmg1 = Math.max(1, atk1 - def1);
        p2hp = Math.max(0, p2hp - dmg1);

        // Player 2 attacks
        const atk2 = randomInt(8, 25);
        const def2 = randomInt(0, 10);
        const dmg2 = Math.max(1, atk2 - def2);
        p1hp = Math.max(0, p1hp - dmg2);

        battleLog += `Turn ${turn}: ${getPlayerName(player1)} -${dmg2}HP | ${getPlayerName(player2)} -${dmg1}HP\n`;
        turn++;
    }

    // Determine winner
    const winner = p1hp > p2hp ? player1 : p2hp > p1hp ? player2 : null;
    const loser = winner === player1 ? player2 : winner === player2 ? player1 : null;

    // Give rewards
    if (winner) {
        const winnerUser = db.getUser(winner);
        const loserUser = db.getUser(loser);

        const reward = randomInt(50, 200);
        winnerUser.koin = (winnerUser.koin || 0) + reward;
        winnerUser.exp = (winnerUser.exp || 0) + randomInt(20, 50);
        loserUser.koin = Math.max(0, (loserUser.koin || 0) - Math.floor(reward / 2));
        loserUser.exp = (loserUser.exp || 0) + randomInt(5, 15);

        db.saveUser(winner, winnerUser);
        db.saveUser(loser, loserUser);

        const hpBar = (hp, max) => {
            const filled = Math.round((hp / max) * 10);
            return '❤️'.repeat(filled) + '🖤'.repeat(10 - filled);
        };

        const text = `
⚔️ *BATTLE RESULT*

${getPlayerName(player1)} vs ${getPlayerName(player2)}

━━━ *HP STATUS* ━━━
${getPlayerName(player1)}: ${hpBar(p1hp, hp1)} ${p1hp}HP
${getPlayerName(player2)}: ${hpBar(p2hp, hp2)} ${p2hp}HP

━━━ *WINNER* ━━━
🏆 *${getPlayerName(winner)} MENANG!*

💰 +${reward} coins untuk pemenang
💀 -${Math.floor(reward / 2)} coins untuk yang kalah

━━━━━━━━━━━━━━━━━━

⚠️ @${loser.split('@')[0]} KALAH!
Ketik *.battle @someone* untuk challenge orang lain!
        `.trim();

        return sendMessage(jid, { text, mentions: [winner, loser] }, { quoted: msg });
    } else {
        const text = `
⚔️ *BATTLE RESULT*

${getPlayerName(player1)} vs ${getPlayerName(player2)}

🤝 *DRAW!*

HP tersisa sama-sama!
        `.trim();

        return sendMessage(jid, { text, mentions: [player1, player2] }, { quoted: msg });
    }
}

// ============ ARENA (Auto-match) ============
const arena = {
    name: 'arena',
    category: 'game',
    description: 'Arena battle system',
    aliases: ['pvp'],
    execute: async (ctx) => {
        const { jid, sender, args, msg, isGroup } = ctx;

        if (!isGroup) return reply(jid, '❌ Arena hanya bisa di grup!', msg);

        const subcmd = (args[0] || '').toLowerCase();

        if (subcmd === 'join') {
            const user = db.getUser(sender);
            const level = Math.floor((user.exp || 0) / 1000) + 1;

            const text = `
🏟️ *ARENA JOINED!*

👤 Player: @${sender.split('@')[0]}
📊 Level: ${level}
💰 Coins: ${formatNumber(user.koin || 0)}

Ketik *.arena fight* untuk mulai battle!
            `.trim();

            return sendMessage(jid, { text, mentions: [sender] }, { quoted: msg });
        }

        if (subcmd === 'stats') {
            const user = db.getUser(sender);
            const level = Math.floor((user.exp || 0) / 1000) + 1;

            const text = `
🏟️ *ARENA STATS*

👤 @${sender.split('@')[0]}
📊 Level: ${level}
⭐ EXP: ${formatNumber(user.exp || 0)}
💰 Coins: ${formatNumber(user.koin || 0)}
⚔️ Wins: ${user.wins || 0}
💀 Losses: ${user.losses || 0}
📈 Win Rate: ${user.wins || 0} / ${(user.wins || 0) + (user.losses || 0)}
            `.trim();

            return sendMessage(jid, { text, mentions: [sender] }, { quoted: msg });
        }

        // Help
        return reply(jid, `
🏟️ *ARENA SYSTEM*

.arena join — Join arena
.arena fight — Start battle
.arena stats — Lihat stats
.arena leaderboard — Top fighters

💡 Kalah = Challenge orang lain!
        `.trim(), msg);
    },
};

// ============ CHALLENGE (on loss) ============
const challenge = {
    name: 'challenge',
    category: 'game',
    description: 'Challenge setelah kalah',
    aliases: ['tantang'],
    execute: async (ctx) => {
        const { jid, sender, args, msg, isGroup } = ctx;

        if (!isGroup) return reply(jid, '❌ Challenge hanya bisa di grup!', msg);

        const target = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        if (!target) return reply(jid, '❌ Tag lawan kamu!\n\n.challenge @user', msg);

        const user = db.getUser(sender);
        if ((user.losses || 0) === 0) {
            return reply(jid, '❌ Kamu belum pernah kalah! Ga bisa challenge.', msg);
        }

        const text = `
⚔️ *CHALLENGE!*

@${sender.split('@')[0]} (💀 ${user.losses || 0} losses)
menantang
@${target.split('@')[0]}!

Ketik *.battle accept* untuk terima
Ketik *.battle decline* untuk tolak

🔥 "Revenge match!"
        `.trim();

        return sendMessage(jid, { text, mentions: [sender, target] }, { quoted: msg });
    },
};

// ============ TOSS (Coinflip for coins) ============
const toss = {
    name: 'toss',
    category: 'game',
    description: 'Toss koin untuk coins',
    aliases: ['lempar'],
    execute: async (ctx) => {
        const { jid, sender, args, msg } = ctx;
        const bet = parseInt(args[0]) || 100;

        if (bet < 10) return reply(jid, '❌ Minimum bet: 10 coins!', msg);

        const user = db.getUser(sender);
        if ((user.koin || 0) < bet) {
            return reply(jid, `❌ Coins tidak cukup! (Balance: ${user.koin || 0})`, msg);
        }

        const result = Math.random() < 0.5 ? 'heads' : 'tails';
        const won = Math.random() < 0.5; // 50% chance

        const reward = won ? bet : -bet;
        user.koin = (user.koin || 0) + reward;
        db.saveUser(sender, user);

        const text = `
🪙 *COIN TOSS*

${result === 'heads' ? '👑' : '💰'} Result: *${result.toUpperCase()}*

${won ? '🎉 *KAMU MENANG!*' : '😢 *KAMU KALAH!*'}
${reward >= 0 ? '💰' : '💸'} ${reward >= 0 ? '+' : ''}${reward} coins

💰 Balance: ${formatNumber(user.koin)} coins
        `.trim();

        await sendMessage(jid, { text }, { quoted: msg });
    },
};

// ============ BET (Player vs Player bet) ============
const bet = {
    name: 'bet',
    category: 'game',
    description: 'Bet dengan player lain',
    aliases: ['taruhan'],
    execute: async (ctx) => {
        const { jid, sender, args, msg, isGroup } = ctx;

        if (!isGroup) return reply(jid, '❌ Bet hanya bisa di grup!', msg);

        const target = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        const amount = parseInt(args[1]) || 100;

        if (!target) return reply(jid, '❌ Usage: .bet @user <amount>', msg);
        if (target === sender) return reply(jid, '❌ Ga bisa bet sama diri sendiri!', msg);
        if (amount < 10) return reply(jid, '❌ Minimum bet: 10 coins!', msg);

        const user = db.getUser(sender);
        const targetUser = db.getUser(target);

        if ((user.koin || 0) < amount) return reply(jid, `❌ Coins kamu tidak cukup! (${user.koin || 0})`, msg);
        if ((targetUser.koin || 0) < amount) return reply(jid, `❌ Coins lawan tidak cukup! (${targetUser.koin || 0})`, msg);

        // Random winner
        const winner = Math.random() < 0.5 ? sender : target;
        const loser = winner === sender ? target : sender;

        const winnerUser = db.getUser(winner);
        const loserUser = db.getUser(loser);

        winnerUser.koin = (winnerUser.koin || 0) + amount;
        loserUser.koin = (loserUser.koin || 0) - amount;

        db.saveUser(winner, winnerUser);
        db.saveUser(loser, loserUser);

        const text = `
🎰 *BET RESULT*

${sender.split('@')[0]} vs ${target.split('@')[0]}
💰 Amount: ${amount} coins

🏆 *${winner.split('@')[0]} MENANG!*

🎉 +${amount} coins
💀 -${amount} coins
        `.trim();

        return sendMessage(jid, { text, mentions: [sender, target] }, { quoted: msg });
    },
};

module.exports = { commands: { battle, arena, challenge, toss, bet } };
