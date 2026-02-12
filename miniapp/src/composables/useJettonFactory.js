import { ref } from 'vue';
import { beginCell, toNano, Address, Cell } from '@ton/ton';
import { useTon } from './useTon';

/**
 * NΞØ Protocol - TON Jetton Deployment
 * 
 * Deploy direto do Jetton Minter Contract (padrão NEØ)
 * Similar ao NeoTokenV2 em BASE, mas adaptado para TON
 * 
 * Baseado em: minter.ton.org (TON Foundation)
 * Referência: https://github.com/ton-blockchain/minter-contract
 */

// Treasury do protocolo NΞØ
const PROTOCOL_TREASURY = import.meta.env.VITE_PROTOCOL_TREASURY_ADDRESS || '';

// Factory: deploy usa JETTON_DEPLOYER_ADDRESS; o minter code fica no contrato, não no cliente.
const JETTON_DEPLOYER_ADDRESS = import.meta.env.VITE_JETTON_DEPLOYER_ADDRESS || '';

// Op-codes (NΞØ Jetton Factory - Tact)
const OP_DEPLOY_JETTON = 0x61caf729;

// Op-codes Standard
const OP_TRANSFER = 0xf8a7ea5;
const OP_INTERNAL_TRANSFER = 0x178d4519;
const OP_EXCESSES = 0xd53276db;

export function useJettonFactory() {
    const { initTon, tonAddress } = useTon();
    const isDeploying = ref(false);

    /**
     * Deploy a new Jetton (Token) on TON via NΞØ Factory
     * @param {Object} config - { metadataUrl, maxSupply, mintPrice, mintAmount }
     */
    const deployJetton = async (config) => {
        if (!tonAddress.value) {
            throw new Error('Wallet not connected');
        }
        if (!JETTON_DEPLOYER_ADDRESS) {
            throw new Error('NΞØ Factory not configured (VITE_JETTON_DEPLOYER_ADDRESS)');
        }

        isDeploying.value = true;
        try {
            // 1. Prepare Metadata Cell (Off-chain link)
            const contentCell = beginCell()
                .storeUint(0x01, 8) // Off-chain content tag
                .storeStringTail(config.metadataUrl)
                .endCell();

            // 2. Build deployment payload for NΞØ Jetton Factory
            // Match messages.tact: DeployJetton { owner, content, max_supply, mint_price, mint_amount }
            const deployPayload = beginCell()
                .storeUint(OP_DEPLOY_JETTON, 32)
                .storeAddress(Address.parse(tonAddress.value)) // owner
                .storeRef(contentCell)
                .storeCoins(toNano(config.maxSupply))
                .storeCoins(toNano(config.mintPrice))
                .storeCoins(toNano(config.mintAmount))
                .endCell();

            // 3. Build the transaction
            const transaction = {
                validUntil: Math.floor(Date.now() / 1000) + 300,
                messages: [
                    {
                        address: JETTON_DEPLOYER_ADDRESS,
                        amount: toNano('0.45').toString(), // Required for factory deploy + gas
                        payload: deployPayload.toBoc().toString('base64'),
                    },
                ],
            };

            console.log('NΞØ Jetton Deploy Config:', {
                factory: JETTON_DEPLOYER_ADDRESS,
                owner: tonAddress.value,
                name: metadata.name.trim(),
                symbol: metadata.symbol.trim().toUpperCase(),
                decimals
            });

            // 3. Send via TON Connect
            const tonConnectUI = initTon();
            if (!tonConnectUI) {
                throw new Error('TON Connect not initialized');
            }
            const result = await tonConnectUI.sendTransaction(transaction);

            console.log('NΞØ Jetton Deployment Sent:', result);
            return result;
        } catch (error) {
            console.error('NΞØ Jetton Deployment Failed:', error);
            throw error;
        } finally {
            isDeploying.value = false;
        }
    };

    return {
        isDeploying,
        deployJetton,
    };
}
