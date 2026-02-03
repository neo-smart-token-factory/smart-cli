const { execSync } = require('child_process');
const chalk = require('chalk');
const path = require('path');

module.exports = async function audit() {
  console.log(chalk.bold.cyan('\n🛡️  NΞØ SMART FACTORY — Sistema de Auditoria de Integridade'));
  console.log(chalk.dim('Mantra: "Soberania através da Verificabilidade"\n'));

  try {
    const corePath = path.join(process.cwd(), '..', 'smart-core');
    
    console.log(chalk.white('  Iniciando verificação do Logic Vault...'));
    
    execSync('npm run security:check', {
      cwd: corePath,
      stdio: 'inherit'
    });

  } catch (error) {
    // Erro já logado pelo script de segurança
    process.exit(1);
  }
};
