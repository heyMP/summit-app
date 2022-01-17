import { css, html } from 'lit';
import { variable } from '../globals.js';
import { StoreBase, StoreSubscriptionController } from '../store.js';
import type { Store, OrderRef } from '../store.js';

export class CNav extends StoreBase {
  static styles = css`
    :host {
			height: ${variable('navHeight')};
			display: block;
			color: ${variable('color')};
    }

		.base {
			display: grid;
			padding: 1rem;
			grid-template-columns: 1fr 1fr;
			max-width: ${variable('contentMaxWidth')}
		}

		.base > *:nth-child(odd) {
			justify-self: start;
		}
		.base > *:nth-child(even) {
			justify-self: end;
		}

		img {
			width: 100%;
			max-width: 400px;
		}
  `;

  render() {
    return html`
			<div class="base" part="base">
				<div id="title">${this.store.state.context.title}</div>
				<div id="order-fulfilled">${this.renderOrdersFilled(this.store)} orders filled</div>
				<div id="points">${this.store.state.context.points} points</div>
				${this.order ? html`
					<div id="countdown">${this.order?.state.context.countdown} seconds</div>
				` : ''}
			</div>
    `;
  }

	renderOrdersFilled(store: Store) {
		return `${store.state.context.fulfilled}/${store.state.context.orders.length}`;
	}
}

customElements.define('c-nav', CNav);
