# Tokens Criados

> **Onde cada novo token vive**

Esta pasta contém o **histórico vivo da fábrica**. Cada token criado tem sua própria estrutura completa.

## Estrutura por Token

Quando você cria um token com `neo-smart-factory init`, a estrutura é gerada automaticamente:

```
tokens/
└── nome-do-token/
    ├── contracts/           # Contratos do token
    │   └── Token.sol
    ├── scripts/             # Scripts específicos
    │   └── deploy.js
    ├── docs/                # Documentação do token
    │   └── README.md
    ├── ui/                  # UI gerada automaticamente
    │   ├── landing/         # Mini landing page
    │   ├── mint/            # Página de mint
    │   └── info/           # Página de informações
    ├── manifesto.md         # Manifesto do token
    ├── token-config.json    # Configuração do token
    └── deploy-info.json     # Informações do deploy
```

## Formato de Configuração

`token-config.json`:
```json
{
  "name": "Token Name",
  "symbol": "SYMBOL",
  "supply": "1000000",
  "price": "0.05",
  "network": "polygon",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

`deploy-info.json` (gerado após deploy):
```json
{
  "name": "Token Name",
  "symbol": "SYMBOL",
  "address": "0x...",
  "network": "polygon",
  "deployer": "0x...",
  "supply": "1000000",
  "price": "0.05",
  "deployedAt": "2024-01-01T00:00:00Z"
}
```

## Fluxo de Criação

1. **`neo-smart-factory init`** → Cria estrutura em `tokens/nome-do-token/`
2. **Configuração** → Edita `.env` e `token-config.json`
3. **Simulação** → `NEO::simulate NOME_DO_TOKEN`
4. **Deploy** → `neo-smart-factory deploy`
5. **UI Gerada** → `tokens/nome-do-token/ui/` criado automaticamente

## Responsabilidades

- ✅ Armazenar cada token criado
- ✅ Manter histórico completo
- ✅ Documentação por token
- ✅ UI gerada por token
- ✅ Informações de deploy

**É o histórico vivo da sua fábrica.**

---

*Tokens criados pela NΞØ SMART FACTORY v0.5.1*

