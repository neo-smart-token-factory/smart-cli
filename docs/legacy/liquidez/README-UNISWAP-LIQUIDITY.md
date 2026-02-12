# 💧 Setup de Liquidez Uniswap V3 - NEOFLW

Script automatizado para criar pool de liquidez Uniswap V3 na Base para o token NEOFLW.

## 📋 Pré-requisitos

1. **Chave Privada configurada** no `.env`:
   ```env
   PRIVATE_KEY=sua_chave_privada_aqui
   ```

2. **Saldo suficiente**:
   - NEOFLW tokens (padrão: 10,000 NEOFLW)
   - WETH ou ETH para wrap (padrão: 1 WETH)

3. **Dependências instaladas**:
   ```bash
   yarn install
   ```

## 🚀 Como Usar

### Execução Básica

```bash
npx ts-node scripts/setup-uniswap-liquidity.ts
```

### Configuração Personalizada

Edite as constantes no início do arquivo `setup-uniswap-liquidity.ts`:

```typescript
// Valores padrão de liquidez
const DEFAULT_NEOFLW_AMOUNT = ethers.utils.parseUnits("10000", 18); // Ajuste aqui
const DEFAULT_WETH_AMOUNT = ethers.utils.parseUnits("1", 18);      // Ajuste aqui

// Preço inicial (1 NEOFLW = X WETH)
const INITIAL_PRICE_RATIO = 1; // Ajuste conforme sua cotação
```

## 📝 O que o Script Faz

### Passo 1: Verificação
- ✅ Verifica se os contratos existem
- ✅ Mostra saldos de NEOFLW e WETH
- ✅ Mostra supply total do token

### Passo 2: Aprovação
- ✅ Aprova NEOFLW para o Position Manager
- ✅ Aprova WETH para o Position Manager
- ✅ Verifica se já está aprovado (evita transações desnecessárias)

### Passo 3: Criação da Pool
- ✅ Verifica se a pool já existe
- ✅ Cria e inicializa a pool se necessário
- ✅ Configura o preço inicial

### Passo 4: Fornecimento de Liquidez
- ✅ Fornece liquidez em full range (-887220 a 887220)
- ✅ Usa 5% de slippage tolerance
- ✅ Cria NFT de posição de liquidez

## ⚙️ Configurações

### Endereços (Base Mainnet)

- **NEOFLW**: `0x6575933669e530dC25aaCb496cD8e402B8f26Ff5`
- **WETH**: `0x4200000000000000000000000000000000000006`
- **Position Manager**: `0x03a520b32C04BF3bEEf7BEb72E919cf822Ed34f1`

### Fee Tier

- **3000** = 0.3% (padrão para pares principais)

### Tick Range

- **Full Range**: -887220 a 887220
- Fornece liquidez em todo o range de preços possível

## 🔍 Monitoramento

Após executar o script, você pode monitorar:

- **BaseScan**: https://basescan.org/address/0x6575933669e530dC25aaCb496cD8e402B8f26Ff5
- **Uniswap**: https://app.uniswap.org/explore/pools/8453
- **ThirdWeb**: https://thirdweb.com/8453/0x6575933669e530dC25aaCb496cD8e402B8f26Ff5

## ⚠️ Avisos Importantes

1. **Gas Fees**: O script faz múltiplas transações. Certifique-se de ter ETH suficiente para gas.

2. **Slippage**: O script usa 5% de slippage. Ajuste se necessário.

3. **Preço Inicial**: O preço inicial da pool é calculado baseado em `INITIAL_PRICE_RATIO`. Ajuste conforme sua estratégia.

4. **Full Range**: A liquidez é fornecida em full range. Para ranges concentrados, modifique `tickLower` e `tickUpper`.

5. **Segurança**: Nunca compartilhe sua `PRIVATE_KEY`. Mantenha o arquivo `.env` seguro.

## 🐛 Troubleshooting

### Erro: "PRIVATE_KEY não configurado"
- Adicione `PRIVATE_KEY` ao arquivo `.env`

### Erro: "Saldo insuficiente"
- Ajuste `DEFAULT_NEOFLW_AMOUNT` e `DEFAULT_WETH_AMOUNT` no script
- Ou adquira mais tokens antes de executar

### Erro: "Pool já existe"
- Isso é normal se a pool já foi criada anteriormente
- O script continuará com o fornecimento de liquidez

### Erro: "Transaction failed"
- Verifique se tem ETH suficiente para gas
- Verifique se os endereços estão corretos
- Verifique se os tokens estão aprovados

## 📚 Recursos

- [Uniswap V3 Documentation](https://docs.uniswap.org/)
- [Base Network](https://docs.base.org/)
- [Uniswap V3 Position Manager](https://docs.uniswap.org/contracts/v3/reference/periphery/NonfungiblePositionManager)

## 🔄 Próximos Passos

Após criar a pool:

1. **Adicionar mais liquidez**: Execute o script novamente com valores diferentes
2. **Gerenciar posição**: Use a interface do Uniswap para gerenciar sua posição NFT
3. **Monitorar volume**: Acompanhe o volume de trades na pool
4. **Ajustar range**: Considere criar posições com ranges concentrados para maior eficiência

---

**Nota**: Este script é uma ferramenta de automação. Sempre revise as transações antes de confirmar.

