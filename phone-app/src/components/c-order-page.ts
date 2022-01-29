import { LitElement, html, css } from 'lit';
import './c-page.js';
import './c-order-nav.js';

export class COrderPage extends LitElement {
  static styles = css`
    :host {
      display: flex;
    }
  `;

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
