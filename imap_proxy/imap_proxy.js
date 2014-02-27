(function() {
  var tls = require("tls");
  var net = require("net");
  var Socket = require("net").Socket;
  var state = {};
  var IMAP_SERVER = "imap.googlemail.com";
  var REMOTE_SERVER_PORT = 993;
  var LOCAL_SERVER_PORT = 3737;
  var clientListener = function(connectionToClient) { //This callback is run when the server gets a connection from a client.
    var connectionToImapServer, isConnected;
	  isConnected = true;
    console.log("Connected to mail client");
    connectionToClient.on("data", function(data) {
      console.log(" Mail client: ", data.toString());
      return connectionToImapServer.write(data);
    });
    connectionToClient.on("end", function() {
      isConnected = false;
      return console.log("Disconnected from " + IMAP_SERVER);
    });
    //Now that we have a client on the line, make a connection to the IMAP server.
	state.conn = new Socket();
    connectionToImapServer = tls.connect({
      socket: state.conn,
      rejectUnauthorized: false //Skip TLS certificate verification. Don't use this script on sensitive data!
    }, function() {
      console.log("Client connected");
      return;
    });
    connectionToImapServer.on("data", function(data) {
      var minusCompress;
      console.log(IMAP_SERVER + ": ", data.toString());
      if (!isConnected) {
        return;
      }
      if (data.toString().match(/CAPABILITY.*COMPRESS=DEFLATE/)) {
        minusCompress = data.toString().replace("COMPRESS=DEFLATE ", "");
        console.log("Proxy substitution: ", minusCompress);
        return connectionToClient.write(minusCompress);
      } else {
        return connectionToClient.write(data);
      }
    });
    return state.conn.connect(REMOTE_SERVER_PORT, IMAP_SERVER);
  };

  var server = net.createServer(clientListener);
  server.listen(LOCAL_SERVER_PORT, function() {
    return console.log("IMAP proxy is listening on port "+LOCAL_SERVER_PORT);
  });

})();
