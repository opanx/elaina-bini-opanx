'use strict';
/**
 * Elaina Bot v4.0 — Event Handler
 * Handles all WhatsApp events
 */

const config = require('../config/settings');
const db = require('../database/engine');
const { sendMessage, reply } = require('./connection');

let sock = null;
let commandHandler = null;

/**
 * Initialize event handler
 */
function initEvents(socket, handler) {
    sock = socket;
    commandHandler = handler;

    // Message handler
    sock.ev.on('messages.upsert', handleMessage);

    // Group update handler
    sock.ev.on('groups.upsert', handleGroupCreate);
    sock.ev.on('groups.update', handleGroupUpdate);
    sock.ev.on('group-participants.update', handleGroupParticipants);

    // Call handler
    sock.ev.on('call', handleCall);

    console.log('[EVENT] ✅ Event handlers initialized');
}

/**
 * Handle incoming messages
 */
async function handleMessage({ messages, type }) {
    if (type !== 'notify') return;

    for (const msg of messages) {
        try {
            // Skip own messages
            if (msg.key.fromMe) continue;

            // Skip status broadcasts
            if (msg.key.remoteJid === 'status@broadcast') continue;

            // Process message
            await processMessage(msg);
        } catch (e) {
            console.error('[MSG] Error:', e.message);
        }
    }
}

/**
 * Process a single message
 */
async function processMessage(msg) {
    const jid = msg.key.remoteJid;
    const sender = msg.key.participant || msg.key.remoteJid;
    const isGroup = jid.endsWith('@g.us');
    const isPrivate = jid.endsWith('@s.whatsapp.net');

    // Extract text
    const body = extractText(msg);
    if (!body) return;

    // Get sender info
    const senderNumber = sender.replace(/[^0-9]/g, '');
    const isOwner = config.ownerNumber.split(',').some(n => senderNumber === n.replace(/[^0-9]/g, ''));
    const isBotAdmin = isOwner; // Owner is always bot admin

    // Get group settings
    let isGroupAdmin = false;
    let groupMetadata = null;

    if (isGroup) {
        try {
            groupMetadata = await sock.groupMetadata(jid);
            const participant = groupMetadata.participants.find(p => p.id === sender);
            isGroupAdmin = participant?.admin === 'admin' || participant?.admin === 'superadmin';
        } catch {}
    }

    // Check if bot is admin in group
    let botIsAdmin = false;
    if (isGroup && groupMetadata) {
        const botParticipant = groupMetadata.participants.find(p => p.id === sock.user?.id);
        botIsAdmin = botParticipant?.admin === 'admin' || botParticipant?.admin === 'superadmin';
    }

    // Build context
    const ctx = {
        msg,
        jid,
        sender,
        senderNumber,
        body,
        isGroup,
        isPrivate,
        isOwner,
        isGroupAdmin,
        isBotAdmin,
        botIsAdmin,
        groupMetadata,
        pushName: msg.pushName || 'User',
        prefix: config.prefix,
    };

    // Check for command prefix
    const prefixRegex = new RegExp(`^[${config.prefix.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}!/]`);
    if (!prefixRegex.test(body)) {
        // Non-command message — check for auto-reply, etc
        return handleNonCommand(ctx);
    }

    // Extract command
    const fullCommand = body.slice(1).trim();
    const [command, ...args] = fullCommand.split(/\s+/);
    const commandName = command.toLowerCase();
    const text = args.join(' ');

    ctx.command = commandName;
    ctx.args = args;
    ctx.text = text;

    // Log command
    console.log(`[CMD] ${isGroup ? 'GC' : 'PM'} | ${senderNumber} | .${commandName} ${text ? text.slice(0, 30) : ''}`);

    // Route to command handler
    if (commandHandler) {
        await commandHandler(ctx);
    }
}

/**
 * Extract text from message
 */
function extractText(msg) {
    const m = msg.message;
    if (!m) return '';

    return (
        m.conversation ||
        m.extendedTextMessage?.text ||
        m.imageMessage?.caption ||
        m.videoMessage?.caption ||
        m.documentMessage?.caption ||
        m.buttonsResponseMessage?.selectedButtonId ||
        m.listResponseMessage?.singleSelectReply?.selectedRowId ||
        m.templateButtonReplyMessage?.selectedId ||
        ''
    ).trim();
}

/**
 * Handle non-command messages
 */
async function handleNonCommand(ctx) {
    // Auto-reply, welcome, etc can be added here
    // For now, just ignore non-command messages
}

/**
 * Handle group create
 */
async function handleGroupCreate(group) {
    console.log(`[GROUP] Created: ${group.subject} (${group.id})`);
}

/**
 * Handle group update
 */
async function handleGroupUpdate(update) {
    console.log(`[GROUP] Updated: ${update.id}`);
}

/**
 * Handle group participant update
 */
async function handleGroupParticipants({ id, participants, action }) {
    const groupSettings = db.gsGet(id);

    if (action === 'add' && groupSettings.welcome) {
        for (const participant of participants) {
            const WelcomeCard = require('../lib/welcomeCard');
            try {
                const caption = groupSettings.welcomeMsg || `Welcome @${participant.split('@')[0]} to ${'this group'}! 🎉`;
                await sendMessage(id, {
                    text: caption,
                    mentions: [participant],
                });
            } catch (e) {
                console.error('[WELCOME] Error:', e.message);
            }
        }
    }

    if (action === 'remove' && groupSettings.leave) {
        for (const participant of participants) {
            try {
                const caption = groupSettings.leaveMsg || `Goodbye @${participant.split('@')[0]} 👋`;
                await sendMessage(id, {
                    text: caption,
                    mentions: [participant],
                });
            } catch (e) {
                console.error('[LEAVE] Error:', e.message);
            }
        }
    }
}

/**
 * Handle incoming calls
 */
async function handleCall(calls) {
    for (const call of calls) {
        if (call.status === 'offer') {
            // Auto-reject calls (optional)
            try {
                await sock.rejectCall(call.id, call.from);
                console.log(`[CALL] Rejected call from ${call.from}`);
            } catch {}
        }
    }
}

module.exports = { initEvents };
