import { LitElement, html, css } from 'lit';
import '../components/c-page.js';
export class PInit extends LitElement {
    constructor() {
        super();
    }
    render() {
        return html `
      <c-page>
        <img src=${new URL('../../../assets/logo.png', import.meta.url)}>
      </c-page>
    `;
    }
}
PInit.styles = css `
    :host {
      display: block;
    }
  `;
customElements.define('p-init', PInit);
//# sourceMappingURL=p-init.js.map