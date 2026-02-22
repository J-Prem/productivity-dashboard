const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const proc = spawn('node', [
    path.join('node_modules', '.bin', 'vite'),
    'build'
], {
    cwd: 'e:/Antigravity/productivity-dashboard',
    shell: false,
    env: { ...process.env }
});

const chunks = [];
proc.stdout.on('data', d => chunks.push(d));
proc.stderr.on('data', d => chunks.push(d));

proc.on('close', code => {
    const raw = Buffer.concat(chunks);
    // Strip ANSI escape codes
    const text = raw.toString('utf8').replace(/\x1B\[[0-9;]*[mGKH]/g, '');
    fs.writeFileSync('e:/Antigravity/productivity-dashboard/build_raw.txt', text, 'utf8');
    console.log('Wrote', text.length, 'bytes, exit code:', code);
    // Print only the relevant error portion
    const errIdx = text.indexOf('Could not resolve');
    if (errIdx >= 0) {
        console.log(text.substring(Math.max(0, errIdx - 100), errIdx + 800));
    }
    const rollupIdx = text.indexOf('[vite]: Rollup failed');
    if (rollupIdx >= 0) {
        console.log(text.substring(Math.max(0, rollupIdx - 100), rollupIdx + 800));
    }
});
