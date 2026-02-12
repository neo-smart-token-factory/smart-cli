# 🔐 NΞØ Protocol - Melhores Práticas de Segurança

**Data:** 2026-01-24  
**Tópico:** Gestão de Secrets e Variáveis de Ambiente

---

## 🎯 REGRA DE OURO

> **NUNCA commite secrets no Git. Use variáveis de ambiente.**

---

## ✅ O QUE É SEGURO EXPOR

### Informações Públicas (Podem estar no código/Git)

| Tipo | Exemplo | Motivo |
|------|---------|--------|
| **Endereços de Wallet** | `UQBBVans...` | São públicos na blockchain |
| **Contract Addresses** | `EQD0vdSA...` | Contratos públicos |
| **RPC URLs Públicos** | `https://toncenter.com` | Endpoints públicos |
| **Project IDs** | WalletConnect ID | Feito para ser público |
| **Chain IDs** | 8453 (Base), -239 (TON) | Informação pública |

**Por quê?** São como endereços comerciais - todos precisam saber para interagir.

---

## ❌ O QUE NUNCA EXPOR

### Informações Secretas (NUNCA no Git)

| Tipo | Exemplo | Risco |
|------|---------|-------|
| **Bot Tokens** | `8017711267:AAF...` | ⚠️ Controle total do bot |
| **Private Keys** | Seed phrases | 💰 Perda total de funds |
| **API Secret Keys** | Secret tokens | 🔓 Acesso não autorizado |
| **Database Passwords** | Credenciais BD | 💾 Acesso aos dados |
| **JWT Secrets** | Signing keys | 🎭 Forjar autenticação |

**Por quê?** São como chaves do cofre - quem tem, controla tudo.

---

## 🗂️ ESTRUTURA DE VARIÁVEIS DE AMBIENTE

### Arquivo `.env` (Local - NÃO vai para o Git)

```env
# ✅ Público - Cliente (prefixo VITE_)
VITE_WALLET_CONNECT_PROJECT_ID=32568dffd851aee7e83086944f7fe077
VITE_JETTON_DEPLOYER_ADDRESS=EQD0vdSA_NedR9uvbgN9EikRX-suesDxGeFg69XQMavfLqIw
VITE_PROTOCOL_TREASURY_ADDRESS=UQBBVansdaNi_Rc_7fLZ8nZfCbNaDTQtew_pFTYd2eXzD8lg
VITE_BASE_RPC_URL=https://mainnet.base.org
VITE_TON_RPC_URL=https://toncenter.com/api/v2/jsonRPC

# ❌ Secreto - Servidor (SEM prefixo VITE_)
TELEGRAM_BOT_TOKEN=your_bot_token_here_KEEP_SECRET
```

### Arquivo `.env.example` (Template - VAI para o Git)

```env
# Template sem valores reais
VITE_WALLET_CONNECT_PROJECT_ID=YOUR_PROJECT_ID_HERE
VITE_JETTON_DEPLOYER_ADDRESS=EQD0vdSA_NedR9uvbgN9EikRX-suesDxGeFg69XQMavfLqIw
TELEGRAM_BOT_TOKEN=your_bot_token_here
```

---

## 🔍 ENTENDENDO PREFIXOS

### Variáveis com `VITE_` (Cliente)

```javascript
// ✅ Exposto no bundle do cliente
const deployer = import.meta.env.VITE_JETTON_DEPLOYER_ADDRESS;

// Visível no browser DevTools
// Incluído no JavaScript final
// NUNCA use para secrets!
```

**Regra:** Use apenas para valores que podem ser públicos.

### Variáveis SEM `VITE_` (Servidor)

```javascript
// ❌ NÃO exposto no cliente
const botToken = process.env.TELEGRAM_BOT_TOKEN;

// Apenas acessível no servidor (API routes)
// NÃO incluído no bundle
// Use para secrets!
```

**Regra:** Use para valores que devem permanecer secretos.

---

## 🚀 CONFIGURAÇÃO NA VERCEL

### 1. Acessar Configurações

```
Projeto → Settings → Environment Variables
```

### 2. Adicionar Variáveis

#### Variáveis Públicas (Cliente)

```
Name: VITE_WALLET_CONNECT_PROJECT_ID
Value: 32568dffd851aee7e83086944f7fe077
Environment: Production, Preview, Development
```

```
Name: VITE_JETTON_DEPLOYER_ADDRESS
Value: EQD0vdSA_NedR9uvbgN9EikRX-suesDxGeFg69XQMavfLqIw
Environment: Production, Preview, Development
```

#### Variáveis Secretas (Servidor)

```
Name: TELEGRAM_BOT_TOKEN
Value: <seu_bot_token_real_aqui>
Environment: Production
⚠️ Marcar como "Sensitive" para ocultar após salvar
```

### 3. Redesployar

Após adicionar variáveis, faça redeploy:
```bash
git push origin main
```

Ou force redeploy no dashboard da Vercel.

---

## 🛡️ PROTEÇÃO DO .env LOCAL

### Verificar .gitignore

Certifique-se que `.env` está ignorado:

```gitignore
# Environment
.env
.env.*
!.env.example
```

### Verificar Status Git

```bash
# ⚠️ IMPORTANTE: Verificar se .env não está rastreado
git status

# Se aparecer .env, REMOVA imediatamente:
git rm --cached .env
git commit -m "Remove .env from tracking"
```

### Se Já Commitou o .env com Secrets

**🚨 AÇÃO IMEDIATA:**

1. **Revogar todos os secrets comprometidos**
   - Gere novo `TELEGRAM_BOT_TOKEN` no @BotFather
   - Rotacione API keys expostas

2. **Remover do histórico Git**
```bash
# ⚠️ CUIDADO: Reescreve o histórico
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (se já fez push)
git push origin --force --all
```

3. **Adicionar ao .gitignore**
```bash
echo ".env" >> .gitignore
git add .gitignore
git commit -m "Add .env to gitignore"
```

---

## 📋 CHECKLIST DE SEGURANÇA

### Antes de Cada Commit

- [ ] `.env` está no `.gitignore`?
- [ ] Nenhum secret no código fonte?
- [ ] Variáveis com `VITE_` são apenas públicas?
- [ ] `.env.example` não contém valores reais?
- [ ] `git status` não mostra `.env`?

### Antes de Fazer Deploy

- [ ] Secrets configurados na Vercel?
- [ ] Variáveis marcadas como "Sensitive"?
- [ ] Ambiente correto (Production/Preview)?
- [ ] Valores testados localmente?

### Rotina de Segurança

- [ ] Rotacionar secrets a cada 90 dias
- [ ] Auditar logs de acesso
- [ ] Monitorar uso de API keys
- [ ] Revisar permissões de time

---

## 🎓 BOAS PRÁTICAS IMPLEMENTADAS NO PROJETO

### ✅ Configuração Atual

```javascript
// useJettonFactory.js
const JETTON_DEPLOYER_ADDRESS = 
    import.meta.env.VITE_JETTON_DEPLOYER_ADDRESS || 
    'EQD0vdSA_NedR9uvbgN9EikRX-suesDxGeFg69XQMavfLqIw'; // Fallback

const PROTOCOL_TREASURY = 
    import.meta.env.VITE_PROTOCOL_TREASURY_ADDRESS || '';
```

**Vantagens:**
1. ✅ Centralizado no `.env`
2. ✅ Fácil trocar entre ambientes
3. ✅ Fallback para valor padrão
4. ✅ Documentado no código

---

## 🔄 AMBIENTES DIFERENTES

### Development (Local)

```env
VITE_TON_NETWORK=testnet
VITE_JETTON_DEPLOYER_ADDRESS=EQDk2RDhzPZKCzjYe_-nP6SjNVoqH0-YQ4aBTqz1HmD5z7kH
VITE_TON_RPC_URL=https://testnet.toncenter.com/api/v2/jsonRPC
```

### Production (Vercel)

```env
VITE_TON_NETWORK=mainnet
VITE_JETTON_DEPLOYER_ADDRESS=EQD0vdSA_NedR9uvbgN9EikRX-suesDxGeFg69XQMavfLqIw
VITE_TON_RPC_URL=https://toncenter.com/api/v2/jsonRPC
```

---

## 🚨 INCIDENTES COMUNS E SOLUÇÕES

### "Commitei meu Bot Token!"

**Solução:**
1. Revogue o token no @BotFather
2. Gere um novo
3. Remova do histórico Git (ver acima)
4. Configure na Vercel

### "Variáveis não aparecem no build"

**Causa:** Faltou prefixo `VITE_`

**Solução:**
```env
# ❌ Errado
JETTON_DEPLOYER_ADDRESS=xxx

# ✅ Correto
VITE_JETTON_DEPLOYER_ADDRESS=xxx
```

### "Bot Token não funciona na Vercel"

**Causa:** Configurado como variável com `VITE_` (exposta)

**Solução:**
```env
# ❌ Errado (expõe no cliente)
VITE_TELEGRAM_BOT_TOKEN=xxx

# ✅ Correto (servidor only)
TELEGRAM_BOT_TOKEN=xxx
```

---

## 📖 RECURSOS ADICIONAIS

### Documentação

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [OWASP Secret Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

### Ferramentas

- **git-secrets**: Previne commits com secrets
  ```bash
  brew install git-secrets
  git secrets --install
  git secrets --register-aws
  ```

- **truffleHog**: Scan de secrets no histórico
  ```bash
  docker run --rm -v $(pwd):/proj dxa4481/trufflehog file:///proj
  ```

---

## 🎯 RESUMO EXECUTIVO

| Tipo | Onde Guardar | Prefixo | Exposto? |
|------|--------------|---------|----------|
| **Endereços Públicos** | `.env` ou código | `VITE_` | ✅ Sim |
| **RPC URLs** | `.env` | `VITE_` | ✅ Sim |
| **Bot Tokens** | Vercel only | Nenhum | ❌ Não |
| **Private Keys** | NUNCA no código | - | ❌ NUNCA |

---

**Regra Final:** Se você não quer ver no DevTools do browser, NÃO use prefixo `VITE_`.

**Status do Projeto:** ✅ Configurado corretamente  
**Último Audit:** 2026-01-24  
**Próxima Revisão:** 2026-04-24 (90 dias)
