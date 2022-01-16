import { createMachine, send, assign, interpret, createSchema, sendParent, spawn } from 'xstate'
import type { Interpreter, Subscription, StateMachine } from 'xstate';

export type OrderId = string | number | null;

export interface Order {
	orderId: OrderId;
	countdown: number;
	counterRef?: any | null;
}

export type OrderEvent =
  | { type: 'NEXT' }
  | { type: 'TICK' }

export const createOrderMachine = (order: Order) => createMachine({
	id: 'order',
	initial: 'color',
	schema: {
		context: createSchema<Order>(),
		events: createSchema<OrderEvent>(),
	},
	context: {
		// @ts-expect-error TS2783
		orderId: null,
		// @ts-expect-error TS2783
		countdown: 55,
		counterRef: null,
		...order
	},
	// @ts-ignore
	entry: assign({
		counterRef: () => spawn(counterInterval)
	}),
	on: {
		'TICK': {
			actions: 'decrementCount',
		},
	},
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
		complete: { type: 'final' }
	}
}, {
	actions: {
		// @ts-ignore
		decrementCount: assign((context, event) => {
			return {
				countdown: context.countdown - 1
			}
		}),
	}
});

const counterInterval = (callback: any, receive: any) => {
  const intervalId = setInterval(() => {
    callback({ type: 'TICK' });
  }, 1000);

  return () => { clearInterval(intervalId); }
}