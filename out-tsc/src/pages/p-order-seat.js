import { html, css } from 'lit';
import { StoreBase } from '../store.js';
import '../components/c-order-page.js';
export class POrderSeat extends StoreBase {
    render() {
        return html `
      <c-order-page>
        <a href="#" @click=${() => { var _a; return (_a = this.order) === null || _a === void 0 ? void 0 : _a.send({ type: 'NEXT' }); }}>
          <img src=${new URL('../../../assets/page-6.png', import.meta.url)}>
        </a>
      </c-order-page>
    `;
    }
}
POrderSeat.styles = css `
    :host {
      display: block;
    }
  `;
customElements.define('p-order-seat', POrderSeat);
//# sourceMappingURL=p-order-seat.js.map