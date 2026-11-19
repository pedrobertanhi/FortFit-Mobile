# Servidor de pagamentos FortFit

Este servidor cria preferências do **Checkout Pro** e consulta o status dos pagamentos no Mercado Pago. Ele existe para manter o Access Token e a assinatura do webhook fora do aplicativo React Native.

## Configuração

1. Entre na pasta `server` e instale as dependências:

```bash
cd server
npm install
```

2. Copie `.env.example` para `.env` e preencha:

```env
MERCADO_PAGO_ACCESS_TOKEN=TEST-...
MERCADO_PAGO_WEBHOOK_SECRET=...
PUBLIC_BASE_URL=https://seu-dominio-publico.com
```

3. Inicie o servidor:

```bash
npm run dev
```

4. No arquivo `.env` da raiz do aplicativo, configure somente a URL pública:

```env
EXPO_PUBLIC_FORTFIT_API_URL=https://seu-dominio-publico.com
```

Reinicie o Expo depois de alterar esse valor.

## Webhook

No painel do Mercado Pago, cadastre esta URL pública:

```
https://seu-dominio-publico.com/api/webhooks/mercado-pago
```

O endpoint valida os headers `x-signature` e `x-request-id` com a chave `MERCADO_PAGO_WEBHOOK_SECRET`. Sem a chave secreta, ele responde `401` e não processa a notificação.

## Fluxo implementado

1. O app envia itens e a referência do pedido ao servidor.
2. O servidor cria a preferência no Mercado Pago e devolve o `init_point`.
3. O app abre o checkout hospedado; nenhum dado de cartão passa pelo FortFit.
4. Após o comprador pagar, o app consulta o status por `external_reference`.
5. Somente pagamentos `approved` viram pedido no SQLite local.

> Para produção, os preços também devem ser conferidos contra um catálogo no servidor. Nesta versão acadêmica, os itens vêm do catálogo SQLite do app.
