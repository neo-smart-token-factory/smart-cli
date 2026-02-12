# 🔍 Diferença: Basescan Token vs Address

## ⚠️ Importante: Duas Abas Diferentes no Basescan

O Basescan tem **duas visualizações diferentes** para o mesmo endereço:

### 1. `/token/` - Informações do Token ERC20
**URL**: https://basescan.org/token/0x6575933669e530dC25aaCb496cD8e402B8f26Ff5

**Mostra**:
- ✅ Nome do token (NEOFlowOFF)
- ✅ Símbolo (NEOFLW)
- ✅ Supply total
- ✅ Holders
- ✅ Transfers
- ✅ Preço (se listado)
- ❌ **NÃO mostra código-fonte**
- ❌ **NÃO mostra verificação**

**Uso**: Para ver informações do token como ativo ERC20

---

### 2. `/address/` - Informações do Contrato
**URL**: https://basescan.org/address/0x6575933669e530dC25aaCb496cD8e402B8f26Ff5

**Mostra**:
- ✅ Código-fonte verificado
- ✅ ABI
- ✅ Funções do contrato
- ✅ Transações
- ✅ Proxy/Implementation
- ✅ Verificação completa
- ❌ **NÃO mostra informações específicas do token**

**Uso**: Para ver e interagir com o código do contrato

---

## 🎯 Qual Usar?

### Para Verificação de Código
👉 Use `/address/` - É onde aparece o código-fonte verificado

### Para Informações do Token
👉 Use `/token/` - É onde aparecem nome, símbolo, supply, holders

---

## 📋 Status Atual

### Verificação de Código (`/address/`)
- ✅ **Proxy**: Verificado
- ✅ **Implementation**: Verificado
- ✅ **Link**: https://basescan.org/address/0x6575933669e530dC25aaCb496cD8e402B8f26Ff5#code

### Informações do Token (`/token/`)
- ✅ **Nome**: NEOFlowOFF
- ✅ **Símbolo**: NEOFLW
- ✅ **Link**: https://basescan.org/token/0x6575933669e530dC25aaCb496cD8e402B8f26Ff5

---

## 🔍 O que pode estar "diferente"?

Se você viu algo diferente na aba `/token/`, pode ser:

1. **Informações do token não atualizadas** - Cache do Basescan
2. **Dados on-chain diferentes** - Verificar se nome/símbolo estão corretos no contrato
3. **Visualização diferente** - Interface pode ter mudado

**Solução**: Verificar diretamente no contrato via `/address/` → "Read Contract" → `name()` e `symbol()`

---

## ✅ Conclusão

Ambas as abas estão corretas, apenas mostram informações diferentes:
- `/token/` = Informações do token como ativo
- `/address/` = Código-fonte e verificação do contrato

**Para verificação de código, sempre use `/address/`!**

