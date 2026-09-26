<p align="center">
  <img src="docs/banner-fortfit.svg" alt="Capa do projeto FortFit Mobile" width="100%">
</p>

<h1 align="center">FortFit Mobile</h1>

<p align="center">
  Aplicativo móvel de e-commerce fitness desenvolvido em React Native e Expo.
</p>

> 🚧 **Projeto em andamento:** o FortFit ainda está em desenvolvimento. As funcionalidades, telas e a estrutura do código poderão receber alterações até a integração e entrega final do projeto.

<p align="center">
  <img alt="Status" src="https://img.shields.io/badge/status-em%20desenvolvimento-9CFF2E?style=for-the-badge&labelColor=171D1A">
  <img alt="React Native" src="https://img.shields.io/badge/React%20Native-Expo-9CFF2E?style=for-the-badge&labelColor=171D1A">
  <img alt="Projeto acadêmico" src="https://img.shields.io/badge/projeto-acad%C3%AAmico-9CFF2E?style=for-the-badge&labelColor=171D1A">
</p>

## Sobre o projeto

O **FortFit Mobile** é um projeto acadêmico de e-commerce voltado a pequenos empreendedores que estão começando no mercado de suplementos e produtos fitness. A proposta é oferecer uma experiência simples para cadastrar produtos, acompanhar a loja e permitir que clientes encontrem os itens e montem seus pedidos pelo celular.

> Este é um projeto desenvolvido em equipe. Este repositório pessoal registra minha participação e será atualizado com a versão consolidada do aplicativo ao final do semestre.

## Minha contribuição

Fiquei responsável pelo fluxo visual de **checkout e pagamento**, incluindo:

- resumo do produto com nome, foto, quantidade e valor;
- escolha entre cartão de crédito e débito;
- campos de dados do cartão;
- endereço exibido a partir do preenchimento do CEP;
- validação dos campos obrigatórios;
- complemento como campo opcional;
- tela de compra confirmada;
- geração visual de um número de pedido;
- prototipação das telas no Figma.

Nesta etapa, o pagamento é uma simulação acadêmica: o fluxo visual funciona, mas não realiza uma cobrança real.

## Código da minha contribuição

A implementação do checkout já está disponível neste repositório:

- [Tela de pagamento](src/telas/pagamento/pagamento.js)
- [Tela de confirmação da compra](src/telas/pagamento/confirmacaoPagamento.js)

Esses arquivos recebem os dados do produto pela navegação, validam o formulário e concluem o fluxo com a confirmação e o número do pedido.

## Protótipo completo

As telas seguem a identidade visual do FortFit: fundo grafite, cartões escuros, textos claros e verde-limão como cor de destaque.

<p align="center">
  <a href="https://www.figma.com/design/t98GvpdNNbr07oQsvCyvlI">
    <strong>Abrir o protótipo completo no Figma</strong>
  </a>
</p>

### Fluxo do cliente

<table>
  <tr>
    <td align="center"><img src="docs/figma-login.svg" alt="Tela de login" width="300"></td>
    <td align="center"><img src="docs/figma-cadastro-usuario.svg" alt="Tela de cadastro do usuário" width="300"></td>
  </tr>
  <tr>
    <td align="center"><strong>Login</strong></td>
    <td align="center"><strong>Cadastro do usuário</strong></td>
  </tr>
  <tr>
    <td align="center"><img src="docs/figma-catalogo.svg" alt="Catálogo de produtos" width="300"></td>
    <td align="center"><img src="docs/figma-detalhes-produto.svg" alt="Detalhes do produto" width="300"></td>
  </tr>
  <tr>
    <td align="center"><strong>Catálogo</strong></td>
    <td align="center"><strong>Detalhes do produto</strong></td>
  </tr>
  <tr>
    <td align="center"><img src="docs/figma-carrinho.svg" alt="Carrinho de compras" width="300"></td>
    <td align="center"><img src="docs/figma-pagamento.svg" alt="Tela de pagamento" width="300"></td>
  </tr>
  <tr>
    <td align="center"><strong>Carrinho</strong></td>
    <td align="center"><strong>Pagamento</strong></td>
  </tr>
  <tr>
    <td align="center" colspan="2"><img src="docs/figma-confirmacao.svg" alt="Compra confirmada" width="300"></td>
  </tr>
  <tr>
    <td align="center" colspan="2"><strong>Compra confirmada</strong></td>
  </tr>
</table>

### Área do vendedor

<table>
  <tr>
    <td align="center"><img src="docs/figma-dashboard-vendedor.svg" alt="Dashboard do vendedor" width="300"></td>
    <td align="center"><img src="docs/figma-produtos-vendedor.svg" alt="Produtos do vendedor" width="300"></td>
  </tr>
  <tr>
    <td align="center"><strong>Dashboard do vendedor</strong></td>
    <td align="center"><strong>Gerenciamento de produtos</strong></td>
  </tr>
  <tr>
    <td align="center" colspan="2"><img src="docs/figma-cadastro-produto.svg" alt="Cadastro de produto" width="300"></td>
  </tr>
  <tr>
    <td align="center" colspan="2"><strong>Cadastro de produto</strong></td>
  </tr>
</table>

## Funcionalidades planejadas

- cadastro e login de usuários;
- catálogo de suplementos e itens fitness;
- visualização dos detalhes dos produtos;
- carrinho de compras;
- checkout e confirmação do pedido;
- cadastro e gerenciamento de produtos;
- dashboard do vendedor com vendas, faturamento e estoque.

## Tecnologias

- React Native
- Expo
- JavaScript
- React Navigation
- Figma
- Git e GitHub

## Situação atual

O projeto está em desenvolvimento durante o semestre. Este repositório já reúne a apresentação, o protótipo e o código do checkout desenvolvido por mim. A versão consolidada do aplicativo será adicionada após a integração das partes da equipe.

## Projeto da equipe

O desenvolvimento em grupo está sendo organizado no repositório oficial:

[FortFit-MobileProject/FortFit](https://github.com/FortFit-MobileProject/FortFit)

## Autor

**Pedro Henrique G. Bertanhi**

[github.com/pedrobertanhi](https://github.com/pedrobertanhi)
