'use strict';
/**
 * Elaina Bot v4.0 — Command Loader
 * Loads all command modules dynamically
 */

const fs = require('fs');
const path = require('path');
const db = require('../database/engine');
const config = require('../config/settings');

const commands = new Map();
const aliases = new Map();

/**
 * Load all commands from commands directory
 */
function loadCommands() {
    const commandsDir = path.join(__dirname, '..', 'commands');

    if (!fs.existsSync(commandsDir)) {
        console.log('[CMD] ⚠️  Commands directory not found');
        return;
    }

    const files = fs.readdirSync(commandsDir).filter(f => f.endsWith('.js'));

    for (const file of files) {
        try {
            const module = require(path.join(commandsDir, file));
            if (module.commands) {
                for (const [name, cmd] of Object.entries(module.commands)) {
                    commands.set(name, cmd);
                    if (cmd.aliases) {
                        for (const alias of cmd.aliases) {
                            aliases.set(alias, name);
                        }
                    }
                }
            }
            console.log(`[CMD] ✅ Loaded: ${file}`);
        } catch (e) {
            console.error(`[CMD] ❌ Error loading ${file}:`, e.message);
        }
    }

    // Load custom commands from DB
    loadCustomCommands();

    console.log(`[CMD] 📦 Total commands: ${commands.size} | Aliases: ${aliases.size}`);
}

/**
 * Load custom commands from database
 */
function loadCustomCommands() {
    const customCmds = db.loadCommands();
    for (const [name, data] of Object.entries(customCmds)) {
        try {
            const fn = new Function('ctx', data.code);
            commands.set(name, {
                name,
                category: 'custom',
                description: `Custom command by ${data.author || 'unknown'}`,
                execute: fn,
                isCustom: true,
            });
        } catch (e) {
            console.error(`[CMD] ❌ Error loading custom command ${name}:`, e.message);
        }
    }
}

/**
 * Get command by name or alias
 */
function getCommand(name) {
    // Check direct match
    if (commands.has(name)) return commands.get(name);
    // Check alias
    const realName = aliases.get(name);
    if (realName && commands.has(realName)) return commands.get(realName);
    return null;
}

/**
 * Execute command
 */
async function executeCommand(ctx) {
    const { command } = ctx;
    const cmd = getCommand(command);

    if (!cmd) return false;

    // Check permissions
    if (cmd.ownerOnly && !ctx.isOwner) {
        await reply(ctx.jid, config.mess.owner, ctx.msg);
        return true;
    }

    if (cmd.groupOnly && !ctx.isGroup) {
        await reply(ctx.jid, config.mess.group, ctx.msg);
        return true;
    }

    if (cmd.adminOnly && !ctx.isGroupAdmin && !ctx.isOwner) {
        await reply(ctx.jid, config.mess.admin, ctx.msg);
        return true;
    }

    if (cmd.botAdminOnly && !ctx.botIsAdmin) {
        await reply(ctx.jid, config.mess.botadmin, ctx.msg);
        return true;
    }

    if (cmd.privateOnly && !ctx.isPrivate) {
        await reply(ctx.jid, config.mess.private, ctx.msg);
        return true;
    }

    // Check rate limit
    if (!ctx.isOwner) {
        const rateLimit = require('../security/rateLimit');
        const rl = rateLimit.check(ctx.sender, command);
        if (!rl.allowed) {
            await reply(ctx.jid, `⏱️ *Rate Limit!*\nTunggu ${rl.retryAfter} detik.`, ctx.msg);
            return true;
        }
    }

    // Execute
    try {
        await cmd.execute(ctx);
        return true;
    } catch (e) {
        console.error(`[CMD] Error executing ${command}:`, e.message);
        await reply(ctx.jid, `❌ Error: ${e.message}`, ctx.msg);
        return true;
    }
}

/**
 * Get all commands by category
 */
function getCommandsByCategory() {
    const categories = {};
    for (const [name, cmd] of commands) {
        const cat = cmd.category || 'uncategorized';
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push({ name, ...cmd });
    }
    return categories;
}

/**
 * Get command count
 */
function getCommandCount() {
    return commands.size;
}

module.exports = {
    loadCommands,
    getCommand,
    executeCommand,
    getCommandsByCategory,
    getCommandCount,
    commands,
    aliases,
};
