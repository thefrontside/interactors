#!/usr/bin/env node

const { main, spawn } = require('effection');
const { daemon } = require('@effection/process');
const fs = require('fs');
const fsp = fs.promises;
const { install } = require('./install');

function* dev(task) {
  let command = process.argv.includes('-Y') || process.argv.includes('-yarn') ? 'yarn' : 'npx';

  let appStartScript = JSON.parse(fs.readFileSync('./app-pkg.json')).scripts.start;
  let args = [appStartScript];

  let portIndex;
  if(process.argv.includes('-p')){
    portIndex = process.argv.indexOf('-p');
    args.push(...process.argv.slice(portIndex, portIndex + 2));
  }

  yield fsp.copyFile('app-pkg.json', 'package.json');
  yield install({ stdio: 'inherit' });

  let { stdout, stderr } = yield daemon(`${command} ${args.join(' ')}`);

  yield spawn(stdout.forEach((data) => {
    process.stdout.write(data);
  }));

  yield spawn(stderr.forEach((data) => {
    process.stderr.write(data);
  }));

  yield;
}

main(dev);
