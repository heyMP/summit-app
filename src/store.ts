import { LitElement } from 'lit';
import type { ReactiveControllerHost, ReactiveController } from 'lit';
import { createMachine, send, assign, interpret, createSchema } from 'xstate'
import type { Interpreter, Subscription, StateMachine } from 'xstate';

export type OrderId = string | number | null;

export interface AppContext {
	// current active order
	orderId: OrderId;
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
				FULFILL: { actions: 'fullfill', target: 'order' }
			}
		},
		order: {
			initial: 'color',
			states: {
				color: {
					on: {
						NEXT: { target: 'frame' }
					}
				},
				frame: {}
			}
		}
	},
}, {
	// Actions (anything that directly mutates state)
	actions: {
		fulfill: (context, event) => {
			if (event.type !== 'FULFILL') return
			assign({ orderId: event.orderId })
		}
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