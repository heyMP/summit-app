import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { StoreBase } from '../store.js';
import '../elements/e-page.js';
import '../elements/e-button.js';

export class POrderWheels extends StoreBase {
  render() {
    return html`
      <e-page>
        <h1 slot="header">Choose your wheels</h1>
        <img src=${new URL('../../../assets/page-7.png', import.meta.url)}>
        <e-button @click=${() => this.order?.send({ type: 'NEXT' })}>Select</e-button>
      </e-page>
    `;
  }
}

customElements.define('p-order-wheels', POrderWheels);
