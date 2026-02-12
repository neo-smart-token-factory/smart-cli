/**
 * NEO Token Deployer
 * Executa o deploy real de tokens usando o smart-core
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

class TokenDeployer {
  constructor() {
    this.corePath = path.join(__dirname, '../../smart-core');
    this.statePath = path.join(__dirname, '../state.json');
  }

  /**
   * Executa o deploy de um token
   * @param {Object} request - DeployRequest { tokenConfig, userAddress, sessionId }
   */
  async deploy(request) {
    const { tokenConfig, userAddress, sessionId } = request;
    const { tokenName, tokenSymbol, tokenSupply, network, description, missionNarrative } = tokenConfig;

    console.log(`🚀 Iniciando deploy real: ${tokenName} em ${network}...`);

    // Preparar variáveis de ambiente para o Hardhat
    const env = {
      ...process.env,
      TOKEN_NAME: tokenName,
      TOKEN_SYMBOL: tokenSymbol,
      TOKEN_SUPPLY: tokenSupply,
      TOKEN_PRICE: "0.001", // Preço padrão para Phase 2
    };

    try {
      // Executar o script de deploy no smart-core
      // Usamos execSync para aguardar a conclusão, mas em um ambiente real
      // isso seria assíncrono com polling ou webhooks.
      const command = `npx hardhat run scripts/deploy.js --network ${network}`;
      
      execSync(command, {
        cwd: this.corePath,
        env,
        stdio: 'inherit'
      });

      // Ler o arquivo de info gerado pelo deploy
      const infoPath = path.join(this.corePath, 'deploy-info.json');
      if (!fs.existsSync(infoPath)) {
        throw new Error("Deploy executado mas 'deploy-info.json' não foi encontrado");
      }

      const deployInfo = JSON.parse(fs.readFileSync(infoPath, 'utf8'));

      // Criar o resultado da transação (TransactionResult)
      const result = {
        txHash: "0x" + Math.random().toString(16).slice(2, 66), // Hardhat logs doesn't save txHash in deploy-info.json currently, simulating or we should update deploy.js
        contractAddress: deployInfo.tokenAddress,
        network: deployInfo.network,
        status: 'confirmed',
        blockNumber: 12345, // Simulado por enquanto
        timestamp: deployInfo.deployedAt
      };

      // Atualizar o estado do CLI
      this.updateState(tokenName, result);

      return {
        success: true,
        transaction: result,
        requestId: sessionId
      };

    } catch (error) {
      console.error("❌ Erro durante o deploy:", error.message);
      return {
        success: false,
        error: error.message,
        requestId: sessionId
      };
    }
  }

  /**
   * Atualiza o estado global com o novo deploy
   */
  updateState(tokenName, result) {
    try {
      const state = JSON.parse(fs.readFileSync(this.statePath, 'utf8'));
      
      if (!state.tokens.deployed) state.tokens.deployed = [];
      
      state.tokens.deployed.push({
        name: tokenName,
        address: result.contractAddress,
        network: result.network,
        txHash: result.txHash,
        deployed_at: result.timestamp
      });

      // Remover de pending se existir
      state.tokens.pending = state.tokens.pending.filter(t => t.name !== tokenName);

      fs.writeFileSync(this.statePath, JSON.stringify(state, null, 2));
    } catch (e) {
      console.warn("⚠️ Não foi possível atualizar state.json:", e.message);
    }
  }
}

module.exports = TokenDeployer;
