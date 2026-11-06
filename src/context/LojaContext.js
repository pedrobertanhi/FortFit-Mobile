import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { adicionarItemAoCarrinho, alterarQuantidadeNoCarrinho, atualizarProdutoNoBanco, atualizarSenhaUsuario, buscarSessaoAtual, cadastrarUsuario as cadastrarUsuarioNoBanco, criarProduto, emailEstaCadastrado, encerrarSessao, excluirContaUsuario, excluirProdutoDoBanco, inicializarBanco, limparCarrinhoNoBanco, listarCarrinho, listarProdutos, listarPedidosDoUsuario, registrarPedido, removerItemDoCarrinho, autenticarUsuario } from '../database/database';

const LojaContext = createContext(null);

export function LojaProvider({ children }) {
    const [produtos, setProdutos] = useState([]);
    const [carrinho, setCarrinho] = useState([]);
    const [usuario, setUsuario] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const carregarDados = useCallback(async () => { const [produtosDoBanco, carrinhoDoBanco] = await Promise.all([listarProdutos(), listarCarrinho()]); setProdutos(produtosDoBanco); setCarrinho(carrinhoDoBanco); }, []);
    useEffect(() => { async function prepararLoja() { try { await inicializarBanco(); const sessao = await buscarSessaoAtual(); setUsuario(sessao); await carregarDados(); } catch (erro) { console.error('Não foi possível preparar o banco do FortFit.', erro); } finally { setCarregando(false); } } prepararLoja(); }, [carregarDados]);
    async function entrar(email, senha) { const usuarioAutenticado = await autenticarUsuario(email, senha); if (usuarioAutenticado) setUsuario(usuarioAutenticado); return usuarioAutenticado; }
    async function cadastrarUsuario(dados) { return cadastrarUsuarioNoBanco(dados); }
    async function sair() { await encerrarSessao(); setUsuario(null); }
    async function excluirMinhaConta() { if (!usuario) return false; await excluirContaUsuario(usuario.id); setUsuario(null); setCarrinho([]); return true; }
    async function verificarEmailCadastrado(email) { return emailEstaCadastrado(email); }
    async function redefinirSenha(email, senha) { return atualizarSenhaUsuario(email, senha); }
    async function adicionarProduto(dados) { await criarProduto({ ...dados, marca: dados.marca ?? 'FortFit' }); await carregarDados(); }
    async function atualizarProduto(id, dados) { await atualizarProdutoNoBanco(id, dados); await carregarDados(); }
    async function excluirProduto(id) { await excluirProdutoDoBanco(id); await carregarDados(); }
    async function adicionarAoCarrinho(produto, quantidade = 1) { if (!produto || produto.estoque === 0) return; await adicionarItemAoCarrinho(produto, quantidade); await carregarDados(); }
    async function alterarQuantidade(id, quantidade) { await alterarQuantidadeNoCarrinho(id, quantidade); await carregarDados(); }
    async function removerDoCarrinho(id) { await removerItemDoCarrinho(id); await carregarDados(); }
    async function limparCarrinho() { await limparCarrinhoNoBanco(); await carregarDados(); }
    async function finalizarPedido(dados) { const pedidoRegistrado = await registrarPedido({ ...dados, usuarioId: usuario?.id }); if (pedidoRegistrado) await carregarDados(); return pedidoRegistrado; }
    async function listarMeusPedidos() { return usuario ? listarPedidosDoUsuario(usuario.id) : []; }
    const quantidadeCarrinho = carrinho.reduce((total, item) => total + item.quantidade, 0);
    const totalCarrinho = carrinho.reduce((total, item) => total + item.produto.preco * item.quantidade, 0);
    const valor = useMemo(() => ({ produtos, carrinho, usuario, carregando, quantidadeCarrinho, totalCarrinho, entrar, cadastrarUsuario, sair, excluirMinhaConta, verificarEmailCadastrado, redefinirSenha, adicionarProduto, atualizarProduto, excluirProduto, adicionarAoCarrinho, alterarQuantidade, removerDoCarrinho, limparCarrinho, finalizarPedido, listarMeusPedidos }), [produtos, carrinho, usuario, carregando, quantidadeCarrinho, totalCarrinho]);
    return <LojaContext.Provider value={valor}>{children}</LojaContext.Provider>;
}
export function useLoja() { const contexto = useContext(LojaContext); if (!contexto) throw new Error('useLoja deve ser utilizado dentro de LojaProvider'); return contexto; }
