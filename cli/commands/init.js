const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');

module.exports = async function init() {
  console.log('🚀 NΞØ SMART FACTORY — Inicializar Token\n');

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'tokenName',
      message: 'Nome do Token:',
      validate: (input) => input.length >= 2 || 'Nome deve ter pelo menos 2 caracteres'
    },
    {
      type: 'input',
      name: 'tokenSymbol',
      message: 'Símbolo:',
      validate: (input) => {
        if (input.length < 2 || input.length > 10) {
          return 'Símbolo deve ter entre 2 e 10 caracteres';
        }
        return true;
      }
    },
    {
      type: 'input',
      name: 'tokenSupply',
      message: 'Supply Total:',
      validate: (input) => {
        const num = Number(input);
        return num > 0 || 'Supply deve ser maior que zero';
      }
    },
    {
      type: 'input',
      name: 'tokenPrice',
      message: 'Preço Fixo (ETH/MATIC):',
      validate: (input) => {
        const num = Number(input);
        return num >= 0 || 'Preço deve ser maior ou igual a zero';
      }
    },
    {
      type: 'list',
      name: 'network',
      message: 'Rede:',
      choices: ['polygon', 'amoy']
    }
  ]);

  // Criar arquivo .env
  const envContent = `TOKEN_NAME=${answers.tokenName}
TOKEN_SYMBOL=${answers.tokenSymbol}
TOKEN_SUPPLY=${answers.tokenSupply}
TOKEN_PRICE=${answers.tokenPrice}
NETWORK=${answers.network}
`;

  fs.writeFileSync('.env', envContent);
  
  // Criar estrutura do token em tokens/
  const tokenDir = path.join(process.cwd(), '..', 'tokens', answers.tokenName.toLowerCase());
  if (!fs.existsSync(tokenDir)) {
    fs.mkdirSync(tokenDir, { recursive: true });
    fs.mkdirSync(path.join(tokenDir, 'contracts'), { recursive: true });
    fs.mkdirSync(path.join(tokenDir, 'scripts'), { recursive: true });
    fs.mkdirSync(path.join(tokenDir, 'docs'), { recursive: true });
    fs.mkdirSync(path.join(tokenDir, 'ui'), { recursive: true });
  }

  // Salvar configuração do token
  const tokenConfig = {
    name: answers.tokenName,
    symbol: answers.tokenSymbol,
    supply: answers.tokenSupply,
    price: answers.tokenPrice,
    network: answers.network,
    createdAt: new Date().toISOString()
  };

  fs.writeFileSync(
    path.join(tokenDir, 'token-config.json'),
    JSON.stringify(tokenConfig, null, 2)
  );

  console.log('\n✅ Configuração salva em .env');
  console.log(`✅ Estrutura criada em tokens/${answers.tokenName.toLowerCase()}/`);
  console.log('\nPróximos passos:');
  console.log('  1. Configure PRIVATE_KEY e RPC_URL no .env');
  console.log('  2. Execute: neo-smart-factory deploy');
};

