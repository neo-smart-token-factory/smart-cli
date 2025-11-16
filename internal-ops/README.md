# NΞØ Internal Ops App v0.1

> **Painel Invisível de Operações Internas**

Sistema de comandos interno para gerenciar tokens pendentes, acompanhar progresso e gerar conteúdo de marketing em tempo real.

## 🎯 Visão Geral

O **NΞØ Internal Ops App** é um sistema de comandos que funciona dentro do ChatGPT, permitindo:

1. **Testar tokens pendentes** antes do deploy
2. **Acompanhar progresso** da construção da factory
3. **Gerar conteúdo de marketing** automaticamente

## 📋 Comandos Disponíveis

### 1. Token Testing Module

```
NEO::token simulate <TOKEN_NAME>
NEO::token draft <TOKEN_NAME>
NEO::token manifest <TOKEN_NAME>
NEO::token deploy-preview <TOKEN_NAME>
NEO::token audit <TOKEN_NAME>
NEO::token economics <TOKEN_NAME>
NEO::token narrative <TOKEN_NAME>
NEO::token rituals <TOKEN_NAME>
```

### 2. Build Log Module

```
NEO::status
NEO::progress
NEO::version
NEO::next
NEO::risks
```

### 3. Marketing Engine Module

```
NEO::marketing update "<mensagem>"
NEO::marketing headline
NEO::marketing story
NEO::marketing log
NEO::marketing post <platform> <tipo>
```

Onde:
- `platform`: `x`, `linkedin`, `flowoff`, `website`
- `tipo`: `technical`, `announcement`, `narrative`, `update`

## 🔧 Como Usar

Simplesmente digite o comando no chat. O sistema irá:

1. Processar o comando
2. Buscar informações relevantes
3. Gerar resposta formatada
4. Atualizar logs internos

## 📊 Estrutura de Dados

Os dados são armazenados em:
- `internal-ops/tokens/` - Tokens pendentes
- `internal-ops/logs/` - Logs de progresso
- `internal-ops/marketing/` - Conteúdo gerado
- `internal-ops/state.json` - Estado atual do projeto

## 🚀 Exemplos

### Testar um Token

```
NEO::token simulate WOD
```

Retorna:
- Tokenômica proposta
- Supply e distribuição
- Vesting schedules
- Riscos identificados
- Recomendações

### Verificar Status

```
NEO::status
```

Retorna:
- Versão atual
- Progresso da FORGE
- Itens concluídos
- Pendências
- Próximas ações
- Sugestões de marketing

### Gerar Conteúdo

```
NEO::marketing update "deploy do token WOD em andamento"
```

Retorna:
- Textos para diferentes plataformas
- Updates técnicos
- Explicações jornalísticas
- Posts formatados

