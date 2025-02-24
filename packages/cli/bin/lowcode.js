#!/usr/bin/env node

const process = require('node:process');
const { cli } = require('../lib');

cli({
  source: process.cwd(),
  packages: {},
  componentFileAffix: '',
  cleanTemp: true,
  temp: '.lowcode',
});
