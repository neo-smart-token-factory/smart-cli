# 🚨 AÇÃO REQUERIDA: Bot Token Exposto

**Data:** 2026-01-24  
**Severidade:** 🔴 CRÍTICA  
**Status:** ⚠️ REQUER AÇÃO IMEDIATA

---

## ⚠️ SITUAÇÃO

Seu `TELEGRAM_BOT_TOKEN` estava no arquivo `.env` local.

**Boas notícias:**

- ✅ `.env` está no `.gitignore`
- ✅ Verificamos o histórico Git: token NÃO foi commitado
- ✅ Token não está hardcoded no código

**Mas para garantir segurança máxima:**

---

## 🔐 AÇÃO IMEDIATA RECOMENDADA

### 1. Rotacionar o Bot Token (5 minutos)

#### Passo a Passo:

1. **Abrir o @BotFather no Telegram**

   ```
   https://t.me/BotFather
   ```

2. **Revogar o token atual**
   ```
   /mybots
   → Selecionar seu bot
   → API Token
   → Revoke current token
   ```

3. **Gerar novo token**
   ```
   → Generate new token
   → Copiar o novo token
   ```

4. **Atualizar no .env local**
   ```env
   TELEGRAM_BOT_TOKEN=<novo_token_aqui>
   ```

5. **Configurar na Vercel**
   ```
   Vercel Dashboard
   → Seu projeto
   → Settings
   → Environment Variables
   → TELEGRAM_BOT_TOKEN
   → Edit
   → Colar novo token
   → Marcar como "Sensitive"
   → Save
   ```

6. **Redesployar**
   ```bash
   git push origin main
   # ou force redeploy no dashboard Vercel
   ```

---

## ✅ MUDANÇAS JÁ IMPLEMENTADAS

### Arquivo .env Atualizado

```env
# ✅ Público - Cliente
VITE_WALLET_CONNECT_PROJECT_ID=32568dffd851aee7e83086944f7fe077
VITE_JETTON_DEPLOYER_ADDRESS=EQD0vdSA_NedR9uvbgN9EikRX-suesDxGeFg69XQMavfLqIw
VITE_PROTOCOL_TREASURY_ADDRESS=UQBBVansdaNi_Rc_7fLZ8nZfCbNaDTQtew_pFTYd2eXzD8lg

# ❌ Secreto - Com aviso
# ⚠️ NÃO commitar este arquivo com o token real!
TELEGRAM_BOT_TOKEN=your_bot_token_here
```

### Código Atualizado (useJettonFactory.js)

Agora usa variáveis do `.env`:

```javascript
// ✅ Lê do .env
const JETTON_DEPLOYER_ADDRESS = 
    import.meta.env.VITE_JETTON_DEPLOYER_ADDRESS || 
    'EQD0vdSA_NedR9uvbgN9EikRX-suesDxGeFg69XQMavfLqIw';

const PROTOCOL_TREASURY = 
    import.meta.env.VITE_PROTOCOL_TREASURY_ADDRESS || '';
```

**Benefícios:**
- ✅ Configuração centralizada
- ✅ Fácil trocar entre testnet/mainnet
- ✅ Não precisa mudar código
- ✅ Fallback para valor seguro

---

## 📋 CHECKLIST PÓS-ROTAÇÃO

Após rotacionar o token:

- [ ] Novo token funcionando no bot?
- [ ] Configurado na Vercel?
- [ ] Marcado como "Sensitive"?
- [ ] Redeploy feito?
- [ ] Bot respondendo normalmente?
- [ ] `.env` não está no Git? (verificar `git status`)

---

## 🛡️ PREVENÇÃO FUTURA

### 1. Sempre use .env para secrets

```env
# ❌ NUNCA
const BOT_TOKEN = '8017711267:AAFxxx'

# ✅ SEMPRE
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
```

### 2. Verifique antes de cada commit

```bash
# Verificar se .env não está sendo commitado
git status

# Se aparecer .env:
git reset HEAD .env
```

### 3. Use git-secrets (opcional)

```bash
# Instalar
brew install git-secrets

# Configurar no projeto
git secrets --install
git secrets --add ':[a-zA-Z0-9]{35,}'  # Padrão Telegram token

# Isso previne commits acidentais com tokens
```

---

## 📖 DOCUMENTAÇÃO CRIADA

Criamos guias completos:

1. **`docs/SECURITY_BEST_PRACTICES.md`**
   - O que pode/não pode expor
   - Como configurar na Vercel
   - Checklist de segurança
   - Recuperação de incidentes

2. **`docs/JETTON_DEPLOYMENT_GUIDE.md`**
   - Diferença entre endereços
   - Custos de deploy
   - Como testar em testnet

3. **`docs/SECURITY_AUDIT.md`**
   - Todas as vulnerabilidades corrigidas
   - Mudanças implementadas

---

## 🎯 RESUMO EXECUTIVO

| Item | Status | Ação |
|------|--------|------|
| **Token no Git?** | ✅ NÃO | Nenhuma |
| **Token hardcoded?** | ✅ NÃO | Nenhuma |
| **Token no .env?** | ⚠️ SIM | Rotacionar (recomendado) |
| **.env no .gitignore?** | ✅ SIM | Nenhuma |
| **Código atualizado?** | ✅ SIM | Nenhuma |

---

## 🔍 POR QUE ROTACIONAR MESMO SEM VAZAMENTO?

**Princípio de Segurança:** "Defense in depth"

1. **Possível exposição local**
   - Backup em cloud?
   - Screenshots compartilhados?
   - Logs de debug?

2. **Melhor seguro que arrependido**
   - Rotação leva 5 minutos
   - Perda de controle do bot é irreversível

3. **Boa prática estabelecida**
   - Rotação regular (90 dias)
   - Começar com token "limpo"

---

## 🚀 PRÓXIMOS PASSOS

1. **AGORA:** Rotacionar bot token (5 min)
2. **Hoje:** Ler `docs/SECURITY_BEST_PRACTICES.md`
3. **Esta semana:** Configurar git-secrets (opcional)
4. **Todo mês:** Auditar variáveis de ambiente
5. **A cada 90 dias:** Rotacionar todos os secrets

---

**Precisa de ajuda?** Consulte `docs/SECURITY_BEST_PRACTICES.md`

**Status:** ⚠️ Aguardando rotação do bot token  
**Prioridade:** 🔴 ALTA (mas não urgente se não houve vazamento)
