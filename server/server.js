/*
 * Application Flow
 * 1. CONNECT and CONFIGURE a player
 * 2. If a user has a microcontroller, PAIR the microcontroller
 * 3. TEST the microcontroller
 * 4. PLAY the game
 * 5. PAUSE the game
 * 6. GAMEOVER
 */

const {createServer} = require('wss');
let clientWs;
let adminWs;
let microcontrollerWs;

const gameStates = {
  "lobby": { name: "lobby", order: 0, active: true, },
  "play": { name: "play", order: 1, active: false },
  "pause": { name: "pause", order: 2, active: false },
  "gameover": { name: "gameover", order: 3, active: false }
};

let currentGameState = gameStates["lobby"];

const setCurrentGameState = state => {
  if (!state) {
    return;
  }

  if (currentGameState === gameStates[state]) {
    return;
  }

  currentGameState = gameStates[state];
  
  const data = {
    type: "GAME_STATE",
    game: {
      state: state
    }
  };

  sendMessage(adminWs, data);
  sendMessage(clientWs, data);
}

const sendMessage = (socket, data) => {
  if (!socket) {
    return;
  }

  socket.send(JSON.stringify(data));
}
 
createServer(function connectionListener (ws) {
  const pingInterval = 5000;
  const player = {
    userId: "abcd-1234",
    username: "Snowy Dreams"
  };
  const game = {
    id: "1234",
    state: gameStates.lobby,
  };

  clientWs = ws;

  ws.on('message', event => {
    if (!event) {
      return;
    }

    event = JSON.parse(event);

    switch (event.type) {
      case "CONNECTION":
        sendMessage(ws, {
          type: "CONFIGURATION",
          player,
          game
        });
        break;

      case "PAIRING":
        console.log("pairing", event);
        sendMessage(microcontrollerWs, {
          type: "PAIRING",
          data: event.data
        });
        break;
    
      default:
        break;
    }
  });
})
.listen(8080, function () {
  const {address, port} = this.address() // this is the http[s].Server
  console.log('client socket listening on http://%s:%d (%s)', /::/.test(address) ? '0.0.0.0' : address, port)
});

// admin socket on ws://localhost:8081
createServer(function connectionListener(ws) {
  adminWs = ws;

  ws.on("message", event => {
    event = JSON.parse(event);

    switch (event.type) {
      case "CONNECTION":
        sendMessage(ws, {
          type: "CONFIGURATION",
          gameStates
        });
        break;

      case "GAME_STATE_CHANGE":
        setCurrentGameState(event.state);
        break;
    
      default:
        break;
    }
  });
})
.listen(8081, function () {
  const {address, port} = this.address() // this is the http[s].Server
  console.log('admin socket listening on http://%s:%d (%s)', /::/.test(address) ? '0.0.0.0' : address, port)
});

// microcontroller socket on ws://localhost:8082
// this is to simulate a connection from a bluetooth
// device
createServer(function connectionListener(ws) {
  microcontrollerWs = ws;

  ws.on("message", event => {
    event = JSON.parse(event);

    switch (event.type) {
      case "PAIRING_COMPLETE":
        // send a message to the phone socket to let the phone
        // know that pairing has completed
        sendMessage(clientWs, {
          type: "PAIRING_COMPLETE",
          data: event.data
        });
        break;
    
      default:
        break;
    }
  });
})
.listen(8082, function () {
  const {address, port} = this.address() // this is the http[s].Server
  console.log('microcontroller socket listening on http://%s:%d (%s)', /::/.test(address) ? '0.0.0.0' : address, port)
});