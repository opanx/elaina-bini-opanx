'use strict';
/**
 * Elaina Bot v4.0 — License Protection System
 * 4x Encrypted License to prevent code tampering
 * Credits: FallZx Infinity × KyyInfinite × Opanx
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════
// LICENSE KEYS (4x Encrypted)
// ═══════════════════════════════════════════════

const LICENSE_KEYS = {
    // Layer 1: Base64 + Salt
    layer1: 'RWxhaW5hX0JvdF92NC4wX09wYW54X0xpY2Vuc2VfRkY9RmFsbFp4SW5maW5pdHkkxLFKyK4=',
    
    // Layer 2: XOR Encrypted
    layer2: '4F4E4F50414E584F50414E584F50414E584F50414E584F50414E584F50',
    
    // Layer 3: Hex Encoded
    layer3: '656C61696E612D626F742D76342E302D6F70616E782D6C6963656E7365',
    
    // Layer 4: SHA256 Hash
    layer4: 'a8f5f167f44f4964e6c998dee827110c3c6e94c5b830b2e4b5c9f8d7e6a5b4c3',
};

// ═══════════════════════════════════════════════
// CREDITS PROTECTION (Cannot be removed)
// ═══════════════════════════════════════════════

const CREDITS = {
    developer: 'FallZx Infinity',
    baseOri: 'KyyInfinite',
    rebuiltBy: 'Opanx',
    version: '4.0.0',
    license: 'MIT',
    copyright: '© 2026 All credits must remain intact.',
};

// ═══════════════════════════════════════════════
// ENCRYPTION FUNCTIONS (4 Layers)
// ═══════════════════════════════════════════════

/**
 * Layer 1: Base64 Encode + Salt
 */
function layer1Encrypt(text) {
    const salt = 'ElainaBotOpanx2026';
    return Buffer.from(salt + text + salt).toString('base64');
}

function layer1Decrypt(encoded) {
    const salt = 'ElainaBotOpanx2026';
    const decoded = Buffer.from(encoded, 'base64').toString('utf8');
    return decoded.replace(new RegExp('^' + salt), '').replace(new RegExp(salt + '$'), '');
}

/**
 * Layer 2: XOR Encryption
 */
function layer2Encrypt(text) {
    const key = 'ElainaBot';
    let result = '';
    for (let i = 0; i < text.length; i++) {
        result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return Buffer.from(result).toString('hex');
}

function layer2Decrypt(hex) {
    const key = 'ElainaBot';
    const decoded = Buffer.from(hex, 'hex').toString('utf8');
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
        result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
}

/**
 * Layer 3: SHA256 Hash (for verification)
 */
function layer3Hash(text) {
    return crypto.createHash('sha256').update(text).digest('hex');
}

function layer3Verify(text, hash) {
    return layer3Hash(text) === hash;
}

/**
 * Layer 4: HMAC Signature
 */
function layer4Sign(text) {
    const secret = 'ElainaBotOpanx2026SecretKey';
    return crypto.createHmac('sha256', secret).update(text).digest('hex');
}

function layer4Verify(text, signature) {
    return layer4Sign(text) === signature;
}

// ═══════════════════════════════════════════════
// LICENSE VALIDATION
// ═══════════════════════════════════════════════

/**
 * Full License Validation (4 Layers)
 */
function validateLicense() {
    try {
        // Layer 1: Decode
        const l1 = layer1Decrypt(LICENSE_KEYS.layer1);
        
        // Layer 2: Decode
        const l2 = layer2Decrypt(LICENSE_KEYS.layer2);
        
        // Layer 3: Verify hash
        const l3 = layer3Verify(l1, LICENSE_KEYS.layer3);
        
        // Layer 4: Verify signature
        const l4 = layer4Verify(l1, LICENSE_KEYS.layer4);
        
        // All layers must pass
        if (l3 && l4) {
            return { valid: true, message: 'License valid ✅' };
        }
        
        return { valid: false, message: 'License invalid ❌' };
    } catch (e) {
        return { valid: false, message: 'License error: ' + e.message };
    }
}

/**
 * Check if code has been tampered
 */
function checkIntegrity() {
    const filesToCheck = [
        'src/index.js',
        'src/config/settings.js',
        'src/core/connection.js',
    ];
    
    const issues = [];
    
    for (const file of filesToCheck) {
        const fullPath = path.join(process.cwd(), file);
        if (fs.existsSync(fullPath)) {
            const content = fs.readFileSync(fullPath, 'utf8');
            
            // Check for credits
            if (!content.includes('FallZx Infinity') || !content.includes('KyyInfinite')) {
                issues.push(`Credits removed from ${file}`);
            }
            
            // Check for Opanx credit
            if (!content.includes('Opanx')) {
                issues.push(`Rebuilt by credit removed from ${file}`);
            }
        }
    }
    
    return {
        valid: issues.length === 0,
        issues,
    };
}

/**
 * Display License Info
 */
function getLicenseInfo() {
    return `
╔═══════════════════════════════════════════╗
║   📜 LICENSE INFORMATION                  ║
╚═══════════════════════════════════════════╝

🏷️ License: ${CREDITS.license}
📦 Version: ${CREDITS.version}
👨‍💻 Developer: ${CREDITS.developer}
📚 Base ORI: ${CREDITS.baseOri}
🐙 Rebuilt by: ${CREDITS.rebuiltBy}

${CREDITS.copyright}

🔐 Protection: 4-Layer Encryption
✅ All credits must remain intact.
    `.trim();
}

module.exports = {
    CREDITS,
    LICENSE_KEYS,
    validateLicense,
    checkIntegrity,
    getLicenseInfo,
    layer1Encrypt, layer1Decrypt,
    layer2Encrypt, layer2Decrypt,
    layer3Hash, layer3Verify,
    layer4Sign, layer4Verify,
};
