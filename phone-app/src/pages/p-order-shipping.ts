import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { StoreBase } from '../store.js';
import '../components/c-page.js';

export class POrderShipping extends StoreBase {
  render() {
    const isSaving = this.order?.state.matches('save');
    return html`
      <c-page>
        <h1>Finalize your bike</h1>
        <img src=${new URL('../../../assets/page-9.png', import.meta.url)}>
        <c-button .disabled=${isSaving} @click=${() => this.order?.send({ type: 'NEXT' })}>
          ${isSaving ? html` ...Saving ` : html` Ship it!  `}
        </c-button>
      </c-page>
    `;
  }
}

customElements.define('p-order-shipping', POrderShipping);
