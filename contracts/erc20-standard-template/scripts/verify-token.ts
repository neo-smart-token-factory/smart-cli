/**
 * Script para verificar o contrato {{TOKEN_NAME}} ({{TOKEN_SYMBOL}}) no explorer
 * 
 * Token Address: {{TOKEN_ADDRESS}}
 * Network: {{NETWORK_NAME}} (Chain ID: {{CHAIN_ID}})
 * 
 * Para executar:
 * 1. Configure a variável EXPLORER_API_KEY no .env
 * 2. Execute: npx ts-node scripts/verify-token.ts
 */

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

dotenv.config();

const CONTRACT_ADDRESS = process.env.TOKEN_ADDRESS || "{{TOKEN_ADDRESS}}";
const CHAIN_ID = parseInt(process.env.CHAIN_ID || "{{CHAIN_ID}}");
const EXPLORER_API_URL = process.env.EXPLORER_API_URL || "{{EXPLORER_API_URL}}";
const API_KEY = process.env.EXPLORER_API_KEY || process.env.SCAN_API_KEY;

// Caminho do contrato no repositório
const CONTRACT_PATH = "contracts/prebuilts/token/TokenERC20.sol";
const CONTRACT_NAME = "TokenERC20";

async function main() {
  console.log("=".repeat(60));
  console.log("Verificação do Token {{TOKEN_NAME}} no {{EXPLORER_NAME}}");
  console.log("=".repeat(60));
  console.log(`Endereço do Contrato: ${CONTRACT_ADDRESS}`);
  console.log(`Network: {{NETWORK_NAME}} (Chain ID: ${CHAIN_ID})`);
  console.log(`API: ${EXPLORER_API_URL}`);
  console.log("=".repeat(60));
  console.log();

  if (CONTRACT_ADDRESS === "{{TOKEN_ADDRESS}}") {
    console.error("❌ ERRO: TOKEN_ADDRESS não configurado. Configure no .env ou substitua o placeholder");
    process.exit(1);
  }

  if (!API_KEY) {
    console.error("❌ ERRO: EXPLORER_API_KEY ou SCAN_API_KEY não configurado no .env");
    console.log("\nPor favor, adicione ao seu arquivo .env:");
    console.log("EXPLORER_API_KEY=seu_api_key_aqui");
    process.exit(1);
  }

  // Verifica se o arquivo do contrato existe
  const contractFullPath = path.join(process.cwd(), CONTRACT_PATH);
  if (!fs.existsSync(contractFullPath)) {
    console.error(`❌ ERRO: Contrato não encontrado em ${CONTRACT_PATH}`);
    process.exit(1);
  }

  // Verifica se o Foundry está instalado
  try {
    execSync("forge --version", { stdio: "pipe" });
  } catch {
    console.error("❌ ERRO: Foundry não está instalado.");
    console.log("\nPara instalar:");
    console.log("  curl -L https://foundry.paradigm.xyz | bash");
    console.log("  foundryup");
    process.exit(1);
  }

  console.log("🔨 Compilando contrato...\n");
  try {
    execSync("forge build", { stdio: "inherit" });
  } catch (error) {
    console.error("❌ Erro ao compilar contrato");
    process.exit(1);
  }

  console.log("\n🔍 Verificando contrato no {{EXPLORER_NAME}}...\n");

  try {
    const verifyCommand = `forge verify-contract ${CONTRACT_ADDRESS} ${CONTRACT_NAME} --chain-id ${CHAIN_ID} --etherscan-api-key ${API_KEY} --watch`;
    console.log(`Executando: ${verifyCommand}\n`);
    execSync(verifyCommand, { stdio: "inherit" });
    console.log("\n✅ Contrato verificado com sucesso!");
    console.log(`\n📋 Verifique em: {{EXPLORER_URL}}/address/${CONTRACT_ADDRESS}`);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("\n❌ Erro ao verificar contrato:", errorMessage);
    console.log("\n💡 Dica: Se o contrato já estiver verificado, este erro é normal.");
    process.exit(1);
  }
}

main();

