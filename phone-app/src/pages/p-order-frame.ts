import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { StoreBase } from '../store.js';
import '../elements/e-page.js';
import '../elements/e-button.js';

export class POrderFrame extends StoreBase {
  render() {
    return html`
      <e-page>
        <h1 slot="header">3D print your bike frame</h1>
        <img src=${new URL('../../../assets/page-4.png', import.meta.url)}>
        <e-button @click=${() => this.order?.send({ type: 'NEXT' })}>Next</e-button>
      </e-page>
    `;
  }
}

customElements.define('p-order-frame', POrderFrame);
