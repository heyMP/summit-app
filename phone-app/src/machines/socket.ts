import type { InvokeCreator } from 'xstate';
import type { AppEvents, AppContext } from '../store.js';
import { getLocalStorage } from '../store.js';

export type ConfigurationEvent = {
	type: 'CONFIGURATION',
	game: {
		id: string
	},
	player: {
		userid: string,
		username: string
	}
}

export type PairingEvent = {
	type: "PAIRING",
}

export type PairedEvent = {
	type: "PAIRED",
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

	/*
	 * if we have a uuid in the query string of the url,
	 * read it and begin the pairing process.
	 */
	const sendPairingFrame = (data: any) => {
		if (!socket) {
			return;
		}

		// send a "PAIRING" frame
		const message = {
			type: "PAIRING",
			data,
		};

		socket.send(JSON.stringify(message));
	};

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

					const searchParams = new URLSearchParams(window.location.search);

					if (searchParams.has("uuid")) {
						const pairingData = {
							type: "PAIRING",
							player: data.player,
							microcontrollerUUID: searchParams.get("uuid")
						};
	
						send(pairingData as PairingEvent);
						
						sendPairingFrame({
							player: {
								uuid: data.player.userId
							},
							microcontroller: {
								uuid: searchParams.get("uuid")
							}
						});
					}

					break;

				case "PAIRING_COMPLETE":
					const pairedData = {
						type: "PAIRED",
						microcontroller: {
							uuid: data.data.microcontroller.uuid
						}
					};
					send(pairedData as PairedEvent);
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