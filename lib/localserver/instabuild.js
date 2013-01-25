
var cheerio = require('cheerio')
  , fs = require('fs')
  , path = require('path');



function InstaBuild() {
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
  this.client_ = '<script type="text/javascript">' +
      fs.readFileSync(path.resolve(__dirname, 'client.js'), 'utf-8') +
      '</script>';
}
module.exports = InstaBuild;


/**
 * Modify the html page by adding the client.js script.
 * @param {string} page is an html page.
 */
InstaBuild.prototype.instrument = function(page) {
  var $ = cheerio.load(page);
  $('body').append(this.sio_);
  $('body').append(this.client_);
  return $.html();
};
