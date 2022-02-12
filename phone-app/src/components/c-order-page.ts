import { LitElement, html, css } from 'lit';
import { StoreBase } from '../store.js';
import './c-page.js';
import './c-order-nav.js';

export class COrderPage extends StoreBase {
  static styles = [...super.styles, css`
    :host {
      display: flex;
    }
  `];

  render() {
    return html`
      <c-page>
        <c-order-nav></c-order-nav>
        <slot></slot>
      </c-page>
    `;
  }
}

customElements.define('c-order-page', COrderPage);
