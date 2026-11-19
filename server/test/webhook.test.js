import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import test from 'node:test';
import { validarWebhookMercadoPago } from '../src/webhook.js';

const secret = 'segredo-de-teste';
const requestId = 'request-123';
const dataId = '987654';
const timestamp = '1742505638683';
const manifesto = `id:${dataId};request-id:${requestId};ts:${timestamp};`;
const assinatura = crypto.createHmac('sha256', secret).update(manifesto).digest('hex');

test('aceita uma assinatura válida do Mercado Pago', () => {
    assert.equal(
        validarWebhookMercadoPago({
            assinatura: `ts=${timestamp},v1=${assinatura}`,
            requestId,
            dataId,
            secret,
        }),
        true
    );
});

test('rejeita uma assinatura inválida do Mercado Pago', () => {
    assert.equal(
        validarWebhookMercadoPago({
            assinatura: `ts=${timestamp},v1=assinatura-invalida`,
            requestId,
            dataId,
            secret,
        }),
        false
    );
});
