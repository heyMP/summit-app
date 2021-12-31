import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { StoreBase } from '../store.js';
import { variable } from '../globals.js';

export class COrderNav extends StoreBase {
  static styles = css`
    :host {
			display: block;
    }
  `;

  render() {
    return html`
			<div class="base" part="base">
				<button>View Order</button>
			</div>
    `;
  }
}

customElements.define('c-order-nav', COrderNav);
