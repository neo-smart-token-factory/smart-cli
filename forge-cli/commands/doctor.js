const fs = require('fs');
const path = require('path');
const { Command } = require('commander');

async function doctor() {
    console.log('NΞØ SMART FACTORY — System Diagnostics');
    console.log('---------------------------------------');

    const diagnostics = [
        {
            name: 'Forge Core',
            path: '../../forge-core',
            check: (p) => fs.existsSync(path.resolve(__dirname, p)),
            message: 'Core logic and contracts repository'
        },
        {
            name: 'Internal Ops',
            path: '../../internal-ops',
            check: (p) => fs.existsSync(path.resolve(__dirname, p)),
            message: 'Operations and state management'
        },
        {
            name: 'Smart UI',
            path: '../../../NEO SMART TOKEN/smart-ui',
            check: (p) => fs.existsSync(path.resolve(__dirname, p)),
            message: 'Frontend management dashboard'
        }
    ];

    for (const diag of diagnostics) {
        const ok = diag.check(diag.path);
        console.log(`${ok ? '✅' : '❌'} ${diag.name.padEnd(15)}: ${ok ? 'LINKED' : 'MISSING'}`);
        if (!ok) {
            console.log(`   └─ Hint: ${diag.message}`);
        }
    }

    console.log('---------------------------------------');
    console.log('System scan complete.');
}

module.exports = doctor;
