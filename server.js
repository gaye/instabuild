#!/usr/bin/env node

var ConfigParser = require('./lib/configparser')
  , FSReporter = require('./lib/fsreporter')
  , fs = require('fs')
  , localserver = require('./lib/localserver')
  , path = require('path');



var PORT = 3000;

// Resolve the config file
var filename = path.resolve(process.cwd(), process.argv[2]);
if (!fs.existsSync(filename)) {
  console.log('Usage: instabuild <config file>');
  process.exit(1);
}

var parser = new ConfigParser();
var config = parser.parse(filename);
var reporter = new FSReporter();
reporter.listen(config.watchList);

localserver.start(PORT, config.publicDir, reporter);
console.log('Instabuild server serving ' + config.publicDir + ' on ' + PORT + '...');
