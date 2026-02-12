# 🔍 Verificar Proxy no Blockscout

O contrato NEOFLW (`0x6575933669e530dC25aaCb496cD8e402B8f26Ff5`) é um **contrato proxy** (TWProxy do thirdweb).

## 📋 Informações Importantes

### Bytecode do Proxy

O bytecode que você viu no Blockscout:
```
0x3d3d3d3d363d3d37363d73071b36bce6a1e1693a864b933275fc3775fc7cc95af43d3d93803e602a57fd5bf3
```

Este é o bytecode do **proxy**, não da implementação. É um padrão comum em contratos upgradeable.

## 🎯 Como Verificar no Blockscout

### Opção 1: Via Interface Web (Recomendado)

1. **Acesse o contrato no Blockscout**:

   ```
   https://base.blockscout.com/address/0x6575933669e530dC25aaCb496cD8e402B8f26Ff5
   ```

2. **Clique em "Verify & Publish"**

3. **Escolha o método de verificação**:
   - **Via Sourcify** (mais fácil): Se já verificado no Sourcify, Blockscout pode importar automaticamente
   - **Standard JSON Input**: Use o arquivo de metadata do Foundry

4. **Para Proxy + Implementação**:
   - O Blockscout pode detectar automaticamente que é um proxy
   - Ou você pode verificar manualmente:
     - Primeiro verifique a **implementação** (encontre o endereço no Basescan)
     - Depois verifique o **proxy**

### Opção 2: Encontrar a Implementação

O endereço da implementação geralmente está disponível no Basescan:

1. **Acesse o Basescan**:
   ```
   https://basescan.org/address/0x6575933669e530dC25aaCb496cD8e402B8f26Ff5#code
   ```

2. **Procure por "Implementation"** na aba "Contract"
   - O endereço da implementação deve estar visível

3. **Use o script**:
   ```bash
   npx ts-node scripts/find-implementation.ts
   ```

### Opção 3: Verificar via Sourcify Primeiro

Como o contrato já está verificado no Basescan, você pode:

1. **Verificar no Sourcify primeiro**:
   - Acesse: https://verify.sourcify.dev/
   - Use "Import from Etherscan" (importa do Basescan automaticamente)

2. **Depois verificar no Blockscout**:
   - O Blockscout pode importar do Sourcify automaticamente
   - Ou use a interface web do Blockscout

## 📝 Arquivos Necessários

Para verificação manual, você precisará:

1. **Metadata JSON** (já compilado):
   ```
   artifacts_forge/TokenERC20.sol/TokenERC20.json
   ```

2. **Código-fonte**:
   ```
   contracts/prebuilts/token/TokenERC20.sol
   ```

## 🔧 Scripts Disponíveis

### Encontrar Implementação
```bash
npx ts-node scripts/find-implementation.ts
```

### Verificar no Blockscout
```bash
npx ts-node scripts/verify-blockscout.ts
```

## ⚠️ Notas Importantes

1. **Proxy vs Implementação**:
   - O **proxy** (`0x6575933669e530dC25aaCb496cD8e402B8f26Ff5`) é o endereço que você usa
   - A **implementação** é onde o código real está armazenado
   - Ambos precisam ser verificados para uma verificação completa

2. **Bytecode Curto**:
   - O bytecode que você viu é normal para proxies
   - É apenas o código do proxy, não da implementação completa
   - A implementação tem o bytecode completo do TokenERC20

3. **Já Verificado no Basescan**:
   - O contrato já está verificado no Basescan
   - Você pode usar essa verificação como referência
   - O Blockscout pode importar automaticamente se verificado no Sourcify

## 🚀 Próximos Passos

1. ✅ Verificar no Sourcify (use "Import from Etherscan")
2. ✅ Verificar no Blockscout (pode importar do Sourcify ou fazer manualmente)
3. ✅ Confirmar que ambos (proxy e implementação) estão verificados

---

**Dica**: A forma mais fácil é verificar primeiro no Sourcify usando "Import from Etherscan", e depois o Blockscout pode importar automaticamente do Sourcify!

