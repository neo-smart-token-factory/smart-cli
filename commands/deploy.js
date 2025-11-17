require('dotenv').config();
const { execSync } = require('child_process');

module.exports = async function deploy(options) {
  const network = options.network || 'polygon';
  
  console.log(`🚀 NΞØ SMART FACTORY — Deploy para ${network}\n`);

  // Validar variáveis de ambiente
  const required = ['TOKEN_NAME', 'TOKEN_SYMBOL', 'TOKEN_SUPPLY', 'TOKEN_PRICE', 'PRIVATE_KEY'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Variáveis de ambiente faltando:', missing.join(', '));
    console.log('Execute: neo-smart-factory init');
    process.exit(1);
  }

  try {
    // Executar deploy via Hardhat
    execSync(
      `cd ../forge-core && npx hardhat run scripts/deploy.js --network ${network}`,
      { stdio: 'inherit' }
    );
  } catch (error) {
    console.error('❌ Erro no deploy:', error.message);
    process.exit(1);
  }
};

