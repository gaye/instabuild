#!/usr/bin/env node

var ConfigParser = require('./lib/configparser')
  , FSReporter = require('./lib/fsreporter')
  , LOG = require('./lib/logger')
  , fs = require('fs')
  , localserver = require('./lib/instaserver')
  , path = require('path');



var PORT = process.env.PORT || 3000;

// Resolve the config file
var filename = null;
try {
  if (!process.argv[2]) {
    throw 'No config file provided';
  }
  filename = path.resolve(process.cwd(), process.argv[2]);
  if (!fs.existsSync(filename)) {
    throw 'No such file ' + filename;
  }
} catch (e) {
  LOG.error('Usage: instabuild <config file>');
  process.exit(1);
}

var parser = new ConfigParser();
var config = parser.parse(filename);
var reporter = new FSReporter();
reporter.listen(config.watchList);

localserver.start(PORT, config.publicDir, reporter);
LOG.info('Instabuild server listening on port ' + PORT + '...');
