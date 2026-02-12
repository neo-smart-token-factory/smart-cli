# 💰 Saldos Necessários para Adicionar Liquidez

## 📊 Resumo Rápido

Para adicionar **0.003 ETH** de liquidez na Base:

| Item | Quantidade | Observação |
|------|------------|------------|
| **WETH** | 0.003 ETH | Pode fazer wrap de ETH → WETH |
| **NEOFLW** | ~30 NEOFLW | Baseado no preço 1 NEOFLW = 0.0001 WETH |
| **ETH (Gas)** | ~0.008 ETH | Para pagar as transações (mint é caro) |
| **TOTAL** | **~0.011 ETH** | + NEOFLW equivalente |

---

## 🔍 Cálculo Detalhado

### Preço Configurado
- **1 NEOFLW = 0.0001 WETH** (10,000 NEOFLW = 1 WETH)

### Para 0.003 ETH:
```
0.003 ETH ÷ 0.0001 = 30 NEOFLW
```

**Valores necessários:**
- **WETH**: 0.003 ETH
- **NEOFLW**: 30 NEOFLW
- **ETH (gas)**: ~0.008 ETH (transações de mint no Uniswap V3 são caras)

---

## 📋 Checklist Antes de Executar

### ✅ 1. Verificar Saldo de ETH
```bash
# Verificar saldo na Base
cast balance SEU_ENDERECO --rpc-url https://mainnet.base.org
```

**Necessário**: Mínimo **0.004 ETH** (0.003 para WETH + 0.001 para gas)

### ✅ 2. Verificar Saldo de WETH
Se você tem ETH mas não tem WETH, precisa fazer wrap primeiro:

```bash
# Opção 1: Usar script existente
npx ts-node scripts/wrap-eth-to-weth.ts 0.003

# Opção 2: Fazer wrap manualmente no Uniswap
# https://app.uniswap.org/swap
```

### ✅ 3. Verificar Saldo de NEOFLW
```bash
# Verificar saldo de NEOFLW
cast call 0x6575933669e530dC25aaCb496cD8e402B8f26Ff5 \
  "balanceOf(address)(uint256)" SEU_ENDERECO \
  --rpc-url https://mainnet.base.org
```

**Necessário**: Mínimo **30 NEOFLW** (para o preço configurado)

---

## 🚀 Executar o Script

Depois de ter os saldos necessários:

```bash
npx ts-node scripts/add-liquidity-simple.ts
```

---

## ⚠️ Se Não Tiver Saldo Suficiente

### Opção 1: Ajustar o Preço
Se você tem menos NEOFLW, pode ajustar o preço no script:

```typescript
// Em add-liquidity-simple.ts
const PRICE_RATIO = 0.0002; // 1 NEOFLW = 0.0002 WETH (mais caro)
// Agora: 0.003 ETH ÷ 0.0002 = 15 NEOFLW (metade)
```

### Opção 2: Reduzir o Amount de ETH
```typescript
// Em add-liquidity-simple.ts
const AMOUNT_ETH = "0.001"; // Reduzir para 0.001 ETH
// Agora: 0.001 ETH ÷ 0.0001 = 10 NEOFLW
```

---

## 📊 Exemplo de Cálculo para Outros Valores

### Para 0.01 ETH:
```
0.01 ETH ÷ 0.0001 = 100 NEOFLW
```

### Para 0.1 ETH:
```
0.1 ETH ÷ 0.0001 = 1,000 NEOFLW
```

---

## 💡 Dicas

1. **Sempre deixe um pouco de ETH extra para gas** (~0.001-0.002 ETH)
2. **Se não tiver WETH**, faça wrap de ETH primeiro
3. **O preço pode ser ajustado** conforme sua necessidade
4. **Você pode adicionar mais liquidez depois** executando o script novamente

---

## 🔗 Links Úteis

- **Basescan**: https://basescan.org/
- **Uniswap**: https://app.uniswap.org/
- **WETH Wrap**: https://app.uniswap.org/swap

---

**Última atualização**: Script configurado para 0.003 ETH com preço 1 NEOFLW = 0.0001 WETH

