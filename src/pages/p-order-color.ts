import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { StoreBase } from '../store.js';
import '../components/c-order-page.js';

export class POrderColor extends StoreBase {
  static styles = css`
    :host {
      display: block;
    }
  `;

  render() {
    return html`
      <c-order-page>
				<a href="#" @click=${() => this.store.state.context?.orderRef?.send({ type: 'NEXT' })}>
					<img src=${new URL('../../../assets/page-3.png', import.meta.url)}>
				</a>
      </c-order-page>
    `;
  }
}

customElements.define('p-order-color', POrderColor);