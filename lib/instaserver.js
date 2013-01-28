
/**
 * @fileoverview This file contains a start function which brings up a local
 * web server. The web server makes a socket.io connection to all connected
 * clients. Whenever the reporter tells us that changes have been made
 * to an important file or directory, we'll send the path down to the client
 * to tell them about the changes.
 */

var Instrument = require('./reload/instrument')
  , LOG = require('./logger')
  , fs = require('fs')
  , http = require('http')
  , io = require('socket.io')
  , mime = require('mime')
  , RSync = require('./deploy/rsync');



/**
 * @param {string} name is the name of this app.
 * @param {number} port is the port to start the web server on.
 * @param {string} staticPath is the web server's root directory.
 * @param {FSReporter} reporter reports changes made to important files.
 * @param {Object} update
 */
exports.start = function(name, port, staticPath, reporter, update) {
  var instrument = new Instrument();
  var rsync = new RSync(name, staticPath);
  var server = http.createServer(function(req, res) {
    // Log the request
    LOG.info('[LocalServer] GET ' + req.url);

    // Map the request url to the local filesystem
    var file = staticPath;
    file += req.url == '/' ? '/index.html' : req.url;

    // Respond with the file. If it's html, instrument it
    fs.exists(file, function(exists) {
      if (!exists) {
        res.writeHead(400);
        res.end();
        return;
      }

      fs.readFile(file, 'utf-8', function(err, data) {
        if (err) {
          res.writeHead(500);
          res.end();
          return;
        }

        res.writeHead(200, { 'Content-Type': mime.lookup(file) });
        res.end(instrument.instrument(data));
      });
    });
  });

  server.listen(port);

  var sio = io.listen(server);
  sio.set('log level', 2);
  sio.sockets.on('connection', function(socket) {
    function refresh(e) {
      if (update.indexOf('local') != -1) {
        socket.emit('refresh');
      }
    }

    reporter.on('change', refresh);

    socket.on('disconnect', function() {
      reporter.removeListener('event', refresh);
    });
  });

  reporter.on('change', function(e) {
    if (update.indexOf('remote') != -1) {
      rsync.rsync();
    }
  });
};
