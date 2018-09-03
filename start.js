'use strict';

/* eslint-disable global-require, import/no-dynamic-require */

const proc = require('process');
const path = require('path');

const execa = require('execa');

const argv = proc.argv.slice(2);
const cwd = proc.cwd();
const dirname = path.dirname(cwd);
const basename = path.basename(dirname);
const cwdNodeBin = path.resolve(path.join('node_modules', '.bin'));
const upNodeBin = path.resolve(path.join('..', '..', 'node_modules', '.bin'));

proc.env.PATH = `${cwdNodeBin}:${proc.env.PATH}`;

if (basename === 'packages') {
  proc.env.PATH = `${upNodeBin}:${proc.env.PATH}`;

  const opts = { env: proc.env, stdio: 'inherit' };
  const localPkgPath = path.join(cwd, 'package.json');

  const { tasks } = require(localPkgPath);
  const parts = tasks[argv[0]].split(' ');

  execa(parts[0], parts.slice(1), opts)
    .then(() => proc.exit(0))
    .catch(() => proc.exit(1));
}

// const name = argv[0];

// execa('pnpm', ['run', name].filter(Boolean), opts)
//   .then(() => proc.exit(0))
//   .catch(() => proc.exit(1));
