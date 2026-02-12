/**
 * 🪙 Mint em Lote para Liquidez - {{TOKEN_SYMBOL}}
 * 
 * Script para fazer mint de tokens em lote para uso em liquidez
 * Usa mintTo() - SEM TAXAS
 * 
 * Para executar:
 *   npx ts-node scripts/mint-batch-liquidity.ts [quantidade]
 * 
 * Exemplo:
 *   npx ts-node scripts/mint-batch-liquidity.ts 10000
 *   (mint 10,000 {{TOKEN_SYMBOL}})
 */

import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const NETWORK = parseInt(process.env.CHAIN_ID || "{{CHAIN_ID}}");
const RPC_URL = process.env.RPC_URL || 
  (process.env.ALCHEMY_KEY 
    ? `https://{{NETWORK_NAME}}-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`
    : "{{DEFAULT_RPC_URL}}");
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS || "{{TOKEN_ADDRESS}}";

// ABI do TokenERC20
const TOKEN_ABI = [
  "function mintTo(address to, uint256 amount) public",
  "function balanceOf(address account) external view returns (uint256)",
  "function totalSupply() external view returns (uint256)",
  "function decimals() public view returns (uint8)",
  "function hasRole(bytes32 role, address account) external view returns (bool)",
];

const MINTER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE"));

async function mintBatch(amount: string) {
  console.log("🪙 Mint em Lote para Liquidez - {{TOKEN_SYMBOL}}\n");
  console.log("=".repeat(60));

  if (!PRIVATE_KEY) {
    throw new Error("❌ PRIVATE_KEY não configurado no .env");
  }

  if (TOKEN_ADDRESS === "{{TOKEN_ADDRESS}}") {
    throw new Error("❌ TOKEN_ADDRESS não configurado. Configure no .env ou substitua o placeholder");
  }

  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);
  const token = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, provider);

  const signerAddress = await signer.getAddress();

  // Verificar se tem MINTER_ROLE
  const hasMinterRole = await token.hasRole(MINTER_ROLE, signerAddress);
  if (!hasMinterRole) {
    throw new Error("❌ Você não tem MINTER_ROLE. Não é possível fazer mint.");
  }

  console.log(`✅ Endereço: ${signerAddress}`);
  console.log(`✅ Token: ${TOKEN_ADDRESS}`);
  console.log(`✅ MINTER_ROLE: Confirmado\n`);

  // Obter decimals
  const decimals = await token.decimals();
  const amountWei = ethers.utils.parseUnits(amount, decimals);

  console.log(`📊 Mint solicitado: ${amount} {{TOKEN_SYMBOL}}`);
  console.log(`   (${amountWei.toString()} wei)\n`);

  // Verificar saldo antes
  const balanceBefore = await token.balanceOf(signerAddress);
  const totalSupplyBefore = await token.totalSupply();

  console.log(`💰 Saldo antes: ${ethers.utils.formatUnits(balanceBefore, decimals)} {{TOKEN_SYMBOL}}`);
  console.log(`📊 Supply antes: ${ethers.utils.formatUnits(totalSupplyBefore, decimals)} {{TOKEN_SYMBOL}}\n`);

  // Fazer mint
  console.log("⏳ Fazendo mint...");
  const tx = await token.connect(signer).mintTo(signerAddress, amountWei);
  console.log(`   Hash: ${tx.hash}`);
  console.log("   Aguardando confirmação...\n");

  const receipt = await tx.wait();
  console.log(`✅ Mint confirmado!`);
  console.log(`   Block: ${receipt.blockNumber}`);
  console.log(`   Gas usado: ${receipt.gasUsed.toString()}\n`);

  // Verificar saldo depois
  const balanceAfter = await token.balanceOf(signerAddress);
  const totalSupplyAfter = await token.totalSupply();

  console.log(`💰 Saldo depois: ${ethers.utils.formatUnits(balanceAfter, decimals)} {{TOKEN_SYMBOL}}`);
  console.log(`📊 Supply depois: ${ethers.utils.formatUnits(totalSupplyAfter, decimals)} {{TOKEN_SYMBOL}}`);
  console.log(`   Ganho: ${ethers.utils.formatUnits(balanceAfter.sub(balanceBefore), decimals)} {{TOKEN_SYMBOL}}\n`);

  console.log("=".repeat(60));
  console.log("✅ MINT CONCLUÍDO!\n");
  console.log(`📋 Transaction: {{EXPLORER_URL}}/tx/${tx.hash}\n`);
}

// Executar
const amount = process.argv[2] || "1000"; // Default: 1000 tokens
mintBatch(amount).catch((error) => {
  console.error("❌ Erro:", error.message || error);
  process.exit(1);
});

