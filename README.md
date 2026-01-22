# NΞØ SMART FACTORY CLI (nxf)

> **Unified Command Line Interface for Web3 Protocol Operations.**

A interface oficial para desenvolvedores e operadores do ecossistema NΞØ. Projetada para ser rápida, segura e com uma estética premium.

## 🚀 Instalação para Desenvolvedores

Para trabalhar no projeto localmente e usar o comando `nxf` globalmente no seu terminal:

```bash
# 1. Clone o repositório
git clone https://github.com/neo-smart-token-factory/smart-cli.git
cd smart-cli

# 2. Instale as dependências
npm install

# 3. Vincule o comando ao seu sistema
npm link
```

Agora você pode usar `nxf` ou `neo-smart-factory` de qualquer lugar!

## 🩺 Diagnóstico e Saúde (Doctor)

O comando `doctor` é a ferramenta de inteligência operacional para garantir que tudo está pronto para produção.

```bash
nxf doctor --deep --contract 0x...
```

## 📦 Comandos Principais

| Comando | Descrição |
| :--- | :--- |
| `nxf init` | Inicializa um novo ambiente de token. |
| `nxf deploy` | Executa o deploy dos contratos inteligentes. |
| `nxf doctor` | Diagnóstico de saúde e auditoria do protocolo. |
| `nxf simulate` | Simulação completa do ecossistema do token (Econ/Risk). |
| `nxf status` | Verifica o progresso do desenvolvimento da fábrica. |

## 🛠️ Desenvolvimento

Para rodar o comando em modo de desenvolvimento sem instalá-lo globalmente:

```bash
npm run dev -- [comando]
# Exemplo: npm run dev -- doctor
```

## 📢 Marketing Automático

A CLI também serve como motor de narrativa, gerando conteúdo para redes sociais baseado no estado real do código.

```bash
nxf marketing update "Nova funcionalidade X implementada"
```

---

## 💼 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

**NΞØ Protocol** — *Expand until silence becomes structure.*
