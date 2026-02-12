# 🔍 Como Encontrar o Endereço da Implementação

Baseado na resposta da Thirdweb sobre contratos proxy.

## 📋 Informações Importantes

### O que a Thirdweb disse:

1. **TokenERC20 NÃO tem função `implementation()` pública**
   - Esta função existe apenas no proxy, não no token
   - É comum em contratos logic (lógica) ou deploys sem proxy

2. **Para encontrar a implementação em proxies:**
   - Ler o slot EIP-1967 (armazenamento de baixo nível)
   - Ver no explorer (Basescan/Blockscout) na aba "Proxy/Implementation"
   - Usar scripts/hardhat ou painel thirdweb

3. **No thirdweb:**
   - O deploy, upgrade e exibição do implementation address são feitos via:
     - Scripts/hardhat
     - Painel thirdweb
   - Não via ABI do token

## 🎯 Métodos para Encontrar a Implementação

### Método 1: Via Basescan (Mais Fácil) ⭐

1. **Acesse o contrato no Basescan**:
   ```
   https://basescan.org/address/0x6575933669e530dC25aaCb496cD8e402B8f26Ff5#code
   ```

2. **Procure por**:
   - Aba "Contract" → Seção "Proxy/Implementation"
   - Ou "More Options" → "Is this a proxy?"
   - Ou na parte superior da página, pode mostrar "Proxy" com link para implementação

3. **O endereço da implementação deve estar visível lá**

### Método 2: Via Blockscout

1. **Acesse**: https://base.blockscout.com/address/0x6575933669e530dC25aaCb496cD8e402B8f26Ff5
2. **Procure por**:
   - "Implementation" ou "Proxy Info"
   - Seção de informações do contrato

### Método 3: Via Slot EIP-1967 (Programático)

O TWProxy do thirdweb usa o slot padrão EIP-1967:

```bash
# Slot EIP-1967 padrão
cast storage 0x6575933669e530dC25aaCb496cD8e402B8f26Ff5 \
  0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc \
  --rpc-url https://mainnet.base.org
```

**Nota**: Se retornar `0x0000...`, o slot pode estar vazio ou o proxy usar outro padrão.

### Método 4: Via Script

```bash
npx ts-node scripts/find-implementation.ts
```

### Método 5: Via Painel Thirdweb

1. Acesse o painel thirdweb
2. Vá para o contrato deployado
3. O endereço da implementação deve estar visível lá

## ⚠️ Por que o Slot EIP-1967 pode estar vazio?

Possíveis razões:

1. **Proxy não inicializado corretamente** (improvável se já está funcionando)
2. **Proxy usa padrão diferente** (não EIP-1967)
3. **Leitura incorreta do slot** (formato do endereço)
4. **Proxy customizado** (thirdweb pode usar variação)

## ✅ Solução Recomendada

**Use o Método 1 (Basescan)** - é o mais confiável:

1. Acesse o Basescan
2. Procure pela seção "Proxy/Implementation"
3. Copie o endereço da implementação
4. Use esse endereço para verificar no Sourcify

## 📝 Para Verificação no Sourcify

Depois de encontrar o endereço da implementação:

1. **Acesse**: https://verify.sourcify.dev/
2. **Chain**: Base (8453)
3. **Address**: Cole o endereço da **IMPLEMENTAÇÃO** (não o proxy)
4. **Método**: "Standard JSON Input"
5. **Upload**: `artifacts_forge/TokenERC20.sol/TokenERC20.json`

---

**Resumo**: O endereço da implementação está visível no Basescan na seção "Proxy/Implementation". Use esse endereço para verificar no Sourcify!

