import { html, css } from 'lit';
import { StoreBase } from '../store.js';
import '../components/c-order-page.js';
export class POrderShipping extends StoreBase {
    render() {
        var _a;
        return html `
      <c-order-page>
        <a href="#" @click=${() => { var _a; return (_a = this.order) === null || _a === void 0 ? void 0 : _a.send({ type: 'NEXT' }); }}>
          <img src=${new URL('../../../assets/page-9.png', import.meta.url)}>
        </a>
        ${((_a = this.order) === null || _a === void 0 ? void 0 : _a.state.matches('save')) ? html `
          <div>...Saving</div>
        ` : ''}
      </c-order-page>
    `;
    }
}
POrderShipping.styles = css `
    :host {
      display: block;
    }
  `;
customElements.define('p-order-shipping', POrderShipping);
//# sourceMappingURL=p-order-shipping.js.map