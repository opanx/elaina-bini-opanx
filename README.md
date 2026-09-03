# 🌙 Elaina Bot — The Primary v4.1.6

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

> ⚠️ **Kalau pairing code / QR ga muncul**: itu karena ada `session/` lama yang basi di panel.
> Hapus folder `session/` di file manager, atau pakai `node index.js --pairing` (otomatis reset session).
> `index.js` sekarang SUDAH DI-DEOBFUSCATE (entry point readable, ga ada lagi kode aneh).

## 📝 Edit settings.js

Buka `settings.js` di file manager, edit bagian ini:

```js
global.owner = "6285706665203"        // Nomor lu
global.namaowner = "Panxcz"           // Nama lu
global.namaBot = "Elaina The Primary" // Nama bot
global.keyopenai = "sk-xxx"           // OpenAI key (opsional)
global.groqKey = "gsk_xxx"            // Groq key (FREE!)
```

## 📲 Pairing Code & QR

```bash
# Pairing otomatis (kalau session kosong)
npm start

# FORCE pairing — reset session lama & minta kode baru
node index.js --pairing

# Pakai QR code (bukan pairing)
node index.js --qr

# Custom pairing code (min 8 karakter)
PAIRING_CODE=PANXCELM node index.js
```

Kode pairing muncul di **console panel** dalam kotak `🔑 PAIRING CODE`.
Masukin nomor HP (format 62xxx) → bot kasih kode → masukin di WhatsApp:
**Setelan → Perangkat Tertaut → Tautkan Perangkat**.

Kalau bot di-logout dari HP, session otomatis dihapus & siap pairing ulang.

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

**Version:** 4.1.6 | **License:** MIT | **Node:** ≥20
