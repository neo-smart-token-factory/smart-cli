# 🚀 NΞØ Mobile Hub - Growth & Communication Strategy

Este documento detalha como transformar a utilidade técnica do **NΞØ Mobile** em uma ferramenta desejável e viral dentro do ecossistema Telegram.

---

## Status da Implementação (atualizado)

| Área | Status | Observação |
|------|--------|------------|
| **Certificado / ShareCard** | ✅ Feito | Card pós-deploy, "Sovereignty established", Save PNG + Share Link |
| **CTA viral (compartilhar)** | ✅ Feito | `t.me/share/url` com texto de ativação; `handleShare` no StepResult |
| **HapticFeedback** | ✅ Feito | `impactOccurred` em auth, deploy, share, navegação (useTelegram) |
| **One-Page Flow** | ✅ Feito | Fluxo 3 etapas (Landing → Form → Result), sem sair da tela principal |
| **Narrativa / copy** | ✅ Feito | "Node Operator", "Sovereignty established", tom técnico-exclusivo |
| **Link Pioneer / referral_id** | ⏳ Pendente | Store Pinia; link único por usuário |
| **Star Points & Rewards** | ⏳ Pendente | Programa TON; exibir no header |
| **Instant Notification Bottler** | ⏳ Pendente | Bot envia DM pós-deploy |
| **Zero-Click Info / Recent Sectors** | ⏳ Pendente | Gas, status rede, últimos ativos forjados |

---

## 🛰️ 1. O Loop Viral (The Pioneer Loop)

Para que o usuário "volte e conte para mais 5", precisamos transformar o ato técnico de criar um token em um ato de **status e soberania**.

### A. Certificado de Soberania (Post-Deploy) — ✅ Implementado

Após o sucesso do deploy na Base ou TON, o MiniApp deve gerar um "Card de Ativação" visualmente impressionante:

*   **Estética:** Estilo "Neural Neon" com o nome do token e endereço. *(Feito em `ShareCard.vue`: gradientes, logo, token name, network.)*
*   **Narrativa:** "Protocolo ativado com sucesso. Soberania estabelecida." *("Sovereignty established" + Protocol Status.)*
*   **CTA Viral:** Botão nativo: **"Compartilhar Ativação"** (abre a lista de contatos/grupos do Telegram com um link de indicação). *(Feito: "Share Link" abre `t.me/share/url`; "Save Card" gera PNG para envio.)*

### B. O Link de Pioneer (Referral) — ⏳ Pendente

Cada usuário terá um link único que rastreia novos "Nodes" ativados através dele.

*   **Recompensa:** Ganho de **Reputação NΞØ** (exibida no Dashboard de Status).
*   **Incentivo:** Usuários com alta reputação desbloqueiam acesso antecipado ao **Módulo 3: AI Agents**.

---

## 🎨 2. Narrativa de Marca (Copywriting) — ✅ Em uso

Seguindo o manifesto da **NΞØ SMART FACTORY**, a comunicação deve ser:

*   **Técnica, mas Fluida:** Evitar "juridiquês" de Web3, focar em "Potência e Autonomia". *(Copy no app e ShareCard.)*
*   **Exclusiva:** Tratar o usuário como um "Operador de Node" e não apenas como um cliente. *(ShareCard: "Node Operator", ID.)*
*   **Micro-momentos:** Usar sons haptics do Telegram e animações de "Encoding" para tornar a espera do deploy prazerosa. *(`impactOccurred` em confirmações; CloudUpload "Encoding Bag".)*

---

## ⚡ 3. Integração Inteligente (Telegram Native)

Devemos usar o melhor que o Telegram oferece para reduzir a fricção:

### A. Star Points & Rewards — ⏳ Pendente

*   Integrar com o programa de lealdade da TON para premiar usuários que realizam transações no app.
*   Exibir o saldo de "Star Points" diretamente no cabeçalho ao lado do endereço da carteira.

### B. Instant Notification Bottler — ⏳ Pendente

*   Ao concluir um deploy, o bot oficial envia uma mensagem privada: *"Operação concluída, Operador. Seu ativo [NOME] está vivo na rede [NETWORK]. 🌐 [Ver no Explorer]"*.
*   Isso garante que o usuário volte ao app para interagir com o resultado.

---

## 🏗️ 4. UX Patterns (Phase 1.5)

Para tornar o app "viciante" para construtores:

1.  **Zero-Click Info:** Mostrar o preço atual do Gas e o status da rede de forma ultra-minimalista. *(⏳ Pendente.)*
2.  **Recent Sectors:** Uma pequena lista (anônima) de "Últimos Ativos Forjados" no protocolo. Isso gera prova social e curiosidade: *"Se a NΞØ forjou 20 tokens na última hora, eu também quero o meu"*. *(⏳ Pendente.)*
3.  **One-Page Flow:** O processo de criação nunca deve tirar o usuário da tela principal. Usamos **Drawers** ou **Steppers** suaves. *(✅ Feito: fluxo em 3 steps, sempre na mesma view.)*

---

## 🛠️ Próximas Ações Técnicas

1.  [x] Implementar componente `ShareCard.vue` para geração de imagem dinâmica. *(Feito: toPng, Save Card, Share Link.)*
2.  [ ] Criar lógica de `referral_id` na store Pinia.
3.  [x] Integrar `HapticFeedback` do Telegram SDK em cada clique de confirmação. *(Feito em `useTelegram`; usado em auth, deploy, share, steps.)*

---

**NΞØ SMART FACTORY** — We don't chase the trend. We forge the infrastructure.
