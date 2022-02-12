import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { StoreBase } from '../store.js';
import '../components/c-page.js';
import '../components/c-button.js';

export class POrderFrame extends StoreBase {
  render() {
    return html`
      <c-page>
        <h1 slot="header">3D print your bike frame</h1>
        <img src=${new URL('../../../assets/page-4.png', import.meta.url)}>
        <c-button @click=${() => this.order?.send({ type: 'NEXT' })}>Next</c-button>
      </c-page>
    `;
  }
}

customElements.define('p-order-frame', POrderFrame);
