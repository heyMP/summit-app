import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import styles from '../global.css.js';
import { variable } from '../globals.js';
import { StoreBase, StoreSubscriptionController } from '../store.js';

export class EMeter extends LitElement {
  static styles = [styles, css`
		:host {
			display: inline-block;
		}
  `];

	@property({ type: Number }) public value = 0;

  render() {
    return html`
			<div class="base" part="base">
				meter here...
			</div>
    `;
  }
}

customElements.define('e-meter', EMeter);
