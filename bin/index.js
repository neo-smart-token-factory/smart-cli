#!/usr/bin/env node

/**
 * NΞØ SMART FACTORY — Unified CLI v0.5.3
 */

const { Command } = require('commander');
const initCommand = require('../commands/init');
const deployCommand = require('../commands/deploy');
const NeoInternalOps = require('../ops-handler');

const program = new Command();
const ops = new NeoInternalOps();

program
  .name('nxf')
  .alias('neo-smart-factory')
  .description('NΞØ SMART FACTORY Unified CLI')
  .version('0.5.3');

// Standard Commands
program
  .command('init')
  .description('Inicializar novo token e infraestrutura')
  .action(initCommand);

program
  .command('deploy')
  .description('Executar deploy de contratos')
  .option('-n, --network <network>', 'Network (base/polygon/arbitrum)', 'base')
  .action(deployCommand);

// Internal Ops & Simulation Commands
program
  .command('simulate <token>')
  .description('Simular ecossistema do token')
  .action((token) => {
    const result = ops.processCommand(`NEO::simulate ${token}`);
    console.log(JSON.stringify(result, null, 2));
  });

program
  .command('status')
  .description('Verificar status do desenvolvimento')
  .action(() => {
    const result = ops.processCommand(`NEO::status`);
    console.log(JSON.stringify(result, null, 2));
  });

program
  .command('marketing <action>')
  .description('Gerar updates de marketing (headline, story, post)')
  .argument('[args...]', 'Argumentos adicionais')
  .action((action, args) => {
    const result = ops.processCommand(`NEO::marketing ${action} ${args.join(' ')}`);
    console.log(JSON.stringify(result, null, 2));
  });

program
  .command('token <action> <name>')
  .description('Operações de token (draft, manifest, audit, economics)')
  .argument('[config]', 'Configuração JSON opcional')
  .action((action, name, config) => {
    const result = ops.processCommand(`NEO::token ${action} ${name} ${config || ''}`);
    console.log(JSON.stringify(result, null, 2));
  });

program.parse();
