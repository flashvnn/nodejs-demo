(function() {

  var net = require("net");
  var Socket = require("net").Socket;
  var state = {};
  var LOCAL_SERVER_PORT = 3737;
  var clientListener = require("./clientListener");

  var server = net.createServer(clientListener.listener);
  server.listen(LOCAL_SERVER_PORT, function() {
    return console.log("IMAP proxy is listening on port "+LOCAL_SERVER_PORT);
  });

})();
