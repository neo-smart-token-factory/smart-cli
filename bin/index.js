#!/usr/bin/env node

/**
 * NΞØ SMART FACTORY — Unified CLI v0.5.3
 */

const { Command } = require('commander');
const initCommand = require('../commands/init');
const deployCommand = require('../commands/deploy');
const doctorCommand = require('../commands/doctor');
const NeoInternalOps = require('../ops-handler');

const program = new Command();
const ops = new NeoInternalOps();

program
  .name('nsf')
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

program
  .command('doctor')
  .description('Diagnóstico e auditoria de saúde do protocolo')
  .option('-d, --deep', 'Executar scan profundo (requer rede)', false)
  .option('-c, --contract <address>', 'Endereço do contrato para analisar')
  .option('-o, --output <file>', 'Exportar relatório (md/pdf)')
  .action(doctorCommand);

// Internal Ops & Simulation Commands
program
  .command('simulate <token>')
  .description('Simular ecossistema do token')
  .action(async (token) => {
    const result = await ops.processCommand(`NEO::simulate ${token}`);
    console.log(JSON.stringify(result, null, 2));
  });

program
  .command('status')
  .description('Verificar status do desenvolvimento')
  .action(async () => {
    const result = await ops.processCommand(`NEO::status`);
    console.log(JSON.stringify(result, null, 2));
  });

program
  .command('marketing <action>')
  .description('Gerar updates de marketing (headline, story, post)')
  .argument('[args...]', 'Argumentos adicionais')
  .action(async (action, args) => {
    const result = await ops.processCommand(`NEO::marketing ${action} ${args.join(' ')}`);
    console.log(JSON.stringify(result, null, 2));
  });

program
  .command('token <action> <name>')
  .description('Operações de token (draft, manifest, audit, economics, deploy)')
  .argument('[config]', 'Configuração JSON opcional')
  .action(async (action, name, config) => {
    const result = await ops.processCommand(`NEO::token ${action} ${name} ${config || ''}`);
    console.log(JSON.stringify(result, null, 2));
  });

program.parse();
