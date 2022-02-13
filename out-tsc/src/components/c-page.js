import { LitElement, html, css } from 'lit';
import { variable } from '../globals.js';
export class CPage extends LitElement {
    render() {
        return html `
			<div class="base" part="base">
				<slot></slot>
			</div>
    `;
    }
}
CPage.styles = css `
    :host {
      display: flex;
      min-height: calc(100vh - calc(${variable('navHeight')} * 2));
      min-width: 100vw;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  `;
customElements.define('c-page', CPage);
//# sourceMappingURL=c-page.js.map