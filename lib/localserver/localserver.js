
/**
 * @fileoverview This file contains a start function which brings up a local
 * web server. The web server makes a socket.io connection to all connected
 * clients. Whenever the reporter tells us that changes have been made
 * to an important file or directory, we'll send the path down to the client
 * to tell them about the changes.
 */

var fs = require('fs')
  , http = require('http')
  , io = require('socket.io')
  , mime = require('mime')
  , InstaBuild = require('./instabuild');



/**
 * @param {number} port is the port to start the web server on.
 * @param {string} staticPath is the web server's root directory.
 * @param {FSReporter} reporter reports changes made to important files.
 */
exports.start = function(port, staticPath, reporter) {
  var instabuild = new InstaBuild();
  var server = http.createServer(function(req, res) {
    // Log the request
    console.log('GET ' + req.url);

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
        res.end(instabuild.instrument(data));
      });
    });
  });

  server.listen(port);

  var sio = io.listen(server);
  sio.sockets.on('connection', function(socket) {
    reporter.on('change', function(e) {
      socket.emit('refresh');
    });
  });
};
