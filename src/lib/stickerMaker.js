'use strict';
/**
 * Elaina Bot v4.1.0 — Sticker Maker
 * Image → Sticker, Text → Sticker, Emoji Mix
 */

const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');

const STICKER_PACK = 'Elaina Bot';
const STICKER_AUTHOR = 'Panxcz × Opanx';

/**
 * Create sticker from image buffer
 */
async function createStickerFromImage(imageBuffer, options = {}) {
    const sticker = new Sticker(imageBuffer, {
        pack: options.pack || STICKER_PACK,
        author: options.author || STICKER_AUTHOR,
        type: options.full ? StickerTypes.FULL : StickerTypes.CROPPED,
        quality: options.quality || 70,
    });
    return sticker.toBuffer();
}

/**
 * Create sticker from text (with background)
 */
async function createStickerFromText(text, options = {}) {
    const width = options.width || 512;
    const height = options.height || 512;
    const bgColor = options.bgColor || '#1a1a2e';
    const textColor = options.textColor || '#ffffff';

    // Create image with jimp
    const image = new Jimp(width, height, bgColor);
    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);

    // Center text
    const textWidth = Jimp.measureText(font, text);
    const x = (width - textWidth) / 2;
    const y = height / 2 - 16;

    image.print(font, x, y, {
        text,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
    });

    const buffer = await image.getBufferAsync(Jimp.MIME_PNG);
    return createStickerFromImage(buffer, options);
}

/**
 * Create sticker from emoji (large emoji on background)
 */
async function createEmojiSticker(emoji, options = {}) {
    const width = 512;
    const height = 512;
    const bgColor = options.bgColor || '#1a1a2e';

    const image = new Jimp(width, height, bgColor);
    const font = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);

    const textWidth = Jimp.measureText(font, emoji);
    const x = (width - textWidth) / 2;
    const y = height / 2 - 64;

    image.print(font, x, y, emoji);

    const buffer = await image.getBufferAsync(Jimp.MIME_PNG);
    return createStickerFromImage(buffer, options);
}

/**
 * Resize image to 512x512 for sticker
 */
async function resizeForSticker(imageBuffer) {
    const image = await Jimp.read(imageBuffer);
    image.resize(512, 512);
    return image.getBufferAsync(Jimp.MIME_PNG);
}

module.exports = {
    createStickerFromImage,
    createStickerFromText,
    createEmojiSticker,
    resizeForSticker,
    STICKER_PACK,
    STICKER_AUTHOR,
};
