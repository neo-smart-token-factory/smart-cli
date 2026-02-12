# 💧 Guia Completo: Setup de Liquidez Uniswap V3

## 📋 Pré-requisitos

### 1. Saldos Necessários

- ✅ **NEOFLW**: Você tem 1100 NEOFLW
- ❌ **WETH**: Você precisa de WETH (atualmente: 0 WETH)
- ✅ **ETH**: Para gas fees e para fazer wrap em WETH

### 2. Quantidades Recomendadas

**Mínimo para começar**:
- 1,000 NEOFLW
- 0.1 WETH (ou mais, dependendo do preço desejado)

**Recomendado**:
- 10,000 NEOFLW
- 1 WETH

---

## 🚀 Passo a Passo

### Passo 1: Wrap ETH para WETH

Você precisa converter ETH em WETH primeiro:

```bash
# Wrap quantidade específica (exemplo: 1.5 ETH)
npx ts-node scripts/wrap-eth-to-weth.ts 1.5

# Ou wrap todo o saldo disponível (reserva 0.01 ETH para gas)
npx ts-node scripts/wrap-eth-to-weth.ts
```

**O que faz**:
- Converte ETH nativo em WETH
- WETH é necessário para criar pool Uniswap V3
- Mantém reserva de 0.01 ETH para gas fees

---

### Passo 2: Aguardar Confirmações

⚠️ **IMPORTANTE**: Se você teve erro "in-flight transaction limit reached":
- Aguarde todas as transações pendentes serem confirmadas
- Verifique no Basescan: https://basescan.org/address/0x460F9D0cf3e6E84faC1A7Abc524ddfa66fb64f60
- Aguarde alguns minutos antes de tentar novamente

---

### Passo 3: Configurar Valores de Liquidez

Edite `scripts/setup-uniswap-liquidity.ts` se necessário:

```typescript
// Ajuste estes valores conforme sua estratégia
const DEFAULT_NEOFLW_AMOUNT = ethers.utils.parseUnits("1000", 18); // Ex: 1000 NEOFLW
const DEFAULT_WETH_AMOUNT = ethers.utils.parseUnits("0.1", 18);     // Ex: 0.1 WETH

// Preço inicial (1 NEOFLW = X WETH)
const INITIAL_PRICE_RATIO = 0.0001; // Ex: 1 NEOFLW = 0.0001 WETH
```

---

### Passo 4: Executar Setup de Liquidez

```bash
npx ts-node scripts/setup-uniswap-liquidity.ts
```

**O que faz**:
1. ✅ Verifica saldos de NEOFLW e WETH
2. ✅ Aprova tokens para Position Manager
3. ✅ Cria pool Uniswap V3 (se não existir)
4. ✅ Fornece liquidez inicial

---

## ⚠️ Problemas Comuns

### Erro: "in-flight transaction limit reached"

**Causa**: Muitas transações pendentes simultaneamente

**Solução**:
1. Aguarde confirmação de todas as transações pendentes
2. Verifique no Basescan
3. Tente novamente após alguns minutos
4. O script agora tem delay de 3 segundos entre aprovações

---

### Erro: "Saldo insuficiente de WETH"

**Causa**: Não fez wrap de ETH para WETH

**Solução**:
```bash
# Fazer wrap primeiro
npx ts-node scripts/wrap-eth-to-weth.ts [quantidade]
```

---

### Erro: "Saldo insuficiente de NEOFLW"

**Causa**: Não tem NEOFLW suficiente

**Solução**:
- Use `mintTo()` para criar mais tokens (se você tem MINTER_ROLE)
- Ou ajuste `DEFAULT_NEOFLW_AMOUNT` no script

---

## 📊 Monitoramento

Após criar a pool:

### Links Úteis

- **BaseScan (Token)**: https://basescan.org/token/0x6575933669e530dC25aaCb496cD8e402B8f26Ff5
- **BaseScan (Contrato)**: https://basescan.org/address/0x6575933669e530dC25aaCb496cD8e402B8f26Ff5
- **Uniswap Pools**: https://app.uniswap.org/explore/pools/8453
- **DexScreener**: https://dexscreener.com/base/ (aparece automaticamente quando pool é criada)

---

## 🎯 Estratégia de Preço

### Como Definir o Preço Inicial

O preço inicial é definido por `INITIAL_PRICE_RATIO`:

```typescript
const INITIAL_PRICE_RATIO = 1; // 1 NEOFLW = 1 WETH
```

**Exemplos**:
- `1` = 1 NEOFLW = 1 WETH
- `0.001` = 1 NEOFLW = 0.001 WETH (1000 NEOFLW = 1 WETH)
- `0.0001` = 1 NEOFLW = 0.0001 WETH (10000 NEOFLW = 1 WETH)

**Recomendação**: Defina baseado em:
- Valor de mercado desejado
- Quantidade de tokens em circulação
- Comparação com tokens similares

---

## 💡 Dicas

1. **Comece pequeno**: Teste com valores menores primeiro
2. **Monitore gas**: Cada transação custa gas, tenha ETH suficiente
3. **Full Range inicial**: O script usa full range (-887220 a 887220) para máxima cobertura
4. **Ranges concentrados**: Depois pode criar posições com ranges menores para maior eficiência

---

## ✅ Checklist

Antes de executar:

- [ ] ETH suficiente para gas (recomendado: 0.05+ ETH)
- [ ] NEOFLW suficiente (ajuste no script)
- [ ] WETH criado via wrap (use `wrap-eth-to-weth.ts`)
- [ ] Transações pendentes confirmadas (se houver erro anterior)
- [ ] Valores ajustados no script (se necessário)

---

## 🚀 Próximos Passos Após Criar Pool

1. **Monitorar volume**: Acompanhe trades na pool
2. **Adicionar mais liquidez**: Execute script novamente com valores diferentes
3. **Gerenciar posição**: Use interface Uniswap para ajustar range
4. **Listar em agregadores**: DexScreener aparece automaticamente

---

**Boa sorte com a criação da liquidez! 🎉**

