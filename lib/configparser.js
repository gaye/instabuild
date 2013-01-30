
/**
 * @fileoverview contains ConfigParser which is responsible for reading
 * InstaBuild configuration files and returning a map of service options.
 */

var LOG = require('./logger')
  , findit = require('findit')
  , fs = require('fs')
  , path = require('path');



/**
 * @constructor
 */
function ConfigParser() {
};
module.exports = ConfigParser;


/**
 * @param {string} filename is a fully-qualified fs path to a config file.
 * @return {Object} a map of config options.
 */
ConfigParser.prototype.parse = function(filename) {
  try {
    // Read the config file and JSON parse it
    var data = fs.readFileSync(filename, 'utf-8');
    var config = JSON.parse(data);

    // Validate the configuration
    this.validatePublicDirectory_(filename, config);
    this.validateWatchList_(filename, config);
    return config;
  } catch (e) {
    LOG.error('Could not parse config file ' + filename);
    process.exit(1);
  }
};


/**
 * Make sure that there's a public directory.
 * @param {string} filename
 * @param {Object} config
 * @private
 */
ConfigParser.prototype.validatePublicDirectory_ = function(filename, config) {
  if (!config.hasOwnProperty('publicDir')) {
    throw 'No publicDir specified in config file';
  }

  var configDir = this.filenameToDirectory_(filename);
  var publicDir = path.resolve(configDir, config.publicDir);
  if (!fs.existsSync(publicDir)) {
    throw 'No file found at ' + publicDir;
  }

  config.publicDir = publicDir;
};


/**
 * Validate that each path in the watchlist has a file or directory
 * and find all of the files that we'll watch
 * @param {string} filename
 * @param {Object} config
 * @private
 */
ConfigParser.prototype.validateWatchList_ = function(filename, config) {
  // Validate watchlist
  if (!config.hasOwnProperty('watchList')) {
    throw 'No watchList specified in config file';
  }

  var configDir = this.filenameToDirectory_(filename);
  var watchList = [];
  for (var k in config.watchList) {
    var watch = config.watchList[k];
    var watchPath = path.resolve(configDir, watch);
    if (!fs.existsSync(watchPath)) {
      throw 'No file found at ' + watchPath;
    }

    // TODO(gareth): Does findit work for files?
    var paths = findit.findSync(watchPath);
    for (var i in paths) {
      watchList.push(paths[i]);
    }
  }

  config.watchList = watchList;
};


/**
 * @return {string} directory path for this file.
 * @private
 */
ConfigParser.prototype.filenameToDirectory_ = function(filename) {
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
