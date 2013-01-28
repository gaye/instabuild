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

// If we're going to sync with remote, write a password file
// TODO(gareth): This is a hack. Think more on rsync + permissions.
var pwfile = path.resolve(config.publicDir, '.password');
fs.writeFileSync(pwfile, 'password', 'utf-8');
fs.chmodSync(pwfile, '600');

var reporter = new FSReporter();
reporter.listen(config.watchList);

localserver.start(
    config.name, PORT, config.publicDir, reporter, config.update);
LOG.info('Instabuild server listening on port ' + PORT + '...');
