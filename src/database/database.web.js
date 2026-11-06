import { PRODUTOS_INICIAIS } from '../data/produtos';

const CHAVE_BANCO = 'fortfit-web-db-v1';

function gerarId() {
    return String(Date.now()) + '-' + String(Math.floor(Math.random() * 100000));
}

function dadosIniciais() {
    return {
        produtos: PRODUTOS_INICIAIS,
        carrinho: [],
        pedidos: [],
        usuarios: [
            { id: 'admin-fortfit', nome: 'Administrador FortFit', email: 'admin@fortfit.com', telefone: '(11) 99999-0000', senha: 'admin123', perfil: 'admin', criado_em: new Date().toISOString() },
            { id: 'cliente-fortfit', nome: 'Cliente FortFit', email: 'cliente@fortfit.com', telefone: '(11) 99999-9999', senha: 'fortfit123', perfil: 'cliente', criado_em: new Date().toISOString() },
        ],
        sessao: null,
    };
}

function lerBanco() {
    const salvo = window.localStorage.getItem(CHAVE_BANCO);
    return salvo ? JSON.parse(salvo) : dadosIniciais();
}

function salvarBanco(banco) {
    window.localStorage.setItem(CHAVE_BANCO, JSON.stringify(banco));
}

function emailNormalizado(email) {
    return email.trim().toLowerCase();
}

function usuarioPublico(usuario) {
    if (!usuario) return null;
    const { senha, ...dados } = usuario;
    return dados;
}

export async function inicializarBanco() {
    if (!window.localStorage.getItem(CHAVE_BANCO)) salvarBanco(dadosIniciais());
}

export async function listarProdutos() {
    return lerBanco().produtos;
}

export async function criarProduto(dados) {
    const banco = lerBanco();
    const produto = { ...dados, id: gerarId(), foto: dados.foto ?? null };
    banco.produtos.push(produto);
    salvarBanco(banco);
    return produto;
}

export async function atualizarProdutoNoBanco(id, dados) {
    const banco = lerBanco();
    banco.produtos = banco.produtos.map((produto) => produto.id === id ? { ...produto, ...dados } : produto);
    salvarBanco(banco);
}

export async function excluirProdutoDoBanco(id) {
    const banco = lerBanco();
    banco.produtos = banco.produtos.filter((produto) => produto.id !== id);
    banco.carrinho = banco.carrinho.filter((item) => item.produto_id !== id);
    salvarBanco(banco);
}

export async function listarCarrinho() {
    const banco = lerBanco();
    return banco.carrinho.map((item) => ({
        produto: banco.produtos.find((produto) => produto.id === item.produto_id),
        quantidade: item.quantidade,
    })).filter((item) => item.produto);
}

export async function adicionarItemAoCarrinho(produto, quantidade) {
    const banco = lerBanco();
    const item = banco.carrinho.find((atual) => atual.produto_id === produto.id);
    const quantidadeFinal = Math.min((item?.quantidade ?? 0) + quantidade, Number(produto.estoque));
    if (quantidadeFinal <= 0) return;
    if (item) item.quantidade = quantidadeFinal;
    else banco.carrinho.push({ produto_id: produto.id, quantidade: quantidadeFinal });
    salvarBanco(banco);
}

export async function alterarQuantidadeNoCarrinho(id, quantidade) {
    const banco = lerBanco();
    const produto = banco.produtos.find((atual) => atual.id === id);
    const quantidadeFinal = Math.min(quantidade, Number(produto?.estoque ?? 0));
    banco.carrinho = quantidadeFinal > 0
        ? banco.carrinho.map((item) => item.produto_id === id ? { ...item, quantidade: quantidadeFinal } : item)
        : banco.carrinho.filter((item) => item.produto_id !== id);
    salvarBanco(banco);
}

export async function removerItemDoCarrinho(id) {
    const banco = lerBanco();
    banco.carrinho = banco.carrinho.filter((item) => item.produto_id !== id);
    salvarBanco(banco);
}

export async function limparCarrinhoNoBanco() {
    const banco = lerBanco();
    banco.carrinho = [];
    salvarBanco(banco);
}

export async function registrarPedido(dados) {
    const banco = lerBanco();
    const itens = await listarCarrinho();
    if (!itens.length) return false;
    const total = itens.reduce((acumulado, item) => acumulado + item.produto.preco * item.quantidade, 0);
    banco.pedidos.push({ ...dados, id: dados.numeroPedido, usuario_id: dados.usuarioId, criado_em: new Date().toISOString(), total, itens });
    banco.produtos = banco.produtos.map((produto) => {
        const item = itens.find((atual) => atual.produto.id === produto.id);
        return item ? { ...produto, estoque: Math.max(produto.estoque - item.quantidade, 0) } : produto;
    });
    banco.carrinho = [];
    salvarBanco(banco);
    return true;
}

export async function cadastrarUsuario({ nome, email, telefone, senha }) {
    const banco = lerBanco();
    const emailFormatado = emailNormalizado(email);
    if (banco.usuarios.some((usuario) => usuario.email === emailFormatado)) throw new Error('EMAIL_JA_CADASTRADO');
    const usuario = { id: gerarId(), nome: nome.trim(), email: emailFormatado, telefone: telefone.trim(), senha, perfil: 'cliente', criado_em: new Date().toISOString() };
    banco.usuarios.push(usuario);
    salvarBanco(banco);
    return usuarioPublico(usuario);
}

export async function autenticarUsuario(email, senha) {
    const banco = lerBanco();
    const usuario = banco.usuarios.find((atual) => atual.email === emailNormalizado(email) && atual.senha === senha);
    if (!usuario) return null;
    banco.sessao = usuario.id;
    salvarBanco(banco);
    return usuarioPublico(usuario);
}

export async function buscarSessaoAtual() {
    const banco = lerBanco();
    return usuarioPublico(banco.usuarios.find((usuario) => usuario.id === banco.sessao));
}

export async function encerrarSessao() {
    const banco = lerBanco();
    banco.sessao = null;
    salvarBanco(banco);
}

export async function emailEstaCadastrado(email) {
    return lerBanco().usuarios.some((usuario) => usuario.email === emailNormalizado(email));
}

export async function atualizarSenhaUsuario(email, senha) {
    const banco = lerBanco();
    const usuario = banco.usuarios.find((atual) => atual.email === emailNormalizado(email));
    if (!usuario) return false;
    usuario.senha = senha;
    salvarBanco(banco);
    return true;
}

export async function listarPedidosDoUsuario(usuarioId) {
    return lerBanco().pedidos
        .filter((pedido) => pedido.usuario_id === usuarioId)
        .sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em));
}
