# ⚙️ Configuração do Ambiente (.env)

Guia rápido para configurar todas as variáveis de ambiente necessárias.

## 🚀 Setup Rápido

```bash
# 1. Copiar arquivo de exemplo
cp .env.example .env

# 2. Editar .env com seus valores
# Use seu editor preferido (nano, vim, code, etc.)
nano .env
```

## 📋 Variáveis Obrigatórias

### 1. PRIVATE_KEY ⚠️ CRÍTICO

**O que é**: Chave privada da sua wallet Ethereum/Base

**Onde obter**: 
- Exporte da sua wallet (MetaMask, etc.)
- **NUNCA compartilhe ou commite no Git!**

**Formato**: `0x` seguido de 64 caracteres hexadecimais

**Exemplo**:
```env
PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

**Usado em**:
- `setup-uniswap-liquidity.ts` - Para fornecer liquidez
- Scripts de deploy
- Scripts de interação com contratos

---

### 2. ETHERSCAN_API_KEY

**O que é**: API key para verificação de contratos no Basescan/Etherscan

**Onde obter**:
- Basescan: https://basescan.org/myapikey
- Etherscan: https://etherscan.io/myapikey
- (Ambos usam a mesma API, então uma key serve para ambos)

**Formato**: String alfanumérica

**Exemplo**:
```env
ETHERSCAN_API_KEY=WYII9Y7JICTMERA89H6P3X9C3JKTIW8V75
```

**Usado em**:
- `verify-neoflow-token.ts` - Verificação no Basescan
- Scripts de verificação de contratos

---

### 3. THIRDWEB_CLIENT_ID

**O que é**: Client ID para acesso à API Thirdweb (frontend)

**Onde obter**: https://thirdweb.com/dashboard

**Formato**: String alfanumérica

**Exemplo**:
```env
THIRDWEB_CLIENT_ID=sa70d3d6d2ec826511ff9e31b0db2d0fc
```

**Usado em**: Scripts que usam Thirdweb SDK

---

### 4. THIRDWEB_SECRET_KEY

**O que é**: Secret key para acesso backend à API Thirdweb

**Onde obter**: https://thirdweb.com/dashboard

**Formato**: String começando com `sk_`

**Exemplo**:
```env
THIRDWEB_SECRET_KEY=sk_live_abc123def456ghi789
```

⚠️ **IMPORTANTE**: Mantenha esta chave PRIVADA!

**Usado em**: Scripts que usam Thirdweb SDK (backend)

---

## 📋 Variáveis Opcionais

### BASE_RPC_URL

**O que é**: URL do RPC provider para Base network

**Default**: `https://mainnet.base.org` (se não fornecido)

**Onde obter**:
- Base oficial: `https://mainnet.base.org` (gratuito)
- Alchemy: https://www.alchemy.com/ (requer conta)
- Infura: https://infura.io/ (requer conta)
- Outros provedores RPC

**Exemplo**:
```env
BASE_RPC_URL=https://base-mainnet.g.alchemy.com/v2/YOUR_KEY
```

**Usado em**: `setup-uniswap-liquidity.ts`

---

### BLOCKSCOUT_API_KEY

**O que é**: API key para verificação no Blockscout (opcional)

**Onde obter**: https://base.blockscout.com/ (criar conta)

**Formato**: String alfanumérica

**Usado em**: `verify-blockscout.ts` (opcional, pode verificar via web também)

---

### SCAN_API_KEY

**O que é**: API key genérica como fallback

**Onde obter**: Depende do serviço que você quer usar

**Usado em**: Alguns scripts como fallback

---

### ALCHEMY_KEY

**O que é**: API key do Alchemy (se usar Alchemy como RPC)

**Onde obter**: https://www.alchemy.com/

**Usado em**: Se configurar `BASE_RPC_URL` com Alchemy

---

## ✅ Checklist de Configuração

### Mínimo Necessário

- [ ] `PRIVATE_KEY` configurado
- [ ] `ETHERSCAN_API_KEY` configurado
- [ ] `THIRDWEB_CLIENT_ID` configurado
- [ ] `THIRDWEB_SECRET_KEY` configurado

### Recomendado

- [ ] `BASE_RPC_URL` configurado (se quiser usar RPC customizado)
- [ ] `BLOCKSCOUT_API_KEY` configurado (se quiser verificar via API)

### Opcional

- [ ] `SCAN_API_KEY` configurado
- [ ] `ALCHEMY_KEY` configurado

---

## 🔒 Segurança

### ⚠️ NUNCA Faça:

- ❌ Commitar `.env` no Git
- ❌ Compartilhar `PRIVATE_KEY` publicamente
- ❌ Compartilhar `THIRDWEB_SECRET_KEY` publicamente
- ❌ Enviar `.env` por email/mensagem não criptografada

### ✅ SEMPRE Faça:

- ✅ Adicione `.env` ao `.gitignore`
- ✅ Use `.env.example` como template (sem valores reais)
- ✅ Mantenha backups seguros das chaves
- ✅ Use variáveis de ambiente em produção (não arquivo .env)

---

## 🧪 Testar Configuração

Após configurar o `.env`, teste se está funcionando:

```bash
# Testar verificação (não precisa de PRIVATE_KEY)
npx ts-node scripts/verify-neoflow-token.ts

# Testar setup de liquidez (precisa de PRIVATE_KEY)
# ⚠️  Só execute se tiver saldos suficientes!
npx ts-node scripts/setup-uniswap-liquidity.ts
```

---

## 📚 Referências

- **Basescan API**: https://basescan.org/apis
- **Thirdweb Dashboard**: https://thirdweb.com/dashboard
- **Base Network**: https://docs.base.org/
- **Alchemy**: https://www.alchemy.com/

---

## ❓ Troubleshooting

### Erro: "PRIVATE_KEY não configurado"
- Verifique se o arquivo `.env` existe
- Verifique se `PRIVATE_KEY=` está preenchido (sem espaços extras)

### Erro: "ETHERSCAN_API_KEY não configurado"
- Obtenha uma API key em https://basescan.org/myapikey
- Adicione ao `.env`

### Erro: "Invalid private key"
- Verifique se a chave começa com `0x`
- Verifique se tem 66 caracteres (0x + 64 hex)
- Não inclua espaços ou quebras de linha

---

**Próximo passo**: Após configurar, veja `QUICK-START.md` para começar!

