#!/usr/bin/env node

/**
 * NΞØ SMART FACTORY — CLI v0.5.1
 */

const { Command } = require('commander');
const initCommand = require('../commands/init');
const deployCommand = require('../commands/deploy');

const program = new Command();

program
  .name('neo-forge')
  .description('NΞØ SMART FACTORY CLI')
  .version('0.5.1');

program
  .command('init')
  .description('Inicializar novo token')
  .action(initCommand);

program
  .command('deploy')
  .description('Deploy token')
  .option('-n, --network <network>', 'Network (polygon/amoy)', 'polygon')
  .action(deployCommand);

program.parse();

