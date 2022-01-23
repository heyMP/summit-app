import type { InvokeCreator } from 'xstate';
import type { AppEvents, AppContext } from '../store.js';
import { getLocalStorage } from '../store.js';

export type ConfigurationEvent = {
	type: 'CONFIGURATION',
	game: {
		id: string
	},
	player: {
		userId: string,
		username: string
	}
}

/**
 * XState Invoke Callback
 */
export const socketCallback: InvokeCreator<AppContext, AppEvents> = (context, event) => (send, receieve)  => {
	let socket:WebSocket;
	const retryDelay:number = 5000;
	const maxTries:number = 50;
	let retryTimeout:any;
	let numRetries:number = 0;

	const sendConnectionFrame = () => {
		if (!socket) {
			return;
		}

		let data = {};

		// get a previously connected player
		const previousPlayer = getLocalStorage();
		if (previousPlayer.game.id && previousPlayer.player.userId && previousPlayer.player.username) {
			data = previousPlayer;
		}

		// send a "CONNECTION" frame
		const message = {
			type: "CONNECTION",
			data
		};

		socket.send(JSON.stringify(message));
	}

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
					send(data as ConfigurationEvent);
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
	}

	connect();

	return () => {
		socket.close();
		if (retryTimeout) {
			clearTimeout(retryTimeout);
		}
	}
}