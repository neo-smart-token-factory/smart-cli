# 🔍 Verificação Multi-Plataforma - NEOFLW Token

Guia completo para verificar o contrato NEOFLW em **todas** as plataformas de verificação disponíveis na Base.

## 📋 Informações do Contrato

- **Endereço**: `0x6575933669e530dC25aaCb496cD8e402B8f26Ff5`
- **Network**: Base (Chain ID: 8453)
- **Contrato**: TokenERC20 (thirdweb)
- **License**: Apache-2.0
- **Compiler**: Solidity 0.8.23
- **Optimization**: Yes (20 runs)

## 🎯 Plataformas de Verificação

### 1. ✅ Basescan (Já Verificado)

**Status**: ✅ Verificado  
**URL**: https://basescan.org/address/0x6575933669e530dC25aaCb496cD8e402B8f26Ff5

**Método**: Via API do Etherscan (Basescan usa a mesma API)

**Script disponível**: `scripts/verify-neoflow-token.ts`

---

### 2. 🔄 Sourcify (Pendente)

**Status**: ⏳ Não verificado ainda  
**URL**: https://verify.sourcify.dev/

**Por que verificar no Sourcify?**
- Verificação descentralizada e open-source
- Suporta múltiplas redes
- Usado por muitos exploradores de blockchain

#### Método 1: Via Interface Web (Recomendado)

⚠️ **IMPORTANTE**: Este contrato é um **PROXY**!  
Você precisa verificar a **IMPLEMENTAÇÃO**, não o proxy.

**Passo 1: Encontrar o endereço da implementação**

1. Acesse: https://basescan.org/address/0x6575933669e530dC25aaCb496cD8e402B8f26Ff5#code
2. Procure por: Aba "Contract" → Seção **"Proxy/Implementation"**
3. Copie o endereço da implementação

**Passo 2: Verificar a implementação no Sourcify**

1. **Acesse**: https://verify.sourcify.dev/
2. **Selecione Chain**: Base (8453)
3. **Cole o endereço da IMPLEMENTAÇÃO** (não o proxy!)
4. **Método**: "Standard JSON Input"
5. **Upload**: `artifacts_forge/TokenERC20.sol/TokenERC20.json`

**Nota**: O "Import from Etherscan" pode falhar porque importa o bytecode do proxy (44 bytes) em vez da implementação.

**Veja**: `scripts/SOURCIFY-PROXY-ERROR.md` e `scripts/HOW-TO-FIND-IMPLEMENTATION.md` para mais detalhes.

#### Método 2: Via Foundry (CLI)

```bash
# Compilar com metadata
forge build --force

# Verificar via Sourcify (se suportado)
forge verify-contract \
  0x6575933669e530dC25aaCb496cD8e402B8f26Ff5 \
  contracts/prebuilts/token/TokenERC20.sol:TokenERC20 \
  --chain-id 8453 \
  --verifier sourcify \
  --verifier-url https://sourcify.dev/server
```

#### Método 3: Via API Sourcify

```bash
# Usar o script de verificação Sourcify
npx ts-node scripts/verify-sourcify.ts
```

**Arquivo necessário**: `artifacts_forge/TokenERC20.sol/TokenERC20.json` (metadata)

---

### 3. 🔄 Blockscout (Pendente)

**Status**: ⏳ Não verificado ainda  
**URL**: https://base.blockscout.com/

**⚠️ IMPORTANTE**: O contrato é um **PROXY** (TWProxy do thirdweb).  
O bytecode visto no Blockscout (`0x3d3d3d3d363d3d37363d73...`) é o bytecode do proxy, não da implementação.

**Por que verificar no Blockscout?**
- Explorador alternativo da Base
- Interface diferente do Basescan
- Útil para usuários que preferem Blockscout

**Veja**: `scripts/VERIFY-PROXY-BLOCKSCOUT.md` para guia completo sobre verificação de proxies

#### Método 1: Via Interface Web

1. **Acesse**: https://base.blockscout.com/address/0x6575933669e530dC25aaCb496cD8e402B8f26Ff5
2. **Clique em**: "Verify & Publish"
3. **Escolha método**:
   - **Via Sourcify** (mais fácil): Se já verificado no Sourcify, Blockscout pode importar
   - **Via API**: Use a API do Blockscout
   - **Manual**: Upload do código-fonte

#### Método 2: Via API Blockscout

```bash
# Verificar via API Blockscout
curl -X POST "https://base.blockscout.com/api" \
  -H "Content-Type: application/json" \
  -d '{
    "module": "contract",
    "action": "verifysourcecode",
    "apikey": "YOUR_API_KEY",
    "contractaddress": "0x6575933669e530dC25aaCb496cD8e402B8f26Ff5",
    "sourceCode": "...",
    "codeformat": "solidity-standard-json-input",
    "contractname": "TokenERC20",
    "compilerversion": "v0.8.23+commit.abaa5c0e",
    "optimizationUsed": "1",
    "runs": "20"
  }'
```

#### Método 3: Via Foundry

```bash
forge verify-contract \
  0x6575933669e530dC25aaCb496cD8e402B8f26Ff5 \
  contracts/prebuilts/token/TokenERC20.sol:TokenERC20 \
  --chain-id 8453 \
  --etherscan-api-key YOUR_BLOCKSCOUT_API_KEY \
  --verifier-url https://base.blockscout.com/api
```

---

## 🛠️ Scripts de Automação

### Script para Sourcify

Criar `scripts/verify-sourcify.ts`:

```typescript
// Script para verificar no Sourcify
import * as fs from "fs";
import * as path from "path";
import axios from "axios";

const CONTRACT_ADDRESS = "0x6575933669e530dC25aaCb496cD8e402B8f26Ff5";
const CHAIN_ID = 8453; // Base
const SOURCIFY_API = "https://sourcify.dev/server";

async function verifyOnSourcify() {
  // Ler metadata do Foundry
  const metadataPath = path.join(
    process.cwd(),
    "artifacts_forge/TokenERC20.sol/TokenERC20.json"
  );

  if (!fs.existsSync(metadataPath)) {
    console.error("❌ Metadata não encontrado. Execute 'forge build' primeiro.");
    process.exit(1);
  }

  const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
  
  // Preparar dados para Sourcify
  const verificationData = {
    address: CONTRACT_ADDRESS,
    chain: CHAIN_ID.toString(),
    files: {
      "TokenERC20.sol": fs.readFileSync(
        "contracts/prebuilts/token/TokenERC20.sol",
        "utf-8"
      ),
    },
    // Incluir todas as dependências necessárias
  };

  try {
    const response = await axios.post(
      `${SOURCIFY_API}/verify`,
      verificationData
    );
    console.log("✅ Verificação no Sourcify concluída!");
  } catch (error) {
    console.error("❌ Erro:", error);
  }
}

verifyOnSourcify();
```

### Script para Blockscout

Criar `scripts/verify-blockscout.ts`:

```typescript
// Script para verificar no Blockscout
import * as fs from "fs";
import * as path from "path";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const CONTRACT_ADDRESS = "0x6575933669e530dC25aaCb496cD8e402B8f26Ff5";
const BLOCKSCOUT_API = "https://base.blockscout.com/api";
const API_KEY = process.env.BLOCKSCOUT_API_KEY || "";

async function verifyOnBlockscout() {
  // Ler metadata do Foundry
  const metadataPath = path.join(
    process.cwd(),
    "artifacts_forge/TokenERC20.sol/TokenERC20.json"
  );

  if (!fs.existsSync(metadataPath)) {
    console.error("❌ Metadata não encontrado. Execute 'forge build' primeiro.");
    process.exit(1);
  }

  const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
  const sourceCode = JSON.stringify(metadata.input);

  const params = {
    module: "contract",
    action: "verifysourcecode",
    apikey: API_KEY,
    contractaddress: CONTRACT_ADDRESS,
    sourceCode: sourceCode,
    codeformat: "solidity-standard-json-input",
    contractname: "TokenERC20",
    compilerversion: "v0.8.23+commit.abaa5c0e",
    optimizationUsed: "1",
    runs: "20",
  };

  try {
    const response = await axios.post(BLOCKSCOUT_API, params);
    console.log("✅ Verificação no Blockscout iniciada!");
    console.log("   Aguarde alguns minutos e verifique em:");
    console.log(`   https://base.blockscout.com/address/${CONTRACT_ADDRESS}`);
  } catch (error) {
    console.error("❌ Erro:", error);
  }
}

verifyOnBlockscout();
```

---

## 📝 Checklist de Verificação

### Basescan
- [x] ✅ Já verificado
- [x] Código-fonte visível
- [x] ABI disponível

### Sourcify
- [ ] Verificar via interface web
- [ ] Ou executar script `verify-sourcify.ts`
- [ ] Confirmar verificação em https://sourcify.dev/

### Blockscout
- [ ] Obter API key (se necessário)
- [ ] Verificar via interface web
- [ ] Ou executar script `verify-blockscout.ts`
- [ ] Confirmar verificação em https://base.blockscout.com/

---

## 🔧 Preparação

### 1. Compilar Contrato

```bash
forge build --force
```

Isso gera o arquivo de metadata necessário:
- `artifacts_forge/TokenERC20.sol/TokenERC20.json`

### 2. Obter API Keys (se necessário)

- **Blockscout**: Pode não precisar, mas se precisar:
  - Acesse: https://base.blockscout.com/
  - Crie conta e obtenha API key

### 3. Verificar Dependências

Para scripts TypeScript, instale:

```bash
yarn add axios
# ou
npm install axios
```

---

## 🎯 Ordem Recomendada de Verificação

1. **Basescan** ✅ (Já feito)
2. **Sourcify** ⏳ (Próximo)
   - Mais fácil via interface web (import from Etherscan)
3. **Blockscout** ⏳ (Depois)
   - Pode importar do Sourcify ou verificar manualmente

---

## 📚 Recursos

- **Sourcify**: https://sourcify.dev/
- **Blockscout Base**: https://base.blockscout.com/
- **Basescan**: https://basescan.org/
- **Sourcify Docs**: https://docs.sourcify.dev/
- **Blockscout Docs**: https://docs.blockscout.com/

---

## ⚠️ Notas Importantes

1. **Sourcify** pode importar automaticamente do Basescan/Etherscan se já estiver verificado
2. **Blockscout** pode importar do Sourcify se já estiver verificado lá
3. **Metadata JSON** é necessário para verificação automática
4. **Dependências** devem ser incluídas (interfaces, extensions, etc.)

---

**Próximo passo**: Verificar no Sourcify usando a interface web (método mais fácil)!

