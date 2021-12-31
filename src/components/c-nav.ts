import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { StoreBase } from '../store.js';
import { variable } from '../globals.js';

export class CNav extends StoreBase {
  static styles = css`
    :host {
			height: ${variable('navHeight')};
			display: block;
    }

		.base {
			display: block;
		}

		img {
			width: 100%;
			max-width: 500px;
		}
  `;

  render() {
    return html`
			<div class="base" part="base">
				${!this.store.state.matches('init') ? html`
					<img src=${new URL('../../../assets/nav.png', import.meta.url)}>
				` : ''}
				<br>
			</div>
    `;
  }
}

customElements.define('c-nav', CNav);
