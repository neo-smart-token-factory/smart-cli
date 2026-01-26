# NΞØ Internal Ops — Guia de Comandos

Este documento descreve como usar o sistema de comandos internos da NΞØ SMART FACTORY.

## 🎯 Como Funciona

Digite os comandos diretamente no chat. O sistema processará e retornará informações formatadas.

---

## 🎯 Módulo 0: Mini-Simulador de Ecossistemas (OBRIGATÓRIO)

### `NEO::simulate <TOKEN_NAME>`

**SIMULADOR COMPLETO OBRIGATÓRIO antes de qualquer deploy real.**

Executa simulação completa do ecossistema verificando:

**A. Segurança:**
- Supply faz sentido?
- Owner não é zero?
- Preço fixo não é zero?
- Travas estão adequadas?
- Wallet já está conectada?

**B. Tokenômica:**
- O modelo faz sentido?
- Tem risco de mint infinito?
- Há risco de exploit?
- Existe overflow?

**C. Rituais e Comportamento:**
- Mint 1x por wallet faz sentido?
- Supply inicial não explode economia?
- Preço fixo não cria barreira?
- Há necessidade de vesting?

**D. Narrativa:**
- Integra com NΞØ Protocol?
- Integra com NΞØ Token?
- Alinhado com FlowOFF narrativa cultural?
- Manifesto do token existe?

**E. Simulação de 7 Dias:**
- Estimativas de holders
- Volume projetado
- Análise de risco
- Curva de adoção
- Comportamento esperado

**Exemplo:**
```
NEO::simulate WOD
```

**Retorna:**
- Veredito final (APPROVED / NEEDS_REVIEW)
- Score geral (0-100)
- Problemas críticos identificados
- Recomendações obrigatórias
- Projeções de 7 dias

---

## 📦 Módulo 1: Token Testing

### `NEO::token simulate <TOKEN_NAME>`

Simula um token completo (análise básica), retornando:
- Análise de completude
- Validação de tokenômica
- Riscos identificados
- Recomendações
- Preview de deploy

**Nota:** Para simulação completa de ecossistema, use `NEO::simulate` acima.

**Exemplo:**
```
NEO::token simulate WOD
```

---

### `NEO::token draft <TOKEN_NAME> [config]`

Cria um rascunho de token. Opcionalmente pode incluir configuração inicial.

**Exemplo:**
```
NEO::token draft FLUXX
NEO::token draft WOD {"symbol": "WOD", "total_supply": 1000000}
```

---

### `NEO::token manifest <TOKEN_NAME>`

Gera manifesto completo para um token, incluindo:
- Introdução
- Visão
- Valores
- Rituais
- Filosofia técnica
- Seção de comunidade

**Exemplo:**
```
NEO::token manifest NEOFLOW
```

---

### `NEO::token deploy-preview <TOKEN_NAME>`

Mostra preview de deploy com:
- Estimativa de gas
- Custo estimado
- Componentes a serem deployados
- Avisos

**Exemplo:**
```
NEO::token deploy-preview WOD
```

---

### `NEO::token audit <TOKEN_NAME>`

Realiza auditoria rápida do token:
- Checks de tokenômica
- Checks de segurança
- Checks de distribuição
- Checks de vesting
- Checks de governança
- Score geral
- Recomendações

**Exemplo:**
```
NEO::token audit FLUXX
```

---

### `NEO::token economics <TOKEN_NAME>`

Valida e analisa a economia do token:
- Soma da distribuição
- Validação contra supply total
- Warnings de concentração
- Recomendações de ajuste

**Exemplo:**
```
NEO::token economics WOD
```

---

### `NEO::token narrative <TOKEN_NAME>`

Gera ou atualiza a narrativa do token:
- Story
- Manifesto
- Rituais sugeridos
- Valores

**Exemplo:**
```
NEO::token narrative NEOFLOW
```

---

### `NEO::token deploy <TOKEN_NAME> [config]`

**Ação de Deploy Real (Phase 2).**

Executa o deploy real do token na rede blockchain configurada.
1. Carrega o rascunho do token.
2. Executa simulação de segurança.
3. Se aprovado, executa transação real via `smart-core`.
4. Retorna `txHash` e `contractAddress`.

**Exemplo:**
```
NEO::token deploy WOD
NEO::token deploy WOD {"userAddress": "0x...", "sessionId": "..."}
```

**Nota:** O comando `forge` ainda é suportado para compatibilidade retroativa, mas está deprecated. Use `deploy` ao invés.

---

### `NEO::token rituals <TOKEN_NAME>`

Sugere rituais para o token baseado em sua configuração.

**Exemplo:**
```
NEO::token rituals WOD
```

---

## 📊 Módulo 2: Build Log

### `NEO::status`

Retorna status completo do projeto:
- Versão atual
- Progresso da SMART FACTORY
- Itens concluídos
- Pendências
- Recomendações
- Riscos
- Próxima ação
- Sugestão de marketing
- Status de branding

**Exemplo:**
```
NEO::status
```

**Resposta esperada:**
```
v0.5.1 — IGNIÇÃO

SMART:
- ✅ Core (completed)
- ✅ Templates (completed)
- ✅ Environment (completed)
- ⏳ CLI (pending)
- ⏳ Frontend (pending)

Progresso: 60%

Próxima ação: Implementar CLI básica
Sugestão marketing: "A fábrica que transforma intenção em protocolo."
```

---

### `NEO::progress`

Retorna apenas informações de progresso:
- Progresso geral (%)
- Breakdown por componente
- Timeline de conclusões

**Exemplo:**
```
NEO::progress
```

---

### `NEO::version`

Retorna informações da versão atual:
- Número da versão
- Codename
- Status
- Data de release

**Exemplo:**
```
NEO::version
```

---

### `NEO::next`

Lista próximas ações:
- Ações imediatas (alta prioridade)
- Ações de curto prazo
- Recomendações gerais

**Exemplo:**
```
NEO::next
```

---

### `NEO::risks`

Lista riscos identificados:
- Agrupados por nível (high/medium/low)
- Estratégias de mitigação

**Exemplo:**
```
NEO::risks
```

---

## 📢 Módulo 3: Marketing Engine

### `NEO::marketing update "<mensagem>"`

Gera conteúdo de marketing para todas as plataformas baseado na mensagem:
- Post para X (Twitter)
- Post para LinkedIn
- Post para FlowOFF
- Conteúdo para website
- Update técnico
- Explicação jornalística

**Exemplo:**
```
NEO::marketing update "deploy do token WOD em andamento"
```

---

### `NEO::marketing headline [tipo]`

Gera headline. Tipos disponíveis:
- `general` (padrão)
- `technical`
- `narrative`

**Exemplo:**
```
NEO::marketing headline
NEO::marketing headline technical
```

---

### `NEO::marketing story [TOKEN_NAME]`

Gera story completa. Se TOKEN_NAME fornecido, gera story específica do token.

**Exemplo:**
```
NEO::marketing story
NEO::marketing story WOD
```

---

### `NEO::marketing log [limit]`

Mostra log de updates de marketing recentes.

**Exemplo:**
```
NEO::marketing log
NEO::marketing log 5
```

---

### `NEO::marketing post <platform> <tipo>`

Gera post específico para plataforma e tipo.

**Plataformas:**
- `x` (Twitter)
- `linkedin`
- `flowoff`
- `website`

**Tipos:**
- `technical`
- `announcement`
- `narrative`
- `update`

**Exemplo:**
```
NEO::marketing post x announcement
NEO::marketing post linkedin technical
NEO::marketing post flowoff narrative
```

---

## 🔄 Fluxo de Trabalho Recomendado

### 1. Criar um novo token

```
NEO::token draft WOD
NEO::token simulate WOD
NEO::token economics WOD
NEO::token manifest WOD
NEO::token audit WOD
NEO::token deploy-preview WOD
```

### 2. Acompanhar progresso

```
NEO::status
NEO::progress
NEO::next
```

### 3. Gerar conteúdo de marketing

```
NEO::marketing update "novo token WOD criado"
NEO::marketing post x announcement
NEO::marketing story WOD
```

---

## 🩺 Módulo 4: Doctor CLI

### `NEO::doctor [action] [args...]`

**Diagnóstico e auditoria de saúde do protocolo.**

Executa uma verificação completa da saúde técnica e operacional:

**A. Verificação de Ambiente:**
- Arquivos .env e package.json.
- Configurações de rede.

**B. Smart Scan (requer --deep e --contract):**
- Bytecode integrity.
- Initializable check.
- Proxy integrity.

**C. Security Pulse:**
- Rolestack (permissões).
- Ownership trail.

**D. Gas Optimization:**
- Benchmark de Mint.
- Sugeridor de janela de operação.

**Exemplo:**
```
NEO::doctor
NEO::doctor scan --deep --contract 0x...
```

---

## 📝 Notas

- Todos os comandos são case-insensitive
- Tokens são armazenados em `internal-ops/tokens/`
- Logs são salvos em `internal-ops/marketing/`
- Estado é mantido em `internal-ops/state.json`
- Use aspas para mensagens com espaços

---

## 🚀 Exemplos Completos

### Criar e testar um token completo

```
NEO::token draft WATERMELLOW {"symbol": "WML", "total_supply": 10000000}
NEO::token simulate WATERMELLOW
NEO::token economics WATERMELLOW
NEO::token manifest WATERMELLOW
NEO::token audit WATERMELLOW
NEO::token deploy-preview WATERMELLOW
```

### Verificar status e gerar marketing

```
NEO::status
NEO::marketing update "token WATERMELLOW pronto para deploy"
NEO::marketing post x announcement
NEO::marketing post linkedin technical
```

---

**NΞØ Internal Ops App v0.1** — Sistema de comandos interno para operações da NΞØ SMART FACTORY.

