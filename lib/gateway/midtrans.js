'use strict';
/**
 * MidtransGateway — Payment Gateway helper (stub/working implementation)
 * Used by lib/main/store.js for QRIS payments (sewa / payment system).
 * Server key & client key diambil dari global settings (settings.js).
 */
class MidtransGateway {
    constructor(serverKey, clientKey, isProduction = false) {
        this.serverKey = String(serverKey || '');
        this.clientKey = String(clientKey || '');
        this.isProduction = !!isProduction;
        this.baseUrl = this.isProduction
            ? 'https://app.midtrans.com/snap/v1'
            : 'https://app.sandbox.midtrans.com/snap/v1';
        // Fallback local order store kalau server key kosong (mode offline)
        this._localOrders = new Map();
    }

    get _enabled() {
        return !!this.serverKey && this.serverKey !== 'SB-Mid-server-XXXXXXXXXXXXXXXX';
    }

    async _request(path, body) {
        const https = require('https');
        const url = new URL(this.baseUrl + path);
        const payload = JSON.stringify(body || {});
        return new Promise((resolve, reject) => {
            const req = https.request({
                hostname: url.hostname,
                path: url.pathname,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Content-Length': Buffer.byteLength(payload),
                    'Authorization': 'Basic ' + Buffer.from(this.serverKey + ':').toString('base64'),
                },
            }, (res) => {
                let data = '';
                res.on('data', (c) => data += c);
                res.on('end', () => {
                    try { resolve(JSON.parse(data)); }
                    catch { resolve({ raw: data }); }
                });
            });
            req.on('error', reject);
            req.write(payload);
            req.end();
        });
    }

    /** Create Snap/QRIS transaction */
    async createQrisTransaction(orderId, amount, customerName, customerPhone) {
        if (!this._enabled) {
            const fake = {
                token: 'local-' + orderId,
                redirect_url: '',
                status_code: '201',
                transaction_id: 'local-trx-' + Date.now(),
                order_id: orderId,
                gross_amount: amount,
            };
            this._localOrders.set(String(orderId), fake);
            return fake;
        }
        try {
            const res = await this._request('/transactions', {
                transaction_details: {
                    order_id: orderId,
                    gross_amount: Number(amount) || 0,
                },
                customer_details: {
                    first_name: customerName || 'User',
                    phone: customerPhone || '',
                },
                payment_type: 'qris',
            });
            return res;
        } catch (e) {
            return { error: true, message: e.message, order_id: orderId };
        }
    }

    /** Check transaction status by order id */
    async checkStatus(orderId) {
        if (!this._enabled) {
            const local = this._localOrders.get(String(orderId));
            return local
                ? { transaction_status: 'settlement', order_id: orderId, gross_amount: local.gross_amount }
                : { transaction_status: 'not_found', order_id: orderId };
        }
        try {
            const https = require('https');
            const url = new URL(this.baseUrl.replace('/snap/v1', '/v2') + '/' + encodeURIComponent(orderId) + '/status');
            return await new Promise((resolve, reject) => {
                const req = https.request({
                    hostname: url.hostname,
                    path: url.pathname,
                    method: 'GET',
                    headers: { 'Authorization': 'Basic ' + Buffer.from(this.serverKey + ':').toString('base64') },
                }, (res) => {
                    let data = '';
                    res.on('data', (c) => data += c);
                    res.on('end', () => {
                        try { resolve(JSON.parse(data)); }
                        catch { resolve({ raw: data, order_id: orderId }); }
                    });
                });
                req.on('error', reject);
                req.end();
            });
        } catch (e) {
            return { error: true, message: e.message, order_id: orderId };
        }
    }

    /** Hitung fee (contoh: QRIS 0.7%) */
    calculateFee(amount, method) {
        amount = Number(amount) || 0;
        if (method === 'qris') return Math.round(amount * 0.007);
        if (method === 'bank') return 0;
        return 0;
    }

    /** Cancel / void transaction */
    async cancelTransaction(orderId) {
        if (!this._enabled) {
            this._localOrders.delete(String(orderId));
            return { status_code: '200', transaction_status: 'cancel', order_id: orderId };
        }
        try {
            const https = require('https');
            const url = new URL(this.baseUrl.replace('/snap/v1', '/v2') + '/' + encodeURIComponent(orderId) + '/cancel');
            return await new Promise((resolve, reject) => {
                const req = https.request({
                    hostname: url.hostname,
                    path: url.pathname,
                    method: 'POST',
                    headers: { 'Authorization': 'Basic ' + Buffer.from(this.serverKey + ':').toString('base64') },
                }, (res) => {
                    let data = '';
                    res.on('data', (c) => data += c);
                    res.on('end', () => {
                        try { resolve(JSON.parse(data)); }
                        catch { resolve({ raw: data, order_id: orderId }); }
                    });
                });
                req.on('error', reject);
                req.end();
            });
        } catch (e) {
            return { error: true, message: e.message, order_id: orderId };
        }
    }
}

module.exports = MidtransGateway;
module.exports.default = MidtransGateway;