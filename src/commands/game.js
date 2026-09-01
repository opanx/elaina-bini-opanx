'use strict';
/**
 * Elaina Bot v4.0 — Game Commands (UPDATED)
 * Tebakkata, Suit, Slot, Daily, Ludo, Quiz, Adventure, etc.
 */

const { sendMessage, reply } = require('../core/connection');
const { random, randomInt, formatNumber } = require('../lib/functions');
const db = require('../database/engine');
const config = require('../config/settings');

// ============ TEBAK KATA ============
const wordBank = [
    { word: 'ALGORITMA', hint: 'Serangkaian langkah untuk menyelesaikan masalah' },
    { word: 'JAVASCRIPT', hint: 'Bahasa pemrograman untuk web' },
    { word: 'WHATSAPP', hint: 'Aplikasi chatting populer' },
    { word: 'KOMPUTER', hint: 'Mesin untuk menghitung' },
    { word: 'INTERNET', hint: 'Jaringan global' },
    { word: 'PROGRAM', hint: 'Kumpulan instruksi untuk komputer' },
    { word: 'DATABASE', hint: 'Tempat menyimpan data' },
    { word: 'SERVER', hint: 'Mesin yang melayani permintaan' },
    { word: 'PYTHON', hint: 'Bahasa pemrograman yang populer' },
    { word: 'ANDROID', hint: 'Sistem operasi mobile dari Google' },
    { word: 'BROWSER', hint: 'Untuk menjelajahi web' },
    { word: 'KEYBOARD', hint: 'Untuk mengetik' },
    { word: 'MONITOR', hint: 'Layar komputer' },
    { word: 'PRINTER', hint: 'Untuk mencetak dokumen' },
    { word: 'STORAGE', hint: 'Tempat penyimpanan data' },
];

const tebakkata = {
    name: 'tebakkata',
    category: 'game',
    description: 'Tebak kata',
    aliases: ['tk', 'wordle'],
    execute: async (ctx) => {
        const { jid, msg } = ctx;
        const item = random(wordBank);
        const word = item.word;
        const hint = item.hint;
        const reward = 50 + word.length * 10;

        const text = `
╭─── 🎮 *TEBAK KATA* ──────────╮
│                                  │
│  📝 *${'_ '.repeat(word.length).trim()}* (${word.length} huruf)
│  💡 Hint: ${hint}
│                                  │
│  💰 Reward: ${reward} coins
│  ⏱️ Time: 60 detik
│                                  │
╰────────────────────────────────╯

> Ketik jawaban kamu!
        `.trim();

        await sendMessage(jid, { text }, { quoted: msg });
    },
};

// ============ SUIT ============
const suit = {
    name: 'suit',
    category: 'game',
    description: 'Rock Paper Scissors',
    aliases: ['rps', 'suitbot'],
    execute: async (ctx) => {
        const { jid, text, msg } = ctx;
        const choices = ['rock', 'paper', 'scissors'];
        const emojis = { rock: '🪨', paper: '📄', scissors: '✂️' };

        const userChoice = (text || '').toLowerCase();
        if (!choices.includes(userChoice)) {
            return reply(jid, `❌ Pilih: rock, paper, atau scissors\n\nContoh: .suit rock`, msg);
        }

        const botChoice = random(choices);
        let result = '';

        if (userChoice === botChoice) result = '🎲 *DRAW!*';
        else if (
            (userChoice === 'rock' && botChoice === 'scissors') ||
            (userChoice === 'paper' && botChoice === 'rock') ||
            (userChoice === 'scissors' && botChoice === 'paper')
        ) {
            result = '🎉 *KAMU MENANG!*';
        } else {
            result = '😢 *KAMU KALAH!*';
        }

        const text_reply = `
╭─── 🎮 *SUIT* ────────────────╮
│                                  │
│  Kamu: ${emojis[userChoice]} ${userChoice.toUpperCase()}
│  Bot:  ${emojis[botChoice]} ${botChoice.toUpperCase()}
│                                  │
│  Result: ${result}
│                                  │
╰────────────────────────────────╯
        `.trim();

        await sendMessage(jid, { text: text_reply }, { quoted: msg });
    },
};

// ============ SLOT ============
const slot = {
    name: 'slot',
    category: 'game',
    description: 'Slot machine',
    aliases: ['slotmachine'],
    execute: async (ctx) => {
        const { jid, sender, msg } = ctx;
        const symbols = ['🍒', '🍋', '🍊', '🍇', '🍉', '💎', '7️⃣'];
        const s1 = random(symbols);
        const s2 = random(symbols);
        const s3 = random(symbols);

        let reward = 0;
        let result = '';

        if (s1 === s2 && s2 === s3) {
            reward = s1 === '💎' ? 500 : s1 === '7️⃣' ? 300 : 100;
            result = `🎉 *JACKPOT!* +${reward} coins`;
        } else if (s1 === s2 || s2 === s3 || s1 === s3) {
            reward = 25;
            result = `✨ *Pair!* +${reward} coins`;
        } else {
            result = '😢 *No match*';
        }

        const user = db.getUser(sender);
        user.koin = (user.koin || 0) + reward;
        db.saveUser(sender, user);

        const text_reply = `
╭─── 🎰 *SLOT MACHINE* ────────╮
│                                  │
│  ╔═══════════════════╗          │
│  ║  [ ${s1} | ${s2} | ${s3} ]  ║          │
│  ╚═══════════════════╝          │
│                                  │
│  ${result}
│  💰 Balance: ${formatNumber(user.koin)} coins
│                                  │
╰────────────────────────────────╯
        `.trim();

        await sendMessage(jid, { text: text_reply }, { quoted: msg });
    },
};

// ============ DAILY ============
const daily = {
    name: 'daily',
    category: 'game',
    description: 'Claim daily reward',
    aliases: ['claim', 'dailyclaim'],
    execute: async (ctx) => {
        const { jid, sender, msg } = ctx;
        const user = db.getUser(sender);

        const now = Date.now();
        const lastDaily = user.last_daily || 0;
        const cooldown = 24 * 60 * 60 * 1000;

        if (now - lastDaily < cooldown) {
            const remaining = cooldown - (now - lastDaily);
            const hours = Math.floor(remaining / 3600000);
            const minutes = Math.floor((remaining % 3600000) / 60000);
            return reply(jid, `⏳ Daily claim sudah dipakai!\n\nCoba lagi dalam ${hours}j ${minutes}m`, msg);
        }

        const reward = randomInt(50, 200);
        const expReward = randomInt(10, 50);

        user.koin = (user.koin || 0) + reward;
        user.exp = (user.exp || 0) + expReward;
        user.last_daily = now;
        db.saveUser(sender, user);

        const text_reply = `
╭─── 🎁 *DAILY CLAIM* ─────────╮
│                                  │
│  ✅ Claim berhasil!
│                                  │
│  💰 +${reward} coins
│  ⭐ +${expReward} EXP
│                                  │
│  💰 Total: ${formatNumber(user.koin)} coins
│  ⭐ EXP: ${formatNumber(user.exp)}
│                                  │
╰────────────────────────────────╯
        `.trim();

        await sendMessage(jid, { text: text_reply }, { quoted: msg });
    },
};

// ============ LUDO ============
const ludo = {
    name: 'ludo',
    category: 'game',
    description: 'Main Ludo vs Bot',
    aliases: ['mainludo'],
    execute: async (ctx) => {
        const { jid, sender, text, msg } = ctx;
        const action = (text || '').toLowerCase();

        if (!action || !['roll', 'start'].includes(action)) {
            return reply(jid, `
╭─── 🎲 *LUDO* ────────────────╮
│                                  │
│  🎲 Ludo vs Bot
│                                  │
│  Cara main:
│  .ludo start — Mulai game
│  .ludo roll — Lempar dadu
│                                  │
│  🎯 Goal: Capai finish duluan!
│  💰 Reward: 100 coins (menang)
│                                  │
╰────────────────────────────────╯
            `.trim(), msg);
        }

        if (action === 'start') {
            const text_reply = `
╭─── 🎲 *LUDO STARTED* ────────╮
│                                  │
│  🟢 Kamu: Position 0
│  🔴 Bot:  Position 0
│                                  │
│  🎯 Goal: Capai position 100
│  🎲 Ketik .ludo roll untuk mulai
│                                  │
╰────────────────────────────────╯
            `.trim();
            return sendMessage(jid, { text: text_reply }, { quoted: msg });
        }

        if (action === 'roll') {
            const playerRoll = randomInt(1, 6);
            const botRoll = randomInt(1, 6);
            const playerPos = Math.min(100, playerRoll * 10); // Simplified
            const botPos = Math.min(100, botRoll * 10);

            let result = '';
            if (playerPos >= 100) result = '🎉 *KAMU MENANG!* +100 coins';
            else if (botPos >= 100) result = '😢 *BOT MENANG!*';
            else if (playerPos > botPos) result = '🟢 *Kamu unggul!*';
            else if (botPos > playerPos) result = '🔴 *Bot unggul!*';
            else result = '🟡 *Seri!*';

            const text_reply = `
╭─── 🎲 *LUDO ROLL* ───────────╮
│                                  │
│  🟢 Kamu rolled: ${playerRoll}
│     Position: ${playerPos}/100
│                                  │
│  🔴 Bot rolled: ${botRoll}
│     Position: ${botPos}/100
│                                  │
│  ${result}
│                                  │
╰────────────────────────────────╯
            `.trim();

            await sendMessage(jid, { text: text_reply }, { quoted: msg });
        }
    },
};

// ============ QUIZ ============
const quizBank = [
    { q: 'Ibukota Indonesia?', a: ['jakarta', 'dki jakarta'] },
    { q: 'Planet terdekat dari matahari?', a: ['merkurius', 'mercury'] },
    { q: 'Siapa presiden pertama RI?', a: ['soekarno'] },
    { q: '2 + 2 = ?', a: ['4'] },
    { q: 'Bahasa pemrograman paling populer?', a: ['javascript', 'python', 'java'] },
    { q: ' Gunung tertinggi di dunia?', a: ['everest', 'mt everest', 'mount everest'] },
    { q: 'Tahun kemerdekaan Indonesia?', a: ['1945'] },
    { q: 'Simbol kimia untuk air?', a: ['h2o'] },
    { q: 'Sungai terpanjang di dunia?', a: ['nil', 'nile', 'amazon'] },
    { q: 'Lambang negara Indonesia?', a: ['garuda'] },
];

const quiz = {
    name: 'quiz',
    category: 'game',
    description: 'Quiz pengetahuan',
    aliases: ['kuis', 'tebakpengetahuan'],
    execute: async (ctx) => {
        const { jid, text, msg } = ctx;
        const item = random(quizBank);
        const reward = 75;

        const text_reply = `
╭─── 🧠 *QUIZ* ────────────────╮
│                                  │
│  📝 *${item.q}*
│                                  │
│  💰 Reward: ${reward} coins
│  ⏱️ Time: 30 detik
│                                  │
╰────────────────────────────────╯

> Ketik jawaban kamu!
        `.trim();

        await sendMessage(jid, { text: text_reply }, { quoted: msg });
    },
};

// ============ ADVENTURE ============
const adventureZones = [
    { name: 'Hutan Gelap', level: 1, enemies: ['🐺 Wolf', '🦇 Bat', '🕷️ Spider'], reward: 30 },
    { name: 'Gua Gelap', level: 5, enemies: ['💀 Skeleton', '👻 Ghost', '🦇 Vampire'], reward: 60 },
    { name: 'Gunung Berapi', level: 10, enemies: ['🐉 Dragon', '🔥 Fire Golem', '👹 Ogre'], reward: 120 },
    { name: 'Kerajaan Bayangan', level: 20, enemies: ['💀 Lich', '👻 Wraith', '🦇 Death Bat'], reward: 250 },
    { name: 'Dunia Bawah', level: 30, enemies: ['😈 Demon', '🐉 Ancient Dragon', '💀 Reaper'], reward: 500 },
];

const adventure = {
    name: 'adventure',
    category: 'game',
    description: 'Petualangan RPG',
    aliases: ['adv', 'explore'],
    execute: async (ctx) => {
        const { jid, sender, text, msg } = ctx;
        const action = (text || '').toLowerCase();

        if (!action || action === 'help') {
            return reply(jid, `
╭─── ⚔️ *ADVENTURE* ───────────╮
│                                  │
│  🗺️ Zones:
│  1. Hutan Gelap (Lv.1) - 30💰
│  2. Gua Gelap (Lv.5) - 60💰
│  3. Gunung Berapi (Lv.10) - 120💰
│  4. Kerajaan Bayangan (Lv.20) - 250💰
│  5. Dunia Bawah (Lv.30) - 500💰
│                                  │
│  Commands:
│  .adv explore — Jelajahi
│  .adv battle — Lawan musuh
│  .adv status — Cek status
│                                  │
╰────────────────────────────────╯
            `.trim(), msg);
        }

        if (action === 'explore') {
            const zone = random(adventureZones);
            const enemy = random(zone.enemies);
            const damage = randomInt(10, 50);
            const reward = randomInt(zone.reward / 2, zone.reward);

            const user = db.getUser(sender);
            user.koin = (user.koin || 0) + reward;
            user.exp = (user.exp || 0) + randomInt(10, 30);
            db.saveUser(sender, user);

            const text_reply = `
╭─── ⚔️ *ADVENTURE* ───────────╮
│                                  │
│  🗺️ Zone: ${zone.name}
│  🎚️ Level: ${zone.level}
│                                  │
│  ⚔️ Enemy: ${enemy}
│  💥 Damage: ${damage}
│  💰 Loot: +${reward} coins
│  ⭐ EXP: +${randomInt(10, 30)}
│                                  │
│  ✅ Petualangan selesai!
│                                  │
╰────────────────────────────────╯
            `.trim();

            await sendMessage(jid, { text: text_reply }, { quoted: msg });
        }
    },
};

// ============ CASINO ============
const casino = {
    name: 'casino',
    category: 'game',
    description: 'Casino - Tebak angka',
    aliases: ['judi', 'bet'],
    execute: async (ctx) => {
        const { jid, sender, args, msg } = ctx;
        const bet = parseInt(args[0]) || 100;

        if (bet < 10) return reply(jid, '❌ Minimum bet: 10 coins!', msg);

        const user = db.getUser(sender);
        if ((user.koin || 0) < bet) return reply(jid, `❌ Coins tidak cukup! (Balance: ${user.koin || 0})`, msg);

        const botNum = randomInt(1, 10);
        const playerNum = randomInt(1, 10);
        const diff = Math.abs(playerNum - botNum);

        let reward = 0;
        let result = '';

        if (playerNum === botNum) {
            reward = bet * 3;
            result = '🎯 *JACKPOT!* Same number!';
        } else if (diff <= 2) {
            reward = bet * 2;
            result = '✨ *Close!* Near miss!';
        } else if (playerNum > botNum) {
            reward = bet;
            result = '🎉 *Higher wins!*';
        } else {
            reward = -bet;
            result = '😢 *Lower loses!*';
        }

        user.koin = (user.koin || 0) + reward;
        db.saveUser(sender, user);

        const text_reply = `
╭─── 🎰 *CASINO* ──────────────╮
│                                  │
│  🎲 Your Number: *${playerNum}*
│  🤖 Bot Number: *${botNum}*
│                                  │
│  ${result}
│  ${reward >= 0 ? '💰' : '💸'} ${reward >= 0 ? '+' : ''}${reward} coins
│                                  │
│  💰 Balance: ${formatNumber(user.koin)} coins
│                                  │
╰────────────────────────────────╯
        `.trim();

        await sendMessage(jid, { text: text_reply }, { quoted: msg });
    },
};

// ============ DICE ============
const dice = {
    name: 'dice',
    category: 'game',
    description: 'Lempar dadu',
    aliases: ['dadu'],
    execute: async (ctx) => {
        const { jid, msg } = ctx;
        const d1 = randomInt(1, 6);
        const d2 = randomInt(1, 6);
        const total = d1 + d2;

        const diceEmoji = {
            1: '⚀', 2: '⚁', 3: '⚂', 4: '⚃', 5: '⚄', 6: '⚅'
        };

        const text_reply = `
╭─── 🎲 *DICE* ────────────────╮
│                                  │
│  ${diceEmoji[d1]} + ${diceEmoji[d2]} = *${total}*
│                                  │
│  ${total >= 10 ? '🎉 Big!' : total <= 4 ? '📉 Small!' : '📊 Medium'}
│                                  │
╰────────────────────────────────╯
        `.trim();

        await sendMessage(jid, { text: text_reply }, { quoted: msg });
    },
};

// ============ COINFLIP ============
const coinflip = {
    name: 'coinflip',
    category: 'game',
    description: 'Flip koin',
    aliases: ['flip', 'koin'],
    execute: async (ctx) => {
        const { jid, text, msg } = ctx;
        const choice = (text || '').toLowerCase();

        if (!['heads', 'tails', 'angka', 'gambar'].includes(choice)) {
            return reply(jid, '❌ Pilih: heads/angka atau tails/gambar\n\nContoh: .coinflip heads', msg);
        }

        const result = Math.random() < 0.5 ? 'heads' : 'tails';
        const resultEmoji = result === 'heads' ? '🪙' : '💰';
        const won = (choice === 'heads' || choice === 'angka') && result === 'heads' ||
                    (choice === 'tails' || choice === 'gambar') && result === 'tails';

        const text_reply = `
╭─── 🪙 *COINFLIP* ────────────╮
│                                  │
│  Kamu pilih: ${choice}
│  Result: ${resultEmoji} *${result.toUpperCase()}*
│                                  │
│  ${won ? '🎉 *KAMU MENANG!*' : '😢 *KAMU KALAH!*'}
│                                  │
╰────────────────────────────────╯
        `.trim();

        await sendMessage(jid, { text: text_reply }, { quoted: msg });
    },
};

// ============ RPS TOURNAMENT ============
const rpsTournament = {
    name: 'rps',
    category: 'game',
    description: 'Rock Paper Scissors Tournament',
    aliases: ['tournament'],
    execute: async (ctx) => {
        const { jid, sender, text, msg } = ctx;
        const choices = ['rock', 'paper', 'scissors'];
        const emojis = { rock: '🪨', paper: '📄', scissors: '✂️' };

        const userChoice = (text || '').toLowerCase();
        if (!choices.includes(userChoice)) {
            return reply(jid, `❌ Pilih: rock, paper, scissors\n\nContoh: .rps rock`, msg);
        }

        // Best of 3
        let userWins = 0;
        let botWins = 0;
        let rounds = [];

        for (let i = 0; i < 3; i++) {
            const botChoice = random(choices);
            let roundResult = '';

            if (userChoice === botChoice) roundResult = 'Draw';
            else if (
                (userChoice === 'rock' && botChoice === 'scissors') ||
                (userChoice === 'paper' && botChoice === 'rock') ||
                (userChoice === 'scissors' && botChoice === 'paper')
            ) {
                userWins++;
                roundResult = 'Win';
            } else {
                botWins++;
                roundResult = 'Lose';
            }

            rounds.push(`R${i + 1}: ${emojis[userChoice]} vs ${emojis[botChoice]} → ${roundResult}`);
        }

        const winner = userWins > botWins ? 'KAMU' : botWins > userWins ? 'BOT' : 'DRAW';

        const text_reply = `
╭─── 🏆 *RPS TOURNAMENT* ──────╮
│                                  │
│  ${rounds.join('\n│  ')}
│                                  │
│  Score: ${userWins} - ${botWins}
│  Winner: *${winner}*
│                                  │
╰────────────────────────────────╯
        `.trim();

        await sendMessage(jid, { text: text_reply }, { quoted: msg });
    },
};

// ============ LEADERBOARD ============
const leaderboard = {
    name: 'leaderboard',
    category: 'game',
    description: 'Top users',
    aliases: ['top', 'lb', 'ranking'],
    execute: async (ctx) => {
        const { jid, msg } = ctx;

        let users = [];
        try {
            const fs = require('fs');
            const userPath = './database/userprofile.json';
            if (fs.existsSync(userPath)) {
                const data = JSON.parse(fs.readFileSync(userPath, 'utf8'));
                users = Object.entries(data)
                    .map(([jid, u]) => ({ jid, name: u.name || jid.split('@')[0], koin: u.koin || 0, exp: u.exp || 0 }))
                    .sort((a, b) => b.koin - a.koin)
                    .slice(0, 10);
            }
        } catch {}

        if (users.length === 0) {
            return reply(jid, '📊 Belum ada data user.', msg);
        }

        let text = '📊 *LEADERBOARD*\n\n';
        users.forEach((u, i) => {
            const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`;
            text += `${medal} ${u.name}\n   💰 ${formatNumber(u.koin)} coins | ⭐ ${formatNumber(u.exp)} EXP\n`;
        });

        await sendMessage(jid, { text }, { quoted: msg });
    },
};

// ============ PROFILE ============
const profile = {
    name: 'profile',
    category: 'game',
    description: 'Lihat profil',
    aliases: ['profil', 'me'],
    execute: async (ctx) => {
        const { jid, sender, pushName, msg } = ctx;
        const user = db.getUser(sender);

        const level = Math.floor((user.exp || 0) / 1000) + 1;
        const expProgress = ((user.exp || 0) % 1000) / 10;

        const text = `
╭─── 👤 *PROFILE* ─────────────╮
│                                  │
│  📛 Name: ${user.name || pushName}
│  📱 Number: ${sender.split('@')[0]}
│  📊 Level: ${level}
│  ⭐ EXP: ${formatNumber(user.exp || 0)}
│  💰 Coins: ${formatNumber(user.koin || 0)}
│  📈 Progress: ${expProgress}% to Lv.${level + 1}
│                                  │
╰────────────────────────────────╯
        `.trim();

        await sendMessage(jid, { text }, { quoted: msg });
    },
};

module.exports = { commands: { 
    tebakkata, suit, slot, daily, ludo, quiz, adventure, 
    casino, dice, coinflip, rpsTournament, leaderboard, profile 
}};
