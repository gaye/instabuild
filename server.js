#!/usr/bin/env node

/**
 * @fileoverview contains a script to parse an instabuild.json config file
 * and bring up a local server that will serve an instabuild app on the local
 * machine and sync the app with a remote machine.
 */

var ConfigParser = require('./lib/configparser')
  , FSReporter = require('./lib/fsreporter')
  , LOG = require('./lib/logger')
  , fs = require('fs')
  , instaserver = require('./lib/instaserver')
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

// Parse the config file
var parser = new ConfigParser();
var config = parser.parse(filename);

// If we're going to sync with remote, write a password file
// TODO(gareth): This is a hack. Think more on rsync + permissions.
if (config.update.indexOf('remote') != -1) {
  var pwfile = path.resolve(config.publicDir, '.password');
  fs.writeFileSync(pwfile, 'password', 'utf-8');
  fs.chmodSync(pwfile, '600');
}

// Start listening for changes on the filesystem
var reporter = new FSReporter()
reporter.listen(config.watchList);

// Start the instaserver
instaserver.start(
    config.name, PORT, config.publicDir, reporter, config.update);
LOG.info('Instabuild starting...');
LOG.info(JSON.stringify(config, undefined, 2));
