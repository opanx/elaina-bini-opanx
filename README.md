# 🌙 Elaina Bot — The Primary v4.1.0

> **Your AI-Powered WhatsApp Butler** | Rebuilt by Opanx 🐙

## ⚡ Install (Pterodactyl / VPS / Local)

```bash
# 1. Clone
git clone https://github.com/opanx/elaina-bini-opanx.git
cd elaina-bini-opanx

# 2. Install
npm install

# 3. Edit settings.js (buka di file manager, edit langsung!)
#    Ganti nomor owner, nama bot, API keys, dll.

# 4. Run
npm start
```

**Done!** Ga perlu `cp .env`, langsung edit `settings.js`!

## 📝 Edit settings.js

Buka `settings.js` di file manager, edit bagian ini:

```js
global.owner = "6285706665203"        // Nomor lu
global.namaowner = "Panxcz"           // Nama lu
global.namaBot = "Elaina The Primary" // Nama bot
global.keyopenai = "sk-xxx"           // OpenAI key (opsional)
global.groqKey = "gsk_xxx"            // Groq key (FREE!)
```

## 📲 Pairing Code

```bash
node index.js --pairing
```

## 📊 Features

| Feature | Count |
|---------|-------|
| Commands | 300+ |
| Scrapers | 34 |
| Games | 25+ |
| AI Models | 20+ |
| Categories | 25 |

## 📁 Structure

```
├── Elaina.js          ← Main handler (32K lines)
├── index.js           ← Entry point
├── settings.js        ← EDIT INI! (config + globals)
├── lib/               ← Libraries
│   ├── allmenu.js     ← Menu system
│   ├── games.js       ← 15+ games
│   ├── scrape/        ← 34 scrapers
│   ├── system/        ← 15 system files
│   ├── canvas/        ← 18 canvas effects
│   └── ...            ← More libs
├── database/          ← 61 JSON files
├── assets/            ← Images + fonts
└── src/               ← Our additions
```

## 🙏 Credits

- **FallZx Infinity** — Developer
- **KyyInfinite** — Base ORI
- **Opanx** — Rebuild 🐙
- **Panxcz** — Owner 👑

## ⚠️ Disclaimer

Educational purposes only. Use at your own risk.

---

**Version:** 4.1.0 | **License:** MIT | **Node:** ≥20
