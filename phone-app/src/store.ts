import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { LitElement } from 'lit';
import type { Interpreter, Subscription } from 'xstate';
import { assign, createMachine, createSchema, interpret, spawn, send, sendParent } from 'xstate';
import type { Order, OrderId } from './machines/orders.js';
import { orderMachine } from './machines/orders.js';
import { socketCallback } from './machines/socket.js';
import type { ConfigurationEvent } from './machines/socket.js';
import styles from './global.css.js';

export type OrderRef = Interpreter<Order> | null;

export interface AppContext {
	name: string;
	points: number;
	// how many orders are fulfilled
	fulfilled: number;
	// how many orders need to be fulfilled
	backlog: number;
	// orders
	orders: [Order?];
	// current active order
	orderRef: OrderRef;
	// current active order
	orderId: OrderId;
}

/** @todo separate these events into their machine files and merge them here. */
export type AppEvents =
  | { type: 'NEXT' }
  | { type: 'PREVIOUS' }
  | { type: 'FULFILL', orderId: OrderId }
  | { type: 'ORDER_COMPLETE' }
	| ConfigurationEvent

export type AppTypestate =
  | { value: 'init', context: AppContext }
  | { value: 'default', context: AppContext }
  | { value: 'fulfill', context: AppContext }
  | { value: 'order', context: AppContext }

export const getLocalStorage = () => {
	return {
		game: {
			id: localStorage.getItem("gameId")
		},
		player: {
			userid: localStorage.getItem("playerId"),
			username: localStorage.getItem("username")
		}
	};
};
	
export const updateLocalStorage = (gameId: string, playerId: string, username: string) => {
	localStorage.setItem("gameId", gameId);
	localStorage.setItem("playerId", playerId);
	localStorage.setItem("username", username);
};

// Edit your machine(s) here
export const storeMachine = createMachine({
	id: "app",
	initial: 'init',
	schema: {
		context: createSchema<AppContext>(),
		events: createSchema<AppEvents>(),
	},
	context: {
		name: 'Pasta Flower',
		points: 0,
		fulfilled: 0,
		backlog: 3,
		orderId: null,
		orders: [{ orderId: 1, countdown: 55, state: 'pending' }],
		orderRef: null,
	},
	invoke: {
		id: 'websocket',
		src: socketCallback,
	},
	on: {
		CONFIGURATION: { actions: 'configuration' }
	},
	states: {
		init: {
			on: {
				NEXT: { target: 'default' }
			},
			after: {
        2000: {
          target: 'default'
        }
      },
		},
		default: {
			on: {
				PREVIOUS: { target: 'init' },
				FULFILL: { target: 'order', actions: 'fulfill' }
			}
		},
		order: {
			invoke: {
				id: 'order',
				src: orderMachine,
				data: (context, event) => context.orders.find(order => order?.orderId === context.orderId),
				onDone: { target: 'default' }
			},
		}
	},
}, {
	// Actions (anything that directly mutates state)
	actions: {
		// @ts-ignore
		configuration: assign((context, event) => {
			if (event.type === 'CONFIGURATION') {
				// updateLocalStorage
				updateLocalStorage(event.game.id, event.player.userid, event.player.username);

				return {
					name: event.player.username
				}
			}
		}),
		// @ts-ignore
		fulfill: assign((context, event) => {
			// this looks weird but it was the only way typescript would
			// accept it.
			if (event.type === 'FULFILL') {
				return {
					orderId: event.orderId
				}
			}
			return {};
		}),
		orderShip: assign((context, event) => {
			return { orderId: null, fulfilled: context.fulfilled + 1 }
		}),
	},
})

export const store = interpret(storeMachine).start();
export type Store = typeof store;

/**
 * Reactive Controller method for adding the store to your element
 */
export class StoreController implements ReactiveController {
  // reference to the host element using this controller
  host: ReactiveControllerHost & Element;
  store: Store;
  subscription?: Subscription;

  constructor(host: ReactiveControllerHost & Element) {
    (this.host = host).addController(this);
    this.store = store;
  }

	hostConnected() {
		this.subscription = this.store.subscribe(() => {
			this.host.requestUpdate();
			// add hook on the class called `storeUpdated` for
			// developer access.
			// @ts-ignore
			if (!!this.host.storeUpdated)
				// @ts-ignore
				this.host.storeUpdated();
		})
	}

  hostDisconnected() {
    this.subscription?.unsubscribe();
  }
}

/**
 * Subscribe to a specific Interpretor in a store.
 */
export class StoreSubscriptionController<T> implements ReactiveController {
  // reference to the host element using this controller
  host: ReactiveControllerHost & Element;
  store: T | null = null;
  subscription?: Subscription;

  constructor(host: ReactiveControllerHost & Element, _store: T) {
    (this.host = host).addController(this);
    this.store = _store;
		// @ts-ignore
		this.subscription = this.store.subscribe(() => {
			this.host.requestUpdate();
		});
  }

  hostDisconnected() {
    this.subscription?.unsubscribe();
  }
}

/**
 * Base Class for giving components access to the store. Uses the StoreController
 * plus sets up a local store prop for easy access.
 */
export class StoreBase extends LitElement {
  protected store;
	protected order: OrderRef = null;

	static styles = [styles];

  constructor() {
    super();
    this.store = new StoreController(this).store;
  }

	storeUpdated() {
		if (this.store.children.has('order')) {
			this.order = new StoreSubscriptionController(this, this.store.children.get('order') as OrderRef).store;
		}
		else {
			this.order = null;
		}
	}
}

// @ts-ignore
window.BikeStore = store;