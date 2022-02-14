import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import '../elements/e-page.js';

export class PPairing extends LitElement {
  render() {
    return html`
      <e-page>
        <h1>Pairing</h1>
      </e-page>
    `;
  }
}

customElements.define('p-pairing', PPairing);
