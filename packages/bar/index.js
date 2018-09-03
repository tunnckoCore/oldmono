'use strict';

const esmLoader = require('esm');
const pkg = require('./package.json');

const esmRequire = esmLoader(module);

module.exports = esmRequire(pkg.module);
