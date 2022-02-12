import { css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { variable } from '../globals.js';
import { StoreBase, StoreSubscriptionController } from '../store.js';
import type { Store, OrderRef } from '../store.js';

export class CButton extends StoreBase {
  static styles = [...super.styles, css`
		button {
			font-size: 1.2rem;
		}
  `];

	@property({ type: Boolean, reflect: true }) public disabled = false;

  render() {
    return html`
			<div class="base" part="base">
				<button ?disabled=${this.disabled}><slot></slot></button>
			</div>
    `;
  }
}

customElements.define('c-button', CButton);
