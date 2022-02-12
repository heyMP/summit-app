import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { StoreBase } from '../store.js';
import '../components/c-page.js';
import '../components/c-button.js';

export class POrderSeat extends StoreBase {
  render() {
    return html`
      <c-page>
        <h1 slot="header">Choose your seat</h1>
        <img src=${new URL('../../../assets/page-6.png', import.meta.url)}>
        <c-button @click=${() => this.order?.send({ type: 'NEXT' })}>Select</c-button>
      </c-page>
    `;
  }
}

customElements.define('p-order-seat', POrderSeat);