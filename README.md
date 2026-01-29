# NΞØ SMART FACTORY CLI (nsf)

> **Official Operations Engine for the NΞØ Protocol.**

A interface unificada para desenvolvedores e operadores da **NΞØ SMART FACTORY**. Projetada como o "cérebro operacional" do ecossistema, permitindo simulação, auditoria, deploy e gestão narrativa de protocolos Web3 diretamente pelo terminal.

## 🚀 Instalação (Development Mode)

Para contribuir com o projeto localmente e ativar o comando `nsf` globalmente:

```bash
# 1. Clone o repositório
git clone https://github.com/neo-smart-token-factory/smart-cli.git
cd smart-cli

# 2. Instale as dependências
npm install

# 3. Vincule o comando ao seu sistema
npm link
```

Agora você pode usar `nsf` ou `neo-smart-factory` de qualquer lugar!

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ ▓▓▓ COMANDOS PRINCIPAIS (v0.5.3)                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│ └─ nsf init                                                                 │
│    └─ Inicializa um novo ambiente de token (Phase 1)                        │
│ └─ nsf token draft                                                          │
│    └─ Cria rascunho de token em tokens/*.json (Phase 1)                     │
│ └─ nsf simulate                                                             │
│    └─ Simulação completa de Security/Econ/Risk (Phase 1)                    │
│ └─ nsf token deploy                                                         │
│    └─ Deploy Real (Phase 2 Bridge) via smart-core (Production)              │
│ └─ nsf doctor                                                               │
│    └─ Diagnóstico de saúde e auditoria do protocolo (Phase 1)               │
│ └─ nsf marketing                                                            │
│    └─ Motor de narrativa e geração de conteúdo (Phase 1)                    │
│ └─ nsf status                                                               │
│    └─ Verifica o progresso e estado da factory (Phase 1)                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 🔵 Phase 2 Integration (Web3 Bridge)

A partir da v0.5.3, a CLI atua como a **Protocol Authority** para o `smart-ui`. O comando `nsf token deploy` permite que a interface modular envie intenções de deploy que são processadas com simulação de segurança prévia.

```bash
# Executar deploy real com validação de segurança automática
nsf token deploy NOME_DO_TOKEN
```

## 🛠️ Tech Stack & Standards

Este projeto segue rigorosamente os **.neodevstandards**:
- **Core:** Node.js 기반 Unified CLI.
- **Engine:** Integração profunda com Hardhat via `smart-core`.
- **Security:** Bloqueio automático de deploys em caso de risco crítico.
- **Narrative:** Geração automática de manifestos e rituais.

---

<div align="center">

## NΞØ SMART FACTORY

**Transformando código em ativos líquidos.**

[![Website](https://img.shields.io/badge/Website-neosmart.space-D8F244?style=flat-square&logo=internet-explorer&logoColor=000)](https://neosmart.space)
[![GitHub](https://img.shields.io/badge/GitHub-neo--smart--token--factory-C0E030?style=flat-square&logo=github&logoColor=000)](https://github.com/neo-smart-token-factory)
[![Twitter](https://img.shields.io/badge/Twitter-@neosmartfactory-A8C81C?style=flat-square&logo=twitter&logoColor=000)](https://x.com/neosmartfactory)
[![Email](https://img.shields.io/badge/Email-neosmart.factory@gmail.com-90B008?style=flat-square&logo=gmail&logoColor=000)](mailto:neosmart.factory@gmail.com)

</div>
