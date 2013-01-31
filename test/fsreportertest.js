
var FSReporter = require('../lib/fsreporter')
  , exec = require('child_process').exec
  , path = require('path')
  , should = require('should');



describe('FSReporter', function() {
  var reporter = new FSReporter();
  describe('#listen', function() {
    it('should emit change when a watched file changes', function(done) {
      // Copy the file to a temporary location
      var index = path.resolve(process.cwd(), 'example/public/index.html');
      var tmp = index.replace('index.html', 'tmp.html');
      var cmd = 'cp ' + index + ' ' + tmp;
      exec(cmd, function(err, stdout, stderr) {
        // Start listening to the file
        reporter.listen([index]);

        // Listen to the reporter for the 'change' event
        reporter.on('change', function() {
          // Cleanup
          reporter.removeAllListeners();
          cmd = 'mv ' + tmp + ' ' + index;
          exec(cmd, function(err, stdout, stderr) {
            done();
          });
        });

        // Make a change to the file to trigger the reporter
        cmd = 'echo "Hello, world!" > ' + index;
        exec(cmd, function(err, stdout, stderr) {});
      });
    });
  });

  describe.skip('#unlisten', function() {
    // TODO(gareth)
  });
});
