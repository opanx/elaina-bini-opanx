'use strict';

/**
 * Midtrans Payment Gateway - Stub
 * Prevents crash when midtrans is not configured.
 * Replace with real implementation when you have API keys.
 */

class MidtransGateway {
    constructor(serverKey, clientKey, isProduction = false) {
        this.serverKey = serverKey || '';
        this.clientKey = clientKey || '';
        this.isProduction = isProduction;
        this.baseUrl = isProduction
            ? 'https://api.midtrans.com'
            : 'https://api.sandbox.midtrans.com';
    }

    async createTransaction(params) {
        console.log('[Midtrans] Transaction requested (stub mode):', params);
        return {
            token: 'STUB_TOKEN_' + Date.now(),
            redirect_url: 'https://example.com/pay',
            status: 'pending',
        };
    }

    async checkTransaction(orderId) {
        console.log('[Midtrans] Check transaction (stub mode):', orderId);
        return {
            order_id: orderId,
            transaction_status: 'pending',
            status_code: '201',
        };
    }

    async cancelTransaction(orderId) {
        console.log('[Midtrans] Cancel transaction (stub mode):', orderId);
        return { order_id: orderId, transaction_status: 'cancelled' };
    }

    verifyNotification(body) {
        // Basic signature verification stub
        return true;
    }
}

module.exports = MidtransGateway;
