# Guia de Verificação Manual do Token NEOFlowOFF

## Informações do Contrato

- **Endereço**: `0x6575933669e530dC25aaCb496cD8e402B8f26Ff5`
- **Network**: Base (Chain ID: 8453)
- **Nome**: NEOFlowOFF (NEOFLW)
- **Tipo**: TokenERC20 (thirdweb)

## Método 1: Verificação via Forge (Recomendado)

### Pré-requisitos

1. Instale as dependências:

```bash
yarn install
forge install
```

1. Configure a API key do Basescan no arquivo `.env`:

```env
ETHERSCAN_API_KEY=seu_api_key_aqui
```

**Nota**: Basescan usa a mesma API do Etherscan, então você pode usar `ETHERSCAN_API_KEY`.  
Você pode obter uma API key gratuita em: <https://basescan.org/myapikey> ou <https://etherscan.io/myapikey>

### Executar Verificação

```bash
# Compile o contrato primeiro
forge build

# Execute o script de verificação
npx ts-node scripts/verify-neoflow-token.ts
```

### Verificação Manual com Forge

Se o script não funcionar, você pode verificar manualmente:

```bash
forge verify-contract \
  0x6575933669e530dC25aaCb496cD8e402B8f26Ff5 \
  contracts/prebuilts/token/TokenERC20.sol:TokenERC20 \
  --chain-id 8453 \
  --etherscan-api-key $ETHERSCAN_API_KEY \
  --compiler-version 0.8.23 \
  --num-of-optimizations 20 \
  --watch
```

**Nota**: TokenERC20 é um contrato upgradeable sem constructor arguments, então a verificação é mais simples.

## Método 2: Verificação Manual no Basescan

### Passo 1: Acesse a página do contrato

<https://basescan.org/address/0x6575933669e530dC25aaCb496cD8e402B8f26Ff5#code>

### Passo 2: Clique em "Verify and Publish"

### Passo 3: Preencha os dados

1. **Compiler Type**: `Solidity (Standard JSON Input)` ou `Solidity (Single file)`
2. **Compiler Version**: `v0.8.23` (ou a versão usada no deploy)
3. **License**: `Apache-2.0`
4. **Optimization**: `Yes` (se foi usado no deploy)
5. **Runs**: `20` (verifique no foundry.toml)

### Passo 4: Código-fonte

#### Opção A: Single File

Copie o conteúdo de `contracts/prebuilts/token/TokenERC20.sol` e cole no campo.

**Importante**: Você precisará incluir todos os arquivos de dependência também:

- Interfaces em `contracts/prebuilts/interface/token/ITokenERC20.sol`
- Extensions em `contracts/extension/`
- Infra em `contracts/infra/`
- EIP em `contracts/eip/`
- External deps em `contracts/external-deps/`

#### Opção B: Standard JSON Input (Recomendado)

1. Gere o JSON de compilação:

```bash
forge build --force
```

1. O arquivo estará em `artifacts_forge/TokenERC20.sol/TokenERC20.json`
2. Use o campo `input` do JSON no Basescan

### Passo 5: Constructor Arguments

TokenERC20 é upgradeable e não tem constructor arguments (usa `initialize`), então deixe este campo vazio.

### Passo 6: Submit

Clique em "Verify and Publish" e aguarde a verificação.

## Método 3: Verificação via Hardhat (Alternativo)

Se você preferir usar Hardhat:

```bash
# Instale hardhat-etherscan
npm install --save-dev @nomicfoundation/hardhat-verify

# Configure no hardhat.config.ts
```

## Verificando se é Proxy

TokenERC20 da thirdweb geralmente é deployado via proxy. Para verificar:

1. Veja a transação de criação do contrato no Basescan
2. Se houver uma chamada para `TWProxy` ou similar, é um proxy
3. Nesse caso, você precisa verificar:
   - A implementação (implementation contract)
   - O proxy (se necessário)

## Troubleshooting

### Erro: "Contract already verified"

O contrato já está verificado. Acesse a página do contrato para ver o código.

### Erro: "Bytecode does not match"

- Verifique se a versão do compilador está correta
- Verifique se as otimizações estão corretas
- Verifique se todas as dependências estão incluídas

### Erro: "Constructor arguments required"

TokenERC20 não tem constructor, então não precisa de arguments. Deixe vazio.

## Links Úteis

- [Basescan API](https://basescan.org/apis)
- [Forge Verify Documentation](https://book.getfoundry.sh/reference/forge/forge-verify-contract)
- [Thirdweb Contracts](https://github.com/thirdweb-dev/contracts)
