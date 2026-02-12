/**
 * ✅ Validação do Arquivo .env
 * 
 * Script para validar se todas as variáveis de ambiente necessárias estão configuradas corretamente.
 * 
 * Para executar:
 *   npx ts-node scripts/validate-env.ts
 */

import dotenv from "dotenv";
import { ethers } from "ethers";

dotenv.config();

// Variáveis obrigatórias
const REQUIRED_VARS = [
  "PRIVATE_KEY",
  "ETHERSCAN_API_KEY",
  "THIRDWEB_CLIENT_ID",
  "THIRDWEB_SECRET_KEY",
];

// Variáveis opcionais
const OPTIONAL_VARS = [
  "BASE_RPC_URL",
  "BLOCKSCOUT_API_KEY",
  "SCAN_API_KEY",
  "ALCHEMY_KEY",
];

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

function validateEnv(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let isValid = true;

  console.log("🔍 Validando configuração do .env\n");
  console.log("=".repeat(60));

  // Validar variáveis obrigatórias
  console.log("\n📋 Variáveis Obrigatórias:\n");

  for (const varName of REQUIRED_VARS) {
    const value = process.env[varName];

    if (!value || value.trim() === "") {
      errors.push(`❌ ${varName} não está configurado`);
      isValid = false;
      console.log(`   ❌ ${varName}: NÃO CONFIGURADO`);
    } else {
      // Validações específicas
      if (varName === "PRIVATE_KEY") {
        // Verificar formato da chave privada
        const has0x = value.startsWith("0x");
        const keyLength = has0x ? value.length : value.length;
        const expectedLength = has0x ? 66 : 64; // 0x + 64 hex ou 64 hex

        if (keyLength !== expectedLength) {
          errors.push(`❌ ${varName} tem comprimento inválido (esperado: ${expectedLength}, atual: ${keyLength})`);
          isValid = false;
          console.log(`   ❌ ${varName}: Comprimento inválido`);
        } else if (!has0x) {
          warnings.push(`⚠️  ${varName} não tem prefixo 0x (recomendado adicionar)`);
          console.log(`   ⚠️  ${varName}: Sem prefixo 0x (recomendado)`);
        } else {
          // Tentar criar wallet para validar
          try {
            const wallet = new ethers.Wallet(value);
            console.log(`   ✅ ${varName}: Válido (endereço: ${wallet.address})`);
          } catch (error) {
            errors.push(`❌ ${varName} é inválido: ${error instanceof Error ? error.message : String(error)}`);
            isValid = false;
            console.log(`   ❌ ${varName}: Inválido`);
          }
        }
      } else if (varName === "ETHERSCAN_API_KEY") {
        // Verificar se não está duplicado
        if (value.includes("ETHERSCAN_API_KEY=")) {
          errors.push(`❌ ${varName} parece estar duplicado no .env`);
          isValid = false;
          console.log(`   ❌ ${varName}: Parece estar duplicado`);
        } else {
          console.log(`   ✅ ${varName}: Configurado`);
        }
      } else {
        console.log(`   ✅ ${varName}: Configurado`);
      }
    }
  }

  // Validar variáveis opcionais
  console.log("\n📋 Variáveis Opcionais:\n");

  for (const varName of OPTIONAL_VARS) {
    const value = process.env[varName];

    if (!value || value.trim() === "") {
      console.log(`   ⚪ ${varName}: Não configurado (opcional)`);
    } else {
      // Validações específicas
      if (varName === "BASE_RPC_URL") {
        try {
          new URL(value);
          console.log(`   ✅ ${varName}: URL válida`);
        } catch {
          warnings.push(`⚠️  ${varName} não parece ser uma URL válida`);
          console.log(`   ⚠️  ${varName}: URL pode ser inválida`);
        }
      } else {
        console.log(`   ✅ ${varName}: Configurado`);
      }
    }
  }

  // Resumo
  console.log("\n" + "=".repeat(60));
  console.log("\n📊 Resumo da Validação:\n");

  if (errors.length > 0) {
    console.log("❌ ERROS ENCONTRADOS:\n");
    errors.forEach((error) => console.log(`   ${error}`));
    console.log();
  }

  if (warnings.length > 0) {
    console.log("⚠️  AVISOS:\n");
    warnings.forEach((warning) => console.log(`   ${warning}`));
    console.log();
  }

  if (isValid && warnings.length === 0) {
    console.log("✅ Todas as variáveis obrigatórias estão configuradas corretamente!\n");
  } else if (isValid) {
    console.log("✅ Variáveis obrigatórias OK, mas há avisos acima.\n");
  } else {
    console.log("❌ Corrija os erros acima antes de continuar.\n");
  }

  return { isValid, errors, warnings };
}

// Executar validação
if (require.main === module) {
  const result = validateEnv();

  if (!result.isValid) {
    console.log("💡 Dica: Veja scripts/SETUP-ENV.md para ajuda na configuração.\n");
    process.exit(1);
  } else {
    console.log("🚀 Pronto para usar os scripts!\n");
    process.exit(0);
  }
}

export { validateEnv };

