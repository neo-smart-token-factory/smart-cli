# TON # NeoJettonV1 — Arquitetura Multichain & Account Abstraction

> **Versão**: v0.5.3  
> **Status**: 🔨 Em Implementação  
> **Última atualização**: 24 de Janeiro de 2026  
> **Base**: Adaptação de NeoTokenV2 para TON Blockchain

---

## 🎯 Visão Geral

O **NeoJettonV1** é a implementação do padrão NEØ para TON, mantendo os princípios do NeoTokenV2:

- **Account Abstraction** via TON Connect (gasless via sponsor)
- **Arquitetura Multichain** (bridge-ready com LayerZero)
- **Proteção anti-bot** integrada
- **Supply cap** imutável

## 📊 Equivalências TON ↔ BASE

| Conceito | BASE (NeoTokenV2) | TON (NeoJettonV1) |
|----------|-------------------|-------------------|
| **Standard** | ERC20 + EIP-2612 | TEP-74 (Jetton) |
| **Gasless TX** | Permit (assinatura off-chain) | TON Connect + Sponsor |
| **Bridge** | bridgeMint() role | Wormhole/LayerZero adapter |
| **Anti-bot** | hasPublicMinted mapping | Cell storage flag |
| **Supply Cap** | MAX_SUPPLY constant | max_supply cell |
| **Ownership** | Ownable2Step | Admin address cell |

---

## 🏗️ Arquitetura TON

### Estrutura de Cells

```
Jetton Minter Cell
├── admin_address (MsgAddress)
├── content (Cell) → Metadata TEP-64
│   ├── name (string)
│   ├── symbol (string)
│   ├── description (string)
│   ├── image (string)
│   └── decimals (uint8)
├── jetton_wallet_code (Cell)
├── total_supply (Coins)
├── max_supply (Coins) ← NEØ: Supply cap
├── mint_price (Coins) ← NEØ: Preço do mint
├── mint_amount (Coins) ← NEØ: Quantidade por mint
├── public_mint_enabled (int1) ← NEØ: Status
└── minted_addresses (HashmapE 256 int1) ← NEØ: Anti-bot
```

---

## 💻 Implementação Frontend (Vue/React)

### 1. Integração TON Connect (Account Abstraction)

```javascript
// composables/useTon.js
import { TonConnectUI } from '@tonconnect/ui';

export function useTon() {
  const tonConnectUI = new TonConnectUI({
    manifestUrl: 'https://neoprotocol.space/tonconnect-manifest.json'
  });

  // Conectar wallet (gasless para o usuário se usar sponsor)
  const connect = async () => {
    await tonConnectUI.openModal();
  };

  return { connect, tonConnectUI };
}
```

### 2. Public Mint (Similar ao NeoTokenV2)

```javascript
// composables/useNeoJetton.js
import { beginCell, toNano, Address } from '@ton/ton';

export function useNeoJetton() {
  const publicMint = async (metadata) => {
    const { tonConnectUI, tonAddress } = useTon();
    
    // Verifica se já mintou (anti-bot)
    const hasMinted = await checkIfMinted(tonAddress.value);
    if (hasMinted) {
      throw new Error('Already minted');
    }

    // Payload para mint público
    const payload = beginCell()
      .storeUint(0x1, 32) // op::public_mint
      .storeUint(0, 64)   // query_id
      .endCell();

    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 300,
      messages: [{
        address: JETTON_MINTER_ADDRESS,
        amount: toNano('0.25').toString(), // Mint price
        payload: payload.toBoc().toString('base64')
      }]
    };

    await tonConnectUI.sendTransaction(transaction);
  };

  return { publicMint };
}
```

### 3. Obter Info do Contrato (getContractInfo equivalente)

```javascript
// components/TokenInfo.vue
<script setup>
import { ref, onMounted } from 'vue';
import { Address } from '@ton/ton';

const tokenInfo = ref(null);

const fetchTokenInfo = async () => {
  // GET method no Jetton Minter
  const result = await tonClient.runMethod(
    Address.parse(JETTON_MINTER_ADDRESS),
    'get_jetton_data'
  );

  const stack = result.stack;
  tokenInfo.value = {
    totalSupply: stack.readBigNumber(),
    mintable: stack.readBoolean(),
    adminAddress: stack.readAddress(),
    content: stack.readCell(),
    walletCode: stack.readCell()
  };

  // GET custom para info NEØ
  const neoInfo = await tonClient.runMethod(
    Address.parse(JETTON_MINTER_ADDRESS),
    'get_neo_info'
  );

  tokenInfo.value.maxSupply = neoInfo.stack.readBigNumber();
  tokenInfo.value.mintPrice = neoInfo.stack.readBigNumber();
  tokenInfo.value.mintAmount = neoInfo.stack.readBigNumber();
  tokenInfo.value.mintEnabled = neoInfo.stack.readBoolean();
};

onMounted(() => fetchTokenInfo());
</script>

<template>
  <div v-if="tokenInfo" class="token-info">
    <p>Supply: {{ tokenInfo.totalSupply }} / {{ tokenInfo.maxSupply }}</p>
    <p>Mint Price: {{ formatTON(tokenInfo.mintPrice) }} TON</p>
    <p>Status: {{ tokenInfo.mintEnabled ? 'Open' : 'Closed' }}</p>
  </div>
</template>
```

### 4. Gasless via TON Sponsor (Similar ao Permit)

```javascript
// Sponsor paga gas pelo usuário (Account Abstraction TON)
const gaslessMint = async () => {
  const { tonConnectUI } = useTon();

  // Usuário assina transação
  const transaction = buildMintTransaction();

  // TON Connect envia para sponsor (se configurado)
  // Sponsor executa e paga gas
  await tonConnectUI.sendTransaction(transaction, {
    sponsor: true // Requer configuração de sponsor
  });
};
```

---

## 🌉 Bridge Integration (Multichain)

### LayerZero para TON ↔ BASE

```javascript
// Bridge de TON para BASE
const bridgeToBase = async (amount) => {
  // 1. Lock tokens no TON
  const lockPayload = beginCell()
    .storeUint(0x2, 32) // op::bridge_lock
    .storeCoins(amount)
    .storeAddress(Address.parse(destinationAddress)) // Base address
    .storeUint(8453, 16) // Base chainId
    .endCell();

  await tonConnectUI.sendTransaction({
    messages: [{
      address: JETTON_BRIDGE_ADDRESS,
      amount: toNano('0.1').toString(),
      payload: lockPayload.toBoc().toString('base64')
    }]
  });

  // 2. LayerZero verifica e minta na Base via bridgeMint()
  // (Automático pelo bridge contract)
};

// Bridge de BASE para TON
const bridgeFromBase = async (amount) => {
  // 1. Lock tokens na Base (NeoTokenV2)
  await baseToken.bridgeLock(amount, tonAddress, -239); // -239 = TON chainId

  // 2. Bridge verifica e minta no TON
  // (Automático via LayerZero messaging)
};
```

---

## 🔒 Segurança (Padrão NEØ)

### Anti-bot (hasPublicMinted equivalente)

```func
;; FunC - get method
(int) has_minted(slice address) method_id {
  var (minted_addresses) = load_minted_addresses();
  (int value, int found) = minted_addresses.udict_get?(256, address);
  return found;
}

;; Mint function
() public_mint() impure {
  var sender_address = get_sender_address();
  
  ;; Anti-bot check
  throw_if(401, has_minted(sender_address));
  
  ;; Marca como mintado
  var minted_addresses = load_minted_addresses();
  minted_addresses~udict_set(256, sender_address, begin_cell().store_uint(1, 1).end_cell().begin_parse());
  save_minted_addresses(minted_addresses);
  
  ;; Mint tokens
  mint_tokens(sender_address, MINT_AMOUNT);
}
```

### Supply Cap (MAX_SUPPLY equivalente)

```func
;; FunC - supply cap check
() mint_tokens(slice to_address, int amount) impure {
  var (total_supply, max_supply) = load_supply_data();
  
  ;; Supply cap validation
  throw_if(402, total_supply + amount > max_supply);
  
  total_supply += amount;
  save_supply_data(total_supply, max_supply);
  
  ;; Internal mint logic
  send_mint_message(to_address, amount);
}
```

---

## 📱 Integração MiniApp Telegram

### Exemplo Completo (Vue)

```vue
<script setup>
import { ref, computed } from 'vue';
import { useTelegram } from '@/composables/useTelegram';
import { useTon } from '@/composables/useTon';
import { useNeoJetton } from '@/composables/useNeoJetton';

const { impactOccurred, showAlert } = useTelegram();
const { connect, isConnected, tonAddress } = useTon();
const { publicMint, getTokenInfo } = useNeoJetton();

const tokenInfo = ref(null);
const isMinting = ref(false);

const canMint = computed(() => {
  return isConnected.value && 
         tokenInfo.value?.mintEnabled && 
         !tokenInfo.value?.hasMinted;
});

const handleMint = async () => {
  if (!canMint.value) {
    showAlert('Connect wallet first or already minted');
    return;
  }

  impactOccurred('heavy');
  isMinting.value = true;

  try {
    await publicMint();
    showAlert('Mint successful! Check your wallet.');
    await fetchTokenInfo(); // Atualiza info
  } catch (error) {
    showAlert(`Mint failed: ${error.message}`);
  } finally {
    isMinting.value = false;
  }
};

const fetchTokenInfo = async () => {
  tokenInfo.value = await getTokenInfo(tonAddress.value);
};

onMounted(() => {
  if (isConnected.value) {
    fetchTokenInfo();
  }
});
</script>

<template>
  <div class="neo-jetton-mint">
    <!-- Token Info -->
    <div v-if="tokenInfo" class="glass-card">
      <h3>{{ tokenInfo.name }} ({{ tokenInfo.symbol }})</h3>
      <p>Supply: {{ tokenInfo.totalSupply }} / {{ tokenInfo.maxSupply }}</p>
      <p>Price: {{ formatTON(tokenInfo.mintPrice) }} TON</p>
      <p>Amount: {{ formatAmount(tokenInfo.mintAmount) }} tokens</p>
    </div>

    <!-- Connect Wallet -->
    <button 
      v-if="!isConnected" 
      @click="connect"
      class="btn-connect"
    >
      Connect TON Wallet
    </button>

    <!-- Mint Button -->
    <button
      v-else
      @click="handleMint"
      :disabled="!canMint || isMinting"
      class="btn-mint"
    >
      {{ isMinting ? 'Minting...' : 'Mint Token' }}
    </button>

    <!-- Status Messages -->
    <p v-if="tokenInfo?.hasMinted" class="status-warning">
      Already minted (Anti-bot protection)
    </p>
    <p v-if="!tokenInfo?.mintEnabled" class="status-disabled">
      Public mint disabled
    </p>
  </div>
</template>
```

---

## 🚀 Deployment Workflow

### Passo 1: Preparar Metadata

```javascript
const metadata = {
  name: 'Neo Protocol',
  symbol: 'NEO',
  description: 'NΞØ Smart Token on TON',
  image: 'https://neoprotocol.space/logo.png',
  decimals: 9,
  
  // NEØ Custom
  maxSupply: '1000000000', // 1 bilhão
  mintPrice: '0.25',        // 0.25 TON
  mintAmount: '1000',       // 1000 tokens per mint
  publicMintEnabled: true
};
```

### Passo 2: Deploy via SDK

```javascript
import { JettonMinter } from '@ton/ton';

const deployNeoJetton = async () => {
  const minter = JettonMinter.create({
    admin: Address.parse(adminAddress),
    content: buildMetadataCell(metadata),
    walletCode: JETTON_WALLET_CODE
  });

  const stateInit = minter.init;
  const address = contractAddress(0, stateInit);

  // Send deploy transaction
  await tonConnectUI.sendTransaction({
    validUntil: Math.floor(Date.now() / 1000) + 300,
    messages: [{
      address: address.toString(),
      amount: toNano('0.5').toString(),
      stateInit: stateInit.toBoc().toString('base64')
    }]
  });

  return address;
};
```

---

## 📊 Comparação: BASE vs TON

| Feature | BASE (NeoTokenV2) | TON (NeoJettonV1) | Status |
|---------|-------------------|-------------------|--------|
| **Gasless TX** | EIP-2612 Permit | TON Sponsor | ✅ Equivalente |
| **Public Mint** | publicMint() | op::public_mint | ✅ Implementado |
| **Anti-bot** | hasPublicMinted | minted_addresses cell | ✅ Implementado |
| **Supply Cap** | MAX_SUPPLY | max_supply cell | ✅ Implementado |
| **Bridge** | bridgeMint() | LayerZero adapter | 🔨 Em desenvolvimento |
| **Admin** | Ownable2Step | admin_address cell | ✅ Implementado |
| **Burn** | burn(), burnFrom() | op::burn | ✅ Nativo TEP-74 |
| **Metadata** | ERC20 strings | TEP-64 onchain | ✅ Implementado |

---

## 🗺️ Roadmap

### Fase 1: Core (🔨 Atual)
- [x] Documentação do padrão
- [ ] Smart contract FunC completo
- [ ] Deploy script
- [ ] Frontend composables

### Fase 2: MiniApp Integration
- [ ] Gasless via TON Sponsor
- [ ] UI/UX otimizada para Telegram
- [ ] Testes em testnet
- [ ] Deploy mainnet

### Fase 3: Multichain
- [ ] LayerZero adapter TON ↔ BASE
- [ ] Bridge UI
- [ ] Cross-chain monitoring

### Fase 4: Advanced Features
- [ ] Staking integration
- [ ] Governance (DAO)
- [ ] DeFi integrations

---

## 📚 Referências

### TON Standards
- [TEP-74: Jetton Standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md)
- [TEP-64: Token Data Standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md)
- [TON Connect Documentation](https://docs.ton.org/develop/dapps/ton-connect/overview)

### NEØ Protocol
- [NeoTokenV2 (BASE)](../contracts/NeoTokenV2.md)
- [NEØ Smart Factory](https://github.com/neo-smart-token-factory)
- [NEØ Protocol Site](https://neoprotocol.space)

### Bridges
- [LayerZero TON Integration](https://layerzero.network/)
- [Wormhole TON Support](https://wormhole.com/)

---

**Versão**: v0.5.3 — TON FOUNDATION  
**Licença**: MIT  
**Padrão**: NEØ Protocol

---

### 👤 Autoria

**Project Lead**: NODE NEØ  
**Web3 Identity**: neoprotocol.eth  
**NEØ PROTOCOL**: https://neoprotocol.space

> *Expand until silence becomes structure.*
