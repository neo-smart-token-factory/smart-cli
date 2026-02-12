# 🚀 Próximos Passos: Criar Liquidez Uniswap V3

## ✅ Status Atual

- **Mint Concluído**: 10,000 NEOFLW ✅
- **Transaction**: https://basescan.org/tx/0x5db4953010087a1df5e440004bcba5d7513eb57bbcb413e6ec4578198aeac844
- **Saldo NEOFLW**: ~11,100 NEOFLW (1,100 + 10,000)
- **Próximo**: Criar pool de liquidez

---

## 📋 Checklist de Execução

### Passo 1: Verificar Saldos ✅

```bash
# Verificar saldo ETH
cast balance 0x460F9D0cf3e6E84faC1A7Abc524ddfa66fb64f60 --rpc-url https://base-mainnet.g.alchemy.com/v2/F7WGOxare2E3WPbjGiBFQ

# Verificar saldo NEOFLW
cast call 0x6575933669e530dC25aaCb496cD8e402B8f26Ff5 "balanceOf(address)" 0x460F9D0cf3e6E84faC1A7Abc524ddfa66fb64f60 --rpc-url https://base-mainnet.g.alchemy.com/v2/F7WGOxare2E3WPbjGiBFQ
```

**Necessário**:
- ✅ NEOFLW: ~11,100 (suficiente)
- ⚠️ ETH: Verificar saldo (precisa para gas + wrap)
- ❌ WETH: 0 (precisa fazer wrap)

---

### Passo 2: Wrap ETH → WETH

**Quantidade Recomendada**: 1-2 WETH

```bash
# Wrap 1.5 ETH para WETH
npx ts-node scripts/wrap-eth-to-weth.ts 1.5
```

**O que faz**:
- Converte ETH nativo em WETH
- WETH é necessário para Uniswap V3
- Reserva 0.01 ETH para gas fees

**Requisitos**:
- Saldo ETH suficiente (1.5 + 0.05 para gas = ~1.55 ETH mínimo)

---

### Passo 3: Ajustar Configuração da Pool

Edite `scripts/setup-uniswap-liquidity.ts`:

```typescript
// Quantidades de liquidez
const DEFAULT_NEOFLW_AMOUNT = ethers.utils.parseUnits("10000", 18); // 10k NEOFLW
const DEFAULT_WETH_AMOUNT = ethers.utils.parseUnits("1", 18);        // 1 WETH

// Preço inicial (IMPORTANTE: Ajuste conforme sua estratégia)
const INITIAL_PRICE_RATIO = 0.0001; // 1 NEOFLW = 0.0001 WETH (10k NEOFLW = 1 WETH)
```

**Estratégias de Preço**:

| Preço | Ratio | Equivalência | Uso |
|-------|-------|--------------|-----|
| **Baixo** | 0.0001 | 10k NEOFLW = 1 WETH | ✅ Recomendado para começar |
| **Médio** | 0.001 | 1k NEOFLW = 1 WETH | Para tokens com mais valor |
| **Alto** | 0.01 | 100 NEOFLW = 1 WETH | Para tokens premium |

**Recomendação**: Começar com **0.0001** (preço baixo) para facilitar entrada e depois ajustar.

---

### Passo 4: Criar Pool Uniswap V3

```bash
npx ts-node scripts/setup-uniswap-liquidity.ts
```

**O que o script faz**:
1. ✅ Verifica saldos de NEOFLW e WETH
2. ✅ Aprova tokens para Position Manager
3. ✅ Cria pool Uniswap V3 (se não existir)
4. ✅ Fornece liquidez inicial (full range)

**Tempo estimado**: 5-10 minutos (múltiplas transações)

---

## 💰 Estimativa de Custos

### Gas Fees (Base - barato)

- **Aprovação NEOFLW**: ~50,000 gas
- **Aprovação WETH**: ~50,000 gas
- **Criação de Pool**: ~500,000 gas
- **Fornecimento de Liquidez**: ~500,000 gas
- **Total**: ~1,100,000 gas

**Custo estimado**: ~0.005-0.01 ETH (depende do preço do gas)

### Liquidez

- **NEOFLW**: 10,000 tokens (já mintados ✅)
- **WETH**: 1-2 WETH (precisa fazer wrap)

---

## ⚠️ Importante

### Antes de Executar

1. **Aguardar confirmações**: Se houver transações pendentes, aguarde
2. **Verificar saldo ETH**: Ter suficiente para gas + wrap
3. **Ajustar preço**: Definir `INITIAL_PRICE_RATIO` conforme estratégia
4. **Backup**: Anotar valores usados para referência futura

### Durante a Execução

- ⏳ Pode levar alguns minutos (múltiplas transações)
- ⚠️ Não interrompa o processo
- 📝 Anote os hashes das transações

### Após Criar Pool

- ✅ Verificar pool no Uniswap
- ✅ Verificar no DexScreener (aparece automaticamente)
- ✅ Monitorar volume inicial
- ✅ Ajustar liquidez conforme necessário

---

## 🎯 Sequência Completa

```bash
# 1. Verificar saldos
cast balance 0x460F9D0cf3e6E84faC1A7Abc524ddfa66fb64f60 --rpc-url https://base-mainnet.g.alchemy.com/v2/F7WGOxare2E3WPbjGiBFQ

# 2. Wrap ETH → WETH
npx ts-node scripts/wrap-eth-to-weth.ts 1.5

# 3. (Opcional) Ajustar valores no setup-uniswap-liquidity.ts

# 4. Criar pool
npx ts-node scripts/setup-uniswap-liquidity.ts
```

---

## 📊 Após Criar Pool

### Links para Monitoramento

- **Uniswap Pool**: https://app.uniswap.org/explore/pools/8453
- **DexScreener**: https://dexscreener.com/base/ (aparece automaticamente)
- **BaseScan Token**: https://basescan.org/token/0x6575933669e530dC25aaCb496cD8e402B8f26Ff5

### Próximas Ações

1. **Monitorar volume**: Acompanhar trades iniciais
2. **Adicionar mais liquidez**: Se necessário, executar script novamente
3. **Ajustar range**: Considerar ranges concentrados para maior eficiência
4. **Marketing**: Compartilhar pool criada

---

**Status**: ✅ Pronto para wrap e criar pool!

**Próxima ação**: `npx ts-node scripts/wrap-eth-to-weth.ts 1.5`

