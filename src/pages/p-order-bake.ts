import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { StoreBase } from '../StoreBase.js';
import '../components/c-order-page.js';

export class POrderBake extends StoreBase {
  static styles = css`
    :host {
      display: block;
    }
  `;

  render() {
    return html`
      <c-order-page>
        <a href="#" @click=${() => this.store.send({ type: 'NEXT' })}>
          <img src=${new URL('../../../assets/page-5.png', import.meta.url)}>
        </a>
      </c-order-page>
    `;
  }
}

customElements.define('p-order-bake', POrderBake);
