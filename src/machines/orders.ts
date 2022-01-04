import { createMachine, send, assign, interpret, createSchema } from 'xstate'
import type { Interpreter, Subscription, StateMachine } from 'xstate';

export type OrderId = string | number | null;

export interface Order {
	orderId: OrderId;
	countdown: number | null;
}

export type OrderEvent =
  | { type: 'NEXT' }

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
		countdown: null,
		...order
	},
	states: {
		countdown: {
			type: 'parallel',
			after: {
				1000: {
					target: 'countdown',
					actions: (context) => assign({
						countdown: Number(context.countdown) - 1,
					}),
					cond: (context) => Number(context.countdown) > 0
				}
			}
		},
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
});