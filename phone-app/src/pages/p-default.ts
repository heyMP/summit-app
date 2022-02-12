import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { StoreBase } from '../store.js';
import '../elements/e-page.js';
import '../elements/e-button.js';

export class PDefault extends StoreBase {
  static styles = [...super.styles, css`
    :host {
      display: block;
    }

    img {
      display: block;
    }
  `];

  render() {
    return html`
      <e-page>
        <h1 slot="header">Fulfill an order</h1>
        <img src=${new URL('../../../assets/page-2.png', import.meta.url)}>
        <e-button @click=${() => this.store.send({ type: 'FULFILL', orderId: 1 })}>Select</e-button>
      </e-page>
    `;
  }
}

customElements.define('p-default', PDefault);
