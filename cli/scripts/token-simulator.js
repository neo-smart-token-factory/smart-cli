/**
 * NEO Token Simulator
 * Simula e valida tokens antes do deploy
 */

const fs = require('fs');
const path = require('path');

class TokenSimulator {
  constructor() {
    this.tokensPath = path.join(__dirname, '../tokens');
    this.statePath = path.join(__dirname, '../state.json');
  }

  /**
   * Simula um token completo
   */
  simulate(tokenName) {
    const token = this.loadToken(tokenName);
    if (!token) {
      return this.createToken(tokenName);
    }

    return {
      token,
      analysis: this.analyzeToken(token),
      recommendations: this.generateRecommendations(token),
      risks: this.identifyRisks(token),
      economics: this.validateEconomics(token),
      deployment: this.previewDeployment(token)
    };
  }

  /**
   * Cria rascunho de um token
   */
  draft(tokenName, config = {}) {
    const template = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../tokens/template.json'), 'utf8')
    );

    const token = {
      ...template,
      name: tokenName,
      symbol: config.symbol || tokenName.substring(0, 4).toUpperCase(),
      status: 'draft',
      created_at: new Date().toISOString(),
      last_updated: new Date().toISOString(),
      ...config
    };

    this.saveToken(tokenName, token);
    this.updateState(tokenName, 'draft');

    return {
      success: true,
      token,
      message: `Token ${tokenName} criado como rascunho`
    };
  }

  /**
   * Gera manifesto para um token
   */
  generateManifest(tokenName) {
    const token = this.loadToken(tokenName);
    if (!token) {
      return { error: `Token ${tokenName} não encontrado` };
    }

    const manifest = {
      title: `${token.name} — Manifesto`,
      introduction: this.generateIntroduction(token),
      vision: this.generateVision(token),
      values: token.narrative.values || [],
      rituals: token.narrative.rituals || [],
      technical_philosophy: this.generateTechnicalPhilosophy(token),
      community: this.generateCommunitySection(token)
    };

    token.narrative.manifesto = manifest;
    this.saveToken(tokenName, token);

    return manifest;
  }

  /**
   * Preview de deploy
   */
  deployPreview(tokenName) {
    const token = this.loadToken(tokenName);
    if (!token) {
      return { error: `Token ${tokenName} não encontrado` };
    }

    const gasEstimate = this.estimateGas(token);
    const costEstimate = this.estimateCost(gasEstimate);

    return {
      token: {
        name: token.name,
        symbol: token.symbol,
        total_supply: token.tokenomics.total_supply,
        decimals: token.tokenomics.decimals
      },
      deployment: {
        network: token.deployment.network || 'Polygon',
        estimated_gas: gasEstimate,
        estimated_cost_usd: costEstimate,
        estimated_cost_eth: (costEstimate / 2000).toFixed(6), // Assumindo ETH ~$2000
        components: this.listComponents(token)
      },
      warnings: this.getDeploymentWarnings(token)
    };
  }

  /**
   * Análise rápida de auditoria
   */
  quickAudit(tokenName) {
    const token = this.loadToken(tokenName);
    if (!token) {
      return { error: `Token ${tokenName} não encontrado` };
    }

    const audit = {
      token: token.name,
      timestamp: new Date().toISOString(),
      checks: {
        tokenomics: this.auditTokenomics(token),
        security: this.auditSecurity(token),
        distribution: this.auditDistribution(token),
        vesting: this.auditVesting(token),
        governance: this.auditGovernance(token)
      },
      risks: this.identifyRisks(token),
      score: this.calculateAuditScore(token),
      recommendations: this.generateRecommendations(token)
    };

    token.audit = audit;
    this.saveToken(tokenName, token);

    return audit;
  }

  // Métodos auxiliares privados

  loadToken(tokenName) {
    const tokenPath = path.join(this.tokensPath, `${tokenName.toLowerCase()}.json`);
    if (fs.existsSync(tokenPath)) {
      return JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
    }
    return null;
  }

  saveToken(tokenName, token) {
    if (!fs.existsSync(this.tokensPath)) {
      fs.mkdirSync(this.tokensPath, { recursive: true });
    }

    const tokenPath = path.join(this.tokensPath, `${tokenName.toLowerCase()}.json`);
    token.last_updated = new Date().toISOString();
    fs.writeFileSync(tokenPath, JSON.stringify(token, null, 2));
  }

  updateState(tokenName, status) {
    const state = JSON.parse(fs.readFileSync(this.statePath, 'utf8'));
    const tokenIndex = state.tokens.pending.findIndex(t => t.name === tokenName);

    if (tokenIndex >= 0) {
      state.tokens.pending[tokenIndex].status = status;
      state.tokens.pending[tokenIndex].last_updated = new Date().toISOString();
    } else {
      state.tokens.pending.push({
        name: tokenName,
        status: status,
        created_at: new Date().toISOString(),
        last_updated: new Date().toISOString()
      });
    }

    fs.writeFileSync(this.statePath, JSON.stringify(state, null, 2));
  }

  analyzeToken(token) {
    return {
      completeness: this.calculateCompleteness(token),
      readiness: this.calculateReadiness(token),
      missing_fields: this.findMissingFields(token)
    };
  }

  calculateCompleteness(token) {
    const fields = [
      'name', 'symbol', 'tokenomics.total_supply',
      'tokenomics.distribution', 'narrative.manifesto',
      'technical.mintable', 'technical.burnable'
    ];

    let completed = 0;
    fields.forEach(field => {
      const value = this.getNestedValue(token, field);
      if (value !== null && value !== undefined && value !== '') {
        completed++;
      }
    });

    return Math.round((completed / fields.length) * 100);
  }

  calculateReadiness(token) {
    const completeness = this.calculateCompleteness(token);
    const hasAudit = token.audit && token.audit.status !== 'pending';

    if (completeness === 100 && hasAudit) return 'ready';
    if (completeness >= 70) return 'almost_ready';
    if (completeness >= 40) return 'in_progress';
    return 'draft';
  }

  findMissingFields(token) {
    const required = {
      'tokenomics.total_supply': 'Supply total',
      'tokenomics.distribution': 'Distribuição de tokens',
      'narrative.manifesto': 'Manifesto',
      'technical.mintable': 'Configuração de mint',
      'technical.burnable': 'Configuração de burn'
    };

    const missing = [];
    Object.keys(required).forEach(field => {
      const value = this.getNestedValue(token, field);
      if (value === null || value === undefined || value === '') {
        missing.push(required[field]);
      }
    });

    return missing;
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((o, p) => o && o[p], obj);
  }

  validateEconomics(token) {
    const dist = token.tokenomics.distribution || {};
    const total = Object.values(dist).reduce((sum, val) => sum + (val || 0), 0);
    const supply = token.tokenomics.total_supply || 0;

    return {
      distribution_sum: total,
      total_supply: supply,
      is_valid: total <= supply,
      warnings: total < supply ? [`Distribuição (${total}) menor que supply total (${supply})`] : []
    };
  }

  identifyRisks(token) {
    const risks = [];

    // Risco de concentração
    const dist = token.tokenomics.distribution || {};
    const teamPercent = (dist.team || 0) / (token.tokenomics.total_supply || 1) * 100;
    if (teamPercent > 50) {
      risks.push({
        level: 'high',
        category: 'tokenomics',
        description: 'Concentração excessiva de tokens na equipe',
        recommendation: 'Reduzir alocação da equipe para menos de 50%'
      });
    }

    // Risco de vesting
    if (!token.tokenomics.vesting || !token.tokenomics.vesting.team_vesting) {
      risks.push({
        level: 'medium',
        category: 'vesting',
        description: 'Sem vesting configurado para equipe',
        recommendation: 'Implementar vesting com cliff para proteger investidores'
      });
    }

    // Risco de mintabilidade
    if (token.technical.mintable && !token.technical.governance) {
      risks.push({
        level: 'medium',
        category: 'governance',
        description: 'Token mintable sem governança',
        recommendation: 'Implementar governança ou remover capacidade de mint'
      });
    }

    return risks;
  }

  generateRecommendations(token) {
    const recommendations = [];
    const completeness = this.calculateCompleteness(token);

    if (completeness < 100) {
      recommendations.push('Completar todos os campos obrigatórios');
    }

    if (!token.audit || token.audit.status === 'pending') {
      recommendations.push('Realizar auditoria completa antes do deploy');
    }

    if (!token.narrative.manifesto) {
      recommendations.push('Criar manifesto para estabelecer narrativa');
    }

    if (!token.tokenomics.vesting) {
      recommendations.push('Configurar vesting schedules para equipe e investidores');
    }

    return recommendations;
  }

  previewDeployment(token) {
    return {
      network: token.deployment.network || 'Polygon',
      estimated_gas: this.estimateGas(token),
      components: this.listComponents(token),
      cost_estimate: this.estimateCost(this.estimateGas(token))
    };
  }

  estimateGas(token) {
    let gas = 2500000; // Base para token ERC20

    if (token.technical.mintable) gas += 50000;
    if (token.technical.burnable) gas += 30000;
    if (token.technical.pausable) gas += 40000;

    // Vesting
    const vestingCount = Object.keys(token.tokenomics.vesting || {}).length;
    gas += vestingCount * 150000;

    // Rewards
    if (token.dapp && token.dapp.planned) gas += 2000000;

    return gas;
  }

  estimateCost(gas) {
    const gasPrice = 30; // gwei
    const ethPrice = 2000; // USD
    return (gas * gasPrice * 1e-9 * ethPrice).toFixed(2);
  }

  listComponents(token) {
    const components = ['Token ERC20'];

    if (token.tokenomics.vesting) components.push('Vesting');
    if (token.dapp && token.dapp.planned) components.push('dApp');
    if (token.pool && token.pool.planned) components.push('Liquidity Pool');
    if (token.technical.governance) components.push('Governance');

    return components;
  }

  getDeploymentWarnings(token) {
    const warnings = [];

    if (!token.audit || token.audit.status === 'pending') {
      warnings.push('Auditoria não realizada');
    }

    if (this.calculateCompleteness(token) < 100) {
      warnings.push('Token incompleto');
    }

    return warnings;
  }

  generateIntroduction(token) {
    return `No coração do ${token.name}, existe uma intenção clara: ${token.narrative.story || 'transformar ideias em realidade através da tokenização.'}`;
  }

  generateVision(token) {
    return `A visão do ${token.name} é criar um ecossistema ${token.narrative.values?.join(' e ') || 'descentralizado e autônomo'}.`;
  }

  generateTechnicalPhilosophy(token) {
    return `Tecnicamente, o ${token.name} prioriza ${token.technical.mintable ? 'flexibilidade' : 'estabilidade'} e ${token.technical.burnable ? 'sustentabilidade' : 'permanência'}.`;
  }

  generateCommunitySection(token) {
    return `A comunidade ${token.name} é construída através de ${token.narrative.rituals?.length || 0} rituais e valores compartilhados.`;
  }

  auditTokenomics(token) {
    const dist = token.tokenomics.distribution || {};
    const total = Object.values(dist).reduce((sum, val) => sum + (val || 0), 0);
    const supply = token.tokenomics.total_supply || 0;

    return {
      passed: total <= supply && supply > 0,
      issues: total > supply ? ['Distribuição excede supply total'] : [],
      score: total <= supply && supply > 0 ? 100 : 0
    };
  }

  auditSecurity(token) {
    const checks = {
      has_vesting: !!token.tokenomics.vesting,
      has_governance: token.technical.governance || false,
      mintable_controlled: !token.technical.mintable || token.technical.governance
    };

    const passed = Object.values(checks).filter(v => v).length;
    return {
      passed: passed === Object.keys(checks).length,
      checks,
      score: Math.round((passed / Object.keys(checks).length) * 100)
    };
  }

  auditDistribution(token) {
    const dist = token.tokenomics.distribution || {};
    const teamPercent = (dist.team || 0) / (token.tokenomics.total_supply || 1) * 100;

    return {
      passed: teamPercent <= 50,
      team_percentage: teamPercent,
      score: teamPercent <= 50 ? 100 : Math.max(0, 100 - (teamPercent - 50) * 2)
    };
  }

  auditVesting(token) {
    const vesting = token.tokenomics.vesting || {};
    const hasTeamVesting = !!vesting.team_vesting;
    const hasInvestorVesting = !!vesting.investor_vesting;

    return {
      passed: hasTeamVesting && hasInvestorVesting,
      checks: {
        team_vesting: hasTeamVesting,
        investor_vesting: hasInvestorVesting
      },
      score: ((hasTeamVesting ? 50 : 0) + (hasInvestorVesting ? 50 : 0))
    };
  }

  auditGovernance(token) {
    return {
      passed: token.technical.governance || false,
      score: token.technical.governance ? 100 : 0
    };
  }

  calculateAuditScore(token) {
    const audits = [
      this.auditTokenomics(token),
      this.auditSecurity(token),
      this.auditDistribution(token),
      this.auditVesting(token),
      this.auditGovernance(token)
    ];

    const totalScore = audits.reduce((sum, audit) => sum + audit.score, 0);
    return Math.round(totalScore / audits.length);
  }
}

module.exports = TokenSimulator;

