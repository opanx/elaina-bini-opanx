'use strict';

/**
 * makeInMemoryStore polyfill for @whiskeysockets/baileys v6+
 * 
 * In baileys v5, makeInMemoryStore provided an in-memory message store.
 * In v6+, this was removed. This polyfill provides compatible behavior.
 * 
 * Based on: https://github.com/WhiskeySockets/Baileys/blob/v5.0.0/src/Store/make-in-memory-store.ts
 */

const { proto, jidNormalizedUser } = require('@whiskeysockets/baileys');

function makeInMemoryStore({ logger, chatKey } = {}) {
    const _messages = {};
    const _contacts = {};
    const _chats = {};

    const store = {
        loadMessages: async () => [],
        loadMessage: async (jid, id) => {
            const msgs = _messages[jid];
            return msgs ? msgs[id] : null;
        },
        loadAllMessages: async (jid) => {
            return _messages[jid] ? Object.values(_messages[jid]) : [];
        },
        syncMessages: async () => {},
        fetchMessage: async (jid, id) => {
            return store.loadMessage(jid, id);
        },
        waitForMessage: async () => {},
        waitForSocketConnection: async () => {},
        onMessage: () => {},
        onChatUpdate: () => {},
        onContactUpdate: () => {},
        toJSON: () => ({
            messages: _messages,
            contacts: _contacts,
            chats: _chats,
        }),
        fromJSON: (json) => {
            if (json.messages) Object.assign(_messages, json.messages);
            if (json.contacts) Object.assign(_contacts, json.contacts);
            if (json.chats) Object.assign(_chats, json.chats);
        },
        bind: (ev) => {
            ev.on('messages.upsert', ({ messages }) => {
                for (const msg of messages) {
                    const jid = jidNormalizedUser(msg.key.remoteJid);
                    if (!_messages[jid]) _messages[jid] = {};
                    _messages[jid][msg.key.id] = msg;
                }
            });
            ev.on('contacts.upsert', (contacts) => {
                for (const c of contacts) {
                    _contacts[jidNormalizedUser(c.id)] = c;
                }
            });
            ev.on('chats.upsert', (chats) => {
                for (const c of chats) {
                    _chats[jidNormalizedUser(c.id)] = c;
                }
            });
        },
        chatSortingKey: chatKey || 'messages.upsert',
        messageCount: () => {
            let count = 0;
            for (const jid in _messages) {
                count += Object.keys(_messages[jid]).length;
            }
            return count;
        },
        getContacts: () => Object.values(_contacts),
        getChats: () => Object.values(_chats),
        getMessages: (jid) => _messages[jid] ? Object.values(_messages[jid]) : [],
        contactCount: () => Object.keys(_contacts).length,
        chatCount: () => Object.keys(_chats).length,
    };

    return store;
}

module.exports = { makeInMemoryStore };
