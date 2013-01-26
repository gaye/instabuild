
/**
 * @fileoverview This file just provides an interface to different logging
 * functions. Right now, we'll use the socket.io logger under the hood to
 * match its logging style, but this is subject to change.
 */

var Logger = require('./logger/logger');
var LOG = new Logger();



exports.debug = function(msg) {
  LOG.debug(msg);
};


exports.error = function(msg) {
  LOG.error(msg);
};


exports.info = function(msg) {
  LOG.info(msg);
};


exports.warn = function(msg) {
  LOG.warn(msg);
};
