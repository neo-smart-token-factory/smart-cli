# 🚀 Quick Start - NEOFLW

Guia rápido para começar a trabalhar com o token NEOFLW.

## 📍 Onde Estamos

```
✅ Fase 1: Fundação (100%) - COMPLETA
🟡 Fase 2: Preparação (50%) - EM ANDAMENTO
⏳ Fase 3: Execução (0%) - PENDENTE
📅 Fase 4: Pós-Liquidez (0%) - PLANEJADO
```

**Veja o roadmap completo**: `ROADMAP-NEOFLW.md`

## 🎯 Próximos Passos (Prioridade)

### 0. Instalar Foundry ⚠️ URGENTE (se não instalado)

```bash
# Verificar se está instalado
npx ts-node scripts/check-foundry.ts

# Se não estiver, instalar:
curl -L https://foundry.paradigm.xyz | bash
source ~/.zshrc  # ou ~/.bashrc
foundryup
```

**Veja**: `scripts/INSTALL-FOUNDRY.md` para guia completo

### 1. Completar Verificação Multi-Plataforma ⚠️ IMPORTANTE

- [ ] Verificar no Sourcify (https://verify.sourcify.dev/)
  - Use "Import from Etherscan" se já verificado no Basescan
  - Ou execute: `npx ts-node scripts/verify-sourcify.ts`
- [ ] Verificar no Blockscout (https://base.blockscout.com/)
  - Via interface web ou execute: `npx ts-node scripts/verify-blockscout.ts`

**Veja**: `scripts/verify-multi-platform.md` para guia completo

### 2. Configurar PRIVATE_KEY ⚠️ URGENTE

```bash
# Adicione ao .env
echo "PRIVATE_KEY=sua_chave_privada_aqui" >> .env
```

⚠️ **IMPORTANTE**: Nunca commite a PRIVATE_KEY no Git!

### 2. Testar Script de Liquidez em Testnet

Antes de executar em mainnet, teste em Base Goerli:

```bash
# 1. Ajustar NETWORK no script para 84531 (Base Goerli)
# 2. Executar script
npx ts-node scripts/setup-uniswap-liquidity.ts
```

### 3. Preparar Recursos

- [ ] Adquirir NEOFLW tokens
- [ ] Adquirir WETH (ou ETH para wrap)
- [ ] Garantir ETH para gas fees
- [ ] Definir valores de liquidez

### 4. Executar em Mainnet

```bash
npx ts-node scripts/setup-uniswap-liquidity.ts
```

## 📚 Documentação Rápida

### Scripts Disponíveis

| Script | Descrição | Status |
|--------|-----------|--------|
| `verify-neoflow-token.ts` | Verificar contrato no Basescan | ✅ Pronto |
| `setup-uniswap-liquidity.ts` | Criar pool Uniswap V3 | ✅ Pronto |

### Documentação

| Arquivo | Descrição |
|---------|-----------|
| `README-NEOFLW.md` | Visão geral do projeto |
| `README-UNISWAP-LIQUIDITY.md` | Guia de liquidez |
| `ROADMAP-NEOFLW.md` | Roadmap completo |
| `CLEANUP-BASE-ONLY.md` | Detalhes da limpeza |

## 🔗 Links Rápidos

- **Contrato**: https://basescan.org/address/0x6575933669e530dC25aaCb496cD8e402B8f26Ff5
- **Uniswap**: https://app.uniswap.org/explore/pools/8453
- **Thirdweb**: https://thirdweb.com/8453/0x6575933669e530dC25aaCb496cD8e402B8f26Ff5

## ⚠️ Checklist Antes de Executar

- [ ] **Foundry instalado** (execute: `npx ts-node scripts/check-foundry.ts`)
- [ ] PRIVATE_KEY configurado no `.env`
- [ ] `.env` validado (execute: `npx ts-node scripts/validate-env.ts`)
- [ ] Saldo suficiente de NEOFLW
- [ ] Saldo suficiente de WETH
- [ ] ETH suficiente para gas fees
- [ ] Script testado em testnet (recomendado)
- [ ] Valores ajustados no script (se necessário)

---

**Próximo passo**: Configurar PRIVATE_KEY e testar em testnet!

