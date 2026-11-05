import * as SQLite from 'expo-sqlite';
import { IMAGENS_PRODUTOS, PRODUTOS_INICIAIS } from '../data/produtos';

let bancoPromise;

function obterBanco() {
    if (!bancoPromise) bancoPromise = SQLite.openDatabaseAsync('fortfit.db');
    return bancoPromise;
}

function gerarId() {
    return `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

function normalizarEmail(email) {
    return email.trim().toLowerCase();
}

function usuarioDaLinha(linha) {
    if (!linha) return null;
    return {
        id: String(linha.id), nome: linha.nome, email: linha.email,
        telefone: linha.telefone, perfil: linha.perfil,
    };
}

function fotoParaBanco(foto) {
    if (typeof foto === 'string') return { tipo: 'uri', valor: foto };
    if (foto?.uri) return { tipo: 'uri', valor: foto.uri };
    const entrada = Object.entries(IMAGENS_PRODUTOS).find(([, imagem]) => imagem === foto);
    return { tipo: entrada ? 'asset' : null, valor: entrada ? entrada[0] : null };
}

function produtoDaLinha(linha) {
    let foto = null;
    if (linha.foto_tipo === 'asset') foto = IMAGENS_PRODUTOS[linha.foto_valor] ?? null;
    if (linha.foto_tipo === 'uri' && linha.foto_valor) foto = { uri: linha.foto_valor };
    return { id: String(linha.id), nome: linha.nome, marca: linha.marca,
        categoria: linha.categoria, descricao: linha.descricao, preco: Number(linha.preco),
        estoque: Number(linha.estoque), foto };
}

async function inserirProduto(db, produto) {
    const foto = fotoParaBanco(produto.foto);
    await db.runAsync(`INSERT INTO produtos (id, nome, marca, categoria, descricao, preco, estoque, foto_tipo, foto_valor) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, produto.id, produto.nome, produto.marca, produto.categoria, produto.descricao, produto.preco, produto.estoque, foto.tipo, foto.valor);
}

export async function inicializarBanco() {
    const db = await obterBanco();
    await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS produtos (id TEXT PRIMARY KEY NOT NULL, nome TEXT NOT NULL, marca TEXT NOT NULL, categoria TEXT NOT NULL, descricao TEXT NOT NULL, preco REAL NOT NULL, estoque INTEGER NOT NULL, foto_tipo TEXT, foto_valor TEXT);
        CREATE TABLE IF NOT EXISTS carrinho_itens (produto_id TEXT PRIMARY KEY NOT NULL, quantidade INTEGER NOT NULL, FOREIGN KEY (produto_id) REFERENCES produtos(id));
        CREATE TABLE IF NOT EXISTS pedidos (id TEXT PRIMARY KEY NOT NULL, criado_em TEXT NOT NULL, forma_pagamento TEXT NOT NULL, cep TEXT NOT NULL, rua TEXT NOT NULL, bairro TEXT NOT NULL, numero TEXT NOT NULL, complemento TEXT, total REAL NOT NULL);
        CREATE TABLE IF NOT EXISTS pedido_itens (id INTEGER PRIMARY KEY AUTOINCREMENT, pedido_id TEXT NOT NULL, produto_id TEXT NOT NULL, nome_produto TEXT NOT NULL, preco_unitario REAL NOT NULL, quantidade INTEGER NOT NULL, FOREIGN KEY (pedido_id) REFERENCES pedidos(id));
        CREATE TABLE IF NOT EXISTS usuarios (id TEXT PRIMARY KEY NOT NULL, nome TEXT NOT NULL, email TEXT UNIQUE NOT NULL, telefone TEXT, senha TEXT NOT NULL, perfil TEXT NOT NULL CHECK(perfil IN ('cliente', 'admin')), criado_em TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS sessao (id INTEGER PRIMARY KEY CHECK(id = 1), usuario_id TEXT NOT NULL, FOREIGN KEY (usuario_id) REFERENCES usuarios(id));
    `);
    const quantidadeProdutos = await db.getFirstAsync('SELECT COUNT(*) AS total FROM produtos');
    if (Number(quantidadeProdutos?.total) === 0) {
        for (const produto of PRODUTOS_INICIAIS) await inserirProduto(db, produto);
    }
    const quantidadeUsuarios = await db.getFirstAsync('SELECT COUNT(*) AS total FROM usuarios');
    if (Number(quantidadeUsuarios?.total) === 0) {
        await db.runAsync('INSERT INTO usuarios (id, nome, email, telefone, senha, perfil, criado_em) VALUES (?, ?, ?, ?, ?, ?, ?)', 'admin-fortfit', 'Administrador FortFit', 'admin@fortfit.com', '(11) 99999-0000', 'admin123', 'admin', new Date().toISOString());
        await db.runAsync('INSERT INTO usuarios (id, nome, email, telefone, senha, perfil, criado_em) VALUES (?, ?, ?, ?, ?, ?, ?)', 'cliente-fortfit', 'Cliente FortFit', 'cliente@fortfit.com', '(11) 99999-9999', 'fortfit123', 'cliente', new Date().toISOString());
    }
}

export async function cadastrarUsuario({ nome, email, telefone, senha }) {
    const db = await obterBanco();
    const emailNormalizado = normalizarEmail(email);
    const existente = await db.getFirstAsync('SELECT id FROM usuarios WHERE email = ?', emailNormalizado);
    if (existente) throw new Error('EMAIL_JA_CADASTRADO');
    const usuario = { id: gerarId(), nome: nome.trim(), email: emailNormalizado, telefone: telefone.trim(), perfil: 'cliente' };
    await db.runAsync('INSERT INTO usuarios (id, nome, email, telefone, senha, perfil, criado_em) VALUES (?, ?, ?, ?, ?, ?, ?)', usuario.id, usuario.nome, usuario.email, usuario.telefone, senha, usuario.perfil, new Date().toISOString());
    return usuario;
}

export async function autenticarUsuario(email, senha) {
    const db = await obterBanco();
    const linha = await db.getFirstAsync('SELECT * FROM usuarios WHERE email = ? AND senha = ?', normalizarEmail(email), senha);
    if (!linha) return null;
    await db.runAsync('INSERT OR REPLACE INTO sessao (id, usuario_id) VALUES (1, ?)', linha.id);
    return usuarioDaLinha(linha);
}

export async function buscarSessaoAtual() {
    const db = await obterBanco();
    const linha = await db.getFirstAsync('SELECT usuarios.* FROM sessao INNER JOIN usuarios ON usuarios.id = sessao.usuario_id WHERE sessao.id = 1');
    return usuarioDaLinha(linha);
}

export async function encerrarSessao() {
    const db = await obterBanco();
    await db.runAsync('DELETE FROM sessao WHERE id = 1');
}

export async function emailEstaCadastrado(email) {
    const db = await obterBanco();
    const usuario = await db.getFirstAsync('SELECT id FROM usuarios WHERE email = ?', normalizarEmail(email));
    return Boolean(usuario);
}

export async function atualizarSenhaUsuario(email, senha) {
    const db = await obterBanco();
    const resultado = await db.runAsync('UPDATE usuarios SET senha = ? WHERE email = ?', senha, normalizarEmail(email));
    return resultado.changes > 0;
}

export async function listarProdutos() { const db = await obterBanco(); const linhas = await db.getAllAsync('SELECT * FROM produtos ORDER BY nome'); return linhas.map(produtoDaLinha); }
export async function criarProduto(dados) { const db = await obterBanco(); const produto = { ...dados, id: gerarId(), foto: dados.foto ?? null }; await inserirProduto(db, produto); return produto; }
export async function atualizarProdutoNoBanco(id, dados) { const db = await obterBanco(); const foto = fotoParaBanco(dados.foto); await db.runAsync('UPDATE produtos SET nome = ?, marca = ?, categoria = ?, descricao = ?, preco = ?, estoque = ?, foto_tipo = ?, foto_valor = ? WHERE id = ?', dados.nome, dados.marca, dados.categoria, dados.descricao, dados.preco, dados.estoque, foto.tipo, foto.valor, id); }
export async function excluirProdutoDoBanco(id) { const db = await obterBanco(); await db.runAsync('DELETE FROM carrinho_itens WHERE produto_id = ?', id); await db.runAsync('DELETE FROM produtos WHERE id = ?', id); }
export async function listarCarrinho() { const db = await obterBanco(); const linhas = await db.getAllAsync('SELECT carrinho_itens.quantidade, produtos.* FROM carrinho_itens INNER JOIN produtos ON produtos.id = carrinho_itens.produto_id ORDER BY produtos.nome'); return linhas.map((linha) => ({ produto: produtoDaLinha(linha), quantidade: Number(linha.quantidade) })); }
export async function adicionarItemAoCarrinho(produto, quantidade) { const db = await obterBanco(); const item = await db.getFirstAsync('SELECT quantidade FROM carrinho_itens WHERE produto_id = ?', produto.id); const quantidadeFinal = Math.min(Number(item?.quantidade ?? 0) + quantidade, Number(produto.estoque)); if (quantidadeFinal <= 0) return; if (item) { await db.runAsync('UPDATE carrinho_itens SET quantidade = ? WHERE produto_id = ?', quantidadeFinal, produto.id); return; } await db.runAsync('INSERT INTO carrinho_itens (produto_id, quantidade) VALUES (?, ?)', produto.id, quantidadeFinal); }
export async function alterarQuantidadeNoCarrinho(id, quantidade) { const db = await obterBanco(); if (quantidade <= 0) { await db.runAsync('DELETE FROM carrinho_itens WHERE produto_id = ?', id); return; } const produto = await db.getFirstAsync('SELECT estoque FROM produtos WHERE id = ?', id); const quantidadeFinal = Math.min(quantidade, Number(produto?.estoque ?? 0)); if (quantidadeFinal <= 0) { await db.runAsync('DELETE FROM carrinho_itens WHERE produto_id = ?', id); return; } await db.runAsync('UPDATE carrinho_itens SET quantidade = ? WHERE produto_id = ?', quantidadeFinal, id); }
export async function removerItemDoCarrinho(id) { const db = await obterBanco(); await db.runAsync('DELETE FROM carrinho_itens WHERE produto_id = ?', id); }
export async function limparCarrinhoNoBanco() { const db = await obterBanco(); await db.runAsync('DELETE FROM carrinho_itens'); }
export async function registrarPedido(dados) { const db = await obterBanco(); const itens = await listarCarrinho(); if (itens.length === 0) return false; const total = itens.reduce((acumulado, item) => acumulado + item.produto.preco * item.quantidade, 0); await db.withTransactionAsync(async () => { await db.runAsync('INSERT INTO pedidos (id, criado_em, forma_pagamento, cep, rua, bairro, numero, complemento, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', dados.numeroPedido, new Date().toISOString(), dados.formaPagamento, dados.endereco.cep, dados.endereco.rua, dados.endereco.bairro, dados.endereco.numero, dados.endereco.complemento, total); for (const item of itens) { await db.runAsync('INSERT INTO pedido_itens (pedido_id, produto_id, nome_produto, preco_unitario, quantidade) VALUES (?, ?, ?, ?, ?)', dados.numeroPedido, item.produto.id, item.produto.nome, item.produto.preco, item.quantidade); await db.runAsync('UPDATE produtos SET estoque = MAX(estoque - ?, 0) WHERE id = ?', item.quantidade, item.produto.id); } await db.runAsync('DELETE FROM carrinho_itens'); }); return true; }
