/**
 * NEO Marketing Engine
 * Gera conteúdo de marketing em tempo real
 */

const fs = require('fs');
const path = require('path');

class MarketingEngine {
  constructor() {
    this.statePath = path.join(__dirname, '../state.json');
    this.marketingPath = path.join(__dirname, '../marketing');
    this.ensureMarketingDir();
  }

  /**
   * Gera update de marketing
   */
  generateUpdate(message) {
    const state = this.loadState();
    const timestamp = new Date().toISOString();
    
    const update = {
      timestamp,
      message,
      content: {
        x: this.formatForX(message, state),
        linkedin: this.formatForLinkedIn(message, state),
        flowoff: this.formatForFlowOFF(message, state),
        website: this.formatForWebsite(message, state),
        technical: this.generateTechnicalUpdate(message, state),
        journalistic: this.generateJournalisticUpdate(message, state)
      }
    };

    this.saveUpdate(update);
    this.updateState(timestamp, message);

    return update;
  }

  /**
   * Gera headline
   */
  generateHeadline(type = 'general') {
    const state = this.loadState();
    const headlines = {
      general: [
        "A fábrica que transforma intenção em protocolo.",
        "Uma fábrica que opera no presente, mas foi construída para sobreviver ao colapso de plataformas.",
        "NΞØ SMART FACTORY — Onde ideias cruas se tornam ecossistemas completos."
      ],
      technical: [
        "NΞØ SMART FACTORY v0.5.1 — Sistema modular de criação de protocolos descentralizados.",
        "Deploy de tokens, vestings e recompensas em minutos, não semanas."
      ],
      narrative: [
        "No subterrâneo invisível da economia digital, surge uma arquitetura silenciosa.",
        "Mais que uma ferramenta, é um sistema vivo de criação."
      ]
    };

    const selected = headlines[type] || headlines.general;
    return selected[Math.floor(Math.random() * selected.length)];
  }

  /**
   * Gera story completa
   */
  generateStory(tokenName = null) {
    const state = this.loadState();
    
    if (tokenName) {
      return this.generateTokenStory(tokenName, state);
    }

    return {
      title: "NΞØ SMART FACTORY — A Fábrica Descentralizada de Protocolos do Futuro",
      introduction: state.marketing.narrative,
      body: this.generateStoryBody(state),
      conclusion: this.generateStoryConclusion(state)
    };
  }

  /**
   * Gera log de marketing
   */
  generateLog(limit = 10) {
    const logPath = path.join(this.marketingPath, 'log.json');
    
    if (!fs.existsSync(logPath)) {
      return { updates: [], message: 'Nenhum update registrado ainda' };
    }

    const log = JSON.parse(fs.readFileSync(logPath, 'utf8'));
    return {
      total: log.updates.length,
      recent: log.updates.slice(-limit).reverse()
    };
  }

  /**
   * Gera post para plataforma específica
   */
  generatePost(platform, tipo, context = {}) {
    const state = this.loadState();
    
    const generators = {
      x: {
        technical: () => this.generateXTechnical(state, context),
        announcement: () => this.generateXAnnouncement(state, context),
        narrative: () => this.generateXNarrative(state, context),
        update: () => this.generateXUpdate(state, context)
      },
      linkedin: {
        technical: () => this.generateLinkedInTechnical(state, context),
        announcement: () => this.generateLinkedInAnnouncement(state, context),
        narrative: () => this.generateLinkedInNarrative(state, context),
        update: () => this.generateLinkedInUpdate(state, context)
      },
      flowoff: {
        technical: () => this.generateFlowOFFTechnical(state, context),
        announcement: () => this.generateFlowOFFAnnouncement(state, context),
        narrative: () => this.generateFlowOFFNarrative(state, context),
        update: () => this.generateFlowOFFUpdate(state, context)
      },
      website: {
        technical: () => this.generateWebsiteTechnical(state, context),
        announcement: () => this.generateWebsiteAnnouncement(state, context),
        narrative: () => this.generateWebsiteNarrative(state, context),
        update: () => this.generateWebsiteUpdate(state, context)
      }
    };

    const generator = generators[platform]?.[tipo];
    if (!generator) {
      return { error: `Plataforma ${platform} ou tipo ${tipo} não suportado` };
    }

    return generator();
  }

  // Métodos auxiliares privados

  ensureMarketingDir() {
    if (!fs.existsSync(this.marketingPath)) {
      fs.mkdirSync(this.marketingPath, { recursive: true });
    }
  }

  loadState() {
    return JSON.parse(fs.readFileSync(this.statePath, 'utf8'));
  }

  formatForX(message, state) {
    const version = state.version;
    const maxLength = 280;
    
    let post = `🚀 NΞØ SMART FACTORY v${version}\n\n${message}`;
    
    if (post.length > maxLength) {
      post = post.substring(0, maxLength - 3) + '...';
    }
    
    return {
      text: post,
      hashtags: ['#NEOSmartFactory', '#DeFi', '#Blockchain', '#Web3'],
      length: post.length
    };
  }

  formatForLinkedIn(message, state) {
    const version = state.version;
    
    return {
      title: `NΞØ SMART FACTORY v${version} — Update`,
      body: `${message}\n\n${state.marketing.narrative}\n\n#NEOSmartFactory #DeFi #Blockchain #Web3 #Innovation`,
      length: message.length + state.marketing.narrative.length
    };
  }

  formatForFlowOFF(message, state) {
    return {
      title: `NΞØ SMART FACTORY — Update`,
      body: `${message}\n\n${this.generateFlowOFFStyle(message, state)}`,
      tags: ['neo-smart-factory', 'defi', 'blockchain', 'protocol-factory']
    };
  }

  formatForWebsite(message, state) {
    return {
      title: `Update — ${new Date().toLocaleDateString()}`,
      content: `<p>${message}</p><p>${state.marketing.narrative}</p>`,
      meta: {
        description: message.substring(0, 160),
        keywords: 'NEO Smart Factory, DeFi, Blockchain, Protocol Factory'
      }
    };
  }

  generateTechnicalUpdate(message, state) {
    return {
      title: `Technical Update — NΞØ SMART FACTORY v${state.version}`,
      content: message,
      details: {
        version: state.version,
        codename: state.codename,
        status: state.status
      }
    };
  }

  generateJournalisticUpdate(message, state) {
    return {
      headline: `NΞØ SMART FACTORY Anuncia ${message}`,
      lead: `${message}. A fábrica descentralizada de protocolos continua expandindo suas capacidades.`,
      body: `${state.marketing.narrative} A NΞØ SMART FACTORY permite que desenvolvedores criem protocolos completos em minutos, incluindo tokens, sistemas de vesting e recompensas.`,
      quote: "Uma fábrica que opera no presente, mas foi construída para sobreviver ao colapso de plataformas."
    };
  }

  generateStoryBody(state) {
    return `A NΞØ SMART FACTORY é mais que uma ferramenta — é um sistema vivo de criação. Ela permite transformar ideias cruas em modelos de receita, tokens funcionais, contratos auditáveis, dashboards, dApps, jogos, recompensas, badges, vestings e rituais de comunidade.

O que antes levava semanas de esforço manual, agora é forjado como se fosse um ato de respiração: um clique, um token, um ecossistema.

A fábrica opera através de uma arquitetura modular onde cada componente pode ser criado independentemente ou como parte de um protocolo completo.`;
  }

  generateStoryConclusion(state) {
    return `A NΞØ SMART FACTORY não quer holofote. Quer eficiência. Quer autonomia. E quer ativar uma geração de criadores que desejam exatamente isso.

Versão atual: ${state.version} — ${state.codename}`;
  }

  generateTokenStory(tokenName, state) {
    return {
      title: `${tokenName} — Criado pela NΞØ SMART FACTORY`,
      introduction: `O token ${tokenName} foi forjado através da NΞØ SMART FACTORY, demonstrando a capacidade da fábrica de criar protocolos completos em minutos.`,
      body: `Utilizando a arquitetura modular da NΞØ SMART FACTORY, ${tokenName} foi criado com tokenômica customizada, sistema de vesting programável e infraestrutura de recompensas integrada.`,
      conclusion: `${tokenName} representa mais um exemplo de como a NΞØ SMART FACTORY transforma intenção em protocolo.`
    };
  }

  generateFlowOFFStyle(message, state) {
    return `No estilo FlowOFF, onde técnica encontra narrativa, a NΞØ SMART FACTORY continua evoluindo. ${message} — mais um passo na construção de uma infraestrutura descentralizada que não depende de Big Tech para validar sua existência.`;
  }

  // Geradores específicos por plataforma e tipo

  generateXTechnical(state, context) {
    return {
      text: `🔧 NΞØ SMART FACTORY v${state.version}\n\n${context.message || 'Atualização técnica em andamento'}\n\n#NEOSmartFactory #DeFi`,
      length: 150
    };
  }

  generateXAnnouncement(state, context) {
    return {
      text: `🚀 ANÚNCIO: NΞØ SMART FACTORY\n\n${context.message || 'Nova funcionalidade disponível'}\n\n#NEOSmartFactory #Web3`,
      length: 200
    };
  }

  generateXNarrative(state, context) {
    return {
      text: `💭 ${state.marketing.headlines[0]}\n\n${state.marketing.narrative.substring(0, 200)}...\n\n#NEOSmartFactory`,
      length: 250
    };
  }

  generateXUpdate(state, context) {
    return this.formatForX(context.message || 'Update da NΞØ SMART FACTORY', state);
  }

  generateLinkedInTechnical(state, context) {
    return {
      title: `Technical Update: NΞØ SMART FACTORY v${state.version}`,
      body: `${context.message || 'Atualização técnica'}\n\n${state.marketing.narrative}\n\n#NEOSmartFactory #Blockchain #DeFi #Innovation`
    };
  }

  generateLinkedInAnnouncement(state, context) {
    return {
      title: `Announcement: NΞØ SMART FACTORY`,
      body: `${context.message || 'Novo anúncio'}\n\nA NΞØ SMART FACTORY continua evoluindo, oferecendo ferramentas para criar protocolos descentralizados completos.\n\n#NEOSmartFactory #Web3 #Innovation`
    };
  }

  generateLinkedInNarrative(state, context) {
    return {
      title: `The Story Behind NΞØ SMART FACTORY`,
      body: `${state.marketing.narrative}\n\n${this.generateStoryBody(state)}\n\n#NEOSmartFactory #Blockchain #Innovation`
    };
  }

  generateLinkedInUpdate(state, context) {
    return this.formatForLinkedIn(context.message || 'Update da NΞØ SMART FACTORY', state);
  }

  generateFlowOFFTechnical(state, context) {
    return this.formatForFlowOFF(context.message || 'Update técnico', state);
  }

  generateFlowOFFAnnouncement(state, context) {
    return {
      title: `NΞØ SMART FACTORY — Anúncio`,
      body: `${context.message || 'Novo anúncio'}\n\n${this.generateFlowOFFStyle(context.message || '', state)}`
    };
  }

  generateFlowOFFNarrative(state, context) {
    return {
      title: `A Narrativa da NΞØ SMART FACTORY`,
      body: `${state.marketing.narrative}\n\n${this.generateStoryBody(state)}`
    };
  }

  generateFlowOFFUpdate(state, context) {
    return this.formatForFlowOFF(context.message || 'Update', state);
  }

  generateWebsiteTechnical(state, context) {
    return this.formatForWebsite(context.message || 'Update técnico', state);
  }

  generateWebsiteAnnouncement(state, context) {
    return {
      title: `Announcement — ${new Date().toLocaleDateString()}`,
      content: `<h2>${context.message || 'Novo Anúncio'}</h2><p>${state.marketing.narrative}</p>`
    };
  }

  generateWebsiteNarrative(state, context) {
    const story = this.generateStory();
    return {
      title: story.title,
      content: `<h1>${story.title}</h1><p>${story.introduction}</p><p>${story.body}</p><p>${story.conclusion}</p>`
    };
  }

  generateWebsiteUpdate(state, context) {
    return this.formatForWebsite(context.message || 'Update', state);
  }

  saveUpdate(update) {
    const logPath = path.join(this.marketingPath, 'log.json');
    
    let log = { updates: [] };
    if (fs.existsSync(logPath)) {
      log = JSON.parse(fs.readFileSync(logPath, 'utf8'));
    }
    
    log.updates.push(update);
    fs.writeFileSync(logPath, JSON.stringify(log, null, 2));
  }

  updateState(timestamp, message) {
    const state = this.loadState();
    state.marketing.last_update = timestamp;
    
    if (!state.marketing.headlines) {
      state.marketing.headlines = [];
    }
    
    fs.writeFileSync(this.statePath, JSON.stringify(state, null, 2));
  }
}

module.exports = MarketingEngine;

