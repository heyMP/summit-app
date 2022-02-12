import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { StoreBase } from '../store.js';
import '../components/c-order-page.js';
import '../components/c-button.js';

export class POrderFrame extends StoreBase {
  static styles = [...super.styles, css`
    :host {
      display: block;
    }

    #page {
      position: relative;
    }

    #sketch {
      position: absolute;
      top: 72px;
      width: 478px;
      height: 246px;
      left: calc(50% - 150px);
    }
  `];

  render() {
    return html`
      <c-order-page id="page">
        <a href="#">
          <img src=${new URL('../../../assets/page-4.png', import.meta.url)}>
        </a>
        <c-button @click=${() => this.order?.send({ type: 'NEXT' })}>Next</c-button>
      </c-order-page>
    `;
  }
}

customElements.define('p-order-frame', POrderFrame);
