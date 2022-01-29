const {createServer} = require('wss');
let clientWs;
let adminWs;

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

  const data = JSON.stringify({
    type: "GAME_STATE",
    game: {
      state: state
    }
  });

  adminWs.send(data);
  clientWs.send(data);
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
        ws.send(JSON.stringify({
          type: "CONFIGURATION",
          gameStates
        }));
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