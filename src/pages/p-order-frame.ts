import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { StoreBase } from '../StoreBase.js';
import '../components/c-page.js';
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
      top: 214px;
      width: 300px;
      height: 246px;
      left: calc(50% - calc(300px / 2));
    }
  `;

  render() {
    return html`
      <c-page id="page">
        <a href="#" @click=${() => this.store.send({ type: 'NEXT' })}>
          <img src=${new URL('../../../assets/page-4.png', import.meta.url)}>
        </a>
        <c-sketch id="sketch"></c-sketch>
      </c-page>
    `;
  }
}

customElements.define('p-order-frame', POrderFrame);
