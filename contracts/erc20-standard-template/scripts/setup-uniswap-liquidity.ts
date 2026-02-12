/**
 * 🚀 {{TOKEN_SYMBOL}} - Setup de Liquidez Uniswap V3
 * 
 * Este script automatiza a criação de pool de liquidez Uniswap V3 para o token {{TOKEN_SYMBOL}}.
 * 
 * Funcionalidades:
 * 1. Verifica saldos de {{TOKEN_SYMBOL}} e WETH
 * 2. Aprova tokens para o Position Manager
 * 3. Cria e inicializa a pool (se não existir)
 * 4. Fornece liquidez inicial
 * 
 * Para executar:
 *   npx ts-node scripts/setup-uniswap-liquidity.ts
 * 
 * Requisitos:
 *   - PRIVATE_KEY configurado no .env
 *   - Saldo suficiente de {{TOKEN_SYMBOL}} e WETH (ou ETH para wrap)
 */

import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

// ============================================================================
// CONFIGURAÇÕES - SUBSTITUA OS PLACEHOLDERS
// ============================================================================

const NETWORK = parseInt(process.env.CHAIN_ID || "{{CHAIN_ID}}");
const RPC_URL = process.env.RPC_URL || 
  (process.env.ALCHEMY_KEY 
    ? `https://{{NETWORK_NAME}}-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`
    : "{{DEFAULT_RPC_URL}}");
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

// Endereços do token e WETH - SUBSTITUA APÓS DEPLOY
const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS || "{{TOKEN_ADDRESS}}";
const WETH_ADDRESS = process.env.WETH_ADDRESS || "{{WETH_ADDRESS}}";
const POSITION_MANAGER = process.env.POSITION_MANAGER_ADDRESS || "{{POSITION_MANAGER_ADDRESS}}";

// Configurações da Pool
const FEE_TIER = 3000; // 0.3% (padrão para pares principais)
// ESTRATÉGIA MÍNIMA VIÁVEL: Preço muito baixo para maximizar liquidez inicial
const INITIAL_PRICE_RATIO = 0.00001; // 1 {{TOKEN_SYMBOL}} = 0.00001 WETH (100k {{TOKEN_SYMBOL}} = 1 WETH)

// Valores padrão de liquidez (ajuste conforme necessário)
// ESTRATÉGIA MÍNIMA VIÁVEL: Valores reduzidos para começar
const DEFAULT_TOKEN_AMOUNT = ethers.utils.parseUnits("1000", 18); // 1k tokens
const DEFAULT_WETH_AMOUNT = ethers.utils.parseUnits("0.1", 18); // 0.1 WETH

// ABIs mínimas necessárias
const ERC20_ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function balanceOf(address account) external view returns (uint256)",
  "function transfer(address to, uint256 amount) public returns (bool)",
  "function decimals() public view returns (uint8)",
  "function totalSupply() external view returns (uint256)",
  "function allowance(address owner, address spender) external view returns (uint256)",
];

const POSITION_MANAGER_ABI = [
  "function createAndInitializePoolIfNecessary(address token0, address token1, uint24 fee, uint160 sqrtPriceX96) external payable returns (address pool)",
  "function mint((address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint256 amount0Desired, uint256 amount1Desired, uint256 amount0Min, uint256 amount1Min, address recipient, uint256 deadline) params) external payable returns (uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1)",
  "function getPool(address token0, address token1, uint24 fee) external view returns (address pool)",
];

// ============================================================================
// UTILITÁRIOS
// ============================================================================

/**
 * Calcula sqrtPriceX96 a partir do preço
 * sqrtPriceX96 = sqrt(price) * 2^96
 */
function calculateSqrtPriceX96(price: number): string {
  const sqrtPrice = Math.sqrt(price);
  const sqrtPriceX96 = sqrtPrice * Math.pow(2, 96);
  return ethers.BigNumber.from(Math.floor(sqrtPriceX96)).toString();
}

/**
 * Determina qual token é token0 e qual é token1 (ordem lexicográfica)
 */
function sortTokens(tokenA: string, tokenB: string): { token0: string; token1: string } {
  return tokenA.toLowerCase() < tokenB.toLowerCase()
    ? { token0: tokenA, token1: tokenB }
    : { token0: tokenB, token1: tokenA };
}

// ============================================================================
// PASSO 1: VERIFICAR CONTRATO E SALDOS
// ============================================================================

async function verifyContract() {
  console.log("\n📋 PASSO 1: VERIFICAÇÃO DO CONTRATO\n");
  console.log("=".repeat(60));

  if (!PRIVATE_KEY) {
    throw new Error("❌ PRIVATE_KEY não configurado no .env");
  }

  if (TOKEN_ADDRESS === "{{TOKEN_ADDRESS}}") {
    throw new Error("❌ TOKEN_ADDRESS não configurado. Configure no .env ou substitua o placeholder");
  }

  if (WETH_ADDRESS === "{{WETH_ADDRESS}}") {
    throw new Error("❌ WETH_ADDRESS não configurado. Configure no .env ou substitua o placeholder");
  }

  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);
  const token = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, provider);
  const weth = new ethers.Contract(WETH_ADDRESS, ERC20_ABI, provider);

  try {
    const tokenBalance = await token.balanceOf(signer.address);
    const wethBalance = await weth.balanceOf(signer.address);
    const ethBalance = await provider.getBalance(signer.address);
    const tokenDecimals = await token.decimals();
    const wethDecimals = await weth.decimals();
    const totalSupply = await token.totalSupply();

    console.log(`✅ Token encontrado: ${TOKEN_ADDRESS}`);
    console.log(`✅ WETH encontrado: ${WETH_ADDRESS}`);
    console.log(`\n💰 Seu endereço: ${signer.address}`);
    console.log(`   {{TOKEN_SYMBOL}}: ${ethers.utils.formatUnits(tokenBalance, tokenDecimals)}`);
    console.log(`   WETH: ${ethers.utils.formatUnits(wethBalance, wethDecimals)}`);
    console.log(`   ETH: ${ethers.utils.formatEther(ethBalance)}`);
    console.log(`\n📊 Supply Total {{TOKEN_SYMBOL}}: ${ethers.utils.formatUnits(totalSupply, tokenDecimals)}`);

    if (tokenBalance.isZero()) {
      console.warn("\n⚠️ AVISO: Você não tem {{TOKEN_SYMBOL}}. Será necessário mint ou transferência antes de criar a pool.");
    }
    if (wethBalance.isZero()) {
      console.warn("\n⚠️ AVISO: Você não tem WETH. Faça wrap de ETH usando: npx ts-node scripts/wrap-eth-to-weth.ts");
    }
    if (ethBalance.lt(ethers.utils.parseEther("0.01"))) {
      console.warn("\n⚠️ AVISO: ETH para gas pode ser insuficiente. Recomendado: ~0.01 ETH");
    }

    return { signer, token, weth, tokenBalance, wethBalance, tokenDecimals, wethDecimals };
  } catch (error) {
    console.error("❌ Erro ao verificar contrato:", error);
    throw error;
  }
}

// ============================================================================
// PASSO 2: APROVAR TOKENS PARA POSITION MANAGER
// ============================================================================

async function approveTokens(signer: ethers.Signer, token: ethers.Contract, weth: ethers.Contract) {
  console.log("\n🔐 PASSO 2: APROVANDO TOKENS\n");
  console.log("=".repeat(60));

  try {
    // Verificar allowance antes de aprovar
    const tokenAllowance = await token.allowance(await signer.getAddress(), POSITION_MANAGER);
    const wethAllowance = await weth.allowance(await signer.getAddress(), POSITION_MANAGER);

    if (tokenAllowance.gt(0)) {
      console.log(`✅ {{TOKEN_SYMBOL}} já aprovado (allowance: ${ethers.utils.formatEther(tokenAllowance)})\n`);
    } else {
      const tokenTx = await token.connect(signer).approve(POSITION_MANAGER, ethers.constants.MaxUint256);
      console.log(`⏳ Aprovando {{TOKEN_SYMBOL}}... Hash: ${tokenTx.hash}`);
      await tokenTx.wait();
      console.log(`✅ {{TOKEN_SYMBOL}} aprovado\n`);
    }

    if (wethAllowance.gt(0)) {
      console.log(`✅ WETH já aprovado (allowance: ${ethers.utils.formatEther(wethAllowance)})\n`);
    } else {
      const wethTx = await weth.connect(signer).approve(POSITION_MANAGER, ethers.constants.MaxUint256);
      console.log(`⏳ Aprovando WETH... Hash: ${wethTx.hash}`);
      await wethTx.wait();
      console.log(`✅ WETH aprovado\n`);
    }

    // Delay para evitar "in-flight transaction limit"
    await new Promise(resolve => setTimeout(resolve, 2000));
  } catch (error) {
    console.error("❌ Erro ao aprovar tokens:", error);
    throw error;
  }
}

// ============================================================================
// PASSO 3: CRIAR POOL E INICIALIZAR (se não existir)
// ============================================================================

async function createAndInitializePool(signer: ethers.Signer) {
  console.log("\n🔨 PASSO 3: CRIANDO POOL UNISWAP V3\n");
  console.log("=".repeat(60));

  const positionManager = new ethers.Contract(POSITION_MANAGER, POSITION_MANAGER_ABI, signer);
  const { token0, token1 } = sortTokens(TOKEN_ADDRESS, WETH_ADDRESS);

  try {
    // Verificar se pool já existe
    const existingPool = await positionManager.getPool(token0, token1, FEE_TIER);
    if (existingPool !== ethers.constants.AddressZero) {
      console.log(`⚠️ Pool já existe: ${existingPool}`);
      console.log(`   Continuando com fornecimento de liquidez...\n`);
      return;
    }

    // Calcular sqrtPriceX96 a partir do preço inicial
    const sqrtPriceX96 = calculateSqrtPriceX96(INITIAL_PRICE_RATIO);

    const tx = await positionManager.createAndInitializePoolIfNecessary(
      token0,
      token1,
      FEE_TIER,
      sqrtPriceX96,
      { gasLimit: 5000000 }
    );

    console.log(`⏳ Criando pool... Hash: ${tx.hash}`);
    const receipt = await tx.wait();
    console.log(`✅ Pool criada com sucesso!`);
    console.log(`   Taxa: ${FEE_TIER / 10000}%\n`);

    // Delay para evitar "in-flight transaction limit"
    await new Promise(resolve => setTimeout(resolve, 2000));
    return receipt;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes("pool already exists") || errorMessage.includes("Pool already exists")) {
      console.log(`⚠️ Pool já existe. Continuando com fornecimento de liquidez...\n`);
    } else {
      console.error("❌ Erro ao criar pool:", errorMessage);
      throw error;
    }
  }
}

// ============================================================================
// PASSO 4: FORNECER LIQUIDEZ INICIAL (FULL RANGE)
// ============================================================================

async function provideLiquidity(signer: ethers.Signer, tokenAmount: ethers.BigNumber, wethAmount: ethers.BigNumber) {
  console.log("\n💧 PASSO 4: FORNECENDO LIQUIDEZ INICIAL\n");
  console.log("=".repeat(60));

  const positionManager = new ethers.Contract(POSITION_MANAGER, POSITION_MANAGER_ABI, signer);
  const { token0, token1 } = sortTokens(TOKEN_ADDRESS, WETH_ADDRESS);

  try {
    // Full range: -887220 até 887220 (ticks máximos para a fee de 0.3%)
    const tickLower = -887220;
    const tickUpper = 887220;

    const mintParams = {
      token0,
      token1,
      fee: FEE_TIER,
      tickLower,
      tickUpper,
      amount0Desired: token0.toLowerCase() === TOKEN_ADDRESS.toLowerCase() ? tokenAmount : wethAmount,
      amount1Desired: token0.toLowerCase() === TOKEN_ADDRESS.toLowerCase() ? wethAmount : tokenAmount,
      amount0Min: token0.toLowerCase() === TOKEN_ADDRESS.toLowerCase() 
        ? tokenAmount.mul(95).div(100) 
        : wethAmount.mul(95).div(100), // 5% slippage
      amount1Min: token0.toLowerCase() === TOKEN_ADDRESS.toLowerCase()
        ? wethAmount.mul(95).div(100)
        : tokenAmount.mul(95).div(100), // 5% slippage
      recipient: await signer.getAddress(),
      deadline: Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutos
    };

    const tx = await positionManager.mint(mintParams, { gasLimit: 5000000 });
    console.log(`⏳ Fornecendo liquidez... Hash: ${tx.hash}`);
    const receipt = await tx.wait();
    console.log(`✅ Liquidez fornecida com sucesso!`);
    console.log(`   Posição NFT criada (token ID no recibo)\n`);

    return receipt;
  } catch (error) {
    console.error("❌ Erro ao fornecer liquidez:", error);
    throw error;
  }
}

// ============================================================================
// MONITORAMENTO E LINKS
// ============================================================================

function printMonitoringLinks() {
  console.log("\n📊 LINKS PARA MONITORAMENTO:\n");
  console.log("=".repeat(60));
  console.log(`{{EXPLORER_NAME}} (Contrato):`);
  console.log(` {{EXPLORER_URL}}/address/${TOKEN_ADDRESS}\n`);
  console.log(`Uniswap (Pool):`);
  console.log(` https://app.uniswap.org/explore/pools/${NETWORK}\n`);
}

// ============================================================================
// EXECUÇÃO PRINCIPAL
// ============================================================================

async function main() {
  console.log("🚀 {{TOKEN_SYMBOL}} - SETUP COMPLETO DE LIQUIDEZ\n");
  console.log("=".repeat(60));

  try {
    // Passo 1: Verificar
    const { signer, token, weth, tokenBalance, wethBalance } = await verifyContract();

    // Passo 2: Aprovar
    await approveTokens(signer, token, weth);

    // Passo 3: Criar pool
    await createAndInitializePool(signer);

    // Passo 4: Fornecer liquidez
    if (tokenBalance.gte(DEFAULT_TOKEN_AMOUNT) && wethBalance.gte(DEFAULT_WETH_AMOUNT)) {
      await provideLiquidity(signer, DEFAULT_TOKEN_AMOUNT, DEFAULT_WETH_AMOUNT);
    } else {
      console.warn("\n⚠️ Saldo insuficiente. Ajuste os valores DEFAULT_TOKEN_AMOUNT e DEFAULT_WETH_AMOUNT em main()");
    }

    // Links
    printMonitoringLinks();

    console.log("=".repeat(60));
    console.log("✅ SETUP COMPLETO!\n");
  } catch (error) {
    console.error("\n❌ Erro fatal:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();

