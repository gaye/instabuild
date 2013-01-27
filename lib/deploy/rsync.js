
/**
 * @constructor
 */
function RSync(config) {
  /**
   * @type {Object}
   * @private
   */
  this.config_ = config;
};


/**
 * Copy the app's public directory to a temporary directory named after the
 * app and then shell out to RSync to send the changes up to the server.
 */
RSync.prototype.rsync = function() {
  // TODO(gareth)
};
