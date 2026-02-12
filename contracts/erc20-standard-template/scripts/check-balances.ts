/**
 * Verifica saldos rapidamente
 */

import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const RPC_URL = process.env.RPC_URL || 
  (process.env.ALCHEMY_KEY 
    ? `https://{{NETWORK_NAME}}-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`
    : "{{DEFAULT_RPC_URL}}");
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS || "{{TOKEN_ADDRESS}}";
const WETH_ADDRESS = process.env.WETH_ADDRESS || "{{WETH_ADDRESS}}";

async function checkBalances() {
  if (!PRIVATE_KEY) {
    throw new Error("❌ PRIVATE_KEY não configurado no .env");
  }

  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);
  const address = signer.address;

  const token = new ethers.Contract(TOKEN_ADDRESS, ["function balanceOf(address) view returns (uint256)", "function decimals() view returns (uint8)"], provider);
  const weth = new ethers.Contract(WETH_ADDRESS, ["function balanceOf(address) view returns (uint256)"], provider);

  const [ethBalance, wethBalance, tokenBalance, tokenDecimals] = await Promise.all([
    provider.getBalance(address),
    weth.balanceOf(address),
    token.balanceOf(address),
    token.decimals(),
  ]);

  console.log("💰 Saldos Atuais:");
  console.log(`   ETH: ${ethers.utils.formatEther(ethBalance)} ETH`);
  console.log(`   WETH: ${ethers.utils.formatEther(wethBalance)} WETH`);
  console.log(`   {{TOKEN_SYMBOL}}: ${ethers.utils.formatUnits(tokenBalance, tokenDecimals)} {{TOKEN_SYMBOL}}`);
  console.log();

  // Verificar se tem o necessário
  const neededWETH = ethers.utils.parseEther("0.1");
  const neededToken = ethers.utils.parseUnits("1000", tokenDecimals);

  console.log("📊 Verificação:");
  if (wethBalance.gte(neededWETH)) {
    console.log("   ✅ WETH suficiente");
  } else {
    console.log(`   ❌ WETH insuficiente. Faltam: ${ethers.utils.formatEther(neededWETH.sub(wethBalance))} WETH`);
  }

  if (tokenBalance.gte(neededToken)) {
    console.log("   ✅ {{TOKEN_SYMBOL}} suficiente");
  } else {
    console.log(`   ❌ {{TOKEN_SYMBOL}} insuficiente. Faltam: ${ethers.utils.formatUnits(neededToken.sub(tokenBalance), tokenDecimals)} {{TOKEN_SYMBOL}}`);
  }

  if (ethBalance.gte(ethers.utils.parseEther("0.01"))) {
    console.log("   ✅ ETH para gas suficiente");
  } else {
    console.log(`   ⚠️  ETH para gas pode ser insuficiente`);
  }
}

checkBalances().catch(console.error);
