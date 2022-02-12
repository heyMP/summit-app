import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { StoreBase } from '../store.js';
import { variable } from '../globals.js';

export class CPage extends StoreBase {
  static styles = [...super.styles, css`
    :host {
      display: flex;
      min-height: calc(100vh - calc(${variable('navHeight')} * 2));
      min-width: 100vw;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  `];

  render() {
    return html`
			<div class="base" part="base">
				<slot></slot>
			</div>
    `;
  }
}

customElements.define('c-page', CPage);
