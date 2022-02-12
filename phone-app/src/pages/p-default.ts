import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { StoreBase } from '../store.js';
import '../components/c-page.js';
import '../components/c-button.js';

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
      <c-page>
        <img src=${new URL('../../../assets/page-2.png', import.meta.url)}>
        <c-button @click=${() => this.store.send({ type: 'FULFILL', orderId: 1 })}>Select</c-button>
      </c-page>
    `;
  }
}

customElements.define('p-default', PDefault);
