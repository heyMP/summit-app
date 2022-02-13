import { LitElement } from 'lit';
import { assign, createMachine, createSchema, interpret } from 'xstate';
import { orderMachine } from './machines/orders.js';
import { socketCallback } from './machines/socket.js';
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
export const updateLocalStorage = (gameId, playerId, username) => {
    localStorage.setItem("gameId", gameId);
    localStorage.setItem("playerId", playerId);
    localStorage.setItem("username", username);
};
// Edit your machine(s) here
export const storeMachine = createMachine({
    id: "app",
    initial: 'init',
    schema: {
        context: createSchema(),
        events: createSchema(),
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
                data: (context, event) => context.orders.find(order => (order === null || order === void 0 ? void 0 : order.orderId) === context.orderId),
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
                };
            }
        }),
        // @ts-ignore
        fulfill: assign((context, event) => {
            // this looks weird but it was the only way typescript would
            // accept it.
            if (event.type === 'FULFILL') {
                return {
                    orderId: event.orderId
                };
            }
            return {};
        }),
        orderShip: assign((context, event) => {
            return { orderId: null, fulfilled: context.fulfilled + 1 };
        }),
    },
});
export const store = interpret(storeMachine).start();
/**
 * Reactive Controller method for adding the store to your element
 */
export class StoreController {
    constructor(host) {
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
        });
    }
    hostDisconnected() {
        var _a;
        (_a = this.subscription) === null || _a === void 0 ? void 0 : _a.unsubscribe();
    }
}
/**
 * Subscribe to a specific Interpretor in a store.
 */
export class StoreSubscriptionController {
    constructor(host, _store) {
        this.store = null;
        (this.host = host).addController(this);
        this.store = _store;
        // @ts-ignore
        this.subscription = this.store.subscribe(() => {
            this.host.requestUpdate();
        });
    }
    hostDisconnected() {
        var _a;
        (_a = this.subscription) === null || _a === void 0 ? void 0 : _a.unsubscribe();
    }
}
/**
 * Base Class for giving components access to the store. Uses the StoreController
 * plus sets up a local store prop for easy access.
 */
export class StoreBase extends LitElement {
    constructor() {
        super();
        this.order = null;
        this.store = new StoreController(this).store;
    }
    storeUpdated() {
        if (this.store.children.has('order')) {
            this.order = new StoreSubscriptionController(this, this.store.children.get('order')).store;
        }
        else {
            this.order = null;
        }
    }
}
// @ts-ignore
window.BikeStore = store;
//# sourceMappingURL=store.js.map