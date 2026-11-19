function obterBaseUrl() {
    const url = process.env.EXPO_PUBLIC_FORTFIT_API_URL?.trim().replace(/\/$/, '');

    if (!url) {
        throw new Error('Configure EXPO_PUBLIC_FORTFIT_API_URL no arquivo .env do aplicativo.');
    }

    return url;
}

async function requisitar(caminho, opcoes = {}) {
    const resposta = await fetch(`${obterBaseUrl()}${caminho}`, {
        ...opcoes,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            ...(opcoes.headers || {}),
        },
    });

    const dados = await resposta.json().catch(() => ({}));
    if (!resposta.ok) {
        throw new Error(dados.erro || 'Não foi possível comunicar com o servidor de pagamentos.');
    }

    return dados;
}

export function gerarReferenciaPedido() {
    return `FF-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

export async function criarCheckoutMercadoPago({ referencia, produto, emailComprador }) {
    return requisitar('/api/checkout/preferences', {
        method: 'POST',
        body: JSON.stringify({
            externalReference: referencia,
            emailComprador,
            itens: [{
                id: String(produto.idProduto || produto.id || ''),
                title: produto.nomeProduto || produto.nome,
                quantity: Number(produto.quantidadeProduto || produto.quantidade || 1),
                unit_price: Number(produto.precoProduto || produto.preco),
            }],
        }),
    });
}

export async function consultarPagamentoMercadoPago(referencia) {
    return requisitar(`/api/checkout/status/${encodeURIComponent(referencia)}`);
}
