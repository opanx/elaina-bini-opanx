'use strict';

module.exports = {
    // Disconnect reasons
    DisconnectReason: {
        loggedOut: 401,
        badSession: 402,
        connectionReplaced: 408,
        timedOut: 408,
        connectionClosed: 411,
        connectionLost: 412,
        connectionReplaced: 440,
        multideviceMismatch: 411,
    },

    // Message types
    MessageType: {
        TEXT: 'text',
        IMAGE: 'image',
        VIDEO: 'video',
        AUDIO: 'audio',
        STICKER: 'sticker',
        DOCUMENT: 'document',
        CONTACT: 'contact',
        LOCATION: 'location',
        REACTION: 'reaction',
        POLL: 'poll',
    },

    // Group actions
    GroupAction: {
        ADD: 'add',
        REMOVE: 'remove',
        PROMOTE: 'promote',
        DEMOTE: 'demote',
    },

    // Protection levels
    ProtectionLevel: {
        LOW: 'low',
        STANDARD: 'standard',
        HIGH: 'high',
        MAXIMUM: 'maximum',
        PARANOID: 'paranoid',
    },

    // PM Guard modes
    PMGuardMode: {
        WARN_THEN_BLOCK: 'warn_then_block',
        INSTANT_BLOCK: 'instant_block',
        QUARANTINE_FIRST: 'quarantine_first',
        SILENT: 'silent',
        GHOST: 'ghost',
        LOG_ONLY: 'log_only',
    },

    // Game difficulty
    GameDifficulty: {
        EASY: 'easy',
        MEDIUM: 'medium',
        HARD: 'hard',
    },

    // AI Models
    AIModels: {
        GPT4O: 'gpt-4o',
        GPT4: 'gpt-4',
        GPT35: 'gpt-3.5-turbo',
        GEMINI: 'gemini-pro',
        DEEPSEEK: 'deepseek-chat',
        LLAMA: 'llama-3.3-70b-versatile',
        MIXTRAL: 'mixtral-8x7b-32768',
        GEMMA: 'gemma-7b-it',
    },

    // Categories
    Categories: {
        MAIN: 'main',
        DOWNLOAD: 'download',
        AI: 'ai',
        AI_IMAGE: 'ai_image',
        STICKER: 'sticker',
        GAME: 'game',
        GROUP: 'group',
        PROTECTION: 'protection',
        SECURITY: 'security',
        TOOLS: 'tools',
        FUN: 'fun',
        OWNER: 'owner',
        SEWA: 'sewa',
        STATS: 'stats',
        DOCTOR: 'doctor',
    },
};
