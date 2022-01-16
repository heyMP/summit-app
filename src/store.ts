import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { LitElement } from 'lit';
import type { Interpreter, Subscription } from 'xstate';
import { assign, createMachine, createSchema, interpret, spawn } from 'xstate';
import type { Order, OrderId } from './machines/orders.js';
import { createOrderMachine } from './machines/orders.js';

export type OrderRef = Interpreter<Order> | null;

export interface AppContext {
	title: string;
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

export type AppEvent =
  | { type: 'NEXT' }
  | { type: 'PREVIOUS' }
  | { type: 'FULFILL', orderId: OrderId }
  | { type: 'ORDER_COMPLETE' }

export type AppTypestate =
  | { value: 'init', context: AppContext }
  | { value: 'default', context: AppContext }
  | { value: 'fulfill', context: AppContext }
  | { value: 'order', context: AppContext }

// Edit your machine(s) here
export const storeMachine = createMachine({
	id: "app",
	initial: 'init',
	schema: {
		context: createSchema<AppContext>(),
		events: createSchema<AppEvent>(),
	},
	context: {
		title: 'Pasta Flower',
		points: 0,
		fulfilled: 0,
		backlog: 3,
		orderId: null,
		orders: [{ orderId: 1, countdown: 55 }],
		orderRef: null,
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
		}
	},
}, {
	// Actions (anything that directly mutates state)
	actions: {
		// @ts-ignore
		fulfill: assign((context, event) => {
			// this looks weird but it was the only way typescript would
			// accept it.
			if (event.type === 'FULFILL') {
				const order = context.orders.find(order => order?.orderId === event.orderId);
				if (order) {
					return {
						orderId: event.orderId,
						orderRef: spawn(createOrderMachine(order))
					}
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
  constructor() {
    super();
    this.store = new StoreController(this).store;
  }
}