# 🛠️ NΞØ Mobile Hub - Configuration & Deployment Guide

Este guia detalha todos os passos necessários para configurar um novo ambiente operacional (Bot + MiniApp) para o protocolo NΞØ.

---

## 1. Telegram Bot (Identity & Auth)
Você precisará de um bot oficial para servir como porta de entrada e validar a autenticação.

1.  Acesse o [@BotFather](https://t.me/botfather) no Telegram.
2.  Use `/newbot` para criar um novo bot (ex: `NEO Smart Factory Bot`).
3.  **Bot Token:** Salve o `HTTP API Token` fornecido. Ele será a sua `TELEGRAM_BOT_TOKEN`.
4.  **Configurar MiniApp:**
    *   Use `/newapp` e selecione o seu bot.
    *   **URL:** Insira a URL oficial: `https://miniapp-smartfactory.vercel.app/`.
    *   **Short Name:** Escolha o nome que aparecerá no link (ex: `app`). Seu link será `t.me/seu_bot/app`.

---

## 2. Reown Cloud (Base/EVM Hub)

Para permitir a conexão com carteiras como OKX, MetaMask e Rabby na rede Base.

1.  Acesse [cloud.reown.com](https://cloud.reown.com/).
2.  Crie um projeto chamado `NΞØ Mobile`.
3.  Selecione o tipo **AppKit**.
4.  **Project ID:** Copie este ID. Ele será o seu `VITE_WALLET_CONNECT_PROJECT_ID`.
5.  **Aba Verify:** Adicione o domínio `miniapp-smartfactory.vercel.app` e `localhost`.

---

## 3. TON Connect (TON Hub)

A integração com o ecossistema TON exige um arquivo de manifesto público.

1.  **Manifest URL:** O arquivo `tonconnect-manifest.json` deve estar acessível publicamente.
2.  **Conteúdo do Manifesto:**
    ```json
    {
      "url": "https://miniapp-smartfactory.vercel.app",
      "name": "NΞØ Mobile",
      "iconUrl": "https://miniapp-smartfactory.vercel.app/brand/logo.png"
    }
    ```
3.  No `.env`, a variável `VITE_TON_MANIFEST_URL` deve apontar para `https://miniapp-smartfactory.vercel.app/tonconnect-manifest.json`.

---

## 4. Variáveis de Ambiente (Vercel / ENV)

Configure estas variáveis no seu arquivo `.env` local e nas **Environment Variables** da Vercel:

| Variável | Descrição | Exemplo / Fonte |
| :--- | :--- | :--- |
| `VITE_WALLET_CONNECT_PROJECT_ID` | Conexão Base/EVM | Reown Cloud |
| `VITE_BASE_RPC_URL` | RPC da rede Base | `https://mainnet.base.org` |
| `VITE_TON_MANIFEST_URL` | Link do manifesto TON | `https://seu-app.com/manifest.json` |
| `VITE_TON_RPC_URL` | RPC da rede TON | `https://toncenter.com/api/v2/jsonRPC` |
| `TELEGRAM_BOT_TOKEN` | Token secreto do Bot | BotFather (Secret) |
| `VITE_PROTOCOL_TREASURY_ADDRESS` | Carteira de Governança | Sua MyTonWallet (EQ...) |

---

## 5. Deployment Flow (Makefile)

Após configurar o `.env`, utilize o cockpit da NΞØ:

```bash
# 1. Preparar ambiente
make setup

# 2. Testar localmente
make dev

# 3. Propagar para produção
make build
make commit
```

---

## 6. Checklist de Segurança (Node Protocol)

*   [ ] O `TELEGRAM_BOT_TOKEN` **NUNCA** deve começar com `VITE_`. Isso impede que ele seja exposto no frontend.
*   [ ] O domínio de produção deve estar na whitelist do Reown.
*   [ ] O manifesto TON deve estar em HTTPS.

---
**NΞØ SMART FACTORY** — Structure is sovereign. Expand.
