#!/usr/bin/env node

var FSReporter = require('./lib/fsreporter')
  , localserver = require('./lib/localserver');



// TODO(gareth): Read these from config
var paths = [
    '/Users/django/instabuild/example/app/public/index.html',
    '/Users/django/instabuild/example/app/public/javascripts/app.js',
    '/Users/django/instabuild/example/app/public/stylesheets/style.css'];
var staticPath = '/Users/django/instabuild/example/app/public';
var port = 3000;

var reporter = new FSReporter();
reporter.listen(paths);

localserver.start(port, staticPath, reporter);
console.log('Instabuild server serving ' + staticPath + ' on ' + port + '...');
