# 🔍 Verificar Proxy no Sourcify - Solução

O erro que você recebeu no Sourcify confirma que o contrato é um **proxy**:

```
Runtime Bytecode Onchain: 44 bytes (proxy)
Runtime Bytecode Recompiled: 19143 bytes (implementação)
```

## ❌ Por que falhou?

O Sourcify tentou verificar o **proxy** (`0x6575933669e530dC25aaCb496cD8e402B8f26Ff5`), mas o bytecode não corresponde porque:
- O bytecode onchain (44 bytes) é do **TWProxy**
- O bytecode recompilado (19143 bytes) é da **implementação TokenERC20**

## ✅ Solução: Verificar a Implementação

Para verificar no Sourcify, você precisa verificar a **implementação**, não o proxy.

### Passo 1: Encontrar o Endereço da Implementação

#### Método 1: Via Basescan (Mais Fácil)

1. Acesse: https://basescan.org/address/0x6575933669e530dC25aaCb496cD8e402B8f26Ff5#code
2. Na aba "Contract", procure por:
   - "Implementation" ou "Implementation Address"
   - Ou "Read Contract" → procure função `implementation()`
   - Ou veja a seção "More Options" → "Is this a proxy?"

3. O endereço da implementação deve estar visível lá

#### Método 2: Via Script (Tentativa)

```bash
npx ts-node scripts/find-implementation.ts
```

**Nota**: O script pode não encontrar se o proxy usar um padrão diferente do EIP-1967.

#### Método 3: Via Cast (Direto)

```bash
# Tentar slot EIP-1967 padrão
cast storage 0x6575933669e530dC25aaCb496cD8e402B8f26Ff5 \
  0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc \
  --rpc-url https://mainnet.base.org

# Se retornar 0x0000..., tentar outros slots ou verificar no Basescan
```

### Passo 2: Verificar a Implementação no Sourcify

Depois de encontrar o endereço da implementação:

1. **Acesse**: https://verify.sourcify.dev/
2. **Chain**: Base (8453)
3. **Address**: Cole o endereço da **implementação** (não o proxy)
4. **Método**: "Standard JSON Input"
5. **Upload**: O arquivo `artifacts_forge/TokenERC20.sol/TokenERC20.json`

### Passo 3: Verificar o Proxy (Opcional)

Se quiser verificar o proxy também:

1. Você precisará do código-fonte do `TWProxy.sol`
2. O arquivo está em: `contracts/infra/TWProxy.sol`
3. Compile e verifique usando o mesmo processo

## 📋 Informações Importantes

### Sourcify e Proxies

- O Sourcify **não associa automaticamente** proxy e implementação
- Você precisa verificar **ambos separadamente**
- A verificação da implementação é mais importante (é onde o código real está)

### Por que o "Import from Etherscan" falhou?

- O Sourcify importou o bytecode do **proxy** (44 bytes)
- Tentou comparar com o código-fonte da **implementação** (TokenERC20)
- Como são diferentes, a verificação falhou

## 🎯 Próximos Passos

1. ✅ Encontrar o endereço da implementação no Basescan
2. ✅ Verificar a implementação no Sourcify usando o endereço correto
3. ⏳ (Opcional) Verificar o proxy separadamente

## 💡 Dica

O endereço da implementação geralmente está visível no Basescan na página do contrato verificado. Procure por:
- "Implementation" na seção de informações do contrato
- Ou use a função "Read Contract" → `implementation()` se disponível

---

**Depois de encontrar o endereço da implementação, use esse endereço para verificar no Sourcify, não o endereço do proxy!**

