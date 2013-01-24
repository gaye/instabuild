
var events = require('events')
  , fs = require('fs');



function FSReporter() {
  events.EventEmitter.call(this);

  /**
   * @type {Array}
   * @private
   */
  this.paths_ = [];

  /**
   * @type {Array}
   * @private
   */
  this.fswatchers_ = [];
};
FSReporter.super_ = events.EventEmitter;
FSReporter.prototype = Object.create(events.EventEmitter.prototype, {
  constructor: {
    value: FSReporter,
    enumerable: false
  }
});
module.exports = FSReporter;


/**
 * Start listening to changes on important files.
 * @param {Array} paths are the paths we need to listen to for changes.
 */
FSReporter.prototype.listen = function(paths) {
  this.paths_ = paths;

  var reporter = this;
  for (var k in paths) {
    var path = paths[k];
    console.log('Will watch ' + path + ' ...');
    var fswatcher = fs.watch(path, function(e, filename) {
      console.log('File changed...');
      reporter.emit('change', { filename: filename });
    });

    this.fswatchers_.push(fswatcher);
  }
};


/**
 * Stop listening to all file changes.
 */
FSReporter.prototype.unlisten = function() {
  for (var fswatcher in this.fswatchers_) {
    fswatcher.close();
  }

  this.fswatchers_ = [];
};
