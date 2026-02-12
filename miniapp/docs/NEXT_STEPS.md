# 🚀 NΞØ MOBILE HUB - NEXT STEPS (INTEGRATION PHASE)

Este documento define o roteiro técnico para a próxima fase de desenvolvimento, focada na integração profunda com o **NΞØ Smart Core** e testes de stress.

---

## 1. 🧪 Stress Testing (Fase Atual - v0.6.x)

Antes de acoplar o motor principal, devemos validar a resistência da "carroceria" (Frontend & Auth).

### Objetivos do Teste:

*   **Auth Handshake:** Verificar se a autenticação via Telegram (`api/auth.js`) suporta picos de conexões simultâneas sem falhar ou gerar latência.
*   **Multichain Toggling:** Testar a troca rápida entre redes (Base <-> TON) e garantir que o estado da UI não se corrompa.
*   **Cloud Upload:** Validar o upload de imagens de >5MB para garantir que a UX de progresso (`CloudUpload.vue`) é resiliente a redes móveis instáveis.
*   **Viral Loop:** Confirmar que o fluxo de geração de `ShareCard` funciona em dispositivos Android (Low-end) e iOS.

---

## 2. 🔗 Smart Core Integration (Fase Próxima - v0.7.0)

Neste momento, o Mobile Hub opera com lógicas de fábrica genéricas/simuladas. A integração transformará o app em uma interface direta para os contratos inteligentes proprietários.

### A. Sincronização de ABIs

*   Clonar os artefatos de build do repositório `smart-core`.
*   Local: `smart-core/deployments/base/NeoSmartFactory.json` -> `mobile/src/contracts/abis/`.
*   Objetivo: Garantir que o frontend "fale a mesma língua" que o contrato.

### B. Endereçamento de Contratos

*   Atualizar `.env` com os endereços imutáveis dos contratos deployados.
    ```bash
    VITE_CONTRACT_FACTORY_BASE="0x..." # Endereço do NeoSmartFactory na Base
    VITE_CONTRACT_FACTORY_TON="EQ..."  # Endereço do Minter Oficial na TON
    ```

### C. Refatoração da Factory (`useJettonFactory.js`)

*   Substituir a lógica de deploy genérico pela chamada de função:

    *   **Solidity:** `NeoSmartFactory.createToken(name, symbol, supply)`
    *   **FunC/Tact:** Chamar o método `mint` do contrato Minter NΞØ.

---

## 3. 🛡️ Security audit (Pré-Mainnet)

*   Verificar se a exposição das chaves de API (`VITE_WALLET_CONNECT_PROJECT_ID`) no frontend segue as melhores práticas de *Domain Whitelisting*.
*   Validar se o fluxo de *Signature Request* exibe claramente os dados da transação para o usuário (evitar "Blind Signing").

---

**NΞØ SMART FACTORY** — *Architecture first. Stress test always.*
