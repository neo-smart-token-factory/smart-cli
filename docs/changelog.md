# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

---

## 🛣️ Roadmap — Transparência Radical

> **Status**: v0.5.1 — IGNIÇÃO (Base sólida, expansão necessária)  
> **Filosofia**: Transparência total sobre o que funciona, o que está em desenvolvimento e o que vem a seguir.

### Versões Planejadas

| Versão | Nome | Tema | Entrega Estimada | Status |
|--------|------|------|-----------------|--------|
| **v0.5.x** | **IGNIÇÃO** | Base sólida e segurança | **Jan 2026** | ✅ Concluído |
| **v0.6.0** | **ORÁCULO** | Inteligência e Diagnóstico | **Fev 2026** | 🔨 Em execução |
| **v0.7.0** | **CULT** | Narrativa e Identidade | **Mar 2026** | 📋 Planejado |
| **v0.8.0** | **KERNEL** | Automação e Orquestração | **Abr 2026** | 📋 Planejado |
| **v1.0.0** | **SINGULARIDADE** | Ecossistema Autônomo | **Q3 2026** | 🎯 Objetivo |

---

### v0.5.x — IGNIÇÃO (Jan 2026)

**Foco**: Base Sólida, Estética Premium e Segurança Neural.

**Entregas Realizadas**:
- ✅ **v0.5.1**: Purificação do repositório base e estrutura modular.
- ✅ **v0.5.3**: **Security Hardening** — Validação EVM, Sanitização XSS e Normalização de dados.
- ✅ **NΞØ Smart Mint Protocol**: Sistema de sincronização cross-repo antecipado.
- ✅ **Interface Premium**: Dashboard inicial com suporte a Base/Polygon e Cloud State Sync.

---

### v0.6.0 — ORÁCULO (Fev 2026)

**Foco**: Inteligência, Diagnóstico e Auditoria Preditiva.

**O que será entregue**:
- 🔨 **Ecosystem Doctor**: Expansão do sistema `doctor` para auditoria de contratos inteligentes em tempo real.
- 🔨 **Protocol Intel Dashboard**: Feed dinâmico integrado entre `smart-ui` e `internal-ops` (v1.0 ativo).
- 🔨 **Heurísticas de Antifragilidade**: Algoritmos de verificação pré-deploy para evitar exploits comuns.
- 📋 **Neural Forge Template**: Primeiro template de contrato com lógica de governança inteligente.

**Por que é importante**:  
Transforma a fábrica de uma ferramenta passiva em um assistente ativo que garante a qualidade de cada ativo gerado.

---

### v0.7.0 — CULT (Mar 2026)

**Foco**: Narrativa Automática e Engenharia Cultural.

**O que será entregue**:
- 📋 **Manifesto Engine**: Geração de narrativas épicas baseadas no DNA do token.
- 📋 **Ritualist API**: Calendário de rituais de comunidade gerado via AI.
- 📋 **Creative Assets Forge**: Geração automática de logotipos e materiais visuais (integrado com DALL-E/Midjourney).
- 📋 **Whitepaper Dynamic Generator**: Exportação de documentos técnicos estruturados (Markdown/PDF).

---

### v0.8.0 — KERNEL (Abr 2026)

**Foco**: Automação de Ponta a Ponta e Orquestração Total.

**O que será entregue**:
- 📋 **Singular CLI**: Um único comando `neo forge` que orquestra build, test, deploy e docs.
- 📋 **One-Click Ecosystem**: Deploy simultâneo de Contrato + Landing Page + Dashboard de Holder.
- 📋 **Bridge-Ready Integration**: Conectores nativos para pontes multichain.
- 📋 **Protocol Auto-Updating**: Contratos actualizáveis via Proxy com governança integrada.

---

### v1.0.0 — IGNIÇÃO COMPLETA (Q2 2025)

**Foco**: Sistema coeso e completo

**O que será entregue**:
- ✅ Todos os módulos integrados
- ✅ Pipeline completo automatizado
- ✅ Documentação completa
- ✅ Testes end-to-end
- ✅ Performance otimizada

**Por que é importante**:  
A versão 1.0 representa o cumprimento completo do manifesto: uma fábrica descentralizada completa e funcional.

---

## 📋 Histórico de Versões

### [0.5.3] - 2026-01-21 — SECURITY HARDENING
**Status**: ✅ Estável — Reforço Crítico

#### Adicionado
- **NΞØ Smart Mint Protocol**: Novo workflow para sincronização cross-repo (UI <-> Core <-> Docs).
- Sistema de validação de endereços e transações EVM via Regex em endpoints de API.
- Sanitização de inputs contra XSS em todas as áreas de configuração de token.
- Feedback visual de erros críticos através de alertas dinâmicos na interface.

#### Mudado
- **Wallet Connection**: Migração de simulação aleatória para padrão real de requisição `eth_requestAccounts`.
- **Cloud Sync**: Otimização do debounce de auto-save (de 1s para 2s) para preservação de recursos de banco de dados.
- Normalização de endereços para lowercase antes do storage para prevenir colisão de dados.

#### Corrigido
- Vulnerabilidade de injeção em endpoints `api/deploys` e `api/drafts`.
- Race condition no carregamento de histórico de deploys.
- Identificadores duplicados e excesso de renders no formulário principal.

---

### [0.5.1] - 2024-01-01 — IGNIÇÃO

**Status**: ✅ Estável — Base funcional

#### Adicionado
- Estrutura completa de produção (`forge-core/`, `forge-ui/`, `forge-cli/`)
- Contrato `IgnitionToken.sol` (herda de `NeoTokenBase`)
- Contrato `NeoTokenBase.sol` (base purificada)
- Scripts de deploy, verificação e simulação
- Interface web básica (React + Tailwind landing + Nuxt.js PWA)
- CLI tool (`neo-smart-factory init/deploy`)
- Templates de contratos (`token.sol.template`)
- Sistema interno de operações (`internal-ops/`)
- Simulador de ecossistemas (`NEO::simulate`)
- Documentação completa reorganizada
- Suporte completo a Polygon e Amoy testnet
- Padronização de nomenclatura (`neo-smart-factory`)

#### Mudado
- Reorganização completa da estrutura de pastas
- Configuração Hardhat otimizada para Polygon
- Documentação movida para `docs/`
- Comando CLI: `mello-forge` → `neo-smart-factory`
- Pacotes NPM: `neo-forge-*` → `neo-smart-factory-*`

#### Corrigido
- Configurações de rede
- Scripts de deploy
- Inconsistências de nomenclatura

#### Limitações Conhecidas
- ⚠️ Oracle não implementado (v0.6.0)
- ⚠️ DNA incompleto (campos básicos apenas)
- ⚠️ CULT parcial (marketing engine básico)
- ⚠️ Kernel não automatizado (comandos separados)

---

### [0.5.0] - 2024-01-01

#### Adicionado
- Contrato `NeoSmartFactory.sol`
- Módulos de tokens (ERC20, ERC721)
- Sistema de vesting (`NeoVesting.sol`)
- Sistema de recompensas e badges (`NeoRewards.sol`)
- Internal Ops App
- Mini-Simulador de Ecossistemas

---

## 🔄 Processo de Versionamento

### Convenções
- **Versão MAJOR** (1.0.0): Mudanças incompatíveis
- **Versão MINOR** (0.6.0): Novas funcionalidades compatíveis
- **Versão PATCH** (0.5.1): Correções e melhorias

### Nomes de Versões
Cada versão tem um nome temático relacionado ao manifesto:
- **IGNIÇÃO** (v0.5.x) — Base funcional
- **ORÁCULO** (v0.6.x) — Inteligência
- **CULT** (v0.7.x) — Narrativa
- **KERNEL** (v0.8.x) — Automação
- **IGNIÇÃO COMPLETA** (v1.0.0) — Sistema coeso

---

## ⚠️ Transparência sobre Estimativas

**Importante**: As datas estimadas são **projeções baseadas em desenvolvimento ativo**. Podem mudar baseado em:
- Feedback da comunidade
- Prioridades técnicas
- Recursos disponíveis
- Complexidade descoberta durante desenvolvimento

**Compromisso**: Manteremos este roadmap atualizado e transparente sobre mudanças.

---

**Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/)**
