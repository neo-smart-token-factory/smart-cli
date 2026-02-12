# 📚 NΞØ Smart Mint — Documentação

Índice da documentação do **NΞØ Mobile Hub** (Telegram Mini App): fluxo Smart Mint em 3 etapas, estratégia, configuração e referências.

---

## 🗂️ Estrutura

| Documento | Descrição |
|-----------|-----------|
| **[NEXT_STEPS.md](./NEXT_STEPS.md)** | Roadmap técnico: stress testing, integração Smart Core, security audit |
| **[CONFIGURATION_GUIDE.md](./CONFIGURATION_GUIDE.md)** | Bot Telegram, Reown, TON Connect, variáveis de ambiente, deploy |
| **[REFERENCES.md](./REFERENCES.md)** | Links externos (TON, Base, WalletConnect, TWA) |
| **[PROPOSED_useGameStore.md](./PROPOSED_useGameStore.md)** | Proposta de store Pinia mínima (deployments + share), sem game mechanics |

### Estratégia e crescimento

| Documento | Descrição |
|-----------|-----------|
| **[estrategia-implementacao-miniapp/ESTRATEGIA.md](./estrategia-implementacao-miniapp/ESTRATEGIA.md)** | Arquitetura modular, status da implementação, TO-DO (Shell, Web3, Factory, Roadmap) |
| **[estrategia-implementacao-miniapp/GROWTH_STRATEGY.md](./estrategia-implementacao-miniapp/GROWTH_STRATEGY.md)** | Loop viral, ShareCard, CTA, referral, Star Points, notificações |
| **[estrategia-implementacao-miniapp/AUTH_GUIDE.md](./estrategia-implementacao-miniapp/AUTH_GUIDE.md)** | Auth via Telegram `initData` e `POST /api/auth` |

---

## 🎯 Fluxo atual (Smart Mint)

1. **Landing** (`StepLanding`) — Logo, status de carteiras, "Open Smart Mint"
2. **Form** (`StepForm`) — Nome, símbolo, decimals, descrição, upload de imagem; Connect Base/TON; Sign & Deploy
3. **Result** (`StepResult`) — ShareCard (Save PNG / Share Link), "Start New Sequence"

- **Form draft:** `useDraft` persiste em `localStorage`; limpa ao "Start New".
- **Viewport:** `.twa-viewport` e `.twa-scroll` para TWA (safe area, rolagem).

---

## 🛠️ Onde começar

| Perfil | Começar por |
|--------|-------------|
| **Config / Deploy** | [CONFIGURATION_GUIDE.md](./CONFIGURATION_GUIDE.md) |
| **Próximos passos** | [NEXT_STEPS.md](./NEXT_STEPS.md) |
| **Estratégia e crescimento** | [ESTRATEGIA](./estrategia-implementacao-miniapp/ESTRATEGIA.md) + [GROWTH_STRATEGY](./estrategia-implementacao-miniapp/GROWTH_STRATEGY.md) |
| **Store (deployments / share)** | [PROPOSED_useGameStore.md](./PROPOSED_useGameStore.md) |

---

**NΞØ SMART FACTORY** — Structure is sovereign. Expand.
