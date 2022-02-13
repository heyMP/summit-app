import { LitElement, html, css } from 'lit';
import './c-page.js';
import './c-order-nav.js';
export class COrderPage extends LitElement {
    render() {
        return html `
      <c-page>
        <c-order-nav></c-order-nav>
        <slot></slot>
      </c-page>
    `;
    }
}
COrderPage.styles = css `
    :host {
      display: flex;
    }
  `;
customElements.define('c-order-page', COrderPage);
//# sourceMappingURL=c-order-page.js.map