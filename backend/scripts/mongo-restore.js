#!/usr/bin/env node
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const mongoUri = process.env.MONGO_URI;
const dirArg = process.argv.find((arg) => arg.startsWith('--dir='));

if (!mongoUri) {
  console.error('MONGO_URI is missing. Define it in backend/.env before restore.');
  process.exit(1);
}

if (!dirArg) {
  console.error('Usage: node scripts/mongo-restore.js --dir=./backups/mongo-backup-...');
  process.exit(1);
}

const restoreDir = path.resolve(dirArg.split('=')[1]);
if (!fs.existsSync(restoreDir)) {
  console.error(`Backup directory not found: ${restoreDir}`);
  process.exit(1);
}

console.warn('WARNING: mongorestore will run with --drop and replace existing collections.');
const args = [`--uri=${mongoUri}`, `--dir=${restoreDir}`, '--gzip', '--drop'];

const child = spawn('mongorestore', args, {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

child.on('error', (error) => {
  console.error('Failed to start mongorestore. Install MongoDB Database Tools.', error.message);
  process.exit(1);
});

child.on('close', (code) => {
  if (code !== 0) {
    console.error(`mongorestore exited with code ${code}`);
  }
  process.exit(code || 0);
});
