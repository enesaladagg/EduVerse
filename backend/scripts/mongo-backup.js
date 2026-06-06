#!/usr/bin/env node
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('MONGO_URI is missing. Define it in backend/.env before backup.');
  process.exit(1);
}

const outArg = process.argv.find((arg) => arg.startsWith('--out='));
const backupRoot = outArg
  ? path.resolve(outArg.split('=')[1])
  : path.join(__dirname, '..', 'backups');

const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const outDir = path.join(backupRoot, `mongo-backup-${stamp}`);

fs.mkdirSync(outDir, { recursive: true });

const args = [`--uri=${mongoUri}`, `--out=${outDir}`, '--gzip'];
console.log(`Starting MongoDB backup: ${outDir}`);

const child = spawn('mongodump', args, {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

child.on('error', (error) => {
  console.error('Failed to start mongodump. Install MongoDB Database Tools.', error.message);
  process.exit(1);
});

child.on('close', (code) => {
  if (code !== 0) {
    console.error(`mongodump exited with code ${code}`);
    process.exit(code);
  }

  fs.writeFileSync(
    path.join(outDir, 'backup-meta.json'),
    JSON.stringify(
      {
        createdAt: new Date().toISOString(),
        tool: 'mongodump',
        gzip: true,
      },
      null,
      2
    )
  );

  console.log(`MongoDB backup completed: ${outDir}`);
});
