const gameStatesList = document.querySelector("#game-states-list");
const gameStateListItemTpl = document.querySelector("#game-state-list-item");
let socket;

const gameStateBtnClickHandler = event => {
  if (!socket) {
    return;
  }

  socket.send(JSON.stringify({
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
  socket = new WebSocket("ws://localhost:8081/");
  socket.onopen = () => {
    console.log("admin socket open");
    socket.send(JSON.stringify({
      type: "CONNECTION"
    }));
  };

  socket.onclose = event => {
    console.warn(event);
  };

  socket.onmessage = event => {
    const data = JSON.parse(event.data);

    switch (data.type) {
      case "CONFIGURATION":
        const sortedGameStates = buildGameStates(data.gameStates);
        displayGameStates(sortedGameStates);
        break;

      case "GAME_STATE":
        setActiveGameState(data.game.state);
        break;
    
      default:
        break;
    }
  };

  socket.onerror = error => {
    console.error(error);
  };
}

connect();
