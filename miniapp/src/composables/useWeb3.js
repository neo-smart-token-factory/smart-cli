import { ref, computed } from 'vue';

// NΞØ Protocol Network Configuration: BASE MAINNET
const BASE_MAINNET = {
    chainId: 8453,
    name: 'Base',
    currency: 'ETH',
    explorerUrl: 'https://basescan.org',
    rpcUrl: import.meta.env.VITE_BASE_RPC_URL || 'https://mainnet.base.org'
};

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

if (!projectId) {
    console.warn('NΞØ Web3 Hub: VITE_WALLET_CONNECT_PROJECT_ID is not defined in environment. Web3 features will be limited.');
}

const metadata = {
    name: 'NΞØ Mobile',
    description: 'NΞØ SMART FACTORY DApp',
    url: 'https://neoprotocol.space',
    icons: ['https://neoprotocol.space/logo.png']
};

// Singleton instance to avoid multiple modals
let modalInstance = null;
let initializationPromise = null; // CRITICAL: Prevent race condition

export function useWeb3() {
    const address = ref(null);
    const isConnected = ref(false);
    const chainId = ref(null);

    const initWeb3 = async () => {
        // CRITICAL: If already initialized, return the instance
        if (modalInstance) return modalInstance;

        // CRITICAL: If initialization is in progress, wait for it
        if (initializationPromise) {
            return initializationPromise;
        }

        // If no project ID, return early with a warning
        if (!projectId) {
            console.warn('NΞØ Web3 Hub: Cannot initialize without VITE_WALLET_CONNECT_PROJECT_ID');
            return null;
        }

        // CRITICAL: Store the promise to prevent concurrent initializations
        initializationPromise = (async () => {
            try {
                console.log('NΞØ Web3 Hub: Loading heavy modules...');
                // Dynamic Import to Keep Initial Bundle Light
                const { createWeb3Modal, defaultConfig } = await import('@web3modal/ethers');

            modalInstance = createWeb3Modal({
                ethersConfig: defaultConfig({ metadata }),
                chains: [BASE_MAINNET],
                projectId,
                enableAnalytics: true,
                themeMode: 'dark',
                themeVariables: {
                    '--w3m-color-mix': '#D6FF00',
                    '--w3m-color-mix-strength': 10,
                    '--w3m-accent': '#D6FF00',
                    '--w3m-border-radius-master': '12px'
                }
            });

            // Sync initial state
            syncState();

            // Subscribe to state changes
            modalInstance.subscribeState(state => {
                syncState(state);
            });

                return modalInstance;
            } catch (error) {
                console.error('NΞØ Web3 Hub: Module expansion failed', error);
                modalInstance = null;
                initializationPromise = null;
                throw error;
            }
        })();

        return initializationPromise;
    };

    const syncState = (state) => {
        if (!modalInstance) {
            address.value = null;
            isConnected.value = false;
            chainId.value = null;
            return;
        }
        
        const currentAddress = modalInstance.getAddress();
        const currentIsConnected = modalInstance.getIsConnected();
        const currentChainId = modalInstance.getChainId();

        address.value = currentAddress;
        isConnected.value = currentIsConnected;
        chainId.value = currentChainId;

        console.log('NΞØ Web3 Sync:', { address: address.value, isConnected: isConnected.value });
    };

    const connect = async () => {
        if (!projectId) {
            console.warn('NΞØ Web3 Hub: Cannot connect - missing project ID');
            throw new Error('Web3 connection requires VITE_WALLET_CONNECT_PROJECT_ID environment variable');
        }
        const m = await initWeb3();
        if (m) await m.open();
    };

    const disconnect = async () => {
        if (modalInstance) await modalInstance.disconnect();
    };

    const isBaseNetwork = computed(() => chainId.value === 8453);

    return {
        address,
        isConnected,
        chainId,
        isBaseNetwork,
        connect,
        disconnect,
        initWeb3
    };
}
