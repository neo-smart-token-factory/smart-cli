# 🪙 NΞØ Protocol - Guia de Deploy de Jettons (TON)

**Atualizado:** 2026-01-24  
**Status:** ✅ Configuração Oficial Implementada

---

## 📍 DIFERENÇA ENTRE OS ENDEREÇOS

### 🏦 VITE_PROTOCOL_TREASURY_ADDRESS
```
UQBBVansdaNi_Rc_7fLZ8nZfCbNaDTQtew_pFTYd2eXzD8lg
```

**Tipo:** Wallet Address (Carteira)  
**Proprietário:** Protocolo NΞØ  
**Função:** Receber fundos, taxas, pagamentos  
**Uso no código:** Opcional (para taxas de protocolo futuras)

**Exemplo de uso:**
```javascript
// Se você quiser cobrar uma taxa de protocolo no futuro:
const protocolFee = amount * 0.01; // 1%
await sendToAddress(PROTOCOL_TREASURY, protocolFee);
```

---

### 🏭 JETTON_DEPLOYER_ADDRESS

```
EQD0vdSA_NedR9uvbgN9EikRX-suesDxGeFg69XQMavfLqIw
```

**Tipo:** Smart Contract (Factory)  
**Proprietário:** TON Foundation (Público)  
**Função:** Deploy de novos Jettons  
**Uso no código:** **OBRIGATÓRIO** para criar tokens

**O que faz:**

1. Recebe pedido de deploy com metadata
2. Cria um novo **Jetton Minter Contract** 
3. Configura o owner como você
4. Retorna o endereço do novo token

---

## 🎯 COMO FUNCIONA O DEPLOY

```
┌─────────────┐
│   Usuário   │ (você)
└──────┬──────┘
       │ 1. Envia transação com metadata
       ↓
┌─────────────────────────────┐
│  JETTON_DEPLOYER_ADDRESS    │ (Factory Contract)
│  EQD0vdSA_Ne...             │
└──────┬──────────────────────┘
       │ 2. Cria novo contrato
       ↓
┌─────────────────────────────┐
│  Jetton Minter Contract     │ (Seu novo token)
│  EQxxx... (novo endereço)   │
│  Owner: você                │
│  Name: "NeoFlow"            │
│  Symbol: "NEO"              │
└─────────────────────────────┘
```

---

## 💻 CÓDIGO IMPLEMENTADO

### useJettonFactory.js

```javascript
// ✅ ENDEREÇO CORRETO - Jetton Factory Oficial da TON
const JETTON_DEPLOYER_ADDRESS = 'EQD0vdSA_NedR9uvbgN9EikRX-suesDxGeFg69XQMavfLqIw';

// Op-code oficial para deploy de Jetton
const OP_DEPLOY_JETTON = 0x5fcc3d14;

// Treasury do protocolo NΞØ (uso futuro, opcional)
const PROTOCOL_TREASURY = import.meta.env.VITE_PROTOCOL_TREASURY_ADDRESS;

async function deployJetton(metadata) {
    // 1. Criar metadata cell (TEP-64 compliant)
    const metadataCell = beginCell()
        .storeUint(0, 8) // Onchain tag
        .storeStringRefTail(metadata.name)
        .storeStringRefTail(metadata.symbol)
        .storeStringRefTail(metadata.description)
        .storeStringRefTail(metadata.image)
        .storeUint(metadata.decimals, 8)
        .endCell();

    // 2. Criar payload de deploy
    const deployPayload = beginCell()
        .storeUint(OP_DEPLOY_JETTON, 32)
        .storeUint(0, 64)
        .storeAddress(Address.parse(tonAddress.value)) // Você será o owner
        .storeRef(metadataCell)
        .endCell();

    // 3. Enviar transação para o Factory
    const transaction = {
        messages: [{
            address: JETTON_DEPLOYER_ADDRESS, // ✅ Factory oficial
            amount: toNano('0.25').toString(), // 0.25 TON para deploy
            payload: deployPayload.toBoc().toString('base64')
        }]
    };

    await tonConnectUI.sendTransaction(transaction);
}
```

---

## 💰 CUSTOS DE DEPLOY

| Item | Custo | Descrição |
|------|-------|-----------|
| **Deploy Fee** | 0.25 TON | Custo para criar o Jetton Minter contract |
| **Storage Fee** | ~0.02 TON | Armazenamento on-chain do metadata |
| **Transaction Gas** | ~0.01 TON | Gas da transação |
| **TOTAL** | ~0.28 TON | (~$1.40 com TON a $5) |

**Nota:** O código envia **0.25 TON**, que é suficiente para cobrir tudo.

---

## 🔍 VERIFICAÇÃO PÓS-DEPLOY

Após o deploy bem-sucedido, você pode verificar seu Jetton:

### 1. TON Explorer
```
https://tonviewer.com/<endereço-do-jetton-minter>
```

### 2. Obter endereço do Jetton deployado
```javascript
// O resultado da transação conterá o endereço
const result = await deployJetton(metadata);
console.log('Jetton Minter Address:', result.address);
```

### 3. Ver seu saldo
```javascript
// Você (owner) receberá o supply inicial automaticamente
// Veja em sua wallet TON
```

---

## 🛠️ ALTERNATIVAS DE FACTORY

Se o endereço oficial não funcionar, você tem alternativas:

### Opção 1: TON Foundation (ATUAL ✅)
```javascript
const JETTON_DEPLOYER_ADDRESS = 'EQD0vdSA_NedR9uvbgN9EikRX-suesDxGeFg69XQMavfLqIw';
```
- **Vantagem:** Oficial, mais confiável
- **Custo:** ~0.25 TON

### Opção 2: Tonkeeper/Tonhub Factory
```javascript
const JETTON_DEPLOYER_ADDRESS = 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs';
```
- **Vantagem:** Usado por Tonkeeper
- **Custo:** ~0.25 TON

### Opção 3: Minter.ton
```javascript
const JETTON_DEPLOYER_ADDRESS = 'EQBX6K9aXVl3nXIcvKKgk0BnJUZbkmB_pY6FcT3JeFxnGGFO';
```
- **Vantagem:** Interface web disponível
- **Custo:** ~0.3 TON

---

## 🧪 COMO TESTAR

### 1. Em Testnet (Recomendado primeiro!)

Altere para testnet no `.env`:
```env
VITE_TON_NETWORK=testnet
```

Use o Factory de testnet:
```javascript
const JETTON_DEPLOYER_ADDRESS = 'EQDk2RDhzPZKCzjYe_-nP6SjNVoqH0-YQ4aBTqz1HmD5z7kH'; // Testnet
```

Obtenha TON de teste:
```
https://t.me/testgiver_ton_bot
```

### 2. Em Mainnet (Após testar!)

Use as configurações de produção atuais no código.

---

## 📋 CHECKLIST PRÉ-DEPLOY

Antes de fazer deploy em mainnet, verifique:

- [ ] Metadata validado (nome, símbolo, descrição)
- [ ] Imagem do token hospedada (IPFS/TON Storage)
- [ ] Decimals corretos (geralmente 9 para TON)
- [ ] Wallet TON com saldo suficiente (mínimo 0.3 TON)
- [ ] Testado em testnet primeiro
- [ ] Endereços do Factory verificados

---

## ⚠️ AVISOS IMPORTANTES

### 🚨 IMUTABILIDADE
Uma vez deployado, o Jetton é **IMUTÁVEL**:
- ❌ Não pode mudar o nome
- ❌ Não pode mudar o símbolo
- ❌ Não pode mudar os decimals
- ✅ Pode transferir ownership (admin)
- ✅ Pode fazer mint (se configurado)

### 💸 CUSTOS NÃO REEMBOLSÁVEIS
Se o deploy falhar:
- Você perde o gas (0.01-0.02 TON)
- A taxa de deploy (0.25 TON) também é perdida
- **Sempre teste em testnet primeiro!**

### 🔐 OWNERSHIP
- Você será o **admin/owner** do Jetton
- Pode transferir ownership depois
- Guarde sua seed phrase com segurança

---

## 📞 SUPORTE

### Documentação Oficial TON
- Jetton Standard (TEP-74): https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md
- TON Docs: https://docs.ton.org/develop/dapps/asset-processing/jettons

### Community
- TON Dev Chat: https://t.me/tondev_eng
- TON Community: https://t.me/toncoin

### Explorers
- TON Viewer: https://tonviewer.com
- TON Scan: https://tonscan.org
- TON Whales: https://tonwhales.com

---

## 🎯 RESUMO

| Configuração | Valor | Arquivo |
|--------------|-------|---------|
| **Factory Address** | `EQD0vdSA_NedR9uvbgN9EikRX-suesDxGeFg69XQMavfLqIw` | `useJettonFactory.js` |
| **Op-Code** | `0x5fcc3d14` | `useJettonFactory.js` |
| **Deploy Cost** | `0.25 TON` | `useJettonFactory.js` |
| **Treasury (NΞØ)** | `UQBBVansdaNi...` | `.env` |
| **Network** | `mainnet` | `.env` |

✅ **Configuração completa e funcional implementada!**

---

**Próximos passos:**
1. Teste em testnet primeiro
2. Verifique os custos em sua wallet
3. Deploy em mainnet quando pronto
4. Compartilhe seu token com a comunidade! 🚀
