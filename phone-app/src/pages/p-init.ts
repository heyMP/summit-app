import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import '../elements/e-page.js';

export class PInit extends LitElement {
  render() {
    return html`
      <e-page>
        <img src=${new URL('../../../assets/logo.png', import.meta.url)}>
      </e-page>
    `;
  }
}

customElements.define('p-init', PInit);
