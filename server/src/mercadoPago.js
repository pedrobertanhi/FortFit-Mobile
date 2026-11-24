const API_BASE = 'https://api.mercadopago.com';

export class MercadoPagoErro extends Error {
    constructor(message, status = 502) {
        super(message);
        this.status = status;
    }
}

function validarReferencia(externalReference) {
    if (!/^[A-Za-z0-9_-]{1,64}$/.test(externalReference)) {
        throw new MercadoPagoErro('Referência de pedido inválida.', 400);
    }
}

function normalizarItens(itens) {
    if (!Array.isArray(itens) || itens.length === 0 || itens.length > 20) {
        throw new MercadoPagoErro('Informe entre 1 e 20 itens para o pedido.', 400);
    }

    return itens.map((item) => {
        const title = String(item?.title || '').trim();
        const quantity = Number(item?.quantity);
        const unitPrice = Number(item?.unit_price);

        if (!title || title.length > 256 || !Number.isInteger(quantity) || quantity < 1 || quantity > 20 || !Number.isFinite(unitPrice) || unitPrice <= 0) {
            throw new MercadoPagoErro('Item de pagamento inválido.', 400);
        }

        return {
            id: String(item.id || '').slice(0, 64) || undefined,
            title,
            quantity,
            currency_id: 'BRL',
            unit_price: Math.round(unitPrice * 100) / 100,
        };
    });
}

async function requisitar(caminho, { method = 'GET', body } = {}) {
    const token = process.env.MERCADO_PAGO_ACCESS_TOKEN?.trim();
    if (!token) throw new MercadoPagoErro('O Access Token do Mercado Pago ainda não foi configurado no servidor.', 503);

    const resposta = await fetch(`${API_BASE}${caminho}`, {
        method,
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    const texto = await resposta.text();
    let dados = {};
    try { dados = texto ? JSON.parse(texto) : {}; } catch { dados = {}; }

    if (!resposta.ok) {
        const mensagem = dados.message || dados.error || 'Não foi possível comunicar com o Mercado Pago.';
        throw new MercadoPagoErro(mensagem, resposta.status >= 400 && resposta.status < 500 ? 400 : 502);
    }

    return dados;
}

export async function criarPreferencia({ externalReference, itens }) {
    validarReferencia(externalReference);
    const publicBaseUrl = process.env.PUBLIC_BASE_URL?.replace(/\/$/, '');
    const preference = {
        items: normalizarItens(itens),
        external_reference: externalReference,
        statement_descriptor: 'FORTFIT',
        payment_methods: { installments: 12 },
    };

    if (publicBaseUrl) {
        preference.back_urls = {
            success: `${publicBaseUrl}/pagamento/sucesso`,
            pending: `${publicBaseUrl}/pagamento/pendente`,
            failure: `${publicBaseUrl}/pagamento/falha`,
        };
        preference.auto_return = 'approved';
        preference.notification_url = `${publicBaseUrl}/api/webhooks/mercado-pago`;
    }

    const resposta = await requisitar('/checkout/preferences', { method: 'POST', body: preference });
    const ambienteTeste = process.env.MERCADO_PAGO_ENVIRONMENT !== 'production';
    const sandboxInitPoint = resposta.sandbox_init_point || null;
    const initPoint = ambienteTeste && sandboxInitPoint
        ? sandboxInitPoint
        : resposta.init_point;

    return {
        preferenceId: resposta.id,
        initPoint,
        sandboxInitPoint,
    };
}

export async function consultarPagamento(externalReference) {
    validarReferencia(externalReference);
    const filtros = new URLSearchParams({
        external_reference: externalReference,
        sort: 'date_created',
        criteria: 'desc',
        limit: '1',
    });
    const resposta = await requisitar(`/v1/payments/search?${filtros}`);
    const pagamento = resposta.results?.[0];

    if (!pagamento) {
        return { status: 'not_found', paymentId: null, statusDetail: null };
    }

    return {
        status: pagamento.status,
        paymentId: String(pagamento.id),
        statusDetail: pagamento.status_detail || null,
    };
}

export async function consultarPagamentoPorId(paymentId) {
    if (!/^\d+$/.test(String(paymentId))) throw new MercadoPagoErro('Identificador de pagamento inválido.', 400);
    const pagamento = await requisitar(`/v1/payments/${paymentId}`);
    return {
        status: pagamento.status,
        paymentId: String(pagamento.id),
        statusDetail: pagamento.status_detail || null,
        externalReference: pagamento.external_reference || null,
    };
}
