import { defineStore } from 'pinia';

export const useProtocolStore = defineStore('protocol', {
    state: () => ({
        version: 'v0.5.3',
        roadmap: [
            { phase: 1, title: 'Foundation', status: 'ACTIVE', description: 'TWA Interface & Multi-Wallet Hub' },
            { phase: 2, title: 'Expansion', status: 'PROGRESS', description: 'Token Factory & TON Storage Integration' },
            { phase: 3, title: 'Intelligence', status: 'LOCKED', description: 'AI Agent Kit (Coinbase) & Automation' },
            { phase: 4, title: 'Sovereignty', status: 'LOCKED', description: 'Decentralized Governance (DAO)' }
        ],
        features: [
            { id: 'shell', name: 'NΞØ Shell', status: 'STABLE', description: 'Telegram SDK Integration' },
            { id: 'factory', name: 'Token Factory', status: 'BETA', description: 'Cross-chain Deployment' },
            { id: 'wallet', name: 'Web3 Hub', status: 'STABLE', description: 'Base & TON Connectivity' },
            { id: 'cloud', name: 'NΞØ Cloud', status: 'BETA', description: 'TON Storage Integration' },
        ],
        network: {
            base: { name: 'Base Mainnet', chainId: 8453 },
            ton: { name: 'TON Mainnet', chainId: -239 }
        }
    }),
    getters: {
        isReady: (state) => state.features.every(f => f.status === 'STABLE'),
        getFeature: (state) => (id) => state.features.find(f => f.id === id),
    }
});
