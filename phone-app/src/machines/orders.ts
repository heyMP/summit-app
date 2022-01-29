import { createMachine, send, assign, interpret, createSchema, sendParent, spawn } from 'xstate'
import type { Interpreter, Subscription, StateMachine, InvokeCreator } from 'xstate';
import { counterInterval } from './counter.js';

export type OrderId = string | number | null;

export interface Order {
	orderId: OrderId;
	countdown: number;
	state: 'pending' | 'color' | 'frame' | 'bake' | 'seat' | 'wheels' | 'handles' | 'pedals' | 'shipping' | 'complete';
}

export type OrderEvent =
  | { type: 'NEXT' }
  | { type: 'TICK' }

export const orderMachine = createMachine({
	id: 'order',
	initial: 'color',
	schema: {
		context: createSchema<Order>(),
		events: createSchema<OrderEvent>(),
	},
	context: {
		// @ts-ignore
		orderId: null,
		countdown: 55,
		state: 'pending',
	},
	invoke: [
		{ id: 'counterInterval', src: () => counterInterval },
	],
	on: {
		'TICK': {
			actions: 'decrementCount',
		},
	},
	states: {
		color: {
			entry: assign(() => ({ state: 'color' })),
			on: {
				NEXT: { target: 'frame',  }
			}
		},
		frame: {
			entry: assign(() => ({ state: 'color' })),
			on: {
				NEXT: { target: 'bake' }
			}
		},
		bake: {
			entry: assign(() => ({ state: 'bike' })),
			on: {
				NEXT: { target: 'seat' }
			}
		},
		seat: {
			entry: assign(() => ({ state: 'seat' })),
			on: {
				NEXT: { target: 'wheels' }
			}
		},
		wheels: {
			entry: assign(() => ({ state: 'wheels' })),
			on: {
				NEXT: { target: 'handles' }
			}
		},
		handles: {
			entry: assign(() => ({ state: 'handles' })),
			on: {
				NEXT: { target: 'shipping' }
			}
		},
		shipping: {
			entry: assign(() => ({ state: 'shipping' })),
			on: {
				NEXT: { target: 'save' }
			}
		},
		save: {
			invoke: {
				id: 'saveOrder',
				src: (context) => saveOrder(context as Order),
				onDone: {
					target: 'complete',
				}
			}
		},
		complete: {
			entry: assign(() => ({ state: 'complete' })),
			type: 'final'
		}
	}
}, {
	actions: {
		// @ts-ignore
		decrementCount: assign((context, event) => {
			return {
				// @ts-ignore
				countdown: context.countdown - 1
			}
		}),
	}
});


// @ts-ignore
const saveOrder = (order: Order) => new Promise(resolve => setTimeout(resolve, 3000));