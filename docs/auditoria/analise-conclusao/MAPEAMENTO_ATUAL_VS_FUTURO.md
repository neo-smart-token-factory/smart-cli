# Mapeamento: Estrutura Atual vs Proposta Futura

> **Guia de referência rápida**

---

## 📊 Tabela de Mapeamento

```text
ASPECTO       ATUAL (v0.5.1)            FUTURO (PROPOSTA)
-------       ----------------------    -----------------------
Tipo          Monorepo                  Multi-repo (8 repos)
GitHub        neo-smart-factory         neo-smart-token-factory
Pastas        forge-{core,ui,cli}/      smart-{core,ui,cli}/
CLI           neo-smart-factory         nxf (alias)
NPM           neo-smart-factory-*       @neosmart/*
Pacotes       core, ui, cli             @neosmart/core, ui, cli
Status        [v]                       [>] 
-------       ----------------------    -----------------------
```

---

## 🔄 Mapeamento de Módulos

### Core Layer

```text
ATUAL                      FUTURO                 STATUS
-----------------------    -------------------    ------------------
forge-core/                smart-core/            [v] PLANEJADO
forge-core/contracts/      smart-core/contracts/  [v] MANTIDO
forge-core/scripts/        smart-core/scripts/    [v] MANTIDO
-----------------------    -------------------    ------------------
```

### Interface Layer

```text
ATUAL                      FUTURO                 STATUS
-----------------------    -------------------    ------------------
forge-ui/                  smart-ui/              [v] PLANEJADO
forge-ui/landing/          smart-ui/landing/      [v] MANTIDO
forge-ui/nuxt-app/         smart-ui/nuxt-app/     [v] MANTIDO
forge-cli/                 smart-cli/             [v] PLANEJADO
-----------------------    -------------------    ------------------
```

### Intelligence Layer (Futuro)

```text
ATUAL                           FUTURO                 STATUS
----------------------------    -------------------    ------------------
scripts/ecosystem-simulator.js  smart-oracle/          [>] CRIAR
scripts/marketing-engine.js     smart-cult/            [>] CRIAR
----------------------------    -------------------    ------------------
```

### Data Layer (Futuro)

```text
ATUAL                           FUTURO                 STATUS
----------------------------    -------------------    ------------------
tokens/template.json            smart-dna/             [>] CRIAR
----------------------------    -------------------    ------------------
```

### Orchestration Layer (Futuro)

```text
ATUAL                           FUTURO                 STATUS
----------------------------    -------------------    ------------------
N/A (comandos separados)        smart-kernel/          [>] PLANEJADO
----------------------------    -------------------    ------------------
```

---

## 📦 Mapeamento de Pacotes NPM

### Atual (v0.5.1)

```json
{
  "name": "neo-smart-factory-core",
  "name": "neo-smart-factory-ui",
  "name": "neo-smart-factory-cli"
}
```

### Proposto (Futuro)

```json
{
  "name": "@neosmart/core",
  "name": "@neosmart/ui",
  "name": "nxf",
  "name": "@neosmart/oracle",
  "name": "@neosmart/cult",
  "name": "@neosmart/dna",
  "name": "@neosmart/kernel"
}
```

---

## 🔧 Mapeamento de Comandos CLI

### Atual (v0.5.1)

```bash
neo-smart-factory init
neo-smart-factory deploy
```

### Proposto (Futuro)

```bash
nxf init          # Comando principal
nxf deploy        # Comando principal
# ou
neo-smart-factory init    # Alias
neo-smart-factory deploy  # Alias
```

---

## 📁 Mapeamento de Estrutura GitHub

### Atual (v0.5.1)

```
github.com/neomello/neo_smart_factory
└── (monorepo)
    ├── forge-core/
    ├── forge-ui/
    ├── forge-cli/
    └── ...
```

### Proposto (Futuro)

```
github.com/neo-smart-token-factory/
├── smart-core/
├── smart-ui/
├── smart-cli/
├── smart-oracle/
├── smart-cult/
├── smart-dna/
├── smart-kernel/
└── docs/
```

---

## ⚠️ Decisões Pendentes

### 1. Nomenclatura de Módulos

**Opção A**: Manter `forge-*` mesmo em multi-repo
- ✅ Consistência com estrutura atual
- ✅ Não causa breaking change
- ❌ Menos "limpo" que `smart-*`

**Opção B**: Migrar para `smart-*` no multi-repo
- ✅ Nomes mais curtos e claros
- ✅ Alinha com nome do projeto
- ❌ Requer renomeação completa

**Recomendação**: Decidir antes de iniciar migração.

---

### 2. Comando CLI

**Opção A**: Manter `neo-smart-factory`
- ✅ Consistente com nome do projeto
- ✅ Já padronizado
- ❌ Mais longo que `nxf`

**Opção B**: Migrar para `nxf` com alias
- ✅ Mais curto e rápido
- ✅ Pode manter `neo-smart-factory` como alias
- ❌ Requer mudança de hábito

**Recomendação**: Manter `neo-smart-factory` como principal, `nxf` como alias opcional.

---

### 3. NPM Scope

**Opção A**: Manter `neo-smart-factory-*`
- ✅ Consistente com nome do projeto
- ✅ Já padronizado
- ❌ Mais longo

**Opção B**: Migrar para `@neosmart/*`
- ✅ Mais curto e profissional
- ✅ Alinha com GitHub org
- ❌ Requer criação de org NPM

**Recomendação**: Migrar para `@neosmart/*` quando criar GitHub org.

---

## 📅 Timeline de Decisões

| Decisão | Prazo | Status |
|---------|-------|--------|
| Nomenclatura de módulos | Antes de v0.6.0 | ⏳ Pendente |
| Comando CLI (`nxf` vs `neo-smart-factory`) | Antes de v0.6.0 | ⏳ Pendente |
| NPM Scope (`@neosmart` vs `neo-smart-factory-*`) | Antes de migração | ⏳ Pendente |

---

## 📝 Notas

- Os documentos em `analise-conclusao/` são **propostas futuras**, não realidade atual
- A estrutura atual (`forge-*`, `neo-smart-factory`) está funcionando e padronizada
- Qualquer migração deve ser planejada cuidadosamente para evitar breaking changes
- Recomenda-se manter compatibilidade retroativa durante transição

---

**Última atualização**: 2024-01-01  
**Versão**: v0.5.1 — IGNIÇÃO

