
var ConfigParser = require('../lib/configparser')
  , path = require('path')
  , should = require('should');



describe('ConfigParser', function() {
  var parser = new ConfigParser();
  describe('#parse', function() {
    it('should properly parse the example config file', function() {
      var filename =
          path.resolve(process.cwd(), 'example/app/instabuild.json');
      var config = parser.parse(filename);
      config.should.have.property('publicDir',
          path.resolve(process.cwd(), 'example/app/public'));
      config.should.have.property('watchList').with.lengthOf(5);
    });
  });
});
