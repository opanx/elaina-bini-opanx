'use strict';
/**
 * Elaina Bot v4.0 — AI Chat Commands
 * GPT, Gemini, DeepSeek, Groq, etc.
 */

const axios = require('axios');
const { sendMessage, reply } = require('../core/connection');
const config = require('../config/settings');

// ============ GPT ============
const gpt = {
    name: 'gpt',
    category: 'ai',
    description: 'Chat with GPT-4o',
    aliases: ['chatgpt', 'openai', 'ai'],
    execute: async (ctx) => {
        const { jid, text, msg } = ctx;
        if (!text) return reply(jid, '❌ Usage: .gpt <text>', msg);
        if (!config.openaiKey) return reply(jid, '❌ OpenAI API key belum di-setup!', msg);

        try {
            await sendMessage(jid, { text: '🤖 *Thinking...*' }, { quoted: msg });

            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-4o',
                messages: [
                    { role: 'system', content: 'You are a helpful WhatsApp assistant named Elaina. Be concise and friendly.' },
                    { role: 'user', content: text },
                ],
                max_tokens: 2000,
                temperature: 0.7,
            }, {
                headers: {
                    'Authorization': `Bearer ${config.openaiKey}`,
                    'Content-Type': 'application/json',
                },
                timeout: 60000,
            });

            const reply_text = response.data.choices[0]?.message?.content || 'No response';
            const tokens = response.data.usage?.total_tokens || 0;

            await sendMessage(jid, {
                text: `🤖 *GPT-4o Response*\n\n${reply_text}\n\n---\n📊 Tokens: ${tokens}`,
            }, { quoted: msg });

        } catch (e) {
            console.error('[GPT] Error:', e.message);
            await reply(jid, `❌ Error: ${e.message}`, msg);
        }
    },
};

// ============ GEMINI ============
const gemini = {
    name: 'gemini',
    category: 'ai',
    description: 'Chat with Google Gemini',
    aliases: ['geminiai', 'googleai'],
    execute: async (ctx) => {
        const { jid, text, msg } = ctx;
        if (!text) return reply(jid, '❌ Usage: .gemini <text>', msg);
        if (!config.geminiKey) return reply(jid, '❌ Gemini API key belum di-setup!', msg);

        try {
            await sendMessage(jid, { text: '🤖 *Thinking...*' }, { quoted: msg });

            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${config.geminiKey}`,
                {
                    contents: [{ parts: [{ text }] }],
                },
                { timeout: 60000 }
            );

            const reply_text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';

            await sendMessage(jid, {
                text: `🤖 *Gemini Response*\n\n${reply_text}`,
            }, { quoted: msg });

        } catch (e) {
            console.error('[GEMINI] Error:', e.message);
            await reply(jid, `❌ Error: ${e.message}`, msg);
        }
    },
};

// ============ DEEPSEEK ============
const deepseek = {
    name: 'deepseek',
    category: 'ai',
    description: 'Chat with DeepSeek R1',
    aliases: ['ds', 'dsr1', 'deepseekr1'],
    execute: async (ctx) => {
        const { jid, text, msg } = ctx;
        if (!text) return reply(jid, '❌ Usage: .deepseek <text>', msg);
        if (!config.deepseekKey) return reply(jid, '❌ DeepSeek API key belum di-setup!', msg);

        try {
            await sendMessage(jid, { text: '🤖 *Thinking...*' }, { quoted: msg });

            const response = await axios.post('https://api.deepseek.com/chat/completions', {
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant. Be concise.' },
                    { role: 'user', content: text },
                ],
                max_tokens: 2000,
            }, {
                headers: {
                    'Authorization': `Bearer ${config.deepseekKey}`,
                    'Content-Type': 'application/json',
                },
                timeout: 60000,
            });

            const reply_text = response.data.choices[0]?.message?.content || 'No response';

            await sendMessage(jid, {
                text: `🤖 *DeepSeek Response*\n\n${reply_text}`,
            }, { quoted: msg });

        } catch (e) {
            console.error('[DEEPSEEK] Error:', e.message);
            await reply(jid, `❌ Error: ${e.message}`, msg);
        }
    },
};

// ============ GROQ (FREE) ============
const groq = {
    name: 'groq',
    category: 'ai',
    description: 'Chat with Groq (FREE)',
    aliases: ['llama', 'llamaai', 'fastai'],
    execute: async (ctx) => {
        const { jid, text, msg } = ctx;
        if (!text) return reply(jid, '❌ Usage: .groq <text>', msg);
        if (!config.groqKey) return reply(jid, '❌ Groq API key belum di-setup!', msg);

        try {
            await sendMessage(jid, { text: '🤖 *Thinking...*' }, { quoted: msg });

            const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant. Be concise and friendly.' },
                    { role: 'user', content: text },
                ],
                max_tokens: 2000,
                temperature: 0.7,
            }, {
                headers: {
                    'Authorization': `Bearer ${config.groqKey}`,
                    'Content-Type': 'application/json',
                },
                timeout: 30000,
            });

            const reply_text = response.data.choices[0]?.message?.content || 'No response';
            const model = response.data.model || 'unknown';

            await sendMessage(jid, {
                text: `🤖 *Groq Response (${model})*\n\n${reply_text}`,
            }, { quoted: msg });

        } catch (e) {
            console.error('[GROQ] Error:', e.message);
            await reply(jid, `❌ Error: ${e.message}`, msg);
        }
    },
};

// ============ TRANSLATE ============
const translate = {
    name: 'translate',
    category: 'ai',
    description: 'Translate text',
    aliases: ['tr', 'tl'],
    execute: async (ctx) => {
        const { jid, args, msg } = ctx;
        const lang = args[0];
        const text = args.slice(1).join(' ');

        if (!lang || !text) return reply(jid, '❌ Usage: .translate <lang> <text>\n\nContoh: .translate id Hello World', msg);

        try {
            // Using Google Translate API (free)
            const response = await axios.get(
                `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`,
                { timeout: 10000 }
            );

            const translated = response.data[0]?.map(item => item[0]).join('') || 'Translation failed';
            const detectedLang = response.data[2] || 'auto';

            await sendMessage(jid, {
                text: `🌐 *Translate*\n\n🔤 Original (${detectedLang}): ${text}\n📝 Translated (${lang}): ${translated}`,
            }, { quoted: msg });

        } catch (e) {
            console.error('[TRANSLATE] Error:', e.message);
            await reply(jid, `❌ Error: ${e.message}`, msg);
        }
    },
};

// ============ ASK (Auto-select best model) ============
const ask = {
    name: 'ask',
    category: 'ai',
    description: 'Ask AI (auto-select best model)',
    aliases: ['askai', 'chat'],
    execute: async (ctx) => {
        const { jid, text, msg } = ctx;
        if (!text) return reply(jid, '❌ Usage: .ask <text>', msg);

        // Try models in order: Groq (free) → Gemini → GPT
        const models = [
            { name: 'Groq', check: () => config.groqKey, handler: async () => {
                const res = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
                    model: 'llama-3.3-70b-versatile',
                    messages: [{ role: 'user', content: text }],
                    max_tokens: 2000,
                }, { headers: { Authorization: `Bearer ${config.groqKey}` }, timeout: 30000 });
                return res.data.choices[0]?.message?.content;
            }},
            { name: 'Gemini', check: () => config.geminiKey, handler: async () => {
                const res = await axios.post(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${config.geminiKey}`,
                    { contents: [{ parts: [{ text }] }] },
                    { timeout: 60000 }
                );
                return res.data.candidates?.[0]?.content?.parts?.[0]?.text;
            }},
            { name: 'GPT', check: () => config.openaiKey, handler: async () => {
                const res = await axios.post('https://api.openai.com/v1/chat/completions', {
                    model: 'gpt-4o-mini',
                    messages: [{ role: 'user', content: text }],
                    max_tokens: 2000,
                }, { headers: { Authorization: `Bearer ${config.openaiKey}` }, timeout: 60000 });
                return res.data.choices[0]?.message?.content;
            }},
        ];

        for (const model of models) {
            if (!model.check()) continue;
            try {
                await sendMessage(jid, { text: `🤖 *Asking ${model.name}...*` }, { quoted: msg });
                const reply_text = await model.handler();
                if (reply_text) {
                    return sendMessage(jid, { text: `🤖 *${model.name} Response*\n\n${reply_text}` }, { quoted: msg });
                }
            } catch (e) {
                console.error(`[ASK] ${model.name} failed:`, e.message);
                continue;
            }
        }

        await reply(jid, '❌ Tidak ada AI model yang tersedia. Setup API key di .env', msg);
    },
};

module.exports = { commands: { gpt, gemini, deepseek, groq, translate, ask } };
