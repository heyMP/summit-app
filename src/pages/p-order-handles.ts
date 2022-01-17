import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { StoreBase } from '../store.js';
import '../components/c-order-page.js';

export class POrderHandles extends StoreBase {
  static styles = css`
    :host {
      display: block;
    }
  `;

  render() {
    return html`
      <c-order-page>
        <a href="#" @click=${() => this.order?.send({ type: 'NEXT' })}>
          <img src=${new URL('../../../assets/page-8.png', import.meta.url)}>
        </a>
      </c-order-page>
    `;
  }
}

customElements.define('p-order-handles', POrderHandles);
