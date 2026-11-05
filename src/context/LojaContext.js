import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import {
    adicionarItemAoCarrinho,
    alterarQuantidadeNoCarrinho,
    atualizarProdutoNoBanco,
    criarProduto,
    excluirProdutoDoBanco,
    inicializarBanco,
    limparCarrinhoNoBanco,
    listarCarrinho,
    listarProdutos,
    registrarPedido,
    removerItemDoCarrinho,
} from '../database/database';

const LojaContext = createContext(null);

export function LojaProvider({ children }) {
    const [produtos, setProdutos] = useState([]);
    const [carrinho, setCarrinho] = useState([]);
    const [carregando, setCarregando] = useState(true);

    const carregarDados = useCallback(async () => {
        const [produtosDoBanco, carrinhoDoBanco] = await Promise.all([
            listarProdutos(),
            listarCarrinho(),
        ]);

        setProdutos(produtosDoBanco);
        setCarrinho(carrinhoDoBanco);
    }, []);

    useEffect(() => {
        async function prepararLoja() {
            try {
                await inicializarBanco();
                await carregarDados();
            } catch (erro) {
                console.error('Não foi possível preparar o banco do FortFit.', erro);
            } finally {
                setCarregando(false);
            }
        }

        prepararLoja();
    }, [carregarDados]);

    async function adicionarProduto(dados) {
        await criarProduto({
            ...dados,
            marca: dados.marca ?? 'FortFit',
        });
        await carregarDados();
    }

    async function atualizarProduto(id, dados) {
        await atualizarProdutoNoBanco(id, dados);
        await carregarDados();
    }

    async function excluirProduto(id) {
        await excluirProdutoDoBanco(id);
        await carregarDados();
    }

    async function adicionarAoCarrinho(produto, quantidade = 1) {
        if (!produto || produto.estoque === 0) {
            return;
        }

        await adicionarItemAoCarrinho(produto, quantidade);
        await carregarDados();
    }

    async function alterarQuantidade(id, quantidade) {
        await alterarQuantidadeNoCarrinho(id, quantidade);
        await carregarDados();
    }

    async function removerDoCarrinho(id) {
        await removerItemDoCarrinho(id);
        await carregarDados();
    }

    async function limparCarrinho() {
        await limparCarrinhoNoBanco();
        await carregarDados();
    }

    async function finalizarPedido(dados) {
        const pedidoRegistrado = await registrarPedido(dados);

        if (pedidoRegistrado) {
            await carregarDados();
        }

        return pedidoRegistrado;
    }

    const quantidadeCarrinho = carrinho.reduce(
        (total, item) => total + item.quantidade,
        0
    );
    const totalCarrinho = carrinho.reduce(
        (total, item) => total + item.produto.preco * item.quantidade,
        0
    );

    const valor = useMemo(
        () => ({
            produtos,
            carrinho,
            carregando,
            quantidadeCarrinho,
            totalCarrinho,
            adicionarProduto,
            atualizarProduto,
            excluirProduto,
            adicionarAoCarrinho,
            alterarQuantidade,
            removerDoCarrinho,
            limparCarrinho,
            finalizarPedido,
        }),
        [
            produtos,
            carrinho,
            carregando,
            quantidadeCarrinho,
            totalCarrinho,
        ]
    );

    return <LojaContext.Provider value={valor}>{children}</LojaContext.Provider>;
}

export function useLoja() {
    const contexto = useContext(LojaContext);

    if (!contexto) {
        throw new Error('useLoja deve ser utilizado dentro de LojaProvider');
    }

    return contexto;
}
