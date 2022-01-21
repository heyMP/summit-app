const {createServer} = require('wss')
 
createServer(function connectionListener (ws) {
  const pingInterval = 5000;
  const player = {
    userId: "abcd-1234",
    username: "Snowy Dreams"
  };
  const game = {
    id: 1234
  };

  ws.send(JSON.stringify({
    type: "CONNECT"
  }));

  ws.on('message', event => {
    if (!event) {
      return;
    }

    event = JSON.parse(event);

    switch (event.type) {
      case "CONFIGURATION":
        ws.send(JSON.stringify({
          type: "CONFIGURATION",
          player,
          game
        }));
        break;
    
      default:
        break;
    }
  });

  // setInterval(() => {
  //   ws.send(JSON.stringify({
  //     type: "PING"
  //   }));
  // }, pingInterval);
})
.listen(8080, function () {
  const {address, port} = this.address() // this is the http[s].Server
  console.log('listening on http://%s:%d (%s)', /::/.test(address) ? '0.0.0.0' : address, port)
})