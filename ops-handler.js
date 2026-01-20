/**
 * NΞØ Internal Ops App v0.1
 * Handler principal para processar comandos
 */

const TokenSimulator = require('./scripts/token-simulator');
const BuildLog = require('./scripts/build-log');
const MarketingEngine = require('./scripts/marketing-engine');
const EcosystemSimulator = require('./scripts/ecosystem-simulator');

class NeoInternalOps {
  constructor() {
    this.tokenSimulator = new TokenSimulator();
    this.buildLog = new BuildLog();
    this.marketingEngine = new MarketingEngine();
    this.ecosystemSimulator = new EcosystemSimulator();
  }

  /**
   * Processa um comando
   */
  processCommand(command) {
    const parts = command.trim().split(/\s+/);
    const prefix = parts[0].toUpperCase();

    if (!prefix.startsWith('NEO::')) {
      return { error: 'Comando inválido. Use prefixo NEO::' };
    }

    const module = parts[0].split('::')[1]?.toLowerCase();

    // Comando especial: NEO::simulate (sem ação, apenas módulo + args)
    if (module === 'simulate') {
      const args = parts.slice(1);
      return this.handleSimulateCommand(args);
    }

    const action = parts[1]?.toLowerCase();
    const args = parts.slice(2);

    try {
      switch (module) {
        case 'token':
          return this.handleTokenCommand(action, args);
        case 'status':
        case 'progress':
        case 'version':
        case 'next':
        case 'risks':
          return this.handleBuildLogCommand(module);
        case 'marketing':
          return this.handleMarketingCommand(action, args);
        default:
          return { error: `Módulo '${module}' não reconhecido` };
      }
    } catch (error) {
      return { error: error.message, stack: error.stack };
    }
  }

  /**
   * Processa comando de simulação de ecossistema
   * NEO::simulate <token-name>
   */
  handleSimulateCommand(args) {
    if (!args.length) {
      return { error: 'Nome do token necessário. Use: NEO::simulate <TOKEN_NAME>' };
    }

    const tokenName = args[0].toUpperCase();
    return this.ecosystemSimulator.simulate(tokenName);
  }

  /**
   * Processa comandos do módulo Token
   */
  handleTokenCommand(action, args) {
    if (!args.length) {
      return { error: 'Nome do token necessário' };
    }

    const tokenName = args[0].toUpperCase();
    const config = args.length > 1 ? this.parseConfig(args.slice(1).join(' ')) || {} : {};

    switch (action) {
      case 'simulate':
        return this.tokenSimulator.simulate(tokenName);
      case 'draft':
        return this.tokenSimulator.draft(tokenName, config);
      case 'manifest':
        return this.tokenSimulator.generateManifest(tokenName);
      case 'deploy-preview':
        return this.tokenSimulator.deployPreview(tokenName);
      case 'audit':
        return this.tokenSimulator.quickAudit(tokenName);
      case 'economics':
        const token = this.tokenSimulator.loadToken(tokenName);
        if (!token) {
          return { error: `Token ${tokenName} não encontrado` };
        }
        return {
          token: tokenName,
          economics: this.tokenSimulator.validateEconomics(token),
          analysis: this.tokenSimulator.analyzeToken(token)
        };
      case 'narrative':
        return this.tokenSimulator.generateManifest(tokenName);
      case 'rituals':
        return {
          token: tokenName,
          suggestions: this.generateRitualSuggestions(tokenName)
        };
      default:
        return { error: `Ação '${action}' não reconhecida` };
    }
  }

  /**
   * Processa comandos do módulo Build Log
   */
  handleBuildLogCommand(command) {
    switch (command) {
      case 'status':
        return this.buildLog.getStatus();
      case 'progress':
        return this.buildLog.getProgress();
      case 'version':
        return this.buildLog.getVersion();
      case 'next':
        return this.buildLog.getNextActions();
      case 'risks':
        return this.buildLog.getRisks();
      default:
        return { error: `Comando '${command}' não reconhecido` };
    }
  }

  /**
   * Processa comandos do módulo Marketing
   */
  handleMarketingCommand(action, args) {
    switch (action) {
      case 'update':
        if (!args.length) {
          return { error: 'Mensagem necessária' };
        }
        const message = args.join(' ');
        return this.marketingEngine.generateUpdate(message);
      case 'headline':
        const type = args[0] || 'general';
        return {
          headline: this.marketingEngine.generateHeadline(type),
          type
        };
      case 'story':
        const tokenName = args[0] || null;
        return this.marketingEngine.generateStory(tokenName);
      case 'log':
        const limit = args[0] ? parseInt(args[0]) : 10;
        return this.marketingEngine.generateLog(limit);
      case 'post':
        if (args.length < 2) {
          return { error: 'Plataforma e tipo necessários' };
        }
        const platform = args[0];
        const tipo = args[1];
        const context = args.length > 2 ? { message: args.slice(2).join(' ') } : {};
        return this.marketingEngine.generatePost(platform, tipo, context);
      default:
        return { error: `Ação '${action}' não reconhecida` };
    }
  }

  /**
   * Parse configuração JSON
   */
  parseConfig(configString) {
    try {
      return JSON.parse(configString);
    } catch (e) {
      return null;
    }
  }

  /**
   * Gera sugestões de rituais
   */
  generateRitualSuggestions(tokenName) {
    return [
      {
        name: 'Genesis Mint',
        description: 'Primeiro mint do token marca o início do ecossistema',
        frequency: 'one-time'
      },
      {
        name: 'Weekly Community Call',
        description: 'Chamada semanal da comunidade para discutir desenvolvimento',
        frequency: 'weekly'
      },
      {
        name: 'Token Burn Ceremony',
        description: 'Ritual periódico de queima de tokens para deflação',
        frequency: 'monthly'
      },
      {
        name: 'Governance Proposal',
        description: 'Ritual de submissão e votação de propostas',
        frequency: 'as-needed'
      }
    ];
  }
}

// Export para uso em Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NeoInternalOps;
}

// Para uso direto no chat, criar instância global
if (typeof window === 'undefined') {
  const ops = new NeoInternalOps();

  // Exemplo de uso
  if (require.main === module) {
    const command = process.argv.slice(2).join(' ');
    if (command) {
      const result = ops.processCommand(command);
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log('NΞØ Internal Ops App v0.1');
      console.log('Use: node index.js "NEO::status"');
    }
  }
}

