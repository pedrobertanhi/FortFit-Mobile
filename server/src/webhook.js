import crypto from 'node:crypto';

function camposAssinatura(cabecalho) {
    return Object.fromEntries(
        String(cabecalho || '')
            .split(',')
            .map((parte) => parte.trim().split('='))
            .filter(([chave, valor]) => chave && valor)
    );
}

export function validarWebhookMercadoPago({ assinatura, requestId, dataId, secret }) {
    if (!secret || !assinatura || !dataId) return false;

    const { ts, v1 } = camposAssinatura(assinatura);
    if (!ts || !v1) return false;

    const manifesto = [
        `id:${String(dataId).toLowerCase()};`,
        requestId ? `request-id:${requestId};` : '',
        `ts:${ts};`,
    ].join('');

    const esperado = crypto.createHmac('sha256', secret).update(manifesto).digest('hex');
    const recebido = Buffer.from(v1, 'utf8');
    const calculado = Buffer.from(esperado, 'utf8');

    return recebido.length === calculado.length && crypto.timingSafeEqual(recebido, calculado);
}
