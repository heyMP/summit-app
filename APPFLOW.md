# Application Flow

## Connection
When the application first loads in the browser, we establish a connection
to the web socket. When the `onopen` callback for the web socket fires,
we send a `CONNECTION` frame. 

### CONNECTION Frame
Before we send a `CONNECTION` frame to the web socket, we check to see if
the browser has a player and a game in `localStorage`. The backend will
check to see if the player already exists and that the current game that is
being played is equal to the `game.id` in `localStorage`.

The connection frame is in the following format if data is found in local
storage.
```
{
  type: "CONNECTION",
  data: {
    game: {
      id: string
    },
    player: {
      userId: string,
      username: string
    }
  }
}
```

If there is no data found in `localStorage`, then we send a `CONNECTION`
frame that looks like this.
```
{
  type: "CONNECTION,
  data: {}
}
```

## CONFIGURATION Frame
Upon the socket server receiving a `CONNECTION` frame from the client, the 
socket server will send back a `CONFIGURATION` frame that will contain 
information about the game and the player.
```
{
  type: "CONFIGURATION",
  player: {
    userId: string,
    username: string
  },
  game: {
    id: string,
    state: string
  }
}
```

## GAME_STATE Frame
From the admin interface, a `GAME_STATE_CHANGE` frame is sent to the socket
server with a data object that looks like this.
```
{
  type: "GAME_STATE_CHANGE",
  state: string
}
```

The socket server receives the frame and sends a response `GAME_STATE` frame
to both the admin socket as well as the client socket.
```
{
  type: "GAME_STATE",
  game: {
    state: string
  }
}
```