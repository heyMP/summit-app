import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { StoreBase } from '../store.js';
import '../components/c-order-page.js';
import '../components/c-sketch.js';

export class POrderFrame extends StoreBase {
  static styles = css`
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
  `;

  render() {
    return html`
      <c-order-page id="page">
        <a href="#" @click=${() => this.order?.send({ type: 'NEXT' })}>
          <img src=${new URL('../../../assets/page-4.png', import.meta.url)}>
        </a>
        <c-sketch id="sketch"></c-sketch>
      </c-order-page>
    `;
  }
}

customElements.define('p-order-frame', POrderFrame);
