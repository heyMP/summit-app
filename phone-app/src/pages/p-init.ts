import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import '../components/c-page.js';

export class PInit extends LitElement {
  render() {
    return html`
      <c-page>
        <img src=${new URL('../../../assets/logo.png', import.meta.url)}>
      </c-page>
    `;
  }
}

customElements.define('p-init', PInit);
