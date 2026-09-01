'use strict';
/**
 * Elaina Bot v4.1.0 — Statistics Tracker
 */

class Stats {
    constructor() {
        this.startTime = Date.now();
        this.commandsUsed = 0;
        this.messagesReceived = 0;
        this.messagesSent = 0;
        this.errors = 0;
        this.commandStats = {}; // command -> count
        this.userStats = {}; // jid -> { commands, messages }
        this.hourlyStats = {}; // hour -> count
    }

    commandUsed(command, userId) {
        this.commandsUsed++;
        this.commandStats[command] = (this.commandStats[command] || 0) + 1;

        if (userId) {
            if (!this.userStats[userId]) this.userStats[userId] = { commands: 0, messages: 0 };
            this.userStats[userId].commands++;
        }

        const hour = new Date().getHours();
        this.hourlyStats[hour] = (this.hourlyStats[hour] || 0) + 1;
    }

    messageReceived() { this.messagesReceived++; }
    messageSent() { this.messagesSent++; }
    error() { this.errors++; }

    getUptime() {
        const ms = Date.now() - this.startTime;
        const s = Math.floor(ms / 1000);
        const d = Math.floor(s / 86400);
        const h = Math.floor((s % 86400) / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        return `${d}d ${h}h ${m}m ${sec}s`;
    }

    getTopCommands(limit = 10) {
        return Object.entries(this.commandStats)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([cmd, count]) => ({ command: cmd, count }));
    }

    getTopUsers(limit = 10) {
        return Object.entries(this.userStats)
            .sort((a, b) => b[1].commands - a[1].commands)
            .slice(0, limit)
            .map(([jid, stats]) => ({ jid, ...stats }));
    }

    getSummary() {
        return {
            uptime: this.getUptime(),
            commandsUsed: this.commandsUsed,
            messagesReceived: this.messagesReceived,
            messagesSent: this.messagesSent,
            errors: this.errors,
            topCommands: this.getTopCommands(5),
            ram: `${(process.memoryUsage().rss / 1048576).toFixed(1)} MB`,
            heap: `${(process.memoryUsage().heapUsed / 1048576).toFixed(1)} MB`,
        };
    }
}

module.exports = new Stats();
