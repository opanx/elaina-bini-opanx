/**
 * ELAINA BOT — Enhanced Game System v4.1.0
 * 15+ New Games: Tebak Gambar, Slot, RPG, Card, Quiz, Mining, etc.
 * Credits: FallZx Infinity × Opanx 🐙
 */

const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════
// DATABASE HELPERS
// ═══════════════════════════════════════════════

const DB_PATH = path.join(__dirname, '../database/userprofile.json');
const GAME_DB = path.join(__dirname, '../database/gamestate.json');

function loadDB(p, def = {}) {
    try { return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : def; }
    catch { return def; }
}

function saveDB(p, data) {
    try { fs.writeFileSync(p, JSON.stringify(data, null, 2)); } catch {}
}

function getUser(jid) {
    const db = loadDB(DB_PATH);
    if (!db[jid]) db[jid] = { name: '', exp: 0, koin: 0, level: 1, last_daily: 0, wins: 0, losses: 0, streak: 0 };
    return db[jid];
}

function saveUser(jid, data) {
    const db = loadDB(DB_PATH);
    db[jid] = data;
    saveDB(DB_PATH, db);
}

function getGameState() { return loadDB(GAME_DB); }
function saveGameState(s) { saveDB(GAME_DB, s); }

// ═══════════════════════════════════════════════
// 1. TEBAK GAMBAR
// ═══════════════════════════════════════════════

const _tebakGambarDB = [
    { q: '🖼️ Gambar ini menunjukkan hewan apa?', a: 'kucing', hint: 'Hewan peliharaan suka mengeong', img: 'https://placekitten.com/400/300' },
    { q: '🖼️ Gambar ini menunjukkan bunga apa?', a: 'mawar', hint: 'Bunga merah simbol cinta', img: 'https://placehold.co/400x300/FF6B6B/fff?text=Mawar' },
    { q: '🖼️ Gambar ini menunjukkan buah apa?', a: 'apel', hint: 'Buah merah favorit dokter', img: 'https://placehold.co/400x300/FF4444/fff?text=Apel' },
    { q: '🖼️ Gambar ini menunjukkan negara mana?', a: 'indonesia', hint: 'Merah putih', img: 'https://placehold.co/400x300/FF0000/fff?text=🇮🇩' },
    { q: '🖼️ Gambar ini menunjukkan kendaraan apa?', a: 'mobil', hint: 'Kendaraan 4 roda', img: 'https://placehold.co/400x300/333/fff?text=🚗' },
];

function tebakGambar() {
    const q = _tebakGambarDB[Math.floor(Math.random() * _tebakGambarDB.length)];
    return { ...q, reward: 100, time: 60 };
}

// ═══════════════════════════════════════════════
// 2. SLOT MACHINE (Enhanced)
// ═══════════════════════════════════════════════

function slotMachine(bet = 100) {
    const symbols = ['🍒', '🍋', '🍊', '🍇', '🍉', '💎', '7️⃣', '🌟', '🔥'];
    const s1 = symbols[Math.floor(Math.random() * symbols.length)];
    const s2 = symbols[Math.floor(Math.random() * symbols.length)];
    const s3 = symbols[Math.floor(Math.random() * symbols.length)];
    
    let reward = 0;
    let multiplier = 0;
    let result = '';
    
    if (s1 === s2 && s2 === s3) {
        if (s1 === '💎') { multiplier = 10; result = '💎 *MEGA JACKPOT!*'; }
        else if (s1 === '7️⃣') { multiplier = 7; result = '7️⃣ *LUCKY 7!*'; }
        else if (s1 === '🌟') { multiplier = 5; result = '🌟 *STAR JACKPOT!*'; }
        else { multiplier = 3; result = '🎉 *JACKPOT!*'; }
    } else if (s1 === s2 || s2 === s3 || s1 === s3) {
        multiplier = 2;
        result = '✨ *PAIR!*';
    } else {
        multiplier = 0;
        result = '😢 *NO MATCH*';
    }
    
    reward = bet * multiplier;
    
    return { s1, s2, s3, result, reward, multiplier, bet };
}

// ═══════════════════════════════════════════════
// 3. DAILY REWARDS
// ═══════════════════════════════════════════════

function dailyReward(jid) {
    const user = getUser(jid);
    const now = Date.now();
    const cooldown = 24 * 60 * 60 * 1000;
    
    if (now - (user.last_daily || 0) < cooldown) {
        const remaining = cooldown - (now - (user.last_daily || 0));
        const hours = Math.floor(remaining / 3600000);
        const minutes = Math.floor((remaining % 3600000) / 60000);
        return { success: false, hours, minutes };
    }
    
    const streak = (user.streak || 0) + 1;
    const baseReward = 50 + Math.floor(Math.random() * 150);
    const streakBonus = Math.min(streak * 10, 100);
    const totalReward = baseReward + streakBonus;
    const expReward = 20 + Math.floor(Math.random() * 30);
    
    user.koin = (user.koin || 0) + totalReward;
    user.exp = (user.exp || 0) + expReward;
    user.last_daily = now;
    user.streak = streak;
    saveUser(jid, user);
    
    return { success: true, reward: totalReward, exp: expReward, streak, base: baseReward, bonus: streakBonus };
}

// ═══════════════════════════════════════════════
// 4. TRIVIA QUIZ
// ═══════════════════════════════════════════════

const _triviaDB = [
    { q: 'Berapa hasil dari 15 × 13?', a: '195', options: ['185', '195', '205', '175'] },
    { q: 'Planet ke-7 dari matahari?', a: ' uranus', options: ['Neptunus', 'Uranus', 'Saturnus', 'Jupiter'] },
    { q: 'Ibukota Jepang?', a: 'Tokyo', options: ['Osaka', 'Tokyo', 'Kyoto', 'Seoul'] },
    { q: 'Siapa penemu lampu?', a: 'Thomas Edison', options: ['Tesla', 'Edison', 'Newton', 'Einstein'] },
    { q: '2^10 = ?', a: '1024', options: ['512', '1024', '2048', '256'] },
    { q: 'Band terkenal dari Inggris, nama hewan?', a: 'The Beatles', options: ['The Rolling Stones', 'The Beatles', 'The Eagles', 'The Sharks'] },
    { q: 'Bahasa pemrograman untuk AI?', a: 'Python', options: ['Java', 'Python', 'C++', 'Ruby'] },
    { q: 'Logo Apple bentuknya?', a: 'Apel gigit', options: ['Apel utuh', 'Apel gigit', 'Apel setengah', 'Apel kecil'] },
    { q: 'Sungai terpanjang di dunia?', a: 'Nil', options: ['Amazon', 'Nil', 'Mississippi', 'Yangtze'] },
    { q: 'Lambang kimia untuk emas?', a: 'Au', options: ['Ag', 'Au', 'Fe', 'Cu'] },
];

function triviaQuiz() {
    const q = _triviaDB[Math.floor(Math.random() * _triviaDB.length)];
    return { ...q, reward: 75, time: 30 };
}

// ═══════════════════════════════════════════════
// 5. MATH CHALLENGE
// ═══════════════════════════════════════════════

function mathChallenge(difficulty = 'easy') {
    const ops = ['+', '-', '×'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a, b, answer;
    
    if (difficulty === 'easy') {
        a = Math.floor(Math.random() * 20) + 1;
        b = Math.floor(Math.random() * 20) + 1;
    } else if (difficulty === 'medium') {
        a = Math.floor(Math.random() * 50) + 10;
        b = Math.floor(Math.random() * 50) + 10;
    } else {
        a = Math.floor(Math.random() * 100) + 50;
        b = Math.floor(Math.random() * 100) + 50;
    }
    
    if (op === '+') answer = a + b;
    else if (op === '-') answer = a - b;
    else { answer = a * b; }
    
    const reward = difficulty === 'easy' ? 30 : difficulty === 'medium' ? 75 : 150;
    
    return { question: `${a} ${op} ${b}`, answer: String(answer), reward, time: 20, difficulty };
}

// ═══════════════════════════════════════════════
// 6. LUCKY SPIN
// ═══════════════════════════════════════════════

function luckySpin(jid) {
    const user = getUser(jid);
    const cost = 50;
    
    if ((user.koin || 0) < cost) return { success: false, reason: 'insufficient' };
    
    user.koin -= cost;
    
    const prizes = [
        { label: '💎 Diamond', reward: 500, chance: 5 },
        { label: '👑 Crown', reward: 300, chance: 10 },
        { label: '🌟 Star', reward: 200, chance: 15 },
        { label: '🔥 Fire', reward: 100, chance: 25 },
        { label: '🍀 Lucky', reward: 75, chance: 20 },
        { label: '💀 Bust', reward: 0, chance: 25 },
    ];
    
    const rand = Math.random() * 100;
    let cumulative = 0;
    let won = prizes[prizes.length - 1];
    
    for (const p of prizes) {
        cumulative += p.chance;
        if (rand <= cumulative) { won = p; break; }
    }
    
    user.koin += won.reward;
    user.exp = (user.exp || 0) + (won.reward > 0 ? 10 : 0);
    saveUser(jid, user);
    
    return { success: true, prize: won.label, reward: won.reward, cost };
}

// ═══════════════════════════════════════════════
// 7. MINING SYSTEM
// ═══════════════════════════════════════════════

function mining(jid) {
    const user = getUser(jid);
    const now = Date.now();
    const cooldown = 30 * 60 * 1000; // 30 minutes
    
    if (user.last_mine && now - user.last_mine < cooldown) {
        const remaining = cooldown - (now - user.last_mine);
        const mins = Math.ceil(remaining / 60000);
        return { success: false, minutes: mins };
    }
    
    const finds = [
        { item: '🪨 Batu', reward: 10, chance: 40 },
        { item: '⛏️ Besi', reward: 25, chance: 25 },
        { item: '💎 Berlian', reward: 100, chance: 10 },
        { item: '🥇 Emas', reward: 75, chance: 15 },
        { item: '💀 Tengkorak', reward: 5, chance: 10 },
    ];
    
    const rand = Math.random() * 100;
    let cumulative = 0;
    let found = finds[finds.length - 1];
    
    for (const f of finds) {
        cumulative += f.chance;
        if (rand <= cumulative) { found = f; break; }
    }
    
    user.koin = (user.koin || 0) + found.reward;
    user.exp = (user.exp || 0) + 5;
    user.last_mine = now;
    saveUser(jid, user);
    
    return { success: true, item: found.item, reward: found.reward };
}

// ═══════════════════════════════════════════════
// 8. BET / COINFLIP
// ═══════════════════════════════════════════════

function coinflip(jid, choice, amount) {
    const user = getUser(jid);
    
    if ((user.koin || 0) < amount) return { success: false, reason: 'insufficient' };
    
    user.koin -= amount;
    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    const won = choice === result;
    
    if (won) user.koin += amount * 2;
    
    user.exp = (user.exp || 0) + (won ? 15 : 5);
    if (won) user.wins = (user.wins || 0) + 1;
    else user.losses = (user.losses || 0) + 1;
    
    saveUser(jid, user);
    
    return { success: true, result, won, reward: won ? amount : -amount, balance: user.koin };
}

// ═══════════════════════════════════════════════
// 9. DICE GAME
// ═══════════════════════════════════════════════

function diceGame(bet = 100) {
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const total = d1 + d2;
    
    let result, reward;
    
    if (total === 12) { result = '🎯 DOUBLE SIX!'; reward = bet * 6; }
    else if (total === 11) { result = '🔥 LUCKY ELEVEN!'; reward = bet * 5; }
    else if (total === 10) { result = '✨ BIG WIN!'; reward = bet * 4; }
    else if (total >= 8) { result = '📈 HIGH ROLLER!'; reward = bet * 2; }
    else if (total <= 4) { result = '📉 LOW BALL!'; reward = bet * 3; }
    else { result = '😐 MIDDLE GROUND'; reward = 0; }
    
    return { d1, d2, total, result, reward, bet };
}

// ═══════════════════════════════════════════════
// 10. WORD CHAIN
// ═══════════════════════════════════════════════

function wordChain(lastWord = '') {
    const words = [
        'API', 'OBOR', 'RODA', 'ANGIN', 'NUANSA', 'ASAP', 'PARU', 'UNDER', 'DENYUT', 'TARUH',
        'HATI', 'IKAN', 'NAFAS', 'SUKU', 'KUNCI', 'ILMU', 'MUARA', 'RUMAH', 'HASIL', 'LANTAI',
    ];
    
    let word;
    if (lastWord) {
        const lastChar = lastWord.slice(-1).toUpperCase();
        word = words.find(w => w.startsWith(lastChar) && w !== lastWord) || words[Math.floor(Math.random() * words.length)];
    } else {
        word = words[Math.floor(Math.random() * words.length)];
    }
    
    return { word, hint: `Huruf awal: ${word[0]}`, reward: 50, time: 30 };
}

// ═══════════════════════════════════════════════
// 11. GUESS NUMBER
// ═══════════════════════════════════════════════

function guessNumber(range = 100) {
    const answer = Math.floor(Math.random() * range) + 1;
    return { answer, range, reward: range * 2, time: 30 };
}

function checkGuess(guess, answer) {
    if (guess === answer) return { correct: true, message: '🎯 *BENAR!*' };
    if (guess < answer) return { correct: false, message: '📈 *Lebih besar!*' };
    return { correct: false, message: '📉 *Lebih kecil!*' };
}

// ═══════════════════════════════════════════════
// 12. BATTLE SYSTEM (PvP)
// ═══════════════════════════════════════════════

function pvpBattle(p1name, p2name) {
    const attacks = ['⚔️ Slash', '🗡️ Stab', '🏹 Shoot', '👊 Punch', '🦶 Kick', '🔥 Fire', '❄️ Ice', '⚡ Lightning'];
    const defends = ['🛡️ Block', '💨 Dodge', '🔄 Counter'];
    
    let p1hp = 100, p2hp = 100;
    const log = [];
    let turn = 0;
    
    while (p1hp > 0 && p2hp > 0 && turn < 15) {
        turn++;
        const atk1 = 8 + Math.floor(Math.random() * 18);
        const def1 = Math.floor(Math.random() * 8);
        const dmg1 = Math.max(1, atk1 - def1);
        p2hp = Math.max(0, p2hp - dmg1);
        
        const atk2 = 8 + Math.floor(Math.random() * 18);
        const def2 = Math.floor(Math.random() * 8);
        const dmg2 = Math.max(1, atk2 - def2);
        p1hp = Math.max(0, p1hp - dmg2);
        
        log.push(`Turn ${turn}: ${p1name} -${dmg2}HP | ${p2name} -${dmg1}HP`);
    }
    
    const winner = p1hp > p2hp ? p1name : p2hp > p1hp ? p2name : null;
    
    return { p1hp, p2hp, winner, log, turns: turn };
}

// ═══════════════════════════════════════════════
// 13. SNAKE & LADDER
// ═══════════════════════════════════════════════

function snakeLadder(jid, action = 'roll') {
    const state = getGameState();
    const key = `snake_${jid}`;
    
    if (!state[key]) {
        state[key] = { pos: 0, turn: 0 };
    }
    
    if (action === 'roll') {
        const dice = Math.floor(Math.random() * 6) + 1;
        let newPos = Math.min(100, state[key].pos + dice);
        
        // Ladders (bonus)
        const ladders = { 4: 14, 9: 31, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 80: 100 };
        // Snakes (penalty)
        const snakes = { 16: 6, 47: 26, 49: 11, 56: 53, 62: 19, 87: 24, 93: 73, 95: 75 };
        
        let message = '';
        if (ladders[newPos]) { message = `🪜 LADDER! Naik ke ${ladders[newPos]}!`; newPos = ladders[newPos]; }
        else if (snakes[newPos]) { message = `🐍 SNAKE! Turun ke ${snakes[newPos]}!`; newPos = snakes[newPos]; }
        
        state[key].pos = newPos;
        state[key].turn++;
        
        const won = newPos >= 100;
        if (won) {
            const user = getUser(jid);
            user.koin = (user.koin || 0) + 200;
            user.exp = (user.exp || 0) + 50;
            saveUser(jid, user);
            delete state[key];
        }
        
        saveGameState(state);
        
        return {
            dice, newPos, message, won,
            visual: generateBoardVisual(newPos),
            reward: won ? 200 : 0
        };
    }
    
    return { pos: state[key].pos, turn: state[key].turn };
}

function generateBoardVisual(playerPos) {
    let board = '';
    for (let row = 9; row >= 0; row--) {
        let line = '';
        for (let col = 0; col < 10; col++) {
            const num = row * 10 + col + 1;
            if (num === playerPos) line += '🧑';
            else if (num % 10 === 0 || num % 10 === 1) line += '🟩';
            else line += '⬜';
        }
        board += line + '\n';
    }
    return board;
}

// ═══════════════════════════════════════════════
// 14. MEMORY GAME
// ═══════════════════════════════════════════════

function memoryGame(jid) {
    const emojis = ['🍎', '🍊', '🍋', '🍇', '🍉', '🍓', '🫐', '🥝'];
    const selected = emojis.sort(() => Math.random() - 0.5).slice(0, 4);
    const pairs = [...selected, ...selected].sort(() => Math.random() - 0.5);
    
    const state = getGameState();
    state[`mem_${jid}`] = { pairs, revealed: Array(8).fill(false), matched: Array(8).fill(false), moves: 0, startTime: Date.now() };
    saveGameState(state);
    
    return { pairs: pairs.map((e, i) => ({ index: i, emoji: '❓' })), time: 60 };
}

function memoryReveal(jid, index) {
    const state = getGameState();
    const key = `mem_${jid}`;
    const game = state[key];
    
    if (!game) return { error: 'Game not found' };
    if (game.matched[index]) return { error: 'Already matched' };
    
    game.revealed[index] = true;
    game.moves++;
    
    const revealedIndices = game.revealed.reduce((acc, r, i) => r && !game.matched[i] ? [...acc, i] : acc, []);
    
    if (revealedIndices.length === 2) {
        const [i1, i2] = revealedIndices;
        if (game.pairs[i1] === game.pairs[i2]) {
            game.matched[i1] = game.matched[i2] = true;
            game.revealed[i1] = game.revealed[i2] = false;
            
            const allMatched = game.matched.every(m => m);
            if (allMatched) {
                const timeBonus = Math.max(0, 300 - Math.floor((Date.now() - game.startTime) / 1000));
                const reward = 100 + timeBonus;
                const user = getUser(jid);
                user.koin = (user.koin || 0) + reward;
                user.exp = (user.exp || 0) + 30;
                saveUser(jid, user);
                delete state[key];
                saveGameState(state);
                return { matched: true, allDone: true, reward, moves: game.moves };
            }
            
            saveGameState(state);
            return { matched: true, allDone: false, moves: game.moves };
        } else {
            setTimeout(() => {
                const s = getGameState();
                if (s[key]) {
                    s[key].revealed[i1] = false;
                    s[key].revealed[i2] = false;
                    saveGameState(s);
                }
            }, 1000);
        }
    }
    
    saveGameState(state);
    return { matched: false, moves: game.moves };
}

// ═══════════════════════════════════════════════
// 15. PROFILE CARD
// ═══════════════════════════════════════════════

function getProfile(jid, pushName) {
    const user = getUser(jid);
    const level = Math.floor((user.exp || 0) / 1000) + 1;
    const expProgress = ((user.exp || 0) % 1000) / 10;
    const winRate = (user.wins || 0) + (user.losses || 0) > 0 
        ? Math.round(((user.wins || 0) / ((user.wins || 0) + (user.losses || 0))) * 100) 
        : 0;
    
    return {
        name: user.name || pushName || jid.split('@')[0],
        level,
        exp: user.exp || 0,
        expProgress,
        koin: user.koin || 0,
        wins: user.wins || 0,
        losses: user.losses || 0,
        winRate,
        streak: user.streak || 0,
    };
}

// ═══════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════

module.exports = {
    // Games
    tebakGambar,
    slotMachine,
    triviaQuiz,
    mathChallenge,
    luckySpin,
    mining,
    coinflip,
    diceGame,
    wordChain,
    guessNumber,
    checkGuess,
    pvpBattle,
    snakeLadder,
    memoryGame,
    memoryReveal,
    
    // Systems
    dailyReward,
    getProfile,
    getUser,
    saveUser,
};
