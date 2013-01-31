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


InstaBuild.prototype.printBasicUsage = function() {
  LOG.info('Usage: instabuild [create|serve]');
  process.exit(1);
};


InstaBuild.prototype.printCreateUsage = function() {
  LOG.info('Usage: instabuild create <name>');
  process.exit(1);
};


InstaBuild.prototype.printServeUsage = function() {
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
      var name = process.argv[3];
      if (!name) {
        instabuild.printCreateUsage();
      }

      // Make the app directory
      fs.mkdirSync(path.resolve(__dirname, name));

      // Write instabuild.json
      fs.writeFile(path.resolve(__dirname, name + '/instabuild.json'),
          JSON.stringify({
            "name": name,
            "publicDir": "./public",
            "update": [ "local", "remote" ],
            "watchList": [ "./public" ]
          }, null, 2) + '\n');

      // mkdir public
      var publicPath = path.resolve(__dirname, name + '/public');
      fs.mkdirSync(publicPath);
      var stylesheetsPath =
          path.resolve(__dirname, name + '/public/stylesheets');
      fs.mkdirSync(stylesheetsPath);
      var javascriptsPath =
          path.resolve(__dirname, name + '/public/javascripts');
      fs.mkdirSync(javascriptsPath);

      // Copy over default files
      var dir = instabuild.filenameToDirectory_(__filename);
      var index = path.resolve(dir, 'default/index.html');
      var style = path.resolve(dir, 'default/stylesheets/style.css');
      var app = path.resolve(dir, 'default/javascripts/app.js');

      exec('cp ' + index + ' ' + publicPath, function(err, stdout, stderr) {
        // TODO(gareth)
      });
      exec('cp ' + style + ' ' + stylesheetsPath, function(err, stdout, stderr) {
        // TODO(gareth)
      });
      exec('cp ' + app + ' ' + javascriptsPath, function(err, stdout, stderr) {
        // TODO(gareth)
      });

      break;
    case 'serve':
      var PORT = process.env.PORT || 3000;

      // Resolve the config file
      var filename = null;
      try {
        if (!process.argv[3]) {
          throw 'No config file provided';
        }
        filename = path.resolve(process.cwd(), process.argv[3]);
        if (!fs.existsSync(filename)) {
          throw 'No such file ' + filename;
        }
      } catch (e) {
        instabuild.printServeUsage();
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
      break;
    default:
      instabuild.printBasicUsage();
      break;
  }
}
