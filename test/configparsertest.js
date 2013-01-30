
var ConfigParser = require('../lib/configparser')
  , path = require('path')
  , should = require('should');



describe('ConfigParser', function() {
  var parser = new ConfigParser();
  describe('#parse', function() {
    it('should properly parse the example config file', function() {
      var filename =
          path.resolve(process.cwd(), 'example/instabuild.json');
      var config = parser.parse(filename);
      var publicDir = path.resolve(process.cwd(), 'example/public');
      config.should.have.property('publicDir', publicDir);
      config.should.have.property('watchList');
      config.watchList.should.includeEql(
          path.resolve(publicDir, 'index.html'));
      config.watchList.should.includeEql(
          path.resolve(publicDir, 'javascripts/app.js'));
      config.watchList.should.includeEql(
          path.resolve(publicDir, 'stylesheets/style.css'));
    });
  });
});
