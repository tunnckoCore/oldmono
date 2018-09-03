#!/usr/bin/env node

'use strict';

const path = require('path');
const proc = require('process');
const esmLoader = require('esm');
const pkg = require('./package.json');

const esmRequire = esmLoader(module);

const cli = esmRequire(path.join(__dirname, pkg.module)).default;

cli()
  .then(() => proc.exit(0))
  .catch((err) => {
    console.error(err.stack);
    proc.exit(1);
  });
