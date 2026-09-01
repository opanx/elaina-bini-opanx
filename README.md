# 🌙 Elaina Bot — The Primary v4.1.0

> **Your AI-Powered WhatsApp Butler** | Rebuilt by Opanx 🐙

## ⚡ Quick Install

```bash
# 1. Clone
git clone https://github.com/opanx/elaina-bini-opanx.git
cd elaina-bini-opanx

# 2. Install
npm install

# 3. Setup
cp .env.example .env
nano .env

# 4. Run
npm start
```

**Done!** Bot langsung jalan! 🎉

## 📲 Pairing Code (No QR)

```bash
node index.js --pairing
```

## ⚙️ Config (.env)

```env
BOT_NAME=Elaina The Primary
OWNER_NUMBER=6285706665203
OWNER_NAME=Panxcz
PREFIX=.
PAIRING_CODE=PANXCELM
OPENAI_API_KEY=sk-xxxxx
GROQ_API_KEY=gsk_xxxxx
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
├── settings.js        ← Config + globals
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
