import { ref, onMounted, onUnmounted } from 'vue';
import { TonConnectUI } from '@tonconnect/ui';

// NΞØ Protocol TON Metadata
const manifestUrl = 'https://neoprotocol.space/tonconnect-manifest.json';

let tonConnectUI = null;
let unsubscribeHandler = null;

export function useTon() {
    const tonAddress = ref(null);
    const isTonConnected = ref(false);
    const tonWallet = ref(null);

    const initTon = () => {
        if (tonConnectUI) return tonConnectUI;

        tonConnectUI = new TonConnectUI({
            manifestUrl,
            buttonRootId: null, // We handle our own UI
        });

        // Subscribe to connection status - STORE unsubscribe to prevent memory leak
        unsubscribeHandler = tonConnectUI.onStatusChange((wallet) => {
            if (wallet) {
                tonAddress.value = wallet.account.address;
                tonWallet.value = wallet;
                isTonConnected.value = true;
                console.log('NΞØ TON Hub Sync: Connected', tonAddress.value);
            } else {
                tonAddress.value = null;
                tonWallet.value = null;
                isTonConnected.value = false;
                console.log('NΞØ TON Hub Sync: Disconnected');
            }
        });

        return tonConnectUI;
    };

    // CRITICAL: Cleanup to prevent memory leak
    onUnmounted(() => {
        if (unsubscribeHandler) {
            unsubscribeHandler();
            unsubscribeHandler = null;
        }
    });

    const connectTon = async () => {
        const t = initTon();
        await t.openModal();
    };

    const disconnectTon = async () => {
        if (tonConnectUI) await tonConnectUI.disconnect();
    };

    return {
        tonAddress,
        isTonConnected,
        tonWallet,
        connectTon,
        disconnectTon,
        initTon
    };
}
