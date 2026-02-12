# 🎯 Template de Token ERC20 - Guia Rápido

Template completo e refinado baseado no projeto NEOFLW bem-sucedido.

---

## ✅ O que está incluído

### 📁 Estrutura Completa
- ✅ Scripts de liquidez Uniswap V3
- ✅ Scripts de verificação
- ✅ Scripts utilitários
- ✅ Documentação completa
- ✅ Configurações (Foundry, TypeScript, npm)
- ✅ Suporte para múltiplas redes

### 🛠️ Scripts Principais
- `setup-uniswap-liquidity.ts` - Setup completo de liquidez
- `mint-batch-liquidity.ts` - Mint em lote (sem taxas)
- `wrap-eth-to-weth.ts` - Converter ETH para WETH
- `verify-token.ts` - Verificar contrato no explorer
- `check-balances.ts` - Verificar saldos
- `check-foundry.ts` - Verificar Foundry
- `validate-env.ts` - Validar .env

### 📚 Documentação
- Guias de verificação (Basescan, Sourcify, Blockscout)
- Guias de liquidez
- Guias de configuração
- Roadmap template

---

## 🚀 Como Usar

1. **Substituir placeholders** (veja `INSTRUCOES.md`)
2. **Configurar `.env`** (copie de `.env.example`)
3. **Instalar dependências**: `npm install`
4. **Validar**: `npx ts-node scripts/validate-env.ts`
5. **Fazer deploy** do contrato
6. **Atualizar `TOKEN_ADDRESS`** no `.env`
7. **Verificar**: `npx ts-node scripts/verify-token.ts`
8. **Criar liquidez**: `npx ts-node scripts/setup-uniswap-liquidity.ts`

---

## 🌐 Redes Suportadas

- Base (8453)
- Ethereum (1)
- Polygon (137)
- Arbitrum (42161)
- Optimism (10)
- Avalanche (43114)
- Outras redes EVM

---

## 📝 Placeholders a Substituir

```
{{TOKEN_NAME}}
{{TOKEN_SYMBOL}}
{{TOKEN_ADDRESS}}
{{NETWORK_NAME}}
{{CHAIN_ID}}
{{RPC_URL}}
{{DEFAULT_RPC_URL}}
{{EXPLORER_NAME}}
{{EXPLORER_URL}}
{{EXPLORER_API_URL}}
{{WETH_ADDRESS}}
{{POSITION_MANAGER_ADDRESS}}
```

---

## ✅ Checklist de Uso

- [ ] Ler `INSTRUCOES.md`
- [ ] Substituir todos os placeholders
- [ ] Configurar `.env`
- [ ] Instalar dependências
- [ ] Validar configuração
- [ ] Fazer deploy
- [ ] Verificar contrato
- [ ] Criar liquidez

---

**Template criado em 22/12/2024** 🎉

Baseado no projeto NEOFLW bem-sucedido com todos os refinamentos aplicados.

