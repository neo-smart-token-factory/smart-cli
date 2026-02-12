# NΞØ Auth: Telegram Integration Guide

## Visão Geral
No ecossistema TMA (Telegram Mini Apps), a autenticação é baseada na confiança da assinatura do Telegram. O arquivo `api/auth.js` fornece a lógica necessária para validar que os dados recebidos no frontend são autênticos.

## Como funciona
1. **Frontend:** O TWA obtém uma string assinada chamada `initData`.
2. **Transferência:** O App envia essa string para `POST /api/auth`.
3. **Backend:**
   - O servidor pega o seu `TELEGRAM_BOT_TOKEN`.
   - Gera uma `secret_key` via HMAC-SHA256 usando o token.
   - Recalcula o hash dos dados recebidos.
   - Se o hash gerado for igual ao hash recebido, o usuário é legítimo.

## Variáveis Necessárias
No seu ambiente de produção (Vercel/Heroku/Self-hosted), você DEVE configurar:
- `TELEGRAM_BOT_TOKEN`: Obtido via [@BotFather](https://t.me/botfather).

## Segurança
- Nunca exponha o `TELEGRAM_BOT_TOKEN` no frontend (Vite).
- Valide sempre o `auth_date` para evitar ataques de replay (dados muito antigos).
- Use HTTPS em todas as comunicações.

---
**NΞØ SMART FACTORY** — Security is not an option, it is the foundation.
