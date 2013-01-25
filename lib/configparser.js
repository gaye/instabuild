
var findit = require('findit')
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
  var data = fs.readFileSync(filename, 'utf-8');
  var config = JSON.parse(data);
  this.validatePublicDirectory_(filename, config);
  this.validateWatchList_(filename, config);
  return config;
};


/**
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
