import React, { createContext, useContext, useMemo, useState } from 'react';
import { PRODUTOS_INICIAIS } from '../data/produtos';

const LojaContext = createContext(null);

export function LojaProvider({ children }) {
    const [produtos, setProdutos] = useState(PRODUTOS_INICIAIS);
    const [carrinho, setCarrinho] = useState([]);

    function adicionarProduto(dados) {
        const novoProduto = {
            ...dados,
            id: String(Date.now()),
            foto: dados.foto ?? null,
        };
        setProdutos((listaAtual) => [novoProduto, ...listaAtual]);
    }

    function atualizarProduto(id, dados) {
        setProdutos((listaAtual) =>
            listaAtual.map((produto) =>
                produto.id === id ? { ...produto, ...dados, id } : produto
            )
        );
    }

    function excluirProduto(id) {
        setProdutos((listaAtual) => listaAtual.filter((produto) => produto.id !== id));
        setCarrinho((listaAtual) => listaAtual.filter((item) => item.produto.id !== id));
    }

    function adicionarAoCarrinho(produto, quantidade = 1) {
        if (!produto || produto.estoque === 0) return;

        setCarrinho((listaAtual) => {
            const itemExistente = listaAtual.find((item) => item.produto.id === produto.id);
            if (itemExistente) {
                return listaAtual.map((item) =>
                    item.produto.id === produto.id
                        ? {
                            ...item,
                            quantidade: Math.min(item.quantidade + quantidade, produto.estoque),
                        }
                        : item
                );
            }
            return [...listaAtual, { produto, quantidade: Math.min(quantidade, produto.estoque) }];
        });
    }

    function alterarQuantidade(id, quantidade) {
        if (quantidade <= 0) {
            removerDoCarrinho(id);
            return;
        }
        setCarrinho((listaAtual) =>
            listaAtual.map((item) =>
                item.produto.id === id
                    ? { ...item, quantidade: Math.min(quantidade, item.produto.estoque) }
                    : item
            )
        );
    }

    function removerDoCarrinho(id) {
        setCarrinho((listaAtual) => listaAtual.filter((item) => item.produto.id !== id));
    }

    function limparCarrinho() {
        setCarrinho([]);
    }

    const quantidadeCarrinho = carrinho.reduce((total, item) => total + item.quantidade, 0);
    const totalCarrinho = carrinho.reduce(
        (total, item) => total + item.produto.preco * item.quantidade,
        0
    );

    const valor = useMemo(
        () => ({
            produtos,
            carrinho,
            quantidadeCarrinho,
            totalCarrinho,
            adicionarProduto,
            atualizarProduto,
            excluirProduto,
            adicionarAoCarrinho,
            alterarQuantidade,
            removerDoCarrinho,
            limparCarrinho,
        }),
        [produtos, carrinho, quantidadeCarrinho, totalCarrinho]
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

