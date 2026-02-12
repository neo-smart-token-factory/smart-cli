/**
 * 🔍 Verificação de Instalação do Foundry
 * 
 * Verifica se o Foundry está instalado e configurado corretamente.
 * 
 * Para executar:
 *   npx ts-node scripts/check-foundry.ts
 */

import { execSync } from "child_process";

const FOUNDRY_COMMANDS = ["forge", "cast", "anvil"];

function checkFoundry(): boolean {
  console.log("🔍 Verificando instalação do Foundry\n");
  console.log("=".repeat(60));

  let allInstalled = true;

  for (const cmd of FOUNDRY_COMMANDS) {
    try {
      const version = execSync(`${cmd} --version`, { encoding: "utf-8", stdio: "pipe" });
      const versionLine = version.split("\n")[0];
      console.log(`✅ ${cmd}: ${versionLine}`);
    } catch (error) {
      console.log(`❌ ${cmd}: NÃO INSTALADO`);
      allInstalled = false;
    }
  }

  console.log("\n" + "=".repeat(60));

  if (allInstalled) {
    console.log("\n✅ Foundry está instalado e configurado corretamente!\n");
    return true;
  } else {
    console.log("\n❌ Foundry não está instalado ou não está no PATH.\n");
    console.log("📖 Para instalar, veja: scripts/INSTALL-FOUNDRY.md\n");
    console.log("🚀 Instalação rápida:\n");
    console.log("   curl -L https://foundry.paradigm.xyz | bash");
    console.log("   source ~/.zshrc  # ou ~/.bashrc");
    console.log("   foundryup\n");
    return false;
  }
}

// Executar verificação
if (require.main === module) {
  const isInstalled = checkFoundry();
  process.exit(isInstalled ? 0 : 1);
}

export { checkFoundry };

