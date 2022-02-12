import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { StoreBase } from '../store.js';
import '../components/c-order-page.js';
import '../components/c-button.js';

export class POrderColor extends StoreBase {
  render() {
    return html`
      <c-order-page>
        <img src=${new URL('../../../assets/page-3.png', import.meta.url)}>
        <c-button @click=${() => this.order?.send({ type: 'NEXT' })}>Spray</c-button>
      </c-order-page>
    `;
  }
}

customElements.define('p-order-color', POrderColor);
