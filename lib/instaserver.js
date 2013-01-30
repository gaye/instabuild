
/**
 * @fileoverview This file contains a start function which brings up a local
 * web server. The web server makes a socket.io connection to all connected
 * clients. Whenever the reporter tells us that changes have been made
 * to an important file or directory, we'll send the path down to the client
 * to tell them about the changes. In addition, we can send the updated files
 * to a remote machine.
 */

var Instrument = require('./reload/instrument')
  , LOG = require('./logger')
  , RSync = require('./deploy/rsync')
  , fs = require('fs')
  , http = require('http')
  , io = require('socket.io')
  , mime = require('mime');



/**
 * @param {string} name is the name of this app.
 * @param {number} port is the port to start the web server on.
 * @param {string} staticPath is the web server's root directory.
 * @param {FSReporter} reporter reports changes made to important files.
 * @param {Object} update
 */
exports.start = function(name, port, staticPath, reporter, update) {
  if (update.indexOf('local') != -1) {
    // Bring up a local web server on the param port which serves files out
    // of the param staticPath and instruments them with Javascript that
    // will reload resources when we send it a change message over socket.io
    var instrument = new Instrument();
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
    LOG.info('Instabuild server listening on port ' + port + '...');

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
  }

  if (update.indexOf('remote') != -1) {
    // Sync with the remote and sync again whenever there are fs changes
    var rsync = new RSync(name, staticPath);
    rsync.rsync();
    reporter.on('change', function(e) {
      rsync.rsync();
    });
  }
};
