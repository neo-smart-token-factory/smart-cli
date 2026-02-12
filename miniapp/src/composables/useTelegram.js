import { ref, onMounted } from 'vue';

export function useTelegram() {
    const tg = window.Telegram?.WebApp;
    const user = ref(null);
    const theme = ref('dark');

    const initData = ref('');

    const initWebApp = () => {
        if (tg) {
            tg.ready();
            tg.expand(); // Maximiza o BottomSheet no mobile (iOS/Android). Sem efeito em desktop.

            user.value = tg.initDataUnsafe?.user;
            initData.value = tg.initData;
            theme.value = tg.colorScheme || 'dark';

            tg.setHeaderColor(theme.value === 'dark' ? '#050505' : '#ffffff');
            tg.setBackgroundColor(theme.value === 'dark' ? '#050505' : '#ffffff');
            // Viewport: --tg-viewport-height, --tg-viewport-stable-height (CSS).
            // Safe area: --tg-safe-area-inset-{top,bottom,left,right} (Bot API 8.0+).
        } else {
            // CRITICAL: Mock deve ser APENAS para dev local, nunca em produção
            // Backend DEVE rejeitar hash 'mock_dev_hash'
            const isDev = import.meta.env.MODE === 'development' || 
                         window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1';
            
            if (isDev) {
                console.warn('⚠️ Running in DEV MODE with mock Telegram data');
                const mockUser = encodeURIComponent(JSON.stringify({
                    id: 123456789,
                    first_name: 'Dev',
                    username: 'dev_mock',
                    language_code: 'pt',
                }));
                initData.value = `query_id=AAHdF6IQAAAAAN0XohAOqTek&user=${mockUser}&auth_date=${Math.floor(Date.now() / 1000)}&hash=mock_dev_hash`;
            } else {
                // Em produção sem Telegram SDK = erro crítico
                console.error('❌ Telegram WebApp SDK not found in production');
                initData.value = '';
            }
        }
    };

    const showAlert = (message) => {
        if (tg) {
            tg.showAlert(message);
        } else {
            alert(message);
        }
    };

    const showConfirm = (message, callback) => {
        if (tg) {
            tg.showConfirm(message, callback);
        } else {
            if (confirm(message)) callback(true);
        }
    };

    const closeApp = () => {
        if (tg) tg.close();
    };

    const impactOccurred = (style = 'medium') => {
        if (tg && tg.HapticFeedback) {
            tg.HapticFeedback.impactOccurred(style);
        }
    };

    onMounted(() => {
        initWebApp();
    });

    return {
        tg,
        user,
        initData,
        theme,
        showAlert,
        showConfirm,
        closeApp,
        impactOccurred
    };
}
