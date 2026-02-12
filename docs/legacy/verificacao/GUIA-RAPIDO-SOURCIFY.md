# 🚀 Guia Rápido: Verificar no Sourcify

## ✅ Status Atual

- **Proxy**: `0x6575933669e530dC25aaCb496cD8e402B8f26Ff5`
- **Implementation**: `0x071b36bce6a1e1693a864b933275fc3775fc7cc9` ✅ **CONFIRMADO**

## 📋 Passos para Verificação no Sourcify

### Opção 1: Interface Web (Recomendado) ⭐

1. **Acesse**: <https://verify.sourcify.dev/>

2. **Preencha**:
   - **Chain**: Base (8453)
   - **Address**: `0x071b36bce6a1e1693a864b933275fc3775fc7cc9`
   - ⚠️ **Use o endereço da IMPLEMENTAÇÃO, não o proxy!**

3. **Método**: "Standard JSON Input"

4. **Upload**:
   - Arquivo: `artifacts_forge/TokenERC20.sol/TokenERC20.json`
   - Localização: `/Users/nettomello/CODIGOS/contracts/artifacts_forge/TokenERC20.sol/TokenERC20.json`

5. **Clique em "Verify"**

### Opção 2: Import from Etherscan (Mais Fácil)

1. **Acesse**: <https://verify.sourcify.dev/>

2. **Preencha**:
   - **Chain**: Base (8453)
   - **Address**: `0x071b36bce6a1e1693a864b933275fc3775fc7cc9`

3. **Clique em "Import from Etherscan"**
   - Isso importa automaticamente o código já verificado no Basescan
   - ⚠️ Pode não funcionar se o Basescan não tiver o código completo da implementação

## ⚠️ Importante

- Use sempre o endereço da **IMPLEMENTAÇÃO** (`0x071b36bce6a1e1693a864b933275fc3775fc7cc9`)
- **NÃO** use o endereço do proxy (`0x6575933669e530dC25aaCb496cD8e402B8f26Ff5`)

## 🔗 Links Úteis

- **Sourcify**: <https://verify.sourcify.dev/>
- **Implementation no Basescan**: <https://basescan.org/address/0x071b36bce6a1e1693a864b933275fc3775fc7cc9>
- **Proxy no Basescan**: <https://basescan.org/address/0x6575933669e530dC25aaCb496cD8e402B8f26Ff5>

---

**Pronto!** Siga esses passos e sua verificação no Sourcify deve funcionar! 🎉
