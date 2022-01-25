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

## Device pairing
A user scans a QR code on the microcontroller. The QR code takes the user to
the mobile web application. The link in the QR code contains the UUID for
the microcontroller. We grab the UUID from the URL and send a message to the
backend over the web socket with the UUID from the microcontroller and the
player UUID.

```
{
  type: "PAIRING",
  data: {
    deviceuuid: string,
    playeruuid: string
  }
}
```

Once the backend receives this message, the backend then sends a pairing
frame to the bluetooth gateway to then relay the message to the microcontroller.
When the microcontroller receives the message, the LEDs on the microcontroller
start to blick indicating a completed pairing. The microcontroller then sends
a `PAIRING_COMPLETE` frame to the bluetooth gateway then to the backend and the
socket sends the `PAIRING_COMPLETE` frame to the mobile web application.

```
{
  type: "PAIRING_COMPLETE"
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