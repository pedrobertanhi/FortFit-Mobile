const wheyOn = require('../../assets/images/produtos/wheyOn.png');
const wheyPerformance = require('../../assets/images/produtos/wheyPerformace.webp');
const creatina = require('../../assets/images/produtos/creatina.webp');
const strap = require('../../assets/images/produtos/strap.png');
const camiseta = require('../../assets/images/produtos/camiseta.webp');
const proteinaChocolate = require('../../assets/images/produtos/proteinaChocolate.webp');
const halteres = require('../../assets/images/produtos/halteres_2kg.webp');

export const PRODUTOS_INICIAIS = [
    {
        id: '1',
        nome: 'Whey Protein Concentrado 900g',
        marca: 'Performance Nutrition',
        categoria: 'Suplementos',
        descricao: 'Proteína concentrada para complementar a alimentação e apoiar a recuperação muscular.',
        preco: 129.9,
        estoque: 42,
        foto: wheyPerformance,
    },
    {
        id: '2',
        nome: 'Creatina Monohidratada 300g',
        marca: 'FortFit Labs',
        categoria: 'Suplementos',
        descricao: 'Creatina monohidratada para auxiliar no ganho de força e desempenho durante os treinos.',
        preco: 79.9,
        estoque: 15,
        foto: creatina,
    },
    {
        id: '3',
        nome: 'Strap de Treino Pro',
        marca: 'FortFit Gear',
        categoria: 'Acessórios',
        descricao: 'Strap resistente para melhorar a pegada em exercícios de puxada.',
        preco: 49.9,
        estoque: 8,
        foto: strap,
    },
    {
        id: '4',
        nome: 'Camiseta Dry-Fit FortFit',
        marca: 'FortFit Wear',
        categoria: 'Roupas',
        descricao: 'Camiseta leve com tecido de secagem rápida para treinos intensos.',
        preco: 59.9,
        estoque: 0,
        foto: camiseta,
    },
    {
        id: '5',
        nome: 'Barra de Proteína Chocolate',
        marca: 'FortFit Foods',
        categoria: 'Suplementos',
        descricao: 'Barra proteica sabor chocolate para um lanche prático.',
        preco: 12.9,
        estoque: 60,
        foto: proteinaChocolate,
    },
    {
        id: '6',
        nome: 'Kit Halteres 2kg',
        marca: 'FortFit Gear',
        categoria: 'Equipamentos',
        descricao: 'Par de halteres de 2kg para exercícios em casa.',
        preco: 89.9,
        estoque: 5,
        foto: halteres,
    },
    {
        id: '7',
        nome: 'Whey Protein Isolado 900g',
        marca: 'Optimum Nutrition',
        categoria: 'Suplementos',
        descricao: 'Proteína isolada com alta concentração proteica e rápida absorção.',
        preco: 149.9,
        estoque: 30,
        foto: wheyOn,
    },
];

export const CATEGORIAS = ['Todos', 'Suplementos', 'Roupas', 'Acessórios', 'Equipamentos'];

