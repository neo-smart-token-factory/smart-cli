# 📋 Instruções de Uso do Template

Este é um template completo e refinado para deploy de tokens ERC20.

---

## 🚀 Passo a Passo

### 1. Substituir Placeholders

Use find/replace em todos os arquivos para substituir:

```
{{TOKEN_NAME}}        → Nome do seu token (ex: "MeuToken")
{{TOKEN_SYMBOL}}      → Símbolo do seu token (ex: "MTK")
{{TOKEN_ADDRESS}}     → Endereço do contrato (após deploy)
{{NETWORK_NAME}}      → Nome da rede (ex: "base", "ethereum", "polygon")
{{CHAIN_ID}}          → Chain ID (ex: 8453 para Base, 1 para Ethereum)
{{RPC_URL}}           → URL do RPC
{{DEFAULT_RPC_URL}}   → URL padrão do RPC da rede
{{EXPLORER_NAME}}     → Nome do explorer (ex: "Basescan", "Etherscan")
{{EXPLORER_URL}}      → URL do explorer (ex: "https://basescan.org")
{{EXPLORER_API_URL}}  → URL da API do explorer
{{WETH_ADDRESS}}      → Endereço do WETH na rede
{{POSITION_MANAGER_ADDRESS}} → Endereço do Uniswap V3 Position Manager
```

### 2. Configurar `.env`

```bash
cp .env.example .env
# Editar .env com seus valores
```

### 3. Instalar Dependências

```bash
npm install
```

### 4. Validar Configuração

```bash
npx ts-node scripts/validate-env.ts
```

### 5. Fazer Deploy

Use o método que preferir (Thirdweb Dashboard, script customizado, etc.)

### 6. Atualizar `.env`

Após o deploy, atualize:
- `TOKEN_ADDRESS` com o endereço do contrato deployado

### 7. Verificar Contrato

```bash
npx ts-node scripts/verify-token.ts
```

### 8. Criar Liquidez

```bash
# 1. Fazer wrap de ETH para WETH (se necessário)
npx ts-node scripts/wrap-eth-to-weth.ts 0.1

# 2. Fazer mint de tokens (se necessário)
npx ts-node scripts/mint-batch-liquidity.ts 10000

# 3. Criar pool e fornecer liquidez
npx ts-node scripts/setup-uniswap-liquidity.ts
```

---

## 📝 Arquivos com Placeholders

Os seguintes arquivos contêm placeholders que precisam ser substituídos:

- `README.md`
- `.env.example`
- `scripts/setup-uniswap-liquidity.ts`
- `scripts/mint-batch-liquidity.ts`
- `scripts/verify-token.ts`
- `scripts/check-balances.ts`
- `scripts/wrap-eth-to-weth.ts`
- `docs/*.md` (vários arquivos de documentação)

---

## 🌐 Endereços por Rede

### Base (Chain ID: 8453)
- WETH: `0x4200000000000000000000000000000000000006`
- Position Manager: `0x03a520b32C04BF3bEEf7BEb72E919cf822Ed34f1`
- Explorer: https://basescan.org
- RPC: https://mainnet.base.org

### Ethereum (Chain ID: 1)
- WETH: `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2`
- Position Manager: `0xC36442b4a4522E871399CD717aBDD847Ab11FE88`
- Explorer: https://etherscan.io
- RPC: https://eth.llamarpc.com

### Polygon (Chain ID: 137)
- WETH: `0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619`
- Position Manager: `0xC36442b4a4522E871399CD717aBDD847Ab11FE88`
- Explorer: https://polygonscan.com
- RPC: https://polygon-rpc.com

### Arbitrum (Chain ID: 42161)
- WETH: `0x82aF49447D8a07e3bd95BD0d56f35241523fBab1`
- Position Manager: `0xC36442b4a4522E871399CD717aBDD847Ab11FE88`
- Explorer: https://arbiscan.io
- RPC: https://arb1.arbitrum.io/rpc

### Optimism (Chain ID: 10)
- WETH: `0x4200000000000000000000000000000000000006`
- Position Manager: `0xC36442b4a4522E871399CD717aBDD847Ab11FE88`
- Explorer: https://optimistic.etherscan.io
- RPC: https://mainnet.optimism.io

### Avalanche (Chain ID: 43114)
- WETH: `0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB`
- Position Manager: `0x655C406EBFa14EE2006250925e54f0E7e375249e`
- Explorer: https://snowtrace.io
- RPC: https://api.avax.network/ext/bc/C/rpc

---

## ✅ Checklist

- [ ] Substituir todos os placeholders
- [ ] Configurar `.env` com valores reais
- [ ] Instalar dependências (`npm install`)
- [ ] Validar configuração (`npx ts-node scripts/validate-env.ts`)
- [ ] Fazer deploy do contrato
- [ ] Atualizar `TOKEN_ADDRESS` no `.env`
- [ ] Verificar contrato no explorer
- [ ] Criar liquidez (se necessário)

---

**Template criado em 22/12/2024 - Pronto para uso! 🚀**

