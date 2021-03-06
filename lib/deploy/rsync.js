
/**
 * @fileoverview contains code to sync the local filesystem with remote
 * by shelling out to rsync.
 */

var LOG = require('../logger')
  , exec = require('child_process').exec
  , path = require('path');



/**
 * @constructor
 * @param {string} name is the name of this app.
 * @param {string} src is a fully-qualified path to the local directory.
 */
function RSync(name, src) {
  /**
   * @type {string}
   * @private
   */
  this.name_ = name;

  /**
   * @type {string}
   * @private
   */
  this.src_ = src;
};
module.exports = RSync;


/**
 * @const
 */
RSync.DEST_PATH = 'user@107.20.251.27::share';


/**
 * Copy the app's public directory to a temporary directory named after the
 * app and then shell out to RSync to send the changes up to the server.
 */
RSync.prototype.rsync = function() {
  var pwfile = path.resolve(this.src_, '.password');
  var dest = RSync.DEST_PATH + '/' + this.name_;

  var rsync = this;
  var cmd = ['rsync', '-vrz', '--password-file', pwfile,
      this.src_ + '/*', dest].join(' ');
  exec(cmd, function(err, stdout, stderr) {
    if (err) {
      LOG.error(err);
    } else {
      LOG.info('[RSync] Synced ' + rsync.src_ + ' to ' +
          rsync.name_ + '.instabuild.org');
    }
  });
};
