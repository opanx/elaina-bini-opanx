# 🌙 Elaina Bot — The Primary

<p align="center">
  <img src="https://img.shields.io/badge/version-4.0.0-purple?style=for-the-badge" />
  <img src="https://img.shields.io/badge/node-%3E%3D20-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/license-MIT-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/baileys-latest-orange?style=for-the-badge" />
</p>

> **"Your AI-Powered WhatsApp Butler"**

A feature-rich WhatsApp bot built with Node.js and Baileys, featuring AI chat, media downloaders, group management, and more.

---

## ⚠️ Credits (DO NOT REMOVE)

| Role | Name |
|------|------|
| **Developer** | FallZx Infinity |
| **Base ORI** | KyyInfinite |
| **Rebuilt by** | Opanx 🐙 |

> This software is provided as-is. The original developer and base creator must be credited at all times.

---

## ✨ Features

### 📥 Downloader
- TikTok (Video & Audio)
- Instagram (Post, Story, Reels)
- YouTube (Video & Audio)
- Facebook
- Twitter/X
- Spotify
- MediaFire
- Terabox

### 🤖 AI Chat
- ChatGPT (GPT-4o, GPT-4, GPT-3.5)
- Google Gemini
- DeepSeek R1
- Meta LLaMA
- Groq (Free tier)
- Multi-language translation

### 🎨 AI Image
- Image generation
- Anime style
- Ghibli style
- Background removal
- Image enhancement

### 🪄 Sticker & Media
- Image to sticker
- Text to sticker
- Animated text sticker
- Emoji mix
- Media conversion

### 🎮 Games
- Word guessing
- Rock Paper Scissors
- Slot machine
- Daily rewards
- Level system

### 👥 Group Management
- Kick/Promote/Demote
- Anti-link
- Anti-spam
- Welcome/Leave messages
- Warning system

### 🛡️ Protection
- Anti-toxic
- Anti-NSFW
- Anti-vortex (forward)
- Slowmode
- Verify system

### 🔐 Security
- PM Guard (anti-PM spam)
- Rate limiting
- Ban system
- Auto-Doctor (self-healing)

### 🔧 Tools
- OCR (image to text)
- Calculator
- QR Code generator
- URL shortener
- Weather info

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- npm or yarn
- WhatsApp account

### Installation

```bash
# Clone the repository
git clone https://github.com/opanx/elaina-bini-opanx.git
cd elaina-bini-opanx

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your settings

# Start the bot
node src/index.js
```

### Pairing Code Mode (No QR Needed)

```bash
# Use pairing code instead of QR
node src/index.js --pairing --phone 628xxxxxxxxxx

# Or with short flags
node src/index.js -p -n 628xxxxxxxxxx
```

### Production (PM2)

```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 config
pm2 save
pm2 startup
```

---

## 🖥️ Deployment

### Pterodactyl Panel

1. Import egg `Node.js Generic` ke Pterodactyl
2. Create server baru
3. Upload source code via File Manager
4. Set startup command: `npm install && node src/index.js`
5. Start server
6. Console → QR Code / Pairing Code
7. Scan dari WhatsApp
8. Bot online 24/7! ✅

### VPS (Ubuntu)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone and setup
git clone https://github.com/opanx/elaina-bini-opanx.git
cd elaina-bini-opanx
npm install
cp .env.example .env
nano .env  # Edit settings

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Railway

1. Connect GitHub repo
2. Railway auto-detects Node.js
3. Set environment variables
4. Deploy!

---

## ⚙️ Configuration

Edit `.env` file:

```env
# Bot Settings
BOT_NAME=Elaina The Primary
OWNER_NUMBER=628xxxxxxxxxx
BOT_NUMBER=628xxxxxxxxxx
OWNER_NAME=Your Name
PREFIX=.

# AI API Keys (get from respective providers)
OPENAI_API_KEY=sk-xxxxx
GEMINI_API_KEY=xxxxx
GROQ_API_KEY=gsk_xxxxx
DEEPSEEK_API_KEY=sk-xxxxx
```

---

## 📁 Project Structure

```
elaina-bini-opanx/
├── src/
│   ├── core/
│   │   ├── connection.js      # WhatsApp connection
│   │   ├── eventHandler.js    # Event handlers
│   │   └── commandLoader.js   # Command loader
│   ├── config/
│   │   ├── settings.js        # Bot settings
│   │   └── constants.js       # Constants
│   ├── database/
│   │   └── engine.js          # SQLite + JSON DB
│   ├── security/
│   │   └── rateLimit.js       # Rate limiter
│   ├── commands/
│   │   └── main.js            # Main commands
│   ├── lib/
│   │   ├── functions.js       # Utility functions
│   │   └── welcomeCard.js     # Welcome card
│   └── index.js               # Entry point
├── assets/
├── .env.example
├── .gitignore
├── ecosystem.config.js
├── package.json
├── LICENSE
└── README.md
```

---

## 🛠️ Commands

| Command | Description |
|---------|-------------|
| `.menu` | Show all commands |
| `.ping` | Check bot latency |
| `.status` | Bot status |
| `.owner` | Contact owner |
| `.tiktok <url>` | Download TikTok |
| `.ig <url>` | Download Instagram |
| `.ytmp3 <url>` | Download YouTube audio |
| `.ytmp4 <url>` | Download YouTube video |
| `.gpt <text>` | Chat with GPT |
| `.gemini <text>` | Chat with Gemini |
| `.img <prompt>` | Generate image |
| `.s` | Image to sticker |
| `.toimg` | Sticker to image |
| `.ocr` | Image to text |
| `.calc <expr>` | Calculator |
| `.doctor` | Health check |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Credits

- **FallZx Infinity** — Original Developer
- **KyyInfinite** — Base ORI
- **Opanx** — Rebuild & Optimization
- **@whiskeysockets/baileys** — WhatsApp Web API
- **Contributors** — Thank you!

---

## ⚠️ Disclaimer

This bot is provided for educational purposes only. Use at your own risk. The developers are not responsible for any misuse or damage caused by this bot.

---

<p align="center">
  Made with ❤️ by <b>Opanx</b> 🐙
  <br>
  Base by <b>FallZx Infinity</b> × <b>KyyInfinite</b>
</p>
