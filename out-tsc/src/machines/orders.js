import { createMachine, assign, createSchema } from 'xstate';
import { counterInterval } from './counter.js';
export const orderMachine = createMachine({
    id: 'order',
    initial: 'color',
    schema: {
        context: createSchema(),
        events: createSchema(),
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
                NEXT: { target: 'frame', }
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
                src: (context) => saveOrder(context),
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
            };
        }),
    }
});
// @ts-ignore
const saveOrder = (order) => new Promise(resolve => setTimeout(resolve, 3000));
//# sourceMappingURL=orders.js.map