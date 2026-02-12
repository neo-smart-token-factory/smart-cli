import { ref } from 'vue';

/**
 * NΞØ Cloud Storage Composable
 * 
 * Abstração para upload descentralizado.
 * Atualmente configurado para simular o comportamento de TON Storage
 * enquanto integra com gateways de persistência.
 */

export function useCloudStorage() {
    const isUploading = ref(false);
    const uploadProgress = ref(0);
    const lastUploadedUrl = ref(null);

    // CRITICAL: Configurações de segurança para upload
    const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const DANGEROUS_EXTENSIONS = ['.exe', '.bat', '.cmd', '.sh', '.js', '.html'];

    /**
     * Realiza o upload de um arquivo para o ecossistema descentralizado.
     * @param {File} file - O arquivo a ser enviado.
     * @returns {Promise<string>} - A URL/CID do arquivo no storage.
     */
    const uploadFile = async (file) => {
        // CRITICAL: Validação de arquivo antes de qualquer processamento
        if (!file || !(file instanceof File)) {
            throw new Error('Invalid file object');
        }

        // Validar tipo de arquivo
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            throw new Error(`Invalid file type: ${file.type}. Only images are allowed.`);
        }

        // Validar tamanho do arquivo
        if (file.size > MAX_FILE_SIZE) {
            throw new Error(`File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Max allowed: 5MB`);
        }

        // Validar extensão do arquivo
        const fileName = file.name.toLowerCase();
        if (DANGEROUS_EXTENSIONS.some(ext => fileName.endsWith(ext))) {
            throw new Error('Dangerous file extension detected');
        }

        // Validar nome do arquivo
        if (fileName.length > 255) {
            throw new Error('File name too long');
        }

        isUploading.value = true;
        uploadProgress.value = 0;

        try {
            console.log(`NΞØ Cloud: Preparando transmissão de ${file.name}...`);

            // Simulação de Progresso para UX Premium
            const progressInterval = setInterval(() => {
                if (uploadProgress.value < 90) {
                    uploadProgress.value += Math.random() * 15;
                }
            }, 400);

            // Aqui seria a integração real com o Gateway TON Storage ou IPFS Proxy
            // Por enquanto, simulamos uma resposta de sucesso
            await new Promise(resolve => setTimeout(resolve, 3000));

            clearInterval(progressInterval);
            uploadProgress.value = 100;

            // URL Simulada baseada no padrão TON HTTP
            const mockCid = 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3efuylqabf3efu';
            lastUploadedUrl.value = `https://ipfs.io/ipfs/${mockCid}`;

            console.log('NΞØ Cloud: Persistência concluída.', lastUploadedUrl.value);
            return lastUploadedUrl.value;
        } catch (error) {
            console.error('NΞØ Cloud: Erro na persistência de dados:', error);
            throw error;
        } finally {
            setTimeout(() => {
                isUploading.value = false;
                uploadProgress.value = 0;
            }, 1000);
        }
    };

    return {
        isUploading,
        uploadProgress,
        lastUploadedUrl,
        uploadFile
    };
}
