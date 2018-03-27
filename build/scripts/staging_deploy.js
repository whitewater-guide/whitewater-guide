#!/usr/bin/env node

// Run this from developer machine
const deploy = require('./src/deploy');

deploy('staging', 'ww-staging');
