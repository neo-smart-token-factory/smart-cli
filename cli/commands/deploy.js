const { execSync } = require('child_process');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
require('dotenv').config();

module.exports = async function deploy(options) {
  const network = options.network || 'base';

  console.log(chalk.bold.cyan(`\n🚀 NΞØ SMART FACTORY — Iniciando Deploy [${network}]`));

  // --- STEP 1: Rigidez de Schema (MCP) ---
  console.log(chalk.dim('  Validando inputs via MCP Schema...'));
  try {
    const schemaPath = path.join(__dirname, '../../smart-core/mcp/schemas/token-factory.json');
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readJsonSync(schemaPath);
      const deployJettonSchema = schema.tools.find(t => t.name === 'deploy_jetton').inputSchema;

      // Validação básica baseada no schema
      const required = deployJettonSchema.required || [];
      const missing = required.filter(key => {
        // Mapear nomes do schema para env vars
        const envKey = `TOKEN_${key.toUpperCase()}`;
        return !process.env[envKey] && !process.env[key.toUpperCase()];
      });

      if (missing.length > 0) {
        console.error(chalk.red('\n🚨 VIOLAÇÃO DE SCHEMA MCP:'));
        console.error(chalk.white(`Campos obrigatórios ausentes: ${missing.join(', ')}`));
        process.exit(1);
      }
      console.log(chalk.green('  ✅ Schema Validado.'));
    }
  } catch (err) {
    console.warn(chalk.yellow('  ⚠️  Aviso: Falha ao carregar schema de validação.'));
  }

  // Validar variáveis de ambiente críticas
  const critical = ['PRIVATE_KEY'];
  const missingCritical = critical.filter(key => !process.env[key]);
  if (missingCritical.length > 0) {
    console.error(chalk.red('❌ Erro: PRIVATE_KEY não configurada.'));
    process.exit(1);
  }

  try {
    const corePath = path.join(process.cwd(), '..', 'smart-core');

    // --- STEP 2: Executar Deploy ---
    console.log(chalk.white('\n  Executando script de deploy no Core...'));
    execSync(
      `npx hardhat run scripts/deploy.js --network ${network}`,
      { cwd: corePath, stdio: 'inherit' }
    );

    // --- STEP 3: Exposição de Provas (MIO Proofs) ---
    console.log(chalk.bold.cyan('\n🛡️  GERANDO PROVAS DE SEGURANÇA (MIO)...'));

    // Tenta gerar o manifesto e MIO via smart-core
    try {
      execSync('npm run security:manifesto', { cwd: corePath, stdio: 'ignore' });

      const deployInfoPath = path.join(corePath, 'deploy-info.json');
      if (fs.existsSync(deployInfoPath)) {
        const deployInfo = fs.readJsonSync(deployInfoPath);
        const manifestoFile = `${deployInfo.tokenSymbol}-MANIFESTO.md`;
        const manifestoPath = path.join(corePath, 'deployments', manifestoFile);

        // Calcular MIO Hash do artefato (ex: IgnitionToken)
        const artifactPath = path.join(corePath, 'artifacts/contracts/IgnitionToken.sol/IgnitionToken.json');
        if (fs.existsSync(artifactPath)) {
          const crypto = require('crypto');
          const artifactBuffer = fs.readFileSync(artifactPath);
          const mioHash = crypto.createHash('sha256').update(artifactBuffer).digest('hex');

          console.log(chalk.green(`  🛡️  Security Proof generated: [${mioHash}]`));
          console.log(chalk.white(`  📄 Manifesto audível disponível em: `) + chalk.yellow(`smart-core/deployments/${manifestoFile}`));
        }
      }
    } catch (secErr) {
      console.warn(chalk.yellow('  ⚠️  Aviso: Erro ao gerar provas de imutabilidade.'));
    }

    console.log(chalk.bold.green('\n✨ OPERAÇÃO FINALIZADA COM SUCESSO.'));

  } catch (error) {
    console.error(chalk.red('\n❌ Erro no deploy:'), error.message);
    process.exit(1);
  }
};

