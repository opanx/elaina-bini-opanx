'use strict';
/**
 * Elaina Bot v4.1.0 — Scraper Registry
 * All scrapers centralized here
 */

const axios = require('axios');
const cheerio = require('cheerio');

// ============ TIKTOK ============
async function tiktok(url) {
    const { data } = await axios.get(`https://tikwm.com/api/?url=${encodeURIComponent(url)}`, { timeout: 30000 });
    if (!data?.data) throw new Error('TikTok download failed');
    const d = data.data;
    return {
        title: d.title || '',
        author: d.author?.nickname || '',
        music: d.music?.title || '',
        video: d.hdplay || d.play,
        audio: d.music?.play || '',
        cover: d.cover || '',
    };
}

// ============ INSTAGRAM ============
async function instagram(url) {
    const { data } = await axios.get(`https://api.veezone.dev/api/instagram?url=${encodeURIComponent(url)}`, { timeout: 30000 });
    if (!data?.result) throw new Error('Instagram download failed');
    return data.result.map(item => ({
        type: item.type,
        url: item.url,
        thumbnail: item.thumbnail || '',
    }));
}

// ============ YOUTUBE ============
async function youtubeAudio(url) {
    const { data } = await axios.get(`https://api.veezone.dev/api/youtube/audio?url=${encodeURIComponent(url)}`, { timeout: 60000 });
    if (!data?.result) throw new Error('YouTube audio download failed');
    return { title: data.result.title, thumbnail: data.result.thumbnail, url: data.result.url };
}

async function youtubeVideo(url) {
    const { data } = await axios.get(`https://api.veezone.dev/api/youtube/video?url=${encodeURIComponent(url)}`, { timeout: 60000 });
    if (!data?.result) throw new Error('YouTube video download failed');
    return { title: data.result.title, thumbnail: data.result.thumbnail, url: data.result.url };
}

// ============ SPOTIFY ============
async function spotify(url) {
    const { data } = await axios.get(`https://api.veezone.dev/api/spotify?url=${encodeURIComponent(url)}`, { timeout: 30000 });
    if (!data?.result) throw new Error('Spotify download failed');
    return { title: data.result.title, artist: data.result.artist, thumbnail: data.result.thumbnail, url: data.result.url };
}

// ============ MEDIAFIRE ============
async function mediafire(url) {
    const { data } = await axios.get(`https://api.veezone.dev/api/mediafire?url=${encodeURIComponent(url)}`, { timeout: 30000 });
    if (!data?.result) throw new Error('MediaFire download failed');
    return { filename: data.result.filename, filesize: data.result.filesize, url: data.result.url };
}

// ============ FACEBOOK ============
async function facebook(url) {
    const { data } = await axios.get(`https://api.veezone.dev/api/facebook?url=${encodeURIComponent(url)}`, { timeout: 30000 });
    if (!data?.result) throw new Error('Facebook download failed');
    return { title: data.result.title, url: data.result.url };
}

// ============ TWITTER/X ============
async function twitter(url) {
    const { data } = await axios.get(`https://api.veezone.dev/api/twitter?url=${encodeURIComponent(url)}`, { timeout: 30000 });
    if (!data?.result) throw new Error('Twitter download failed');
    return { caption: data.result.caption, media: data.result.media || [] };
}

// ============ TERABOX ============
async function terabox(url) {
    const { data } = await axios.get(`https://api.veezone.dev/api/terabox?url=${encodeURIComponent(url)}`, { timeout: 30000 });
    if (!data?.result) throw new Error('Terabox download failed');
    return data.result;
}

// ============ THREADS ============
async function threads(url) {
    const { data } = await axios.get(`https://api.veezone.dev/api/threads?url=${encodeURIComponent(url)}`, { timeout: 30000 });
    if (!data?.result) throw new Error('Threads download failed');
    return data.result;
}

// ============ SOUNDCLOUD ============
async function soundcloud(url) {
    const { data } = await axios.get(`https://api.veezone.dev/api/soundcloud?url=${encodeURIComponent(url)}`, { timeout: 30000 });
    if (!data?.result) throw new Error('SoundCloud download failed');
    return data.result;
}

// ============ PINTEREST ============
async function pinterest(url) {
    const { data } = await axios.get(`https://api.veezone.dev/api/pinterest?url=${encodeURIComponent(url)}`, { timeout: 30000 });
    if (!data?.result) throw new Error('Pinterest download failed');
    return data.result;
}

// ============ SNAPCHAT ============
async function snapchat(url) {
    const { data } = await axios.get(`https://api.veezone.dev/api/snapchat?url=${encodeURIComponent(url)}`, { timeout: 30000 });
    if (!data?.result) throw new Error('Snapchat download failed');
    return data.result;
}

// ============ GENERIC URL SHORTENER ============
async function shortenUrl(url) {
    const { data } = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`, { timeout: 10000 });
    return data;
}

// ============ WEATHER ============
async function weather(city) {
    const { data } = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=j1`, { timeout: 10000 });
    const c = data.current_condition[0];
    return {
        city,
        temp: c.temp_C,
        feelsLike: c.FeelsLikeC,
        humidity: c.humidity,
        wind: c.windspeedKmph,
        condition: c.weatherDesc[0].value,
    };
}

// ============ WHOIS ============
async function whois(domain) {
    const { data } = await axios.get(`https://api.hackertarget.com/whois/?q=${encodeURIComponent(domain)}`, { timeout: 10000 });
    return data;
}

// ============ QR CODE ============
function qrUrl(text) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`;
}

// ============ TRANSLATE ============
async function translate(text, targetLang = 'id') {
    const { data } = await axios.get(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`,
        { timeout: 10000 }
    );
    const translated = data[0]?.map(item => item[0]).join('') || '';
    const detectedLang = data[2] || 'auto';
    return { translated, detectedLang };
}

// ============ AI CHAT ============
async function aiChat(text, apiKey, model = 'gpt-4o-mini') {
    const { data } = await axios.post('https://api.openai.com/v1/chat/completions', {
        model,
        messages: [{ role: 'user', content: text }],
        max_tokens: 2000,
    }, {
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        timeout: 60000,
    });
    return data.choices[0]?.message?.content || 'No response';
}

async function groqChat(text, apiKey) {
    const { data } = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: text }],
        max_tokens: 2000,
    }, {
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        timeout: 30000,
    });
    return data.choices[0]?.message?.content || 'No response';
}

async function geminiChat(text, apiKey) {
    const { data } = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        { contents: [{ parts: [{ text }] }] },
        { timeout: 60000 }
    );
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
}

async function deepseekChat(text, apiKey) {
    const { data } = await axios.post('https://api.deepseek.com/chat/completions', {
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: text }],
        max_tokens: 2000,
    }, {
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        timeout: 60000,
    });
    return data.choices[0]?.message?.content || 'No response';
}

module.exports = {
    tiktok, instagram, youtubeAudio, youtubeVideo, spotify,
    mediafire, facebook, twitter, terabox, threads,
    soundcloud, pinterest, snapchat,
    shortenUrl, weather, whois, qrUrl, translate,
    aiChat, groqChat, geminiChat, deepseekChat,
};
