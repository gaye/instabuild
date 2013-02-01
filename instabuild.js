#!/usr/bin/env node

var ConfigParser = require('./lib/configparser')
  , FSReporter = require('./lib/fsreporter')
  , LOG = require('./lib/logger')
  , fs = require('fs')
  , exec = require('child_process').exec
  , instaserver = require('./lib/instaserver')
  , path = require('path');



/**
 * @constructor
 */
function InstaBuild() {
}


/**
 * @param {string} name
 */
InstaBuild.prototype.create = function(name) {
  if (!name) {
    this.printCreateUsage_();
  }

  // Make the app directory
  fs.mkdirSync(path.resolve(process.cwd(), name));

  // Write instabuild.json
  var configFile = path.resolve(process.cwd(), name + '/instabuild.json');
  fs.writeFile(configFile, JSON.stringify({
    "name": name,
    "publicDir": "./public",
    "update": [ "local", "remote" ],
    "watchList": [ "./public" ]
  }, null, 2) + '\n');
  LOG.info('create ' + name + '/instabuild.json');

  // mkdir public
  var publicPath = path.resolve(process.cwd(), name + '/public');
  fs.mkdirSync(publicPath);
  LOG.info('create ' + name + '/public');
  var stylesheetsPath =
      path.resolve(process.cwd(), name + '/public/stylesheets');
  fs.mkdirSync(stylesheetsPath);
  var javascriptsPath =
      path.resolve(process.cwd(), name + '/public/javascripts');
  fs.mkdirSync(javascriptsPath);

  // Copy over default files
  var dir = instabuild.filenameToDirectory_(__filename);
  var index = path.resolve(dir, 'default/index.html');
  
  var style = path.resolve(dir, 'default/stylesheets/style.css');
  var app = path.resolve(dir, 'default/javascripts/app.js');

  exec('cp ' + index + ' ' + publicPath, function(err, stdout, stderr) {
    LOG.info('create ' + name + '/public/index.html');
  });
  exec('cp ' + style + ' ' + stylesheetsPath, function(err, stdout, stderr) {
    LOG.info('create ' + name + '/public/stylesheets');
    LOG.info('create ' + name + '/public/stylesheets/style.css');
  });
  exec('cp ' + app + ' ' + javascriptsPath, function(err, stdout, stderr) {
    LOG.info('create ' + name + '/public/javascripts');
    LOG.info('create ' + name + '/public/javascripts/app.js');
  });
};


/**
 * @param {string} configFile
 */
InstaBuild.prototype.serve = function(configFile) {
  var PORT = process.env.PORT || 3000;

  // Resolve the config file
  var filename = null;
  try {
    if (!configFile) {
      throw 'No config file provided';
    }
    filename = path.resolve(process.cwd(), configFile);
    if (!fs.existsSync(filename)) {
      throw 'No such file ' + filename;
    }
  } catch (e) {
    instabuild.printServeUsage_();
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
  LOG.info('Instabuild starting ' + config.name + '...');
  instaserver.start(
      config.name, PORT, config.publicDir, reporter, config.update);
};


/**
 * Print a usage message and exit.
 * @private
 */
InstaBuild.prototype.printBasicUsage = function() {
  LOG.info('Usage: instabuild [create|serve]');
  process.exit(1);
};


/**
 * Print a usage message and exit.
 * @private
 */
InstaBuild.prototype.printCreateUsage_ = function() {
  LOG.info('Usage: instabuild create <name>');
  process.exit(1);
};


/**
 * Print a usage message and exit.
 * @private
 */
InstaBuild.prototype.printServeUsage_ = function() {
  LOG.info('Usage: instabuild serve <config file>');
  process.exit(1);
};


/**
 * @return {string} directory path for this file.
 * @private
 */
InstaBuild.prototype.filenameToDirectory_ = function(filename) {
  if (filename.indexOf('/') == -1 || filename.substring(0, 2) == './') {
    return '.';
  }

  var split = filename.split('/');
  split = split.slice(0, split.length - 1);
  if (split.length == 1) {
    return '/';
  }

  return split.join('/');
};



if (require.main === module) {
  var instabuild = new InstaBuild();
  var cmd = process.argv[2];
  if (!cmd) {
    instabuild.printBasicUsage();
  }

  switch (cmd) {
    case 'create':
      instabuild.create(process.argv[3]);
      break;
    case 'serve':
      instabuild.serve(process.argv[3]);
      break;
    default:
      instabuild.printBasicUsage();
      break;
  }
}
