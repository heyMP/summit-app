import { LitElement } from 'lit';
import type { ReactiveControllerHost, ReactiveController } from 'lit';
import { createMachine, send, assign, interpret, createSchema } from 'xstate'
import type { Interpreter, Subscription, StateMachine } from 'xstate';

export type OrderId = string | number | null;

export interface AppContext {
	// current active order
	orderId: OrderId;
	// how many orders are fulfilled
	fulfilled: number;
	// how many orders need to be fulfilled
	backlog: number;
}

export type AppEvent =
  | { type: 'NEXT' }
  | { type: 'PREVIOUS' }
  | { type: 'FULFILL', orderId: OrderId }

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
		fulfilled: 0,
		backlog: 3,
		orderId: null,
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
				FULFILL: { actions: 'fulfill', target: 'order' }
			}
		},
		order: {
			id: "order",
			initial: 'color',
			states: {
				color: {
					on: {
						NEXT: { target: 'frame' }
					}
				},
				frame: {
					on: {
						NEXT: { target: 'bake' }
					}
				},
				bake: {
					on: {
						NEXT: { target: 'seat' }
					}
				},
				seat: {
					on: {
						NEXT: { target: 'wheels' }
					}
				},
				wheels: {
					on: {
						NEXT: { target: 'handles' }
					}
				},
				handles: {
					on: {
						NEXT: { target: 'shipit' }
					}
				},
				shipit: {
					on: {
						NEXT: { target: 'complete' }
					}
				},
				complete: {
					on: {
						'': [
							{ target: '#app.default', actions: 'orderShip' }
						]
					}
				}
			}
		}
	},
}, {
	// Actions (anything that directly mutates state)
	actions: {
		fulfill: assign((context, event) => {
			// this looks weird but it was the only way typescript would
			// accept it.
			if (event.type === 'FULFILL') return {orderId: event.orderId }
			return {};
		}),
		orderShip: assign((context, event) => {
			return { orderId: null, fulfilled: context.fulfilled + 1 }
		}),
	},
})

export const store = interpret(storeMachine).start();

/**
 * Reactive Controller method for adding the store to your element
 */
export class StoreController implements ReactiveController {
  // reference to the host element using this controller
  host: ReactiveControllerHost & Element;
  store;
  subscription?: Subscription;

  constructor(host: ReactiveControllerHost & Element) {
    (this.host = host).addController(this);
    this.store = store;
  }

	hostConnected() {
		this.subscription = this.store.subscribe(() => {
			this.host.requestUpdate();
			// @ts-ignore
			if (!!this.host.storeUpdated)
				// @ts-ignore
				this.host.storeUpdated();
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