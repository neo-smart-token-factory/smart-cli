# 🛸 Estratégia de Implementação: NΞØ Telegram MiniApp DApp

Este documento detalha o planejamento estratégico para transformar o `smart-ui-mobile` em uma interface de alto padrão integrada ao ecossistema Telegram, seguindo os padrões de engenharia da **NΞØ SMART FACTORY**.

---

## Status da Implementação (atualizado)

| Área | Status | Observação |
|------|--------|------------|
| **Shell (TWA)** | ✅ Feito | SDK, `useTelegram`, theme, viewport/safe area, mock initData |
| **Web3 Hub** | ✅ Feito | Base (WalletConnect) + TON (TON Connect), Network Guard |
| **Factory** | ✅ Feito | Deploy Jetton, NΞØ Cloud (CloudUpload), fluxo 3 etapas |
| **UX & Layout** | ✅ Feito | Neon Acid, mobile-first, `twa-viewport` / `twa-scroll` |
| **Roadmap/Governança** | ⏳ Pendente | Badges, dashboard de status, canal de suporte |

---

## 1. Visão Geral

O objetivo é garantir presença digital imediata, oferecendo funcionalidades Web3 core da Phase 1 (Foundation) enquanto preparamos o terreno para automações avançadas (Phase 2/3). O projeto assume agora uma **Arquitetura Multichain**, integrando a robustez da **Base Mainnet** com a agilidade nativa do ecossistema **TON Blockchain (Telegram)**.

## 2. Arquitetura Modular (Multichain-Core)

Dividiremos a implementação em módulos fundamentais que suportam tanto EVM quanto TVM:

### Módulo 0: The Shell (Fundação TWA) — ✅ Implementado

*   **Integração SDK:** Inclusão e configuração do `telegram-web-app.js`. *(Feito em `index.html`.)*
*   **Dynamic Theme:** Sincronização automática com as variáveis de cor do Telegram. *(Feito em `useTelegram`: `setHeaderColor`, `setBackgroundColor`, `themeParams`.)*
*   **Viewport e Safe Area:** Uso de `--tg-viewport-stable-height` e `--tg-safe-area-inset-*`; classes `.twa-viewport` e `.twa-scroll` para margens e rolagem no Mini App.
*   **Mock initData:** Quando roda fora do Telegram (dev local), `useTelegram` preenche `initData` com valor mock.

### Módulo 1: Web3 Hub (Multichain Connectivity) — ✅ Implementado

*   **Base Hub (EVM):** Gateway para WalletConnect, OKX e carteiras nativas na Base Mainnet. *(Feito em `useWeb3`.)*
*   **TON Hub (TVM):** Integração via **TON Connect SDK** para carteiras Tonkeeper, @Wallet e MyTonWallet. *(Feito em `useTon`.)*
*   **Network Guard:** Monitoramento de estado em ambas as redes. *(Aviso “Wrong Network” para Base no `StepForm`.)*

### Módulo 2: The Factory (Cross-Chain Deploy) — ✅ Implementado

*   **NEOFLW Factory:** Interface para definição e deploy de tokens **Jetton (TON)**. *(Fluxo em 3 etapas: Landing → Form → Result; `useJettonFactory`.)*
*   **SoU (State of Union):** Uso de **TON Storage** para hospedar metadados e ativos (NΞØ Cloud). *(Feito em `CloudUpload` + `useCloudStorage`.)*
*   **Persistência de rascunho:** Formulário do Smart Mint salvo em `localStorage` via `useDraft`.

### Módulo 3: Status & Roadmap (Strategic Partnerships) — ⏳ Pendente

*   **Feature Badges:** Uso de tags dinâmicas como `[BETA]`, `[STABLE]`, `[LOCKED]`. *(Previsto; não exposto no fluxo atual.)*
*   **TON Ecosystem Integration:** Implementação de suporte para o Programa de Lealdade da TON e Star Points.

---

## 3. Planejamento de Tarefas (TO-DO List)

### ✅ Fase 1: Fundação (Imediato)

- [x] Criar estrutura de diretórios para módulos. *(Composables, components, stores; fluxo em steps.)*
- [x] Configurar SDK do Telegram no `index.html`.
- [x] Implementar hook `useTelegram` para acesso fácil aos dados do usuário e tema.
- [x] Atualizar base de CSS para estética "Neon Acid" compatível com Dark/Light mode do TWA.
- [x] Layout viewport/safe area (`.twa-viewport`, `.twa-scroll`) e rolagem adequada no Mini App.

### 🏗️ Fase 2: Web3 & Factory

- [x] Portar lógica de contratos do repositório `smart-ui`. *(Deploy Jetton; fluxo inspirado no smart-ui.)*
- [ ] Implementar estimador de custos (Gas + Service Fee).
- [ ] Criar componentes de feedback de transação (Blockchain Pulse).

### 🚀 Fase 3: Governança e Feedback

- [ ] Implementar dashboard de status do roadmap.
- [ ] Criar canal de report de bugs e suporte direto.

---

## 4. Filosofia de Design e UX

*   **Estética Premium:** Uso de tipografia experimental, micro-animações e gradientes vibrantes. *(Implementado.)*
*   **Foco no Mobile:** Prioridade absoluta para a experiência de toque e navegação com o polegar. *(Layout mobile-first, `twa-viewport`.)*
*   **Transparência Institucional:** Nada de "placeholder". Se não estiver pronto, terá o badge `[COMING SOON]` com link para a documentação técnica.

---

**NΞØ SMART FACTORY** — Expand until silence becomes structure.
