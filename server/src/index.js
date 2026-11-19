import 'dotenv/config';
import express from 'express';
import { MercadoPagoErro, consultarPagamento, consultarPagamentoPorId, criarPreferencia } from './mercadoPago.js';
import { validarWebhookMercadoPago } from './webhook.js';

const app = express();
const port = Number(process.env.PORT || 3333);
const origensPermitidas = new Set(
    String(process.env.CORS_ALLOWED_ORIGINS || '')
        .split(',')
        .map((origem) => origem.trim())
        .filter(Boolean)
);

app.use((req, res, next) => {
    const origem = req.headers.origin;
    if (!origem || origensPermitidas.has('*') || origensPermitidas.has(origem)) {
        if (origem) res.setHeader('Access-Control-Allow-Origin', origem);
        res.setHeader('Vary', 'Origin');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        if (req.method === 'OPTIONS') return res.sendStatus(204);
        return next();
    }
    return res.status(403).json({ erro: 'Origem não permitida.' });
});

app.use(express.json({ limit: '32kb' }));

app.get('/api/health', (_req, res) => {
    res.json({
        ok: true,
        mercadoPagoConfigurado: Boolean(process.env.MERCADO_PAGO_ACCESS_TOKEN),
        webhookConfigurado: Boolean(process.env.MERCADO_PAGO_WEBHOOK_SECRET),
    });
});

app.post('/api/checkout/preferences', async (req, res, next) => {
    try {
        const preferencia = await criarPreferencia({
            externalReference: req.body?.externalReference,
            itens: req.body?.itens,
            emailComprador: req.body?.emailComprador,
        });

        res.status(201).json(preferencia);
    } catch (erro) {
        next(erro);
    }
});

app.get('/api/checkout/status/:externalReference', async (req, res, next) => {
    try {
        const pagamento = await consultarPagamento(req.params.externalReference);
        res.json(pagamento);
    } catch (erro) {
        next(erro);
    }
});

app.post('/api/webhooks/mercado-pago', async (req, res, next) => {
    try {
        const dataId = req.query['data.id'] || req.body?.data?.id;
        const assinaturaValida = validarWebhookMercadoPago({
            assinatura: req.headers['x-signature'],
            requestId: req.headers['x-request-id'],
            dataId,
            secret: process.env.MERCADO_PAGO_WEBHOOK_SECRET,
        });

        if (!assinaturaValida) return res.sendStatus(401);
        if (dataId) await consultarPagamentoPorId(dataId);
        return res.sendStatus(200);
    } catch (erro) {
        next(erro);
    }
});

app.get('/pagamento/:resultado', (req, res) => {
    const mensagens = {
        sucesso: 'Pagamento aprovado. Volte ao aplicativo FortFit para confirmar seu pedido.',
        pendente: 'Seu pagamento está pendente. Volte ao aplicativo FortFit e consulte o status mais tarde.',
        falha: 'O pagamento não foi concluído. Você pode tentar novamente pelo aplicativo FortFit.',
    };

    const mensagem = mensagens[req.params.resultado] || 'Retorne ao aplicativo FortFit para acompanhar o seu pedido.';
    res.type('html').send(`<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>FortFit</title><body style="margin:0;background:#101010;color:#fff;font-family:Arial,sans-serif;display:grid;min-height:100vh;place-items:center"><main style="max-width:420px;padding:32px;text-align:center"><div style="color:#B7FF00;font-size:44px">✓</div><h1>FortFit</h1><p style="line-height:1.6;color:#ddd">${mensagem}</p></main></body></html>`);
});

app.use((erro, _req, res, _next) => {
    const status = erro instanceof MercadoPagoErro ? erro.status : 500;
    if (status >= 500) console.error(erro);
    res.status(status).json({ erro: erro.message || 'Erro interno no servidor.' });
});

app.listen(port, () => {
    console.log(`API de pagamentos FortFit em execução na porta ${port}`);
});
