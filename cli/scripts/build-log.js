/**
 * NEO Build Log
 * Acompanha progresso da construção da SMART FACTORY
 */

const fs = require('fs');
const path = require('path');

class BuildLog {
  constructor() {
    this.statePath = path.join(__dirname, '../state.json');
  }

  /**
   * Retorna status completo do projeto
   */
  getStatus() {
    const state = this.loadState();
    
    return {
      version: `${state.version} — ${state.codename}`,
      status: state.status,
      smart: this.getSmartStatus(state),
      tokens: this.getTokensStatus(state),
      progress: this.calculateProgress(state),
      completed: this.getCompletedItems(state),
      pending: this.getPendingItems(state),
      recommendations: state.next_actions || [],
      risks: state.risks || [],
      next_action: this.getNextAction(state),
      marketing: {
        headline: this.getMarketingHeadline(state),
        narrative: state.marketing.narrative,
        suggestion: this.generateMarketingSuggestion(state)
      },
      branding: state.branding
    };
  }

  /**
   * Retorna apenas progresso
   */
  getProgress() {
    const state = this.loadState();
    return {
      overall: this.calculateProgress(state),
      breakdown: this.getProgressBreakdown(state),
      timeline: this.getTimeline(state)
    };
  }

  /**
   * Retorna versão atual
   */
  getVersion() {
    const state = this.loadState();
    return {
      version: state.version,
      codename: state.codename,
      status: state.status,
      released_at: state.smart.core.completed_at
    };
  }

  /**
   * Retorna próximas ações
   */
  getNextActions() {
    const state = this.loadState();
    return {
      immediate: this.getImmediateActions(state),
      short_term: this.getShortTermActions(state),
      recommendations: state.next_actions || []
    };
  }

  /**
   * Retorna riscos identificados
   */
  getRisks() {
    const state = this.loadState();
    return {
      risks: state.risks || [],
      by_level: this.groupRisksByLevel(state.risks || []),
      mitigation: this.getMitigationStrategies(state.risks || [])
    };
  }

  // Métodos auxiliares privados

  loadState() {
    return JSON.parse(fs.readFileSync(this.statePath, 'utf8'));
  }

  getSmartStatus(state) {
    const smart = state.smart || {};
    const components = Object.keys(smart);
    
    const status = {
      completed: components.filter(c => smart[c].status === 'completed').length,
      in_progress: components.filter(c => smart[c].status === 'in_progress').length,
      pending: components.filter(c => smart[c].status === 'pending').length,
      total: components.length,
      breakdown: {}
    };

    components.forEach(component => {
      status.breakdown[component] = {
        status: smart[component].status,
        version: smart[component].version,
        notes: smart[component].notes
      };
    });

    return status;
  }

  getTokensStatus(state) {
    return {
      pending: state.tokens.pending.length,
      deployed: state.tokens.deployed.length,
      total: state.tokens.pending.length + state.tokens.deployed.length,
      pending_list: state.tokens.pending.map(t => ({
        name: t.name,
        status: t.status
      }))
    };
  }

  calculateProgress(state) {
    const smart = state.smart || {};
    const components = Object.keys(smart);
    
    if (components.length === 0) return 0;

    const completed = components.filter(c => smart[c].status === 'completed').length;
    const inProgress = components.filter(c => smart[c].status === 'in_progress').length;
    
    // Completed = 100%, In Progress = 50%, Pending = 0%
    const progress = ((completed * 100) + (inProgress * 50)) / components.length;
    
    return Math.round(progress);
  }

  getProgressBreakdown(state) {
    const smart = state.smart || {};
    const breakdown = {};
    
    Object.keys(smart).forEach(component => {
      const comp = smart[component];
      let progress = 0;
      
      if (comp.status === 'completed') progress = 100;
      else if (comp.status === 'in_progress') progress = 50;
      else progress = 0;
      
      breakdown[component] = {
        progress,
        status: comp.status,
        notes: comp.notes
      };
    });
    
    return breakdown;
  }

  getCompletedItems(state) {
    const smart = state.smart || {};
    const completed = [];
    
    Object.keys(smart).forEach(component => {
      if (smart[component].status === 'completed') {
        completed.push({
          component,
          version: smart[component].version,
          completed_at: smart[component].completed_at,
          notes: smart[component].notes
        });
      }
    });
    
    return completed;
  }

  getPendingItems(state) {
    const smart = state.smart || {};
    const pending = [];
    
    Object.keys(smart).forEach(component => {
      if (smart[component].status === 'pending') {
        pending.push({
          component,
          notes: smart[component].notes
        });
      }
    });
    
    return pending;
  }

  getNextAction(state) {
    const pending = this.getPendingItems(state);
    if (pending.length > 0) {
      return {
        component: pending[0].component,
        description: pending[0].notes,
        priority: 'high'
      };
    }
    
    return {
      component: 'testing',
      description: 'Expandir cobertura de testes',
      priority: 'medium'
    };
  }

  getMarketingHeadline(state) {
    if (state.marketing && state.marketing.headlines && state.marketing.headlines.length > 0) {
      return state.marketing.headlines[0];
    }
    return "A fábrica que transforma intenção em protocolo.";
  }

  generateMarketingSuggestion(state) {
    const progress = this.calculateProgress(state);
    const version = state.version;
    
    if (progress >= 80) {
      return `"NΞØ SMART FACTORY v${version} — A fábrica está quase completa. Próximo passo: deploy em produção."`;
    } else if (progress >= 50) {
      return `"NΞØ SMART FACTORY v${version} — Construindo o futuro, um contrato de cada vez."`;
    } else {
      return `"NΞØ SMART FACTORY v${version} — Em construção. A fábrica está tomando forma."`;
    }
  }

  getTimeline(state) {
    const smart = state.smart || {};
    const timeline = [];
    
    Object.keys(smart).forEach(component => {
      const comp = smart[component];
      if (comp.completed_at) {
        timeline.push({
          component,
          date: comp.completed_at,
          version: comp.version,
          status: comp.status
        });
      }
    });
    
    return timeline.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  getImmediateActions(state) {
    const pending = this.getPendingItems(state);
    return pending.slice(0, 3).map(p => ({
      action: `Completar ${p.component}`,
      description: p.notes,
      priority: 'high'
    }));
  }

  getShortTermActions(state) {
    return (state.next_actions || []).slice(0, 5).map(action => ({
      action,
      priority: 'medium'
    }));
  }

  groupRisksByLevel(risks) {
    return {
      high: risks.filter(r => r.level === 'high'),
      medium: risks.filter(r => r.level === 'medium'),
      low: risks.filter(r => r.level === 'low')
    };
  }

  getMitigationStrategies(risks) {
    return risks.map(risk => ({
      risk: risk.description,
      mitigation: risk.mitigation || 'A ser definido'
    }));
  }
}

module.exports = BuildLog;

