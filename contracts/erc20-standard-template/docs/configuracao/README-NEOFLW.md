# Guia: Usando este Repositório para o Token NEOFlowOFF

> ⚠️ **NOTA**: Este projeto foi limpo para manter apenas configurações da rede **Base**.  
> Todas as outras redes foram removidas. Veja `CLEANUP-BASE-ONLY.md` para detalhes.

> 📍 **ROADMAP**: Veja `ROADMAP-NEOFLW.md` para o roadmap completo com prioridades e fases do projeto.

## 📋 Situação Atual

- **Token**: NEOFlowOFF (NEOFLW)
- **Endereço**: `0x6575933669e530dC25aaCb496cD8e402B8f26Ff5`
- **Network**: Base (Chain ID: 8453)
- **Status**: ✅ **Já verificado no Basescan**
- **API Key**: `ETHERSCAN_API_KEY` (Basescan usa a mesma API do Etherscan)

## ⚠️ Diferença Importante: Foundry vs Hardhat

### Este Repositório usa **Foundry/Forge**

Este repositório (`thirdweb-dev/contracts`) usa **Foundry** como ferramenta principal:

- Compilação: `forge build`
- Testes: `forge test`
- Verificação: `forge verify-contract`
- **NÃO usa Hardhat**

### Instruções que você recebeu usam **Hardhat**

As instruções que mencionam `npx hardhat compile` e `npx hardhat verify` são para projetos que usam **Hardhat**, não este repositório.

## ✅ O que você PODE fazer com este repositório

### 1. Verificar o código-fonte (já está verificado)

O contrato já está verificado, mas você pode confirmar que o código corresponde:

```bash
# Ver o código do contrato no Basescan
open https://basescan.org/address/0x6575933669e530dC25aaCb496cD8e402B8f26Ff5#code

# Comparar com o código local
cat contracts/prebuilts/token/TokenERC20.sol
```

### 2. Interagir com o contrato usando scripts

Criar scripts para interagir com o token (mint, transfer, etc.):

```typescript
// scripts/interact-neoflow.ts
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { Base } from "@thirdweb-dev/chains";

const sdk = ThirdwebSDK.fromPrivateKey(
  process.env.PRIVATE_KEY!,
  Base
);

const contract = await sdk.getContract("0x6575933669e530dC25aaCb496cD8e402B8f26Ff5");
// Interagir com o contrato...
```

### 3. Deploy de novos contratos baseados no TokenERC20

Se quiser fazer deploy de uma versão customizada:

```bash
# Compilar
forge build

# Deploy (você precisaria criar um script de deploy)
# Este repositório não tem scripts de deploy prontos para Hardhat
```

### 4. Testar funcionalidades

Executar os testes do TokenERC20:

```bash
forge test --match-contract TokenERC20
```

## 🔧 Configuração Atual

Seu `.env` já está configurado corretamente:

```env
ETHERSCAN_API_KEY=WYII9Y7JICTMERA89H6P3X9C3JKTIW8V75
THIRDWEB_CLIENT_ID=sa70d3d6d2ec826511ff9e31b0db2d0fc
THIRDWEB_SECRET_KEY=hsGUgB7hj1_ClpE79QhRWwSk7I5XIIbZXrR7bvwFgZUMXKq0ZxXkCUdk_2K7UvtbvovAurFGiizU3yo22lN_nQ
```

## 📝 Se você quiser usar Hardhat (instruções recebidas)

Se você realmente quiser seguir as instruções que recebeu (usando Hardhat), você precisaria:

1. **Criar um novo projeto Hardhat** (não usar este repositório)
2. **Copiar o TokenERC20.sol** para o novo projeto
3. **Configurar Hardhat** com suporte a Base
4. **Seguir as instruções recebidas**

Mas isso não é necessário, pois:

- ✅ O contrato já está deployado
- ✅ O contrato já está verificado
- ✅ Este repositório já tem o código-fonte correto

## 🎯 Próximos Passos Recomendados

Como o contrato já está deployado e verificado, você pode focar em:

1. **Adicionar liquidez** em DEX (Uniswap V3) - Veja `setup-uniswap-liquidity.ts`
2. **Interagir com o contrato** via scripts TypeScript usando Thirdweb SDK
3. **Criar frontend** para interagir com o token
4. **Configurar funcionalidades** como mint, burn, etc.

### 💧 Setup de Liquidez Uniswap V3

Script automatizado para criar pool de liquidez:

```bash
npx ts-node scripts/setup-uniswap-liquidity.ts
```

Veja `README-UNISWAP-LIQUIDITY.md` para detalhes completos.

## 📚 Recursos Úteis

- [Thirdweb SDK Docs](https://portal.thirdweb.com/sdk)
- [Base Network Docs](https://docs.base.org/)
- [Basescan](https://basescan.org/address/0x6575933669e530dC25aaCb496cD8e402B8f26Ff5)
- [Foundry Book](https://book.getfoundry.sh/)

## 🧹 Limpeza do Projeto

Este projeto foi limpo para manter apenas configurações da rede **Base**.  
Veja `CLEANUP-BASE-ONLY.md` para detalhes completos da limpeza realizada.

## ❓ FAQ

**P: Preciso fazer deploy novamente?**  
R: Não, o contrato já está deployado e verificado.

**P: Posso usar as instruções Hardhat neste repositório?**  
R: Não diretamente. Este repositório usa Foundry. Se quiser usar Hardhat, crie um projeto separado.

**P: Como interagir com o contrato deployado?**  
R: Use o Thirdweb SDK ou ethers.js para interagir com o endereço `0x6575933669e530dC25aaCb496cD8e402B8f26Ff5`.

**P: O código local corresponde ao deployado?**  
R: Sim, o `TokenERC20.sol` neste repositório é idêntico ao código que você forneceu e que está verificado no Basescan.
