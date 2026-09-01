'use strict';
/**
 * Elaina Bot v4.0 — Downloader Commands
 * TikTok, Instagram, YouTube, Spotify, etc.
 */

const axios = require('axios');
const { sendMessage, reply } = require('../core/connection');
const { sleep, isUrl } = require('../lib/functions');
const config = require('../config/settings');

// ============ TIKTOK ============
const tiktok = {
    name: 'tiktok',
    category: 'download',
    description: 'Download TikTok video/audio',
    aliases: ['tt', 'tikdl', 'ttdl'],
    execute: async (ctx) => {
        const { jid, text, msg } = ctx;
        if (!text) return reply(jid, '❌ Usage: .tiktok <url>', msg);
        if (!isUrl(text)) return reply(jid, '❌ URL tidak valid!', msg);

        try {
            await reply(jid, '⏳ Downloading TikTok...', msg);

            // Using TikWM API (free)
            const apiUrl = `https://tikwm.com/api/?url=${encodeURIComponent(text)}`;
            const { data } = await axios.get(apiUrl, { timeout: 30000 });

            if (!data || !data.data) {
                return reply(jid, '❌ Gagal download! Coba URL lain.', msg);
            }

            const { title, author, music, play, hdplay } = data.data;
            const videoUrl = hdplay || play;
            const audioUrl = music?.play;

            // Send video
            if (videoUrl) {
                await sendMessage(jid, {
                    video: { url: videoUrl },
                    caption: `🎵 *TikTok Download*\n\n📝 ${title || 'No title'}\n👤 ${author?.nickname || 'Unknown'}\n🎵 ${music?.title || 'Unknown'}\n\n> ${config.foother}`,
                }, { quoted: msg });
            }

            // Send audio if available
            if (audioUrl) {
                await sleep(1000);
                await sendMessage(jid, {
                    audio: { url: audioUrl },
                    mimetype: 'audio/mpeg',
                    ptt: false,
                }, { quoted: msg });
            }

        } catch (e) {
            console.error('[TIKTOK] Error:', e.message);
            await reply(jid, `❌ Error: ${e.message}`, msg);
        }
    },
};

// ============ INSTAGRAM ============
const instagram = {
    name: 'ig',
    category: 'download',
    description: 'Download Instagram post/reel/story',
    aliases: ['igdl', 'instagram', 'igreels'],
    execute: async (ctx) => {
        const { jid, text, msg } = ctx;
        if (!text) return reply(jid, '❌ Usage: .ig <url>', msg);
        if (!isUrl(text)) return reply(jid, '❌ URL tidak valid!', msg);

        try {
            await reply(jid, '⏳ Downloading Instagram...', msg);

            // Using Instagram API
            const apiUrl = `https://api.veezone.dev/api/instagram?url=${encodeURIComponent(text)}`;
            const { data } = await axios.get(apiUrl, { timeout: 30000 });

            if (!data || !data.result) {
                return reply(jid, '❌ Gagal download! Coba URL lain.', msg);
            }

            const results = data.result;
            let sent = 0;

            for (const item of results.slice(0, 5)) { // Max 5 items
                if (sent > 0) await sleep(1000);

                if (item.type === 'video') {
                    await sendMessage(jid, {
                        video: { url: item.url },
                        caption: sent === 0 ? `📸 *Instagram Download*\n\n> ${config.foother}` : undefined,
                    }, { quoted: sent === 0 ? msg : undefined });
                } else {
                    await sendMessage(jid, {
                        image: { url: item.url },
                        caption: sent === 0 ? `📸 *Instagram Download*\n\n> ${config.foother}` : undefined,
                    }, { quoted: sent === 0 ? msg : undefined });
                }
                sent++;
            }

            if (sent === 0) {
                await reply(jid, '❌ Tidak ada media yang bisa didownload.', msg);
            }

        } catch (e) {
            console.error('[IG] Error:', e.message);
            await reply(jid, `❌ Error: ${e.message}`, msg);
        }
    },
};

// ============ YOUTUBE ============
const ytmp3 = {
    name: 'ytmp3',
    category: 'download',
    description: 'Download YouTube audio',
    aliases: ['yta', 'youtubeaudio'],
    execute: async (ctx) => {
        const { jid, text, msg } = ctx;
        if (!text) return reply(jid, '❌ Usage: .ytmp3 <url>', msg);
        if (!isUrl(text)) return reply(jid, '❌ URL tidak valid!', msg);

        try {
            await reply(jid, '⏳ Downloading YouTube audio...', msg);

            // Using YouTube API
            const apiUrl = `https://api.veezone.dev/api/youtube/audio?url=${encodeURIComponent(text)}`;
            const { data } = await axios.get(apiUrl, { timeout: 60000 });

            if (!data || !data.result) {
                return reply(jid, '❌ Gagal download! Coba URL lain.', msg);
            }

            const { title, thumbnail, url } = data.result;

            await sendMessage(jid, {
                audio: { url },
                mimetype: 'audio/mpeg',
                ptt: false,
                contextInfo: {
                    externalAdReply: {
                        title: title || 'YouTube Audio',
                        body: config.botName,
                        thumbnailUrl: thumbnail,
                        mediaType: 1,
                    },
                },
            }, { quoted: msg });

        } catch (e) {
            console.error('[YTMP3] Error:', e.message);
            await reply(jid, `❌ Error: ${e.message}`, msg);
        }
    },
};

const ytmp4 = {
    name: 'ytmp4',
    category: 'download',
    description: 'Download YouTube video',
    aliases: ['ytv', 'youtubevideo'],
    execute: async (ctx) => {
        const { jid, text, msg } = ctx;
        if (!text) return reply(jid, '❌ Usage: .ytmp4 <url>', msg);
        if (!isUrl(text)) return reply(jid, '❌ URL tidak valid!', msg);

        try {
            await reply(jid, '⏳ Downloading YouTube video...', msg);

            const apiUrl = `https://api.veezone.dev/api/youtube/video?url=${encodeURIComponent(text)}`;
            const { data } = await axios.get(apiUrl, { timeout: 60000 });

            if (!data || !data.result) {
                return reply(jid, '❌ Gagal download! Coba URL lain.', msg);
            }

            const { title, thumbnail, url } = data.result;

            await sendMessage(jid, {
                video: { url },
                caption: `🎬 *YouTube Download*\n\n📝 ${title || 'Unknown'}\n\n> ${config.foother}`,
                mimetype: 'video/mp4',
            }, { quoted: msg });

        } catch (e) {
            console.error('[YTMP4] Error:', e.message);
            await reply(jid, `❌ Error: ${e.message}`, msg);
        }
    },
};

// ============ SPOTIFY ============
const spotify = {
    name: 'spotify',
    category: 'download',
    description: 'Download Spotify track',
    aliases: ['spdl', 'spotifydl'],
    execute: async (ctx) => {
        const { jid, text, msg } = ctx;
        if (!text) return reply(jid, '❌ Usage: .spotify <url>', msg);
        if (!isUrl(text)) return reply(jid, '❌ URL tidak valid!', msg);

        try {
            await reply(jid, '⏳ Downloading Spotify...', msg);

            const apiUrl = `https://api.veezone.dev/api/spotify?url=${encodeURIComponent(text)}`;
            const { data } = await axios.get(apiUrl, { timeout: 30000 });

            if (!data || !data.result) {
                return reply(jid, '❌ Gagal download! Coba URL lain.', msg);
            }

            const { title, artist, thumbnail, url } = data.result;

            await sendMessage(jid, {
                audio: { url },
                mimetype: 'audio/mpeg',
                ptt: false,
                contextInfo: {
                    externalAdReply: {
                        title: title || 'Spotify',
                        body: artist || config.botName,
                        thumbnailUrl: thumbnail,
                        mediaType: 1,
                    },
                },
            }, { quoted: msg });

        } catch (e) {
            console.error('[SPOTIFY] Error:', e.message);
            await reply(jid, `❌ Error: ${e.message}`, msg);
        }
    },
};

// ============ MEDIAFIRE ============
const mediafire = {
    name: 'mediafire',
    category: 'download',
    description: 'Download MediaFire file',
    aliases: ['mf', 'mfdl'],
    execute: async (ctx) => {
        const { jid, text, msg } = ctx;
        if (!text) return reply(jid, '❌ Usage: .mediafire <url>', msg);
        if (!isUrl(text)) return reply(jid, '❌ URL tidak valid!', msg);

        try {
            await reply(jid, '⏳ Downloading MediaFire...', msg);

            const apiUrl = `https://api.veezone.dev/api/mediafire?url=${encodeURIComponent(text)}`;
            const { data } = await axios.get(apiUrl, { timeout: 30000 });

            if (!data || !data.result) {
                return reply(jid, '❌ Gagal download! Coba URL lain.', msg);
            }

            const { filename, filesize, url } = data.result;

            await sendMessage(jid, {
                document: { url },
                fileName: filename || 'download',
                mimetype: 'application/octet-stream',
                caption: `📁 *MediaFire Download*\n\n📄 ${filename || 'Unknown'}\n📏 ${filesize || 'Unknown'}\n\n> ${config.foother}`,
            }, { quoted: msg });

        } catch (e) {
            console.error('[MEDIAFIRE] Error:', e.message);
            await reply(jid, `❌ Error: ${e.message}`, msg);
        }
    },
};

// ============ FACEBOOK ============
const facebook = {
    name: 'fb',
    category: 'download',
    description: 'Download Facebook video',
    aliases: ['fbdl', 'facebookdl'],
    execute: async (ctx) => {
        const { jid, text, msg } = ctx;
        if (!text) return reply(jid, '❌ Usage: .fb <url>', msg);
        if (!isUrl(text)) return reply(jid, '❌ URL tidak valid!', msg);

        try {
            await reply(jid, '⏳ Downloading Facebook video...', msg);

            const apiUrl = `https://api.veezone.dev/api/facebook?url=${encodeURIComponent(text)}`;
            const { data } = await axios.get(apiUrl, { timeout: 30000 });

            if (!data || !data.result) {
                return reply(jid, '❌ Gagal download! Coba URL lain.', msg);
            }

            const { title, url } = data.result;

            await sendMessage(jid, {
                video: { url },
                caption: `📘 *Facebook Download*\n\n📝 ${title || 'Unknown'}\n\n> ${config.foother}`,
            }, { quoted: msg });

        } catch (e) {
            console.error('[FB] Error:', e.message);
            await reply(jid, `❌ Error: ${e.message}`, msg);
        }
    },
};

// ============ TWITTER ============
const twitter = {
    name: 'twitter',
    category: 'download',
    description: 'Download Twitter/X media',
    aliases: ['tw', 'x', 'tweet'],
    execute: async (ctx) => {
        const { jid, text, msg } = ctx;
        if (!text) return reply(jid, '❌ Usage: .twitter <url>', msg);
        if (!isUrl(text)) return reply(jid, '❌ URL tidak valid!', msg);

        try {
            await reply(jid, '⏳ Downloading Twitter media...', msg);

            const apiUrl = `https://api.veezone.dev/api/twitter?url=${encodeURIComponent(text)}`;
            const { data } = await axios.get(apiUrl, { timeout: 30000 });

            if (!data || !data.result) {
                return reply(jid, '❌ Gagal download! Coba URL lain.', msg);
            }

            const { caption, media } = data.result;

            if (media && media.length > 0) {
                for (let i = 0; i < Math.min(media.length, 5); i++) {
                    const item = media[i];
                    if (i > 0) await sleep(1000);

                    if (item.type === 'video') {
                        await sendMessage(jid, {
                            video: { url: item.url },
                            caption: i === 0 ? `🐦 *Twitter Download*\n\n📝 ${caption || 'Unknown'}\n\n> ${config.foother}` : undefined,
                        }, { quoted: i === 0 ? msg : undefined });
                    } else {
                        await sendMessage(jid, {
                            image: { url: item.url },
                            caption: i === 0 ? `🐦 *Twitter Download*\n\n📝 ${caption || 'Unknown'}\n\n> ${config.foother}` : undefined,
                        }, { quoted: i === 0 ? msg : undefined });
                    }
                }
            }

        } catch (e) {
            console.error('[TWITTER] Error:', e.message);
            await reply(jid, `❌ Error: ${e.message}`, msg);
        }
    },
};

module.exports = { commands: { tiktok, instagram, ytmp3, ytmp4, spotify, mediafire, facebook, twitter } };
