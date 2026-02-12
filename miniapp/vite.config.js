import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
    plugins: [vue()],
    define: {
        global: 'window',
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    build: {
        rollupOptions: {
            input: './index.html',
            output: {
                manualChunks: (id) => {
                    if (id.includes('node_modules')) {
                        // Combine all Web3 related packages to avoid circular dependencies
                        if (id.includes('ethers') || id.includes('@noble') || id.includes('@web3modal') || id.includes('@reown') || id.includes('@walletconnect')) {
                            return 'vendor-web3-all';
                        }
                        if (id.includes('@ton') || id.includes('ton-core') || id.includes('@tonconnect') || id.includes('tweetnacl')) {
                            return 'vendor-ton-hub';
                        }
                        if (id.includes('vue') || id.includes('pinia') || id.includes('lucide') || id.includes('motion')) {
                            return 'vendor-core';
                        }
                    }
                }
            }
        },
        chunkSizeWarningLimit: 1000 // Aumenta o limite para suprimir avisos desnecessários após split
    },
    server: {
        port: 3002  // Changed from 3001 to avoid conflict with landing
    }
})
