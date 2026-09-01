/*
╔══════════════════════════════════════════════════════╗
║               𝗖𝗥𝗘𝗗𝗜𝗧𝗦 & 𝗖𝗢𝗣𝗬𝗥𝗜𝗚𝗛𝗧                ║
╚══════════════════════════════════════════════════════╝

Developer   : FallZx Infinity
Base ORI    : KyyInfinite
Version     : 1.0.0

© Copyright 2026 FallZx Infinity. All Rights Reserved.

Script WhatsApp Bot ini dikembangkan oleh FallZx Infinity
dengan menggunakan Base ORI dari KyyInfinite. Seluruh
pengembangan fitur, perbaikan, optimasi, dan modifikasi
merupakan hasil karya FallZx Infinity.

──────────────────────────────────────────────────────

[01] DILARANG MENGHAPUS CREDITS
     Dilarang menghapus, mengubah, menyembunyikan, atau
     mengganti identitas Developer maupun Base ORI yang
     tercantum di dalam script ini.

[02] RECODE / MODIFIKASI
     Anda dipersilakan melakukan recode maupun modifikasi
     script sesuai kebutuhan, namun wajib tetap mencantumkan
     kredit kepada:
       • Developer : FallZx Infinity
       • Base ORI  : KyyInfinite

[03] DISTRIBUSI ULANG
     Apabila ingin membagikan ulang script ini, harap tetap
     menyertakan credits asli dan jangan mengklaim script ini
     sebagai karya pribadi.

[04] PENOLAKAN JAMINAN
     Script ini disediakan sebagaimana adanya (AS IS).
     Developer tidak bertanggung jawab atas kerusakan,
     kehilangan data, suspend, banned, maupun masalah lain
     yang timbul akibat penggunaan atau modifikasi script.

Terima kasih telah menghargai karya para developer.
Semoga bermanfaat dan selamat berkarya!
*/


require("./Elaina")
const fs = require('fs')

global.owner = "6285706665203" //NOMOR OWNER
global.nobot = "6282147837988" //NOMOR BOT
global.nomorowner = '6285706665203' //NOMOR OWNER
global.namaowner = "Panxcz Infinity" //NAMA OWNER LO
global.namaBot = "𝑬𝒍𝒂𝒊𝒏𝒆 𝑻𝒉𝒆 𝑷𝒓𝒊𝒎𝒂𝒓𝒚" //NAMA BOT LO
global.thumnail2 = "https://files.catbox.moe/i58vrz.jpg" //REPLY IMAG
global.replyimg = "https://files.catbox.moe/2hhala.jpg" //REPLY IMAGE
global.creator = `${owner}@s.whatsapp.net` //GAUSAH LO OPREK
global.foother = `© ${namaBot}` //GAUSAH LO OPREK
global.ppowner = 'https://files.catbox.moe/h5zya9.png' //PROFILE OWNER
global.versi = "𝑬𝒍𝒂𝒊𝒏𝒆 𝑻𝒉𝒆 𝑷𝒓𝒊𝒎𝒂𝒓𝒚" //JANGAN LO UBAH
global.menuBg = 'https://u.pone.rs/ezchqsab.jpg' //THUMBNAIL MENU LO
global.idch = "120363186130999681@newsletter" //UBAH PAKE IDCH LO
global.linkSaluran = "https://whatsapp.com/channel/0029Vb7MGFI7j6g0cOofOn1a" //SAMA UBAH JUGA
//KALO MAU GANTI BACKGROUND WELCOME/GOODBYE UBAH AJA
global.welcomeBg = 'https://files.catbox.moe/qbihzq.jpg'
//UBAH SESUKA LO
global.mess = {
    owner: "You are not owner",
    prem: "You are not premium",
    group: "Only group command",
    admin: "You are not Admin",
    botadmin: "Bot Harus Jadi Admin",
    private: "Only Private Chat",
    done: "Done"
}
//===BAGIAN STORE UNTUK PAYMENT GETWA =====
global.midtransServerKey = '';
global.midtransClientKey = '';
global.midtransProduction = false;
global.paymentMode = 'both';
//==================================


//===GAUSAH LO UBAH APA APA =====
global.mute = false
global.onlygc = false
global.allowedGroupIds = global.allowedGroupIds || [""];
global.nama = namaBot
global.namach = nama
global.namafile = foother
global.author = namaowner
global.welcome = true
global.leave = true
global.antitags = false
global.welcomeMessage = "awkawkwwk"
global.leaveMessage = "awkww yatim oit"
global.autoreadsw = false
global.autoreactsw = false
global.autoreactemoji = '😂'
global.prefix = ".", "/", "#", "?", "/"
global.flaming = 'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=sketch-name&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&text='
global.fluming = 'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=fluffy-logo&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&text='
global.flarun = 'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=runner-logo&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&text='
global.flasmurf = 'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=smurfs-logo&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&text='
global.keyopenai = "YOUR_OPENAI_KEY_HERE"
global.packname = nama
global.author = namaBot
//==================================
let file = require.resolve(__filename)
require('fs').watchFile(file, () => {
    require('fs').unwatchFile(file)
    console.log('\x1b[0;32m' + __filename + ' \x1b[1;32mupdated!\x1b[0m')
    delete require.cache[file]
    require(file)
})