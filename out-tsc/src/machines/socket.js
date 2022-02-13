import { getLocalStorage } from '../store.js';
/**
 * XState Invoke Callback
 */
export const socketCallback = (context, event) => (send, receieve) => {
    let socket;
    const retryDelay = 5000;
    const maxTries = 50;
    let retryTimeout;
    let numRetries = 0;
    const sendConnectionFrame = () => {
        if (!socket) {
            return;
        }
        let data = {};
        // get a previously connected player
        const previousPlayer = getLocalStorage();
        if (previousPlayer.game.id && previousPlayer.player.userid && previousPlayer.player.username) {
            data = previousPlayer;
        }
        // send a "CONNECTION" frame
        const message = {
            type: "CONNECTION",
            data
        };
        socket.send(JSON.stringify(message));
    };
    const connect = () => {
        socket = new WebSocket("ws://localhost:8080");
        socket.onopen = event => {
            console.log("socket connected");
            numRetries = 0;
            if (retryTimeout) {
                clearTimeout(retryTimeout);
            }
            sendConnectionFrame();
        };
        socket.onmessage = event => {
            const data = JSON.parse(event.data);
            switch (data.type) {
                case "PING":
                    console.log("ping");
                    break;
                case "CONFIGURATION":
                    send(data);
                    break;
                default:
                    break;
            }
        };
        socket.onclose = event => {
            numRetries++;
            if (numRetries === maxTries) {
                // show some error message that the user should refresh the page
                return;
            }
            retryTimeout = setTimeout(() => {
                console.log(`socket reconnect try: ${numRetries}`);
                connect();
            }, retryDelay);
        };
        socket.onerror = error => {
        };
    };
    connect();
    return () => {
        socket.close();
        if (retryTimeout) {
            clearTimeout(retryTimeout);
        }
    };
};
//# sourceMappingURL=socket.js.map