var osc = require('node-osc');
var io = require('socket.io')(4000, {
  cors: {
    origins: '*',
  } 
});

var oscClient, oscServer;

console.log("starting")

io.on('connection', (socket) => {
  socket.on('config', (obj) => {
    console.log('config', obj);
    console.log('SocketId: ' + socket.id)
    oscServer = new osc.Server(obj.server.port, obj.server.host);
    oscClient = new osc.Client(obj.client.host, obj.client.port);

    // Wait for an OSC message to come in and forward it to the website
    oscServer.on('message', function(msg, rinfo) {
      let rIp = rinfo.address + ':' + rinfo.port;
      socket.broadcast.emit('message', 'From: ' + rIp + '\n' + msg);
      console.log('sent OSC message to Website', msg, rinfo);
    });
  });

  // Wait for a message from the website starting with 'message' and forward
  // it to the OSC client
  socket.on('message', (ip, port, data) => {
    oscClient = new osc.Client(ip, port);
    var toSend = data.split(' ');
    oscClient.send(...toSend);
    console.log(`ip: ${ip}, port: ${port}, message: ${data}`);
  });

  socket.on("disconnect", () => {
    console.log("disconnect")
    if (oscServer) {
      console.log("disconnect oscserver")
      oscServer.close();
      oscServer = null;
    }
    if (oscClient) {
      console.log("disconnect oscclient")
      oscClient.close();
      oscClient = null;
    }
    socket.disconnect();
    io = null;
  })
});