import { html, css } from 'lit';
import { StoreBase } from '../store.js';
export class COrderNav extends StoreBase {
    render() {
        return html `
			<div class="base" part="base">
				<button>View Order</button>
			</div>
    `;
    }
}
COrderNav.styles = css `
    :host {
			display: block;
    }
  `;
customElements.define('c-order-nav', COrderNav);
//# sourceMappingURL=c-order-nav.js.map