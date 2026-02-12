import crypto from 'crypto';

/**
 * NΞØ Protocol - Telegram Auth Validator
 * 
 * Este script valida o 'initData' enviado pelo Telegram Mini App (TWA).
 * Baseado na documentação oficial do Telegram.
 */

// CRITICAL: Rate limiting para prevenir DoS
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minuto
const MAX_REQUESTS_PER_WINDOW = 10;

function checkRateLimit(identifier) {
    const now = Date.now();
    const userRequests = rateLimitMap.get(identifier) || [];
    
    // Remover requisições antigas
    const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW);
    
    if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
        return false;
    }
    
    recentRequests.push(now);
    rateLimitMap.set(identifier, recentRequests);
    
    // Cleanup: remover entradas antigas a cada 100 requisições
    if (rateLimitMap.size > 1000) {
        for (const [key, times] of rateLimitMap.entries()) {
            if (times.every(t => now - t > RATE_LIMIT_WINDOW)) {
                rateLimitMap.delete(key);
            }
        }
    }
    
    return true;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // CRITICAL: Rate limiting por IP
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || 
                     req.headers['x-real-ip'] || 
                     req.connection?.remoteAddress || 
                     'unknown';
    
    if (!checkRateLimit(clientIp)) {
        return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }

    const { initData } = req.body;
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

    if (!initData || !BOT_TOKEN) {
        return res.status(400).json({ error: 'Missing initData or BOT_TOKEN' });
    }

    // CRITICAL: Validar tamanho do payload para prevenir memory exhaustion
    if (initData.length > 10000) {
        return res.status(400).json({ error: 'Payload too large' });
    }

    try {
        // CRITICAL: Rejeitar mock hash em produção
        if (initData.includes('hash=mock_dev_hash') && process.env.NODE_ENV === 'production') {
            console.error('Security Alert: Mock auth attempt in production');
            return res.status(401).json({ error: 'Invalid authentication method' });
        }

        // 1. Validar a integridade
        const isValid = validateTelegramInitData(initData, BOT_TOKEN);

        if (!isValid) {
            return res.status(401).json({ error: 'Invalid origin or tampered data' });
        }

        // 2. CRITICAL: Prevenir replay attacks - verificar timestamp
        const urlParams = new URLSearchParams(initData);
        const authDate = parseInt(urlParams.get('auth_date'));
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const MAX_AUTH_AGE = 86400; // 24 hours

        if (!authDate || isNaN(authDate)) {
            return res.status(401).json({ error: 'Invalid auth_date' });
        }

        if (currentTimestamp - authDate > MAX_AUTH_AGE) {
            return res.status(401).json({ error: 'Authentication expired' });
        }

        // 3. Extrair dados do usuário com validação
        const userParam = urlParams.get('user');
        if (!userParam) {
            return res.status(400).json({ error: 'Missing user data' });
        }

        let user;
        try {
            user = JSON.parse(userParam);
        } catch (parseError) {
            return res.status(400).json({ error: 'Invalid user data format' });
        }

        // 4. Validar campos obrigatórios do usuário
        if (!user.id || typeof user.id !== 'number') {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        // 5. Aqui você registraria/atualizaria no banco de dados NΞØ
        // Ex: db.users.upsert({ telegram_id: user.id, ...user })

        return res.status(200).json({
            status: 'authenticated',
            user: {
                id: user.id,
                first_name: user.first_name || '',
                username: user.username || '',
                language_code: user.language_code || 'en'
            },
            timestamp: Date.now()
        });

    } catch (error) {
        console.error('Auth Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

/**
 * Função Core de Validação
 */
function validateTelegramInitData(initData, botToken) {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');

    // Remover hash da verificação
    urlParams.delete('hash');

    // Ordenar parâmetros alfabeticamente
    const params = Array.from(urlParams.entries())
        .map(([key, value]) => `${key}=${value}`)
        .sort()
        .join('\n');

    // 1. Gerar Secret Key (HMAC-SHA256 de "WebAppData" usando Bot Token)
    const secretKey = crypto
        .createHmac('sha256', 'WebAppData')
        .update(botToken)
        .digest();

    // 2. Gerar Hash de verificação (HMAC-SHA256 dos params usando a secretKey)
    const calculatedHash = crypto
        .createHmac('sha256', secretKey)
        .update(params)
        .digest('hex');

    // 3. Comparar
    return calculatedHash === hash;
}
