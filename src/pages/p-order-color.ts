import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { StoreBase } from '../store.js';
import '../components/c-page.js';

export class POrderColor extends StoreBase {
  static styles = css`
    :host {
      display: block;
    }
  `;

  render() {
    return html`
      <c-page>
				<a href="#" @click=${() => this.store.send({ type: 'NEXT' })}>
					<img src=${new URL('../../../assets/page-3.png', import.meta.url)}>
				</a>
      </c-page>
    `;
  }
}

customElements.define('p-order-color', POrderColor);
