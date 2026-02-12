/**
 * 💎 Wrap ETH para WETH
 * 
 * Converte ETH nativo para WETH (Wrapped Ether)
 * Necessário para fornecer liquidez em Uniswap V3
 * 
 * Para executar:
 *   npx ts-node scripts/wrap-eth-to-weth.ts [quantidade_em_eth]
 * 
 * Exemplo:
 *   npx ts-node scripts/wrap-eth-to-weth.ts 0.1
 *   (converte 0.1 ETH para WETH)
 */

import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

// const NETWORK = parseInt(process.env.CHAIN_ID || "{{CHAIN_ID}}"); // não usado, removido para lint
const RPC_URL = process.env.RPC_URL || 
  (process.env.ALCHEMY_KEY 
    ? `https://{{NETWORK_NAME}}-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`
    : "{{DEFAULT_RPC_URL}}");
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

const WETH_ADDRESS = process.env.WETH_ADDRESS || "{{WETH_ADDRESS}}";

// ABI mínima do WETH
const WETH_ABI = [
  "function deposit() public payable",
  "function balanceOf(address account) external view returns (uint256)",
  "function decimals() public view returns (uint8)",
];

async function wrapETH(amountETH: string) {
  try {
    console.log("💎 Wrap ETH para WETH\n");
    console.log("=".repeat(60));

    if (!PRIVATE_KEY) {
      throw new Error("❌ PRIVATE_KEY não configurado no .env");
    }

    if (WETH_ADDRESS === "{{WETH_ADDRESS}}") {
      throw new Error("❌ WETH_ADDRESS não configurado. Configure no .env ou substitua o placeholder");
    }

    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);
    const weth = new ethers.Contract(WETH_ADDRESS, WETH_ABI, provider);

    const signerAddress = await signer.getAddress();
    const amountWei = ethers.utils.parseEther(amountETH);

    console.log(`✅ Endereço: ${signerAddress}`);
    console.log(`✅ WETH: ${WETH_ADDRESS}`);
    console.log(`✅ Quantidade: ${amountETH} ETH\n`);

    // Verificar saldo ETH antes
    const ethBalanceBefore = await provider.getBalance(signerAddress);
    const wethBalanceBefore = await weth.balanceOf(signerAddress);

    console.log(`💰 Saldo ETH antes: ${ethers.utils.formatEther(ethBalanceBefore)} ETH`);
    console.log(`💰 Saldo WETH antes: ${ethers.utils.formatEther(wethBalanceBefore)} WETH\n`);

    if (ethBalanceBefore.lt(amountWei)) {
      throw new Error(`❌ Saldo ETH insuficiente. Você tem ${ethers.utils.formatEther(ethBalanceBefore)} ETH, mas precisa de ${amountETH} ETH`);
    }

    // Fazer wrap
    console.log("⏳ Fazendo wrap...");
    const tx = await weth.connect(signer).deposit({ value: amountWei });
    console.log(`   Hash: ${tx.hash}`);
    console.log("   Aguardando confirmação...\n");

    const receipt = await tx.wait();
    console.log(`✅ Wrap confirmado!`);
    console.log(`   Block: ${receipt.blockNumber}`);
    console.log(`   Gas usado: ${receipt.gasUsed.toString()}\n`);

    // Verificar saldo depois
    const ethBalanceAfter = await provider.getBalance(signerAddress);
    const wethBalanceAfter = await weth.balanceOf(signerAddress);

    console.log(`💰 Saldo ETH depois: ${ethers.utils.formatEther(ethBalanceAfter)} ETH`);
    console.log(`💎 Saldo WETH depois: ${ethers.utils.formatEther(wethBalanceAfter)} WETH`);
    console.log(`   Ganho: ${ethers.utils.formatEther(wethBalanceAfter.sub(wethBalanceBefore))} WETH\n`);

    console.log("=".repeat(60));
    console.log("✅ PRONTO PARA CRIAR LIQUIDEZ!\n");
    console.log("Próximo passo:");
    console.log("  npx ts-node scripts/setup-uniswap-liquidity.ts\n");
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Erro ao fazer wrap:", errorMessage);
    if (error instanceof Error && (error as any).transaction) {
      console.error(`   Transaction Hash: ${(error as any).transaction.hash}`);
    }
    throw error;
  }
}

// Executar
const amount = process.argv[2] || "0.1"; // Default: 0.1 ETH
wrapETH(amount).catch((error: unknown) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error("❌ Erro:", errorMessage);
  process.exit(1);
});
