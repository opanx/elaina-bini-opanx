'use strict';
/**
 * Elaina Bot v4.1.0 — Welcome Card Image Generator
 * Generates beautiful welcome/leave cards as images
 */

const Jimp = require('jimp');
const path = require('path');

const COLORS = {
    primary: '#ff6b9d',
    secondary: '#c44dff',
    accent: '#6c63ff',
    dark: '#0a0a0f',
    darker: '#12121a',
    text: '#ffffff',
    muted: '#a0a0b0',
    success: '#55efc4',
    warning: '#ffd93d',
    danger: '#ff6b6b',
};

/**
 * Generate welcome card image
 */
async function generateWelcomeImage({ userName, groupName, memberCount, groupIcon }) {
    const width = 800;
    const height = 400;
    const img = new Jimp(width, height, COLORS.dark);

    // Gradient background (simplified with rectangles)
    for (let i = 0; i < height; i++) {
        const r = Math.floor(10 + (i / height) * 8);
        const g = Math.floor(10 + (i / height) * 8);
        const b = Math.floor(15 + (i / height) * 15);
        for (let x = 0; x < width; x++) {
            img.setPixelColor(Jimp.cssColorToHex(`rgb(${r},${g},${b})`), x, i);
        }
    }

    // Border accent
    for (let x = 0; x < width; x++) {
        img.setPixelColor(Jimp.cssColorToHex(COLORS.primary), x, 0);
        img.setPixelColor(Jimp.cssColorToHex(COLORS.secondary), x, 1);
    }

    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
    const fontSmall = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
    const fontLarge = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);

    // Title
    img.print(fontLarge, 50, 50, 'Welcome!');

    // User name
    img.print(font, 50, 150, `@${userName}`);

    // Group name
    img.print(fontSmall, 50, 210, `to ${groupName}`);

    // Member count
    img.print(fontSmall, 50, 260, `Member #${memberCount}`);

    // Footer
    img.print(fontSmall, 50, 350, 'Elaina Bot v4.1.0');

    return img.getBufferAsync(Jimp.MIME_PNG);
}

/**
 * Generate leave card image
 */
async function generateLeaveImage({ userName, groupName }) {
    const width = 800;
    const height = 400;
    const img = new Jimp(width, height, COLORS.dark);

    // Gradient background
    for (let i = 0; i < height; i++) {
        const r = Math.floor(15 + (i / height) * 5);
        const g = Math.floor(10 + (i / height) * 3);
        const b = Math.floor(10 + (i / height) * 5);
        for (let x = 0; x < width; x++) {
            img.setPixelColor(Jimp.cssColorToHex(`rgb(${r},${g},${b})`), x, i);
        }
    }

    // Border accent (red for leave)
    for (let x = 0; x < width; x++) {
        img.setPixelColor(Jimp.cssColorToHex(COLORS.danger), x, 0);
    }

    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
    const fontSmall = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
    const fontLarge = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);

    img.print(fontLarge, 50, 50, 'Goodbye!');
    img.print(font, 50, 150, `@${userName}`);
    img.print(fontSmall, 50, 210, `Left ${groupName}`);
    img.print(fontSmall, 50, 350, 'Elaina Bot v4.1.0');

    return img.getBufferAsync(Jimp.MIME_PNG);
}

module.exports = { generateWelcomeImage, generateLeaveImage };
