# NΞØ SMART FACTORY — Mobile App

Progressive Web App (PWA) mobile-first para criação de tokens, construída com Vue 3 + Vite + Tailwind CSS.

## 🚀 Início Rápido

```bash
npm install
npm run dev
```

Acesse `http://localhost:3002`

## 🔐 Variáveis de Ambiente

Para o funcionamento completo da aplicação, as seguintes variáveis de ambiente devem ser configuradas:

### Obrigatórias para Produção

Crie um arquivo `.env` baseado no `.env.example`:

```bash
# Web3 Connect (EVM / Base) - OBRIGATÓRIO para recursos Web3
VITE_WALLET_CONNECT_PROJECT_ID=your_project_id_here

# TON Connect (TVM) - URLs padrão funcionam, mas podem ser customizadas
VITE_TON_MANIFEST_URL=https://neoprotocol.space/tonconnect-manifest.json
VITE_TON_NETWORK=mainnet
VITE_TON_RPC_URL=https://toncenter.com/api/v2/jsonRPC
```

### Como obter o WALLET_CONNECT_PROJECT_ID

1. Acesse [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Crie um projeto gratuito
3. Copie o Project ID
4. Configure no Vercel: Dashboard → Settings → Environment Variables

**⚠️ IMPORTANTE**: Sem o `VITE_WALLET_CONNECT_PROJECT_ID`, a aplicação funcionará parcialmente, mas os recursos de conexão Web3/Base estarão desabilitados.

## 📦 Build

```bash
npm run build
npm run preview
```

## 🎨 Características

- Design mobile-first
- PWA (Progressive Web App)
- Vue 3 Composition API
- Performance otimizada com Vite
- Preparado para integração Telegram Mini App

## 📁 Estrutura

```
smart-ui-mobile/
├── src/
│   ├── components/      # Componentes Vue
│   ├── App.vue          # Componente principal
│   ├── main.js          # Entry point
│   └── styles.css       # Tailwind imports
├── public/              # Assets estáticos
├── index.html           # HTML base
├── vite.config.js       # Configuração Vite
├── tailwind.config.js   # Configuração Tailwind
└── package.json
```

## 📦 Repositórios Relacionados

Este é o **Mobile App** do ecossistema NEØ Smart Factory.

- **Dashboard**: https://github.com/neo-smart-token-factory/smart-ui
  - Interface completa de gestão e fábrica de tokens
  - Inclui API routes (Vercel Serverless Functions)
- **Landing Page**: https://github.com/neo-smart-token-factory/smart-ui-landing
  - Página pública de marketing e captura de leads

## 🔮 Integração Futura

- Telegram Mini App
- Wallet mobile
- Notificações push

## 🐛 Troubleshooting

### Tela Preta no Deploy Vercel

Se o deploy na Vercel mostrar uma tela preta, verifique:

1. **Variáveis de Ambiente Configuradas**
   - Vá em Settings → Environment Variables
   - Adicione `VITE_WALLET_CONNECT_PROJECT_ID`
   - Redeploy após adicionar variáveis

2. **Logs de Build**
   - Verifique se o build completou sem erros
   - Build output deve estar em `/dist`

3. **Console do Navegador**
   - Abra DevTools (F12)
   - Verifique erros no console
   - Erros de módulos faltando indicam problema no build
   - Erros de CORS indicam problema de configuração de domínio

4. **Vercel.json**
   - Certifique-se que o arquivo está configurado corretamente
   - Deve incluir rewrite para SPA: `"/(.*)" → "/index.html"`

### Teste Local Antes do Deploy

```bash
# Build localmente
npm run build

# Teste a build
npm run preview

# Acesse http://localhost:4173 e verifique se funciona
```

---

**Versão**: v0.6.0 — IGNIÇÃO
