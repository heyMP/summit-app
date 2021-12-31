import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { StoreBase } from '../store.js';
import '../components/c-page.js';

export class PDefault extends StoreBase {
  static styles = css`
    :host {
      display: block;
    }

    img {
      display: block;
    }
  `;

  render() {
    return html`
      <c-page>
        <a href="#" @click=${() => this.store.send({ type: 'FULFILL', orderId: 23 })}>
          <img src=${new URL('../../../assets/page-2.png', import.meta.url)}>
        </a>
      </c-page>
    `;
  }
}

customElements.define('p-default', PDefault);
