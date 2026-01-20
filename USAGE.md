# Como Usar o NΞØ Internal Ops App

## 🎯 Para o Usuário

Simplesmente digite os comandos no chat. O sistema processará automaticamente.

**Comando mais importante:**
```
NEO::simulate <TOKEN_NAME>
```
Este é **OBRIGATÓRIO** antes de qualquer deploy real.

## 🤖 Para o Assistente (Como Processar Comandos)

Quando o usuário digitar um comando começando com `NEO::`, você deve:

1. **Reconhecer o comando** e identificar o módulo/ação
2. **Processar usando os scripts** em `internal-ops/scripts/`
3. **Retornar resposta formatada** em português

### Exemplo de Processamento

#### Comando: `NEO::status`

```javascript
// 1. Carregar módulo
const BuildLog = require('./internal-ops/scripts/build-log');
const buildLog = new BuildLog();

// 2. Processar
const status = buildLog.getStatus();

// 3. Formatar resposta
```

**Resposta esperada:**

```
🏭 NΞØ SMART FACTORY — Status

Versão: v0.5.1 — IGNIÇÃO
Status: development

📊 FORGE Progresso: 60%

✅ Concluído:
- Core (v0.5.1)
- Templates (v0.5.1)
- Environment (v0.5.1)

⏳ Em Progresso:
- Testing (v0.5.1)

📋 Pendente:
- CLI
- Frontend

🎯 Próxima Ação:
Completar CLI com init(), generator(), deploy()

💡 Sugestão Marketing:
"A fábrica que transforma intenção em protocolo."

🔒 Riscos:
- Baixo: Dependência de OpenZeppelin (mitigado com versões auditadas)
```

---

#### Comando: `NEO::token simulate WOD`

```javascript
// 1. Carregar módulo
const TokenSimulator = require('./internal-ops/scripts/token-simulator');
const simulator = new TokenSimulator();

// 2. Processar
const result = simulator.simulate('WOD');

// 3. Formatar resposta
```

**Resposta esperada:**

```
🪙 Simulação: WOD

📊 Análise:
- Completude: 45%
- Status: draft
- Prontidão: in_progress

⚠️ Campos Faltando:
- Supply total
- Distribuição de tokens
- Manifesto
- Configuração de mint

💰 Tokenômica:
- Distribuição: Não configurada
- Supply: Não configurado
- ⚠️ Validação pendente

🔍 Riscos Identificados:
- Médio: Sem vesting configurado para equipe
- Recomendação: Implementar vesting com cliff

💡 Recomendações:
1. Completar todos os campos obrigatórios
2. Configurar vesting schedules
3. Criar manifesto
4. Realizar auditoria completa

📦 Preview Deploy:
- Network: Polygon
- Gas estimado: ~2.5M
- Custo estimado: ~$150 USD
- Componentes: Token ERC20
```

---

#### Comando: `NEO::marketing update "deploy do token WOD em andamento"`

```javascript
// 1. Carregar módulo
const MarketingEngine = require('./internal-ops/scripts/marketing-engine');
const engine = new MarketingEngine();

// 2. Processar
const update = engine.generateUpdate("deploy do token WOD em andamento");

// 3. Formatar resposta
```

**Resposta esperada:**

```
📢 Conteúdo de Marketing Gerado

🐦 X (Twitter):
🚀 NΞØ SMART FACTORY v0.5.1

deploy do token WOD em andamento

#NEOSmartFactory #DeFi #Blockchain #Web3
(150 caracteres)

💼 LinkedIn:
Título: NΞØ SMART FACTORY v0.5.1 — Update

deploy do token WOD em andamento

No subterrâneo invisível da economia digital...

#NEOSmartFactory #DeFi #Blockchain #Web3 #Innovation

🌊 FlowOFF:
Título: NΞØ SMART FACTORY — Update

deploy do token WOD em andamento

No estilo FlowOFF, onde técnica encontra narrativa...

Tags: neo-smart-factory, defi, blockchain, protocol-factory

🌐 Website:
Título: Update — [Data]

deploy do token WOD em andamento

No subterrâneo invisível da economia digital...

📰 Explicação Jornalística:
Headline: NΞØ SMART FACTORY Anuncia Deploy do Token WOD

Lead: deploy do token WOD em andamento. A fábrica descentralizada...

Body: [narrativa completa]
```

---

## 📋 Checklist de Resposta

Ao processar um comando, sempre:

- [ ] Identificar módulo e ação
- [ ] Carregar script apropriado
- [ ] Processar comando
- [ ] Formatar resposta em português
- [ ] Incluir emojis quando apropriado
- [ ] Manter estilo NΞØ (objetivo, técnico, mas com narrativa)
- [ ] Fornecer informações acionáveis

## 🎨 Estilo de Resposta

- **Objetivo**: Direto ao ponto
- **Técnico**: Preciso e detalhado quando necessário
- **Narrativo**: Mantém identidade NΞØ
- **Acionável**: Sempre inclui próximos passos ou recomendações

## 🔄 Fluxo de Trabalho Típico

1. Usuário: `NEO::status`
2. Assistente: Processa e retorna status formatado
3. Usuário: `NEO::token draft WOD`
4. Assistente: Cria token e retorna confirmação
5. Usuário: `NEO::token simulate WOD`
6. Assistente: Retorna análise completa
7. Usuário: `NEO::marketing update "WOD pronto"`
8. Assistente: Gera conteúdo para todas as plataformas

---

**Nota**: Este sistema funciona como um "painel invisível" — o usuário simplesmente digita comandos e recebe respostas formatadas, como se estivesse usando um app interno.

