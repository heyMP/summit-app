import { html, css } from 'lit';
import { StoreBase } from '../store.js';
import '../components/c-order-page.js';
import '../components/c-sketch.js';
export class POrderFrame extends StoreBase {
    render() {
        return html `
      <c-order-page id="page">
        <a href="#" @click=${() => { var _a; return (_a = this.order) === null || _a === void 0 ? void 0 : _a.send({ type: 'NEXT' }); }}>
          <img src=${new URL('../../../assets/page-4.png', import.meta.url)}>
        </a>
        <c-sketch id="sketch"></c-sketch>
      </c-order-page>
    `;
    }
}
POrderFrame.styles = css `
    :host {
      display: block;
    }

    #page {
      position: relative;
    }

    #sketch {
      position: absolute;
      top: 72px;
      width: 478px;
      height: 246px;
      left: calc(50% - 150px);
    }
  `;
customElements.define('p-order-frame', POrderFrame);
//# sourceMappingURL=p-order-frame.js.map