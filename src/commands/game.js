'use strict';
/**
 * Elaina Bot v4.0 — Game Commands
 * Tebakkata, Suit, Slot, Daily, etc.
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

        // Wait for answer (simplified - in production use message collector)
        // For now, just show the game
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

        // Update user coins
        const user = db.getUser(sender);
        user.koin = (user.koin || 0) + reward;
        db.saveUser(sender, user);

        const text = `
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

        await sendMessage(jid, { text }, { quoted: msg });
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
        const cooldown = 24 * 60 * 60 * 1000; // 24 hours

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

        const text = `
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

        await sendMessage(jid, { text }, { quoted: msg });
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

        // Get all users from database
        let users = [];
        try {
            const db_data = require('../database/engine');
            const userPath = './database/userprofile.json';
            const fs = require('fs');
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
        const expNext = level * 1000;
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

module.exports = { commands: { tebakkata, suit, slot, daily, leaderboard, profile } };
