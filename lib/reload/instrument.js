
/**
 * @fileoverview contains Instrument which is responsible for instrumenting
 * HTML files served up by the InstaBuild server with Javascript that can
 * respond to websocket messages regarding changes to the local filesystem.
 */

var cheerio = require('cheerio')
  , fs = require('fs')
  , path = require('path');



/**
 * @constructor
 */
function Instrument() {
  /**
   * @type {string}
   * @private
   */
  this.sio_ = '<script type="text/javascript">' +
      fs.readFileSync(path.resolve(__dirname, 'socket.io.js'), 'utf-8') +
      '</script>';

  /**
   * @type {string}
   * @private
   */
  this.reload_ = '<script type="text/javascript">' +
      fs.readFileSync(path.resolve(__dirname, 'reload.js'), 'utf-8') +
      '</script>';
}
module.exports = Instrument;


/**
 * Modify the html page by adding the client.js script.
 * @param {string} page is an html page.
 */
Instrument.prototype.instrument = function(page) {
  var $ = cheerio.load(page);
  $('body').append(this.sio_);
  $('body').append(this.reload_);
  return $.html();
};
