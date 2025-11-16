# NΞØ SMART FACTORY

> **A Fábrica Descentralizada de Protocolos do Futuro**

No subterrâneo invisível da economia digital, enquanto o mercado corre atrás de trends obsoletos, surge uma arquitetura silenciosa que une inteligência, automação, tokenização e engenharia cultural: **NΞØ SMART FACTORY**.

Mais que uma ferramenta, é um **sistema vivo de criação**.

## 📁 Estrutura do Repositório

```
neo-smart-factory/
├── forge-core/                    # Núcleo Hardhat + Polygon + OpenZeppelin
│   ├── contracts/                # Contratos inteligentes
│   │   ├── IgnitionToken.sol     # Token de ignição v0.5.1
│   │   └── ...                   # Outros contratos
│   ├── scripts/                   # Scripts de deploy e verificação
│   ├── test/                     # Testes
│   ├── templates/                # Templates reutilizáveis
│   └── package.json
│
├── forge-ui/                     # Interface web (Next.js)
│   ├── pages/                    # Páginas da aplicação
│   ├── components/               # Componentes React
│   └── package.json
│
├── forge-cli/                    # CLI oficial
│   ├── bin/                      # Executáveis
│   ├── commands/                 # Comandos CLI
│   └── package.json
│
├── docs/                         # Documentação
│   ├── manifesto.md
│   ├── architecture.md
│   ├── patch-v0.5.1.md
│   └── changelog.md
│
├── internal-ops/                 # Sistema interno de operações
│   ├── scripts/                  # Scripts de simulação e análise
│   └── COMMANDS.md               # Guia de comandos
│
├── tokens/                       # Tokens criados
├── examples/                     # Exemplos de uso
└── README.md                     # Este arquivo
```

## 🚀 Início Rápido

### 1. Configurar forge-core

```bash
cd forge-core
npm install
cp .env.example .env
# Editar .env com suas configurações
```

### 2. Criar e Deployar Token

#### Via CLI:
```bash
cd forge-cli
npm install
npm link  # ou npm install -g .
neo-forge init
neo-forge deploy
```

#### Via Scripts:
```bash
cd forge-core
npm run simulate  # Simular antes do deploy
npm run deploy    # Deploy em Polygon
```

### 3. Usar Interface Web

```bash
cd forge-ui
npm install
npm run dev
# Acessar http://localhost:3000
```

## 🎮 Sistema Interno (ChatGPT)

O projeto inclui um sistema interno de operações que funciona através de comandos:

### Comandos Principais

```
NEO::simulate <TOKEN_NAME>     # Simulação completa (OBRIGATÓRIO antes do deploy)
NEO::status                    # Status do projeto
NEO::token draft <NAME>        # Criar rascunho de token
NEO::marketing update "..."    # Gerar conteúdo de marketing
```

Veja `internal-ops/COMMANDS.md` para documentação completa.

## 📚 Documentação

- [Manifesto](docs/manifesto.md)
- [Arquitetura](docs/architecture.md)
- [Patch v0.5.1](docs/patch-v0.5.1.md)
- [Changelog](docs/changelog.md)
- [Comandos Internos](internal-ops/COMMANDS.md)

## 🏗️ Componentes

### forge-core
Núcleo da fábrica com Hardhat, contratos e scripts de deploy.

**Características:**
- ✅ Polygon-ready
- ✅ Suporte a Amoy testnet
- ✅ Verificação automática de contratos
- ✅ Templates reutilizáveis

### forge-ui
Interface web para criação de tokens.

**Características:**
- ✅ Formulário oficial
- ✅ Preview de deploy
- ✅ Next.js 14

### forge-cli
Ferramenta CLI para criação e deploy.

**Comandos:**
- `neo-forge init` — Inicializar novo token
- `neo-forge deploy` — Deploy de token

### internal-ops
Sistema interno de operações (ChatGPT).

**Módulos:**
- Token Testing
- Build Log
- Marketing Engine
- Ecosystem Simulator

## 🔐 Segurança

- ✅ Contratos baseados em OpenZeppelin
- ✅ Testes automatizados
- ✅ Verificação de contratos
- ✅ Simulação antes do deploy

## 🌐 Redes Suportadas

- **Polygon** (Mainnet)
- **Amoy** (Testnet)
- **Hardhat** (Local)

## 📄 Licença

MIT

## 🤝 Contribuindo

Este é um projeto da NΞØ Protocol. Para contribuições, entre em contato através dos canais oficiais.

---

**NΞØ SMART FACTORY v0.5.1 — IGNIÇÃO**

*Uma fábrica que opera no presente, mas foi construída para sobreviver ao colapso de plataformas, fusões corporativas e ciclos de hype.*
