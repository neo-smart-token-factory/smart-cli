# Guia de Uso — NΞØ SMART CLI

Este guia detalha como utilizar a ferramenta oficial de linha de comando (CLI) do protocolo NΞØ em diferentes contextos.

## 💻 1. Uso via Terminal (Desenvolvedores)

Se você executou o `npm link`, use o comando `nsf`:

### Iniciar Projeto
```bash
nsf init
```

### Diagnóstico de Protocolo
```bash
nsf doctor --deep --contract <address>
```

### Simular Ecossistema
```bash
nsf simulate <TOKEN_SYMBOL>
```

---

## 🤖 2. Uso via Assistente AI (Internal Ops)

O sistema possui um "painel invisível" que permite ao assistente AI processar comandos diretamente através de mensagens no chat. Isso é usado para automação e relatórios rápidos.

Quando estiver no chat com o assistente, você pode usar o prefixo `NEO::`:

- `NEO::status` — Relatório de progresso.
- `NEO::token audit <NAME>` — Auditoria rápida de rascunho.
- `NEO::doctor` — Diagnóstico básico do ambiente.

---

## 🏗️ 3. Comandos de Manutenção

Para desenvolvedores modificando a fábrica:

- `npm run dev -- <comando>`: Executa o código atual sem necessidade de rebuild/reinstall.
- `npm run test`: Executa a suite de testes (em breve).

## 📋 Lista Completa
Para ver todos os comandos e opções atualizadas, sempre consulte:
```bash
nsf --help
```

OU leia o arquivo completo de especificações em **[COMMANDS.md](./COMMANDS.md)**.
