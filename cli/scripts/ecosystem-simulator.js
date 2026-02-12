/**
 * NEO Ecosystem Simulator
 * Simulador completo de ecossistemas antes do deploy
 * OBRIGATÓRIO antes de qualquer deploy real
 */

const fs = require('fs');
const path = require('path');
const TokenSimulator = require('./token-simulator');

class EcosystemSimulator {
  constructor() {
    this.tokensPath = path.join(__dirname, '../tokens');
    this.statePath = path.join(__dirname, '../state.json');
    this.tokenSimulator = new TokenSimulator();
  }

  /**
   * Simulação completa do ecossistema
   * NEO::simulate <token-name>
   */
  simulate(tokenName) {
    const token = this.loadToken(tokenName);
    if (!token) {
      return {
        error: `Token ${tokenName} não encontrado`,
        suggestion: `Use NEO::token draft ${tokenName} para criar o token primeiro`
      };
    }

    const simulation = {
      token: tokenName,
      timestamp: new Date().toISOString(),
      status: 'simulating',
      
      // A. Segurança
      security: this.checkSecurity(token),
      
      // B. Tokenômica
      tokenomics: this.validateTokenomics(token),
      
      // C. Rituais e Comportamento
      rituals: this.analyzeRituals(token),
      
      // D. Narrativa
      narrative: this.validateNarrative(token),
      
      // E. Simulação de 7 dias
      sevenDaySimulation: this.simulateSevenDays(token),
      
      // Resultado final
      verdict: this.generateVerdict(token),
      
      // Recomendações críticas
      criticalRecommendations: this.getCriticalRecommendations(token)
    };

    // Salvar resultado da simulação
    this.saveSimulation(tokenName, simulation);

    return simulation;
  }

  /**
   * A. Verificação de Segurança
   */
  checkSecurity(token) {
    const checks = {
      supply_valid: this.checkSupply(token),
      owner_valid: this.checkOwner(token),
      price_valid: this.checkPrice(token),
      locks_adequate: this.checkLocks(token),
      wallet_connected: this.checkWallet(token),
      overall_score: 0,
      passed: false,
      warnings: [],
      errors: []
    };

    // Validar supply
    if (!checks.supply_valid.valid) {
      checks.errors.push(checks.supply_valid.error);
    }

    // Validar owner
    if (!checks.owner_valid.valid) {
      checks.errors.push(checks.owner_valid.error);
    }

    // Validar preço
    if (!checks.price_valid.valid) {
      checks.warnings.push(checks.price_valid.warning);
    }

    // Validar travas
    if (!checks.locks_adequate.valid) {
      checks.warnings.push(checks.locks_adequate.warning);
    }

    // Calcular score
    const validChecks = [
      checks.supply_valid.valid,
      checks.owner_valid.valid,
      checks.price_valid.valid,
      checks.locks_adequate.valid,
      checks.wallet_connected.valid
    ].filter(v => v).length;

    checks.overall_score = (validChecks / 5) * 100;
    checks.passed = checks.errors.length === 0 && checks.overall_score >= 80;

    return checks;
  }

  checkSupply(token) {
    const supply = token.tokenomics?.total_supply;
    
    if (!supply || supply === 0) {
      return {
        valid: false,
        error: 'Supply total não configurado ou zero',
        critical: true
      };
    }

    if (supply > 1e30) {
      return {
        valid: false,
        error: 'Supply excessivamente alto (risco de overflow)',
        critical: true
      };
    }

    if (supply < 1000) {
      return {
        valid: false,
        error: 'Supply muito baixo (pode causar problemas de divisibilidade)',
        critical: true
      };
    }

    return { valid: true, supply };
  }

  checkOwner(token) {
    const owner = token.technical?.owner || token.deployment?.owner;
    
    if (!owner || owner === '0x0000000000000000000000000000000000000000') {
      return {
        valid: false,
        error: 'Owner não configurado ou é zero address',
        critical: true
      };
    }

    // Validar formato de endereço Ethereum
    if (!/^0x[a-fA-F0-9]{40}$/.test(owner)) {
      return {
        valid: false,
        error: 'Formato de endereço inválido',
        critical: true
      };
    }

    return { valid: true, owner };
  }

  checkPrice(token) {
    const price = token.deployment?.price || token.tokenomics?.mint_price;
    
    if (price === 0) {
      return {
        valid: false,
        warning: 'Preço zero pode indicar problema de configuração',
        critical: false
      };
    }

    if (!price) {
      return {
        valid: true,
        warning: 'Preço não configurado (pode ser intencional para token gratuito)',
        critical: false
      };
    }

    return { valid: true, price };
  }

  checkLocks(token) {
    const locks = {
      mintable: token.technical?.mintable || false,
      burnable: token.technical?.burnable || false,
      pausable: token.technical?.pausable || false,
      governance: token.technical?.governance || false
    };

    const warnings = [];

    // Se mintable sem governance, pode ser risco
    if (locks.mintable && !locks.governance) {
      warnings.push('Token mintable sem governança pode permitir mint infinito');
    }

    // Se não tem pausable, não há proteção de emergência
    if (!locks.pausable) {
      warnings.push('Token sem pausable não tem proteção de emergência');
    }

    return {
      valid: warnings.length === 0,
      locks,
      warning: warnings.join('; ')
    };
  }

  checkWallet(token) {
    // Em produção, isso verificaria conexão real
    // Por enquanto, assumimos que está conectado se owner está configurado
    const owner = token.technical?.owner || token.deployment?.owner;
    
    return {
      valid: !!owner && owner !== '0x0000000000000000000000000000000000000000',
      note: 'Verificar conexão real da wallet antes do deploy'
    };
  }

  /**
   * B. Validação de Tokenômica
   */
  validateTokenomics(token) {
    const validation = {
      model_makes_sense: this.validateModel(token),
      infinite_mint_risk: this.checkInfiniteMintRisk(token),
      exploit_risk: this.checkExploitRisk(token),
      overflow_risk: this.checkOverflowRisk(token),
      distribution_valid: this.validateDistribution(token),
      overall_score: 0,
      passed: false,
      warnings: [],
      errors: []
    };

    // Coletar warnings e errors
    if (!validation.model_makes_sense.valid) {
      validation.errors.push(validation.model_makes_sense.error);
    }

    if (validation.infinite_mint_risk.risk) {
      validation.warnings.push(validation.infinite_mint_risk.warning);
    }

    if (validation.exploit_risk.risk) {
      validation.errors.push(validation.exploit_risk.error);
    }

    if (validation.overflow_risk.risk) {
      validation.errors.push(validation.overflow_risk.error);
    }

    if (!validation.distribution_valid.valid) {
      validation.errors.push(validation.distribution_valid.error);
    }

    // Calcular score
    const checks = [
      validation.model_makes_sense.valid,
      !validation.infinite_mint_risk.risk,
      !validation.exploit_risk.risk,
      !validation.overflow_risk.risk,
      validation.distribution_valid.valid
    ];

    validation.overall_score = (checks.filter(v => v).length / checks.length) * 100;
    validation.passed = validation.errors.length === 0 && validation.overall_score >= 70;

    return validation;
  }

  validateModel(token) {
    const supply = token.tokenomics?.total_supply || 0;
    const dist = token.tokenomics?.distribution || {};
    const totalDist = Object.values(dist).reduce((sum, val) => sum + (val || 0), 0);

    if (totalDist > supply) {
      return {
        valid: false,
        error: 'Distribuição excede supply total'
      };
    }

    if (totalDist < supply * 0.5) {
      return {
        valid: false,
        error: 'Menos de 50% do supply está distribuído (pode indicar problema)'
      };
    }

    // Verificar concentração
    const teamPercent = (dist.team || 0) / supply * 100;
    if (teamPercent > 60) {
      return {
        valid: false,
        error: 'Concentração excessiva na equipe (>60%)'
      };
    }

    return { valid: true };
  }

  checkInfiniteMintRisk(token) {
    const mintable = token.technical?.mintable || false;
    const governance = token.technical?.governance || false;
    const maxSupply = token.tokenomics?.max_supply;

    if (mintable && !governance && !maxSupply) {
      return {
        risk: true,
        warning: 'ALTO RISCO: Token mintable sem governança e sem max supply pode permitir mint infinito',
        severity: 'high'
      };
    }

    if (mintable && !governance && maxSupply) {
      return {
        risk: false,
        warning: 'Token mintable tem max supply definido, mas sem governança ainda é risco médio',
        severity: 'medium'
      };
    }

    return { risk: false };
  }

  checkExploitRisk(token) {
    const risks = [];

    // Verificar se há funções públicas perigosas
    if (token.technical?.mintable && !token.technical?.governance) {
      risks.push('Mint sem controle de governança');
    }

    // Verificar vesting
    const vesting = token.tokenomics?.vesting;
    if (!vesting || !vesting.team_vesting) {
      risks.push('Sem vesting configurado - tokens podem ser vendidos imediatamente');
    }

    // Verificar se há mecanismo de proteção
    if (!token.technical?.pausable) {
      risks.push('Sem pausable - não há como parar em caso de exploit');
    }

    if (risks.length > 0) {
      return {
        risk: true,
        error: `Riscos de exploit identificados: ${risks.join('; ')}`,
        risks
      };
    }

    return { risk: false };
  }

  checkOverflowRisk(token) {
    const supply = token.tokenomics?.total_supply || 0;
    const decimals = token.tokenomics?.decimals || 18;

    // Verificar se supply * 10^decimals pode causar overflow
    const maxSafeSupply = BigInt(2 ** 256 - 1) / BigInt(10 ** decimals);

    if (BigInt(supply) > maxSafeSupply) {
      return {
        risk: true,
        error: `Supply pode causar overflow (max seguro: ${maxSafeSupply.toString()})`
      };
    }

    return { risk: false };
  }

  validateDistribution(token) {
    const dist = token.tokenomics?.distribution || {};
    const supply = token.tokenomics?.total_supply || 0;

    if (supply === 0) {
      return { valid: false, error: 'Supply zero' };
    }

    const totalDist = Object.values(dist).reduce((sum, val) => sum + (val || 0), 0);

    if (totalDist > supply) {
      return { valid: false, error: 'Distribuição excede supply' };
    }

    // Verificar se distribuição faz sentido
    const percentages = {};
    Object.keys(dist).forEach(key => {
      percentages[key] = ((dist[key] || 0) / supply * 100).toFixed(2);
    });

    return {
      valid: true,
      total_distributed: totalDist,
      percentages,
      undistributed: supply - totalDist,
      undistributed_percent: (((supply - totalDist) / supply) * 100).toFixed(2)
    };
  }

  /**
   * C. Análise de Rituais e Comportamento
   */
  analyzeRituals(token) {
    return {
      mint_once_per_wallet: this.analyzeMintOnce(token),
      initial_supply_impact: this.analyzeInitialSupply(token),
      fixed_price_barrier: this.analyzeFixedPrice(token),
      vesting_necessity: this.analyzeVestingNecessity(token),
      overall_assessment: '',
      recommendations: []
    };
  }

  analyzeMintOnce(token) {
    const mintOnce = token.technical?.mint_once_per_wallet || false;
    const mintable = token.technical?.mintable || false;

    if (mintable && !mintOnce) {
      return {
        makes_sense: false,
        analysis: 'Token mintable sem limite de 1x por wallet pode permitir acúmulo excessivo',
        recommendation: 'Considerar implementar mint 1x por wallet ou sistema de whitelist'
      };
    }

    if (!mintable && mintOnce) {
      return {
        makes_sense: false,
        analysis: 'Token não mintable mas tem restrição de mint 1x (contraditório)',
        recommendation: 'Remover restrição ou tornar token mintable'
      };
    }

    return {
      makes_sense: true,
      analysis: mintOnce ? 'Mint 1x por wallet implementado' : 'Sem restrição de mint por wallet'
    };
  }

  analyzeInitialSupply(token) {
    const supply = token.tokenomics?.total_supply || 0;
    const dist = token.tokenomics?.distribution || {};
    const teamSupply = dist.team || 0;
    const teamPercent = (teamSupply / supply) * 100;

    if (teamPercent > 50) {
      return {
        risk: 'high',
        analysis: `Supply inicial muito concentrado na equipe (${teamPercent.toFixed(2)}%)`,
        impact: 'Pode explodir economia se equipe vender tudo de uma vez',
        recommendation: 'Reduzir alocação da equipe ou implementar vesting rigoroso'
      };
    }

    if (supply > 1e9) {
      return {
        risk: 'medium',
        analysis: 'Supply inicial muito alto pode diluir valor',
        impact: 'Pode dificultar price discovery',
        recommendation: 'Considerar supply menor ou mecanismo de queima'
      };
    }

    return {
      risk: 'low',
      analysis: 'Supply inicial parece adequado',
      impact: 'Baixo risco de impacto negativo na economia'
    };
  }

  analyzeFixedPrice(token) {
    const price = token.deployment?.price || token.tokenomics?.mint_price || 0;
    const fixedPrice = token.deployment?.fixed_price !== false; // Default true

    if (fixedPrice && price === 0) {
      return {
        creates_barrier: false,
        analysis: 'Preço fixo zero (gratuito) não cria barreira',
        recommendation: 'Considerar se token gratuito é intencional'
      };
    }

    if (fixedPrice && price > 0.1) {
      return {
        creates_barrier: true,
        analysis: `Preço fixo alto (${price} ETH) pode criar barreira de entrada`,
        impact: 'Pode limitar adoção inicial',
        recommendation: 'Considerar preço mais baixo ou modelo de preço dinâmico'
      };
    }

    return {
      creates_barrier: false,
      analysis: 'Preço fixo adequado ou não aplicável'
    };
  }

  analyzeVestingNecessity(token) {
    const dist = token.tokenomics?.distribution || {};
    const teamSupply = dist.team || 0;
    const investorSupply = dist.investors || 0;
    const vesting = token.tokenomics?.vesting || {};

    const needsVesting = teamSupply > 0 || investorSupply > 0;
    const hasVesting = !!vesting.team_vesting || !!vesting.investor_vesting;

    if (needsVesting && !hasVesting) {
      return {
        necessary: true,
        hasVesting: false,
        analysis: 'Token tem alocação para equipe/investidores mas sem vesting configurado',
        risk: 'ALTO: Tokens podem ser vendidos imediatamente, causando dump',
        recommendation: 'IMPLEMENTAR VESTING OBRIGATÓRIO antes do deploy'
      };
    }

    if (hasVesting) {
      return {
        necessary: true,
        hasVesting: true,
        analysis: 'Vesting configurado adequadamente',
        risk: 'Baixo'
      };
    }

    return {
      necessary: false,
      hasVesting: false,
      analysis: 'Token não tem alocação que requer vesting'
    };
  }

  /**
   * D. Validação de Narrativa
   */
  validateNarrative(token) {
    return {
      neo_protocol_integration: this.checkNEOProtocolIntegration(token),
      neo_token_integration: this.checkNEOTokenIntegration(token),
      flowoff_narrative: this.checkFlowOFFNarrative(token),
      token_manifesto: this.checkTokenManifesto(token),
      overall_coherence: '',
      score: 0
    };
  }

  _getNarrativeString(token) {
    const m = token.narrative?.manifesto;
    const s = token.narrative?.story || '';
    if (typeof m === 'string') return m || s;
    if (m && typeof m === 'object') {
      const parts = [m.title, m.introduction, m.vision, m.technical_philosophy, m.community].filter(Boolean);
      return parts.join(' ') || s;
    }
    return s;
  }

  checkNEOProtocolIntegration(token) {
    const narrative = this._getNarrativeString(token);
    const hasNEO = narrative.toLowerCase().includes('neo') ||
                   narrative.toLowerCase().includes('nξø') ||
                   token.name.toUpperCase().includes('NEO');

    return {
      integrated: hasNEO,
      analysis: hasNEO 
        ? 'Narrativa integra com NΞØ Protocol'
        : 'Narrativa não menciona NΞØ Protocol explicitamente',
      recommendation: hasNEO 
        ? null
        : 'Considerar integrar narrativa com NΞØ Protocol para consistência'
    };
  }

  checkNEOTokenIntegration(token) {
    const narrative = this._getNarrativeString(token);
    const hasNEOToken = narrative.toLowerCase().includes('neo token');

    return {
      integrated: hasNEOToken,
      analysis: hasNEOToken
        ? 'Menciona NEO Token'
        : 'Não menciona NEO Token explicitamente',
      recommendation: 'Opcional: conectar com NEO Token se relevante'
    };
  }

  checkFlowOFFNarrative(token) {
    const narrative = this._getNarrativeString(token);
    const flowoffKeywords = ['flowoff', 'cultura', 'ritual', 'narrativa', 'engenharia'];
    const hasFlowOFF = flowoffKeywords.some(keyword =>
      narrative.toLowerCase().includes(keyword)
    );

    return {
      integrated: hasFlowOFF,
      analysis: hasFlowOFF
        ? 'Narrativa alinhada com FlowOFF (cultura, rituais, narrativa)'
        : 'Narrativa não menciona elementos FlowOFF',
      recommendation: hasFlowOFF
        ? null
        : 'Considerar integrar elementos culturais e rituais da FlowOFF'
    };
  }

  checkTokenManifesto(token) {
    const manifesto = token.narrative?.manifesto;
    const story = token.narrative?.story;
    const narrativeStr = this._getNarrativeString(token);

    if (!manifesto && !story) {
      return {
        exists: false,
        analysis: 'Manifesto não encontrado',
        recommendation: 'CRÍTICO: Criar manifesto antes do deploy (NEO::token manifest)'
      };
    }

    const length = typeof narrativeStr === 'string' ? narrativeStr.length : 0;
    const isSubstantial = length > 200;

    return {
      exists: true,
      substantial: isSubstantial,
      analysis: isSubstantial
        ? `Manifesto existe e é substancial (${length} caracteres)`
        : `Manifesto existe mas é muito curto (${length} caracteres)`,
      recommendation: isSubstantial
        ? null
        : 'Expandir manifesto para pelo menos 200 caracteres'
    };
  }

  /**
   * E. Simulação de 7 Dias
   */
  simulateSevenDays(token) {
    const baseMetrics = this.calculateBaseMetrics(token);
    
    return {
      day1: this.simulateDay(1, baseMetrics, token),
      day3: this.simulateDay(3, baseMetrics, token),
      day7: this.simulateDay(7, baseMetrics, token),
      summary: this.generateSevenDaySummary(baseMetrics, token),
      adoption_curve: this.calculateAdoptionCurve(token),
      behavior_analysis: this.analyzeBehavior(token)
    };
  }

  calculateBaseMetrics(token) {
    const supply = token.tokenomics?.total_supply || 0;
    const price = token.deployment?.price || token.tokenomics?.mint_price || 0;
    const mintOnce = token.technical?.mint_once_per_wallet || false;
    
    // Estimativas baseadas em padrões de mercado
    const initialAdoptionRate = mintOnce ? 0.15 : 0.05; // 15% se limitado, 5% se livre
    const dailyGrowthRate = 0.08; // 8% ao dia (decaimento exponencial)
    
    return {
      supply,
      price,
      mintOnce,
      initialAdoptionRate,
      dailyGrowthRate
    };
  }

  simulateDay(day, baseMetrics, token) {
    // Modelo simplificado de simulação
    const adoptionRate = baseMetrics.initialAdoptionRate * Math.pow(1 - baseMetrics.dailyGrowthRate, day - 1);
    const estimatedHolders = Math.floor(baseMetrics.supply * adoptionRate / (baseMetrics.price || 1));
    const estimatedVolume = estimatedHolders * (baseMetrics.price || 0.001) * 0.1; // 10% trade diário
    
    // Calcular risco baseado em métricas do token
    const riskScore = this.calculateRiskScore(token, day);
    
    return {
      day,
      estimated_holders: Math.max(1, estimatedHolders),
      estimated_volume_eth: estimatedVolume.toFixed(4),
      estimated_volume_usd: (estimatedVolume * 2000).toFixed(2), // Assumindo ETH ~$2000
      risk_score: riskScore,
      risk_level: this.getRiskLevel(riskScore),
      adoption_rate: (adoptionRate * 100).toFixed(2) + '%'
    };
  }

  calculateRiskScore(token, day) {
    let score = 50; // Base

    // Ajustar baseado em segurança
    const security = this.checkSecurity(token);
    score += (security.overall_score - 50) * 0.3;

    // Ajustar baseado em tokenômica
    const tokenomics = this.validateTokenomics(token);
    score += (tokenomics.overall_score - 50) * 0.3;

    // Ajustar baseado em vesting
    const vesting = this.analyzeVestingNecessity(token);
    if (!vesting.hasVesting && vesting.necessary) {
      score -= 20; // Penalidade alta
    }

    // Ajustar baseado em dia (risco diminui com tempo se tudo está ok)
    if (day > 3 && score > 70) {
      score += 5;
    }

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  getRiskLevel(score) {
    if (score >= 80) return 'low';
    if (score >= 60) return 'medium';
    if (score >= 40) return 'high';
    return 'critical';
  }

  generateSevenDaySummary(baseMetrics, token) {
    const day7 = this.simulateDay(7, baseMetrics, token);
    
    return {
      projected_holders: day7.estimated_holders,
      projected_volume_7d_eth: (parseFloat(day7.estimated_volume_eth) * 7).toFixed(4),
      projected_volume_7d_usd: (parseFloat(day7.estimated_volume_usd) * 7).toFixed(2),
      average_risk_score: day7.risk_score,
      risk_level: day7.risk_level,
      adoption_trend: 'growing', // Simplificado
      recommendation: this.getSevenDayRecommendation(day7.risk_score)
    };
  }

  calculateAdoptionCurve(token) {
    const baseMetrics = this.calculateBaseMetrics(token);
    
    return {
      type: baseMetrics.mintOnce ? 'limited_growth' : 'exponential_decay',
      peak_day: baseMetrics.mintOnce ? 3 : 1,
      stabilization_day: 7,
      analysis: baseMetrics.mintOnce
        ? 'Crescimento limitado por mint 1x, estabilização mais rápida'
        : 'Crescimento inicial rápido com decaimento exponencial'
    };
  }

  analyzeBehavior(token) {
    const behaviors = [];

    if (token.technical?.mint_once_per_wallet) {
      behaviors.push({
        pattern: 'Mint 1x por wallet',
        impact: 'Distribuição mais equitativa, menos whale dominance',
        risk: 'low'
      });
    }

    if (token.tokenomics?.vesting) {
      behaviors.push({
        pattern: 'Vesting configurado',
        impact: 'Reduz risco de dump inicial',
        risk: 'low'
      });
    } else {
      behaviors.push({
        pattern: 'Sem vesting',
        impact: 'ALTO RISCO de dump se equipe/investidores venderem',
        risk: 'high'
      });
    }

    const price = token.deployment?.price || 0;
    if (price > 0.05) {
      behaviors.push({
        pattern: 'Preço fixo alto',
        impact: 'Pode limitar adoção inicial, mas filtra especuladores',
        risk: 'medium'
      });
    }

    return behaviors;
  }

  getSevenDayRecommendation(riskScore) {
    if (riskScore >= 80) {
      return 'Token pronto para deploy. Risco baixo.';
    }
    if (riskScore >= 60) {
      return 'Token pode ser deployado com monitoramento. Risco médio.';
    }
    if (riskScore >= 40) {
      return 'REVISAR antes do deploy. Risco alto identificado.';
    }
    return 'NÃO DEPLOYAR. Risco crítico. Corrigir problemas antes.';
  }

  /**
   * Veredito Final
   */
  generateVerdict(token) {
    const security = this.checkSecurity(token);
    const tokenomics = this.validateTokenomics(token);
    const rituals = this.analyzeRituals(token);
    const narrative = this.validateNarrative(token);
    const day7 = this.simulateSevenDays(token);

    const vestingNecessity = rituals.vesting_necessity;
    const vestingConfigured = !!token.tokenomics?.vesting;
    const vestingOk = !vestingNecessity.necessary || (vestingNecessity.necessary && vestingConfigured);
    
    const canDeploy = 
      security.passed &&
      tokenomics.passed &&
      vestingOk &&
      narrative.token_manifesto.exists &&
      day7.summary.risk_level !== 'critical';

    const overallScore = (
      security.overall_score * 0.3 +
      tokenomics.overall_score * 0.3 +
      (rituals.vesting_necessity.necessary === (!!token.tokenomics?.vesting) ? 100 : 0) * 0.2 +
      (narrative.token_manifesto.exists ? 100 : 0) * 0.1 +
      (100 - day7.summary.average_risk_score) * 0.1
    );

    return {
      can_deploy: canDeploy,
      overall_score: Math.round(overallScore),
      status: canDeploy ? 'APPROVED' : 'NEEDS_REVIEW',
      critical_issues: this.getCriticalIssues(token, security, tokenomics, rituals),
      deployment_ready: canDeploy && overallScore >= 75
    };
  }

  getCriticalIssues(token, security, tokenomics, rituals) {
    const issues = [];

    if (!security.passed) {
      issues.push(...security.errors);
    }

    if (!tokenomics.passed) {
      issues.push(...tokenomics.errors);
    }

    if (rituals.vesting_necessity.necessary && !token.tokenomics?.vesting) {
      issues.push('VESTING OBRIGATÓRIO não configurado');
    }

    if (!token.narrative?.manifesto && !token.narrative?.story) {
      issues.push('MANIFESTO não encontrado');
    }

    return issues;
  }

  getCriticalRecommendations(token) {
    const recommendations = [];
    const verdict = this.generateVerdict(token);

    if (!verdict.can_deploy) {
      recommendations.push('⚠️ CORRIGIR problemas críticos antes do deploy');
    }

    if (!token.tokenomics?.vesting && this.analyzeVestingNecessity(token).necessary) {
      recommendations.push('🔒 IMPLEMENTAR VESTING antes do deploy');
    }

    if (!token.narrative?.manifesto) {
      recommendations.push('📝 CRIAR MANIFESTO (NEO::token manifest)');
    }

    const security = this.checkSecurity(token);
    if (security.overall_score < 80) {
      recommendations.push('🔐 REVISAR configurações de segurança');
    }

    const tokenomics = this.validateTokenomics(token);
    if (tokenomics.overall_score < 70) {
      recommendations.push('💰 REVISAR tokenômica');
    }

    if (recommendations.length === 0) {
      recommendations.push('✅ Token parece pronto para deploy');
    }

    return recommendations;
  }

  // Métodos auxiliares

  loadToken(tokenName) {
    const tokenPath = path.join(this.tokensPath, `${tokenName.toLowerCase()}.json`);
    if (fs.existsSync(tokenPath)) {
      return JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
    }
    return null;
  }

  saveSimulation(tokenName, simulation) {
    const simPath = path.join(this.tokensPath, `${tokenName.toLowerCase()}_simulation.json`);
    fs.writeFileSync(simPath, JSON.stringify(simulation, null, 2));
  }
}

module.exports = EcosystemSimulator;

