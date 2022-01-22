import type { InvokeCreator } from 'xstate';
import type { AppEvents, AppContext } from '../store.js';

export type ConfigurationEvent = {
	type: 'CONFIGURATION',
	game: {
		id: number
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

	const sendConfigurationFrame = () => {
		if (!socket) {
			return;
		}

		const message = {
			type: "CONFIGURATION",
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

			sendConfigurationFrame();
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