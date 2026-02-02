#!/usr/bin/env node

/**
 * NΞØ SMART FACTORY — CLI v0.5.1
 */

const { Command } = require('commander');
const initCommand = require('../commands/init');
const deployCommand = require('../commands/deploy');
const doctorCommand = require('../commands/doctor');

const program = new Command();

program
  .name('neo-smart-factory')
  .description('NΞØ SMART FACTORY CLI')
  .version('0.5.3');

program
  .command('init')
  .description('Inicializar novo token')
  .action(initCommand);

program
  .command('deploy')
  .description('Deploy token')
  .option('-n, --network <network>', 'Network (polygon/amoy)', 'polygon')
  .action(deployCommand);

program
  .command('doctor')
  .description('Run ecosystem health diagnostics')
  .action(doctorCommand);

program.parse();

