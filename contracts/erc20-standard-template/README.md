# {{TOKEN_NAME}} ({{TOKEN_SYMBOL}}) - Token ERC20 Template

Template padrão para deploy de tokens ERC20 completos, verificados e com liquidez.

---

## 🚀 Status

✅ **Template Pronto para Uso**

- ✅ Estrutura completa de verificação
- ✅ Scripts de liquidez Uniswap V3
- ✅ Documentação organizada
- ✅ Suporte para múltiplas redes

---

## 📊 Configuração do Token

**Substitua os placeholders abaixo:**

- `{{TOKEN_NAME}}` - Nome do token (ex: "MeuToken")
- `{{TOKEN_SYMBOL}}` - Símbolo do token (ex: "MTK")
- `{{TOKEN_ADDRESS}}` - Endereço do contrato após deploy
- `{{NETWORK_NAME}}` - Nome da rede (ex: "Base", "Ethereum", "Polygon")
- `{{CHAIN_ID}}` - Chain ID da rede (ex: 8453 para Base, 1 para Ethereum)
- `{{RPC_URL}}` - URL do RPC da rede
- `{{EXPLORER_URL}}` - URL do explorer (ex: "https://basescan.org")

---

## 🔗 Links Importantes

### Blockchain Explorers
- **{{EXPLORER_NAME}} (Token)**: {{EXPLORER_URL}}/token/{{TOKEN_ADDRESS}}
- **{{EXPLORER_NAME}} (Contrato)**: {{EXPLORER_URL}}/address/{{TOKEN_ADDRESS}}

### Liquidez
- **Pool**: Uniswap V3 ({{TOKEN_SYMBOL}}/WETH)
- **Status**: A configurar

---

## 📚 Documentação

Toda a documentação está organizada em [`docs/`](docs/):

- **[📖 Documentação Completa](docs/README.md)** - Índice geral
- **[🎯 Início Rápido](docs/configuracao/QUICK-START.md)** - Comece aqui
- **[📋 Guia Completo](docs/README-FINAL.md)** - Visão geral

---

## 🛠️ Scripts Disponíveis

### Utilitários
- `scripts/check-balances.ts` - Verificar saldos de tokens
- `scripts/check-foundry.ts` - Verificar instalação do Foundry
- `scripts/validate-env.ts` - Validar variáveis de ambiente
- `scripts/verify-token.ts` - Verificar contrato no explorer

### Liquidez
- `scripts/setup-uniswap-liquidity.ts` - Setup completo de liquidez Uniswap V3
- `scripts/mint-batch-liquidity.ts` - Mint em lote (sem taxas)
- `scripts/wrap-eth-to-weth.ts` - Converter ETH para WETH

---

## ⚙️ Configuração Inicial

1. **Instalar dependências**:
```bash
npm install
```

2. **Configurar `.env`**:
```bash
cp .env.example .env
# Editar .env com suas chaves e valores do token
```

3. **Substituir placeholders**:
```bash
# Use find/replace para substituir:
# {{TOKEN_NAME}} → Nome do seu token
# {{TOKEN_SYMBOL}} → Símbolo do seu token
# {{TOKEN_ADDRESS}} → Endereço após deploy
# {{NETWORK_NAME}} → Nome da rede
# {{CHAIN_ID}} → Chain ID
# {{RPC_URL}} → URL do RPC
# {{EXPLORER_URL}} → URL do explorer
```

4. **Validar configuração**:
```bash
npx ts-node scripts/validate-env.ts
```

Ver [`docs/configuracao/SETUP-ENV.md`](docs/configuracao/SETUP-ENV.md) para detalhes.

---

## 📝 Estrutura do Projeto

```
{{PROJECT_NAME}}/
├── contracts/          # Contratos Solidity
│   └── prebuilts/     # Contratos thirdweb
├── scripts/            # Scripts TypeScript
├── docs/               # Documentação completa
│   ├── verificacao/    # Docs de verificação
│   ├── liquidez/       # Docs de liquidez
│   ├── upgrade/         # Docs de upgrade
│   ├── configuracao/   # Docs de configuração
│   └── conclusao/      # Docs de conclusão
└── .env.example        # Exemplo de variáveis
```

---

## 🌐 Redes Suportadas

Este template suporta múltiplas redes. Configure no `.env`:

- **Base** (Chain ID: 8453)
- **Ethereum** (Chain ID: 1)
- **Polygon** (Chain ID: 137)
- **Arbitrum** (Chain ID: 42161)
- **Optimism** (Chain ID: 10)
- **Avalanche** (Chain ID: 43114)
- **Outras redes EVM**

---

## 🎯 Próximos Passos

1. Substituir todos os placeholders
2. Configurar `.env` com suas chaves
3. Fazer deploy do contrato
4. Verificar o contrato
5. Criar liquidez

---

**Template criado em 22/12/2024 - Pronto para uso! 🚀**

