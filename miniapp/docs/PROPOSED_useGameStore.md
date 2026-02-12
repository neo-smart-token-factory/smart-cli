# Proposta: useGameStore para o projeto atual

Sugestão de store Pinia mínima, alinhada ao fluxo Smart Mint (3 etapas), **sem** mecânicas de idle game.  
Ref.: análise de um store de gameplay anterior (removido — spec antiga/confusa).

---

## 1. Análise do store de gameplay (obsoleto, removido)

**O que não bate com o projeto atual:**

| Aspecto | Exemplo | Nosso projeto |
|--------|---------|----------------|
| **Game mechanics** | Energy, XP, level, cooldowns, NEO, daily/idle rewards | Revertemos para Token Factory **sem** idle game (ESTRATEGIA) |
| **Estado** | `GameState` pesado (player, resources, progression, wallets, deployments, cooldowns) | Fluxo 3 etapas; form em `useDraft`; wallets em `useWeb3` / `useTon` |
| **Tipos** | Depende de `GameState.ts` + constantes (XP_PER_LEVEL, COOLDOWNS, etc.) | Esses tipos vêm da spec de gameplay; não usamos hoje |
| **Wallets** | Store guarda `wallets.baseConnected`, `tonAddress`, etc. | Wallets vivem nos composables; store duplicaria fonte de verdade |
| **Form / draft** | Não trata formulário | Draft é responsabilidade do `useDraft`; store não mexe nisso |
| **Inicialização** | `claimDailyReward`, `calculateIdleRewards`, `regenerateEnergy` | Não temos daily/idle/energy |

**O que vale reaproveitar:**

- **Deployments:** Histórico (tokenName, symbol, network, txHash, timestamp, sharedCount) para “Recent Sectors”, estatísticas, ShareCard, etc.
- **Share:** `recordShare(deploymentId?)` para crescimento/referral (GROWTH_STRATEGY).
- **Persistência:** Um único `localStorage` para estado “global” do app (além do draft).
- **Estrutura:** persist, reset, inicialização mínima.

---

## 2. Proposta: store mínima

- **Não duplica:** `useDraft` (form), `useWeb3` / `useTon` (wallets), `useJettonFactory` (deploy).
- **Guarda:** Histórico de deployments, último share (opcional), `referralId` (placeholder para GROWTH_STRATEGY), versão e `lastSyncedAt`.
- **Ações:** `recordDeployment`, `recordShare`, `persist`, `reset`, `initialize`. Opcional: `syncToBackend` (stub para quando existir API).

---

## 3. Código proposto

```ts
// stores/useGameStore.ts (PROPOSTA)
// Store mínima para Smart Mint: histórico de deploys + share, sem game mechanics.
// Form → useDraft; Wallets → useWeb3/useTon; Deploy → useJettonFactory.

import { defineStore } from 'pinia'

const STORAGE_KEY = 'neo-smart-mint-state'
const VERSION = '1.0.0'

export interface DeploymentRecord {
  id: string
  tokenName: string
  symbol: string
  network: 'TON' | 'BASE'
  txHash: string
  timestamp: number
  sharedCount: number
}

interface SmartMintState {
  deployments: DeploymentRecord[]
  lastSharedAt: number
  referralId: string | null
  version: string
  lastSyncedAt: number
}

function defaultState(): SmartMintState {
  return {
    deployments: [],
    lastSharedAt: 0,
    referralId: null,
    version: VERSION,
    lastSyncedAt: 0,
  }
}

function loadState(): SmartMintState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw) as SmartMintState
    if (parsed.version !== VERSION) return defaultState()
    return {
      ...defaultState(),
      ...parsed,
      deployments: Array.isArray(parsed.deployments) ? parsed.deployments : [],
    }
  } catch {
    return defaultState()
  }
}

export const useGameStore = defineStore('game', {
  state: (): SmartMintState => loadState(),

  getters: {
    totalDeployments: (s) => s.deployments.length,
    lastDeployment: (s): DeploymentRecord | null =>
      s.deployments.length ? s.deployments[s.deployments.length - 1]! : null,
    tonDeployments: (s) => s.deployments.filter((d) => d.network === 'TON').length,
    baseDeployments: (s) => s.deployments.filter((d) => d.network === 'BASE').length,
  },

  actions: {
    persist() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.$state))
      } catch (e) {
        console.error('[useGameStore] persist failed', e)
      }
    },

    recordDeployment(payload: {
      tokenName: string
      symbol: string
      network: 'TON' | 'BASE'
      txHash: string
    }) {
      this.deployments.push({
        id: crypto.randomUUID(),
        tokenName: payload.tokenName,
        symbol: payload.symbol,
        network: payload.network,
        txHash: payload.txHash,
        timestamp: Date.now(),
        sharedCount: 0,
      })
      this.persist()
    },

    recordShare(deploymentId?: string) {
      if (deploymentId) {
        const d = this.deployments.find((x) => x.id === deploymentId)
        if (d) d.sharedCount += 1
      }
      this.lastSharedAt = Date.now()
      this.persist()
    },

    setReferralId(id: string | null) {
      this.referralId = id
      this.persist()
    },

    reset() {
      Object.assign(this.$state, defaultState())
      this.persist()
    },

    initialize() {
      const loaded = loadState()
      Object.assign(this.$state, loaded)
    },

    async syncToBackend() {
      try {
        const res = await fetch('/api/game/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.$state),
        })
        if (res.ok) {
          this.lastSyncedAt = Date.now()
          this.persist()
        }
      } catch (_) {}
    },
  },
})
```

---

## 4. Uso sugerido no App (ao integrar)

**Após deploy com sucesso** (`handleDeploy`), antes de `currentStep = 3`:

```ts
const game = useGameStore()
game.recordDeployment({
  tokenName: form.name,
  symbol: form.symbol,
  network: 'TON',
  txHash: result?.boc ?? result?.toString?.() ?? 'pending', // ajustar ao retorno real do useJettonFactory
})
```

**No share** (`handleShare`), após abrir o link:

```ts
const game = useGameStore()
const last = game.lastDeployment
game.recordShare(last?.id)
```

**`initialize`:** chamar no `onMounted` do App (junto com init Web3/TON/auth), ou quando houver sync/backend.

---

## 5. Resumo

| Item | Exemplo | Proposta |
|------|---------|----------|
| Energy / XP / Level / Cooldowns | ✅ | ❌ |
| Daily / Idle | ✅ | ❌ |
| Wallets no store | ✅ | ❌ (useWeb3 / useTon) |
| Form / draft no store | ❌ | ❌ (useDraft) |
| Deployments | ✅ | ✅ |
| Record share | ✅ | ✅ |
| `referralId` | ❌ | ✅ (placeholder) |
| Persist / Reset / Init | ✅ | ✅ |
| Sync backend | ✅ | Stub opcional |

---

**NΞØ SMART FACTORY** — Proposta salva para implementação futura.
