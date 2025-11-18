#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const version = '0.5.1';
const codename = 'IGNIÇÃO';

const roadmap = [
  { version: 'v0.6.0', name: 'ORÁCULO', date: 'Fev 2026', status: '🔜' },
  { version: 'v0.7.0', name: 'CULT', date: 'Mar 2026', status: '🔜' },
  { version: 'v0.8.0', name: 'KERNEL', date: 'Abr 2026', status: '🔜' },
  { version: 'v1.0.0', name: 'IGNIÇÃO COMPLETA', date: 'Mai 2026', status: '🔜' }
];

console.log(`🧠 NΞØ SMART FACTORY`);
console.log(`Version: v${version} — ${codename}`);
console.log(`Status: ALPHA (em chamas 🔥)\n`);

console.log('📍 Roadmap:');
roadmap.forEach(r => {
  console.log(`${r.status} ${r.version} — ${r.name} (${r.date})`);
});
