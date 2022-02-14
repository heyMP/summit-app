const gameStatesList = document.querySelector("#game-states-list");
const gameStateListItemTpl = document.querySelector("#game-state-list-item");
const microcontrollerUUID = "abcd-1234-efgh-5678";
const microcontroller = document.querySelector("#microcontroller");
const microcontrollerLEDs = document.querySelector("#leds");
const microcontrollerBtnLeft = document.querySelector("#microcontroller-btn-left");
const microcontrollerBtnRight = document.querySelector("#microcontroller-btn-right");
let adminSocket;
let microcontrollerSocket;

const gameStateBtnClickHandler = event => {
  if (!adminSocket) {
    return;
  }

  adminSocket.send(JSON.stringify({
    type: "GAME_STATE_CHANGE",
    state: event.target.dataset.state
  }));
}

const buildGameStates = gameStates => {
  const sortedGameStates = Object.entries(gameStates)
    .sort(([,a], [,b]) => a.order - b.order)
    .map(gameState => gameState[1]);

  return sortedGameStates;
}

const displayGameStates = gameStates => {
  gameStates.forEach(gameState => {
    const listItem = gameStateListItemTpl.content.cloneNode(true);
    const btn = listItem.querySelector("button");
    btn.textContent = gameState.name;
    btn.dataset.state = gameState.name;
    btn.dataset.active = gameState.active;
    btn.addEventListener("click", gameStateBtnClickHandler);
    gameStatesList.appendChild(listItem);
  });
}

const setActiveGameState = gameState => {
  const previouslyActive = gameStatesList.querySelector(`button[data-active="true"]`);
  previouslyActive.dataset.active = false;

  const currentlyActive = gameStatesList.querySelector(`button[data-state="${gameState}"]`);
  currentlyActive.dataset.active = true;
};

const connect = () => {
  adminSocket = new WebSocket("ws://localhost:8081/");
  adminSocket.onopen = () => {
    console.log("admin socket open");
    adminSocket.send(JSON.stringify({
      type: "CONNECTION"
    }));
  };

  adminSocket.onclose = event => {
    console.warn(event);
  };

  adminSocket.onmessage = event => {
    const data = JSON.parse(event.data);

    switch (data.type) {
      case "CONFIGURATION":
        const sortedGameStates = buildGameStates(data.gameStates);
        displayGameStates(sortedGameStates);
        break;

      case "GAME_STATE":
        setActiveGameState(data.game.state);
        break;

      case "PAIRING":

        break;
    
      default:
        break;
    }
  };

  adminSocket.onerror = error => {
    console.error(error);
  };
}

const microcontrollerConnect = () => {
  microcontrollerSocket = new WebSocket("ws://localhost:8082/");
  microcontrollerSocket.onopen = () => {
    console.log("microcontroller socket open");
  };

  microcontrollerSocket.onclose = event => {
    console.warn(event);
  };

  microcontrollerSocket.onmessage = event => {
    const data = JSON.parse(event.data);

    switch (data.type) {
      case "PAIRING":
        console.log("pairing frame received", data);
        microcontrollerLEDs.classList.add("pairing");

        // simulate a delay from the server
        setTimeout(() => {
          microcontrollerLEDs.classList.remove("pairing");
          microcontrollerLEDs.classList.add("paired");
          microcontroller.setAttribute("paired", "");
          microcontroller.setAttribute("player-uuid", data.data.player.uuid);

          setTimeout(() => {
            microcontrollerLEDs.classList.remove("paired");
            microcontrollerSocket.send(JSON.stringify({
              type: "PAIRING_COMPLETE",
              data: {
                microcontroller: {
                  uuid: microcontrollerUUID
                }
              }
            }));
          }, 3500);
        }, 2500);
        break;
    
      default:
        break;
    }
  };

  microcontrollerSocket.onerror = error => {
    console.error(error);
  };
};

microcontrollerBtnLeft.addEventListener("click", () => {

});

microcontrollerBtnRight.addEventListener("click", () => {

})

connect();
microcontrollerConnect();
