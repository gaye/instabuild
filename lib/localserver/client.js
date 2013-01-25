
var socket = io.connect('http://localhost');
socket.on('refresh', function() {
  location.reload(true);
});
