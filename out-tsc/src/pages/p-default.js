import { html, css } from 'lit';
import { StoreBase } from '../store.js';
import '../components/c-page.js';
export class PDefault extends StoreBase {
    render() {
        return html `
      <c-page>
        <a href="#" @click=${() => this.store.send({ type: 'FULFILL', orderId: 1 })}>
          <img src=${new URL('../../../assets/page-2.png', import.meta.url)}>
        </a>
      </c-page>
    `;
    }
}
PDefault.styles = css `
    :host {
      display: block;
    }

    img {
      display: block;
    }
  `;
customElements.define('p-default', PDefault);
//# sourceMappingURL=p-default.js.map